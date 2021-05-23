const { ipcRenderer } = require('electron')

let add_file_btn = document.querySelector("#add_file_btn")
add_file_btn.onclick = () => {
    //get file infomation
    let file = document.getElementById("add_a_file").files
    let file_relative_path = "/mypath"
    let file_name = file[0]['name']
    let file_path = file[0]['path']

    //read file
    //then chack file content , and return a file_mark 0/1
    //then send file_info to main processor
    let reader = new FileReader()
    reader.readAsText(file[0]);
    reader.onload = function fileReadCompleted() {
        /*将文件进行检查的逻辑，返回标志位 file_mark --------------------------!
        const check = new XMLHttpRequest()
        const url = ""
        down_https.open("GET", url)
        down_https.send()

        down_https.onreadystatechange = (e) => {
            console.log(down_https)
        }
        */

        let file_mark = 0
        if (reader.result=="不合法") {
            file_mark = 1
        }

        //send file_info
        let file_info = {"file_mark":file_mark, "file_path": file_path, "file_relative_path": file_relative_path, "file_name":file_name, "file_content": reader.result}

        let encrypt_ipfs_file_path = ipcRenderer.sendSync('add_file_info_message', file_info)

        let files_info_content = document.querySelector("#files_info_content")
        files_info_content.innerHTML = encrypt_ipfs_file_path
    };
}