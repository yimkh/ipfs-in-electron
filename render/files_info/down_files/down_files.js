// const { ipcRenderer } = require('electron')

download_file_btn = document.querySelector("#download_file_btn")
download_file_btn.onclick = () => {
    let encrypt_ipfs_file_cid_download = document.getElementById("encrypt_ipfs_file_cid_download").value;

    let ipfs_file_cidwpath = ipcRenderer.sendSync('down_file_info_message', encrypt_ipfs_file_cid_download)
    
    location.href="https://ipfs.io/ipfs/"+ipfs_file_cidwpath
}