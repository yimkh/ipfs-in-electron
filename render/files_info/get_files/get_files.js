const { ipcRenderer } = require('electron')

get_file_btn = document.querySelector("#get_file_btn")
get_file_btn.onclick = () => {
    encrypt_ipfs_file_cid_get = document.getElementById("encrypt_ipfs_file_cid_get").value;

    //send message to main process, and get the ipfs file information
    let ipfs_files_info = ipcRenderer.sendSync('get_file_info_message', encrypt_ipfs_file_cid_get)

    download_files_info_type = document.querySelector("#get_file_info_type")
    download_files_info_type.innerHTML = ipfs_files_info["file_type"]

    let download_files_info_content = document.querySelector("#get_file_info_content")
    download_files_info_content.innerHTML = Uint8ArrayToString(ipfs_files_info["content"])
}

function Uint8ArrayToString(fileData){
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i]);
    }
   
    return dataString
  }