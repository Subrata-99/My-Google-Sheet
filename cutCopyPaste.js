let ctrlKey;

document.addEventListener('keydown', (e) => {
    ctrlKey = e.ctrlKey
})
document.addEventListener('keyup', (e) => {
    ctrlKey = e.ctrlKey
})

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell)
    }
}

let rangeStorage = []

function handleSelectedCells(cell) {
    cell.addEventListener('click', (e) => {
        // Selecting range
        if(!ctrlKey) return
        if(rangeStorage.length >= 2) {
            defaultSelectedCellsUI()
            rangeStorage = []
        }

        //UI style
        cell.style.border = '3px solid #218c74'

        let rid = +cell.getAttribute('rid')
        let cid = +cell.getAttribute('cid')
        rangeStorage.push([rid, cid])
        console.log(rangeStorage);
    })
}

function defaultSelectedCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = '1px solid lightgrey'
    }
}

let copyBtn = document.querySelector(".copy")
let cutBtn = document.querySelector(".cut")
let pasteBtn = document.querySelector(".paste")

//Copying cells data
let copyData = []
copyBtn.addEventListener('click', (e) => {
    if(rangeStorage.length < 2) return
    copyData = []

    let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]]
    for (let i = startRow; i <= endRow; i++) {
        let copyRow = []
        for (let j = startCol; j <= endCol; j++) {
            let cellProp = sheetDB[i][j]
            copyRow.push(cellProp)
        }
        copyData.push(copyRow)
    }
    console.log("copied copy", copyData);
    defaultSelectedCellsUI()
})

//Cut cells data
cutBtn.addEventListener('click', (e) => {
    if(rangeStorage.length < 2) return
    

    let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]]

    for (let i = startRow; i <= endRow; i++) {
        let copyRow = []
        for (let j = startCol; j <= endCol; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            //DB update
            let cellProp = sheetDB[i][j]
            cellProp.value = ""
            cellProp.bold = false
            cellProp.italic = false
            cellProp.underline = false
            cellProp.fontSize = "14"
            cellProp.fontFamily = "monospace"
            cellProp.fontColor = "#000000"
            cellProp.bgColor = "transparent"
            cellProp.alignment = "left"

            //UI update
            cell.click()
        }
    }
    console.log("copied copy", copyData);
    defaultSelectedCellsUI()
})

//Paste cells data
pasteBtn.addEventListener('click', (e) => {
    // Paste cells data
    if(rangeStorage.length < 2) return

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0] )
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]) 

    //Target identify
    let address = addressBar.value
    let [startRow, startCol] =decodeRIdCIdFromAddress(address)

    // r -> refers copyData row
    // c -> refers copyData col
    for (let i = startRow, r= 0; i <= startRow+rowDiff; i++, r++) {
        for (let j = startCol, c= 0; j <= startCol+colDiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if(!cell) continue//For controlling out of range selection

            //DB modification
            let data = copyData[r][c]
            let cellProp = sheetDB[i][j]
            cellProp.value = data.value
            cellProp.bold = data.bold
            cellProp.italic = data.italic
            cellProp.underline = data.underline
            cellProp.fontSize = data.fontSize
            cellProp.fontFamily = data.fontFamily
            cellProp.fontColor = data.fontColor
            cellProp.bgColor = data.bgColor
            cellProp.alignment = data.alignment

            //UI update
            cell.click()
        }
    }

})