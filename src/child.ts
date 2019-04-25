import IframeBridge from './iframeBridge'

document.querySelector('#action').addEventListener('click', () => {
  const bridge = new IframeBridge(window.parent, '*')
  bridge.makeMirror('navigator.bluetooth')
})

// bridge.sendMessage('sent!')
// bridge.sendCommand('makeMirror', 'navigator.bluetooth')
