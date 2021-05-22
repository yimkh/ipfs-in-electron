const { ipcRenderer } = require('electron')

let add_file_btn = document.querySelector("#add_file_btn")
add_file_btn.onclick = () => {
    //get file infomation
    let file = document.getElementById("add_a_file").files
    let file_path = file[0]['path']

    read_file(file)

    //send message to main process, and get the ipfs file information
    let encrypt_ipfs_file_path = ipcRenderer.sendSync('file_path', file_path)

    let files_info_content = document.querySelector("#files_info_content")
    files_info_content.innerHTML = encrypt_ipfs_file_path
}


function read_file(file) {
    //读取文件的逻辑-----------！
    let reader = new FileReader()
    reader.onload = function fileReadCompleted() {
        // 当读取完成时，内容只在`reader.result`中
        console.log(reader.result);

        //传送加密文件路径标志位
        // ipcRenderer.sendSync('mark', 0)
    };
    reader.readAsText(file[0]);
}

function send_mark() {

}