const { ipcRenderer } = require('electron')
var iconv = require('iconv-lite');

get_file_btn = document.querySelector("#get_file_btn")
get_file_btn.onclick = () => {
    encrypt_ipfs_file_cid_get = document.getElementById("encrypt_ipfs_file_cid_get").value;

    //send message to main process, and get the ipfs file information
    let ipfs_files_info = ipcRenderer.sendSync('get_file_info_message', encrypt_ipfs_file_cid_get)

    download_files_info_type = document.querySelector("#get_file_info_type")
    download_files_info_type.innerHTML = ipfs_files_info["file_type"]

    let content = iconv.decode(Buffer.from(ipfs_files_info["file_content"][0]), 'utf8');
    let download_files_info_content = document.querySelector("#get_file_info_content")
    download_files_info_content.innerHTML = content
}