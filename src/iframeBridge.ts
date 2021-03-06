export default class IframeBridge {
  targetWindow: Window
  targetObject: any
  onReadyListener: () => void

  constructor(targetWindow?: any) {
    this.targetWindow = targetWindow

    this.setCommandHandler()
  }

  public sendMessage(message: string) {
    this.targetWindow.postMessage(message, '*')
  }

  public receiveMessage(listener: any) {
    window.addEventListener('message', (message: any) => {
      if (!this.targetWindow) {
        this.targetWindow = message.source
      }

      listener(message.data)
    })
  }

  public sendCommand(...args) {
    const message = JSON.stringify(args)
    this.sendMessage(message)
  }

  public receiveCommand(listener: any) {
    this.receiveMessage((message: any) => {
      const [command, ...args] = JSON.parse(message)
      listener(command, args)
    })
  }

  private setCommandHandler() {
    this.receiveCommand((command, args) => {
      switch (command) {
        case 'makeMirrorForCallee':
          return this.makeMirrorForCallee.apply(this, args)

        case 'makeMirrorForCaller':
          return this.makeMirrorForCaller.apply(this, args)

        case 'invoke':
          return this.invoke.apply(this, args)
      }
    })
  }

  public makeMirror(instance: string, onReadyListener: () => void) {
    this.onReadyListener = onReadyListener
    this.sendCommand('makeMirrorForCallee', instance)
  }

  private makeMirrorForCallee(instance: string) {
    const [rootKey, ...keys] = instance.split('.')

    let rootObject = null
    switch (rootKey) {
      case 'window':
        rootObject = window
        break

      case 'navigator':
        rootObject = navigator
        break
    }
    if (!rootObject) {
      return
    }

    this.targetObject = rootObject[keys.join('.')]

    const functions = []
    const values = []
    for (const key in this.targetObject) {
      if (typeof this.targetObject[key] === 'function') {
        functions.push(key)
      } else {
        values.push(key)
      }
    }

    this.sendCommand('makeMirrorForCaller', { functions, values })
  }

  private invoke(params: { functionName: string; args: any }) {
    if (!this.targetObject) {
      return
    }

    this.targetObject[params.functionName].apply(this.targetObject, params.args)
  }

  private makeMirrorForCaller(attributes: any) {
    for (const functionName of attributes.functions) {
      IframeBridge.prototype[functionName] = (...args: any) => {
        // console.log(`${functionName}() is called with ${args}`)

        this.sendCommand('invoke', { functionName, args })
      }
    }

    if (this.onReadyListener) {
      this.onReadyListener()
    }
  }
}
