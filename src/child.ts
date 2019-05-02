import IframeBridge from './iframeBridge'

document.querySelector('#action').addEventListener('click', () => {
  const bridge = new IframeBridge(window.parent)
  bridge.makeMirror('navigator.bluetooth', () => {
    bridge.requestDevice({
      filters: [{ services: ['10b20100-5b3b-4571-9508-cf3efcd7bbae'] }]
    })
  })
})
