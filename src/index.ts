import IframeBridge from './iframeBridge'

const bridge = new IframeBridge(window, '*')
bridge.receiveMessage(message => {
  console.log(message)
})
