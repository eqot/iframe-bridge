export default class IFrameBridge {
  target: any
  origin: string

  constructor(target, origin) {
    this.target = target
    this.origin = origin
  }

  public sendMessage(message: string) {
    this.target.postMessage(message)
  }

  public receiveMessage(listener: any) {
    this.target.addEventListener('message', (message: any) => {
      listener(message.data)
    })
  }
}
