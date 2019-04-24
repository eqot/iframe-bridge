export default class IFrameBridge {
  target: any
  origin: string

  constructor(target, origin) {
    this.target = target
    this.origin = origin
  }

  public sendMessage(message: string) {
    this.target.postMessage(message, this.origin)
  }

  public receiveMessage(listener: any) {
    this.target.addEventListener('message', (message: any) => {
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

  public setCommandHandler() {
    this.receiveCommand((command, args) => {
      switch (command) {
        case 'makeMirror':
          return this.makeMirrorCallee.apply(this, args)
      }
    })
  }

  public makeMirror(instance: string) {
    this.sendCommand('makeMirror', instance)
  }

  private makeMirrorCallee(instance: string) {
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

    const object = rootObject[keys.join('.')]

    const functions = []
    const values = []
    for (const key in object) {
      if (typeof object[key] === 'function') {
        functions.push(key)
      } else {
        values.push(key)
      }
    }
    console.log(functions)
    console.log(values)
  }
}
