import IframeBridge from './iframeBridge'

const bridge = new IframeBridge(window.parent, '*')
bridge.sendMessage('sent!')
