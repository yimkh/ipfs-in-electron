const { ipcRenderer } = require('electron')

let add_file_btn = document.querySelector("#add_file_btn")
add_file_btn.onclick = () => {
    //get file infomation
    let file = document.getElementById("add_a_file").files

    //file_info include file_mark and file_path
    let file_path = file[0]['path']

    //read file
    //then chack file content , and return a file_mark 0/1
    //then send file_info to main processor
    let reader = new FileReader()
    reader.readAsText(file[0]);
    reader.onload = function fileReadCompleted() {
        //when be read, the content is in reader.result
        //console.log(reader.result);

        //将文件进行检查的逻辑，返回标志位 file_mark --------------------------!
        let file_mark = 0

        //send file_info
        let file_info = {"file_mark":file_mark, "file_path": file_path}

        let encrypt_ipfs_file_path = ipcRenderer.sendSync('file_info', file_info)

        let files_info_content = document.querySelector("#files_info_content")
        files_info_content.innerHTML = encrypt_ipfs_file_path
    };
}