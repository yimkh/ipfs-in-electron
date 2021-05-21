// const console = require("console");

// console.log("this is in node_info.js")

let node_info_btn = this.document.querySelector('#node_info_btn')
node_info_btn.onclick = () => {
    let node_info_content = this.document.querySelector("#node_info_content")
    node_info_content.innerHTML = window.localStorage.getItem("ipfs-id")
}

var node_info_detail_btn = this.document.querySelector('#node_info_detail_btn')
node_info_detail_btn.onclick = () => {
    // console.log("node_info_detail is coming")
    window.open("node_info_detail.html")
}