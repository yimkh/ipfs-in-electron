const { ipcRenderer } = require('electron')

let add_file_btn = document.querySelector("#add_file_btn")
add_file_btn.onclick = () => {
    //get file infomation
    let file_info = document.getElementById("add_a_file").files[0]
    path = file_info['path']

    //send message to main process, and get the ipfs file information
    let add_file_message = ipcRenderer.sendSync('add_file_message', path)
    path = add_file_message['path']

    let files_info_content = document.querySelector("#files_info_content")
    files_info_content.innerHTML = path
}
