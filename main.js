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
    ipfsFunc(win)
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

async function ipfsFunc(win) { 
    try { 
        ipfs = await IPFS.create()

        //get node info
        var node_id = { x : "" }
        get_node_info(ipfs, node_id)

        //add a file
        //get file_path message from render
        ipcMain.on('add_file_message', (event, arg) => {
            let file_path = arg

            add_a_file(ipfs, file_path, event)
        })

        //get a file with cid
        let test_cid = "QmetCcwGqVrBukGPeYDP6c3vqhaJRNnHA3gd9bA3JakEfq"
        get_file(ipfs, test_cid)

        //send to index.html 
        win.loadURL(`file://${__dirname}/index.html`)
        //for node information
        win.webContents.on('did-finish-load', () => {
        win.webContents.send('ipfs_id', node_id.x)
        win.webContents.send('ipfs_files_info', )

        //for other files information
        })
    } 
    catch (err) { 
        console.log("Oops, there was an error :(", err); 
    } 
}

async function get_node_info(ipfs, node_id) {
    const id = await ipfs.id()

    node_id.x = id.id
}

async function add_a_file(ipfs, file_path, event) {
    let add_file_result = await ipfs.add(file_path)

    event.returnValue = add_file_result
}

async function get_file(ipfs, test_cid) {
    for await (const file of ipfs.get(test_cid)) {
        // console.log("file.type, file.path", file.type, file.path)
      
        if (!file.content) continue;
      
        const content = []
      
        for await (const chunk of file.content) {
            content.push(chunk)
        }
      
        // console.log("content", content)
    }
}
