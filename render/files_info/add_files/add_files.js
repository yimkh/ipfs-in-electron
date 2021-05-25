process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const { ipcRenderer } = require('electron')

let add_file_btn = document.querySelector("#add_file_btn")
add_file_btn.onclick = () => {
    //get file infomation
    let file = document.getElementById("add_a_file").files
    let file_relative_path = "/mypath"
    let file_name = file[0]['name']
    let file_path = file[0]['path']

    console.log("file[0]", file[0])

    //read file
    //then chack file content , and return a file_mark 0/1
    //then send file_info to main processor
    let reader = new FileReader()
    reader.readAsText(file[0]);
    reader.onload = function fileReadCompleted() {
        console.log("reader.result", reader.result)

        //check
        const check = new XMLHttpRequest()
        const url = "http://localhost:8080/ping/"+reader.result

        check.open("GET", url, true)

        let file_mark = 2 
        let file_content = reader.result

        check.onreadystatechange = function() {
            if ( check.status == 200 && check.readyState == 4){
                let file_message_from_http = JSON.parse(check.responseText)
                file_mark = file_message_from_http["mark"]
                file_content = file_message_from_http["message"]

                //send file_info to main.js
                let file_info = {"file_mark":file_mark, "file_path": file_path, "file_relative_path": file_relative_path, "file_name":file_name, "file_content": file_content}
                console.log("file_info", file_info) 

                let encrypt_ipfs_file_path = ipcRenderer.sendSync('add_file_info_message', file_info)

                let files_info_content = document.querySelector("#files_info_content")
                files_info_content.innerHTML = encrypt_ipfs_file_path
            }
        }
        
        check.send(null);
    };
}