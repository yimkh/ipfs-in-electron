const { ipcRenderer } = require('electron')

let node_info_btn = document.querySelector('#node_info_btn')
node_info_btn.onclick = () => {
    //send message to main process, and get the node information
    let node_info = ipcRenderer.sendSync('node_info_message')

    node_info_content.innerHTML = node_info
}