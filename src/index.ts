import IframeBridge from './iframeBridge'

const bridge = new IframeBridge(window, '*')
bridge.setCommandHandler()

// bridge.receiveMessage(message => {
//   console.log(message)
// })

// bridge.receiveCommand((command, args) => {
//   console.log(command)
//   console.log(args)
// })
