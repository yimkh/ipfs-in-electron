const electron = require('electron')
const path = require('path')
 
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let win = null

function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation:false
        }
    })

    win.loadFile('index.html')

    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    //ipfs logic
    ipfsFunc()
    //ipfs logic    

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    win.on('close', ()=>{
      win = null
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


//wait for being devided
//require('./main.util/ipfs_info_get.js')
const console = require('console')
const IPFS = require('ipfs-core')

let ipfs
const ipcMain = electron.ipcMain

async function ipfsFunc() { 
    try { 
        ipfs = await IPFS.create()

        //get node info
        ipcMain.on('node_info_message', (event, arg) => {
            get_node_info(ipfs, event)
        })

        //add a file
        //get file_info message from render
        ipcMain.on('add_file_info', (event, arg) => {
            let file_info = arg

            add_a_file(ipfs, file_info, event)
        })
        
        //get a file
        //get file_ipfs_path message from render
        ipcMain.on('download_files_message', (event, arg) => {
            let encrypt_ipfs_file_path = arg

            get_a_file(ipfs, encrypt_ipfs_file_path, event)
        })
    } 
    catch (err) { 
        console.log("Oops, there was an error :(", err); 
    } 
}

async function get_node_info(ipfs, event) {
    const id = await ipfs.id()

    event.returnValue = id.id
}

async function add_a_file(ipfs, file_info, event) {
    if (file_info["file_mark"]==1) {
        event.returnValue = "file is not legal, add error"
    } else {
        let ipfs_file_info = await ipfs.add(file_info["file_path"])

        ipfs_file_path = ipfs_file_info['path']
    
        add_path = file_info["file_mark"] + ipfs_file_path 
    
        encrypt_ipfs_file_path = encrypt_path(add_path)
    
        event.returnValue = encrypt_ipfs_file_path
    }
}

async function get_a_file(ipfs, encrypt_ipfs_file_path, event){
    ipfs_file_path = decrypt_path(encrypt_ipfs_file_path)

    for await (const file of ipfs.get(ipfs_file_path)) {
        file_type = file.type
      
        if (!file.content) continue;
      
        const content = []
      
        for await (const chunk of file.content) {
            content.push(chunk)
        }
        
        file_info = {"content": content, "file_type": file_type}
        event.returnValue = file_info
    }
}


//deal with file path by using mark
var aesjs = require('aes-js')

const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]

function encrypt_path(ipfs_file_path) {

    // Convert text to bytes
    var text = ipfs_file_path
    var textBytes = aesjs.utils.utf8.toBytes(text)

    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    var encryptedBytes = aesCtr.encrypt(textBytes)

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

    return encryptedHex
}

function decrypt_path(encrypt_ipfs_file_path) {
    var encryptedHex = encrypt_ipfs_file_path
    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    var decryptedBytes = aesCtr.decrypt(encryptedBytes)

    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

    return decryptedText
}