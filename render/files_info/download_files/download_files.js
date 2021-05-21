ipfs_file_path_download_btn = document.querySelector("#ipfs_file_path_download_btn")
ipfs_file_path_download_btn.onclick = () => {
    encrypt_ipfs_file_path = document.getElementById("ipfs_file_path").value;

    //send message to main process, and get the ipfs file information
    let ipfs_files_info = ipcRenderer.sendSync('download_files_message', encrypt_ipfs_file_path)

    download_files_info_type = document.querySelector("#download_files_info_type")
    download_files_info_type.innerHTML = ipfs_files_info["file_type"]

    let download_files_info_content = document.querySelector("#download_files_info_content")
    download_files_info_content.innerHTML = ipfs_files_info["content"]
}