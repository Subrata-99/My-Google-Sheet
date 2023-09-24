let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

//For creating table address columns(1, 2, 3 ... 100)
for (let i = 0; i < rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.innerText = i + 1;
  addressCol.setAttribute("class", "address-col");
  addressColCont.appendChild(addressCol);
}

//For creating table address row(A, B, C ... Z)
for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.innerText = String.fromCharCode(65 + i);
  addressRow.setAttribute("class", "address-row");
  addressRowCont.appendChild(addressRow);
}

for (let i = 0; i < rows; i++) {
  let rowCont = document.createElement("div");
  rowCont.setAttribute("class", "row-cont");
  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    // cells.innerText = String.fromCharCode(65 + i);
    cell.setAttribute("class", "cell");
    cell.setAttribute("contenteditable", "true");

    //Attributes for cell identification
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);
    cell.setAttribute("spellcheck", "false");
    rowCont.appendChild(cell);
    addEventListenerForCellAddressDisplay(cell, i, j);
  }
  cellsCont.appendChild(rowCont);
}

function addEventListenerForCellAddressDisplay(cell, i, j) {
  cell.addEventListener("click", (e) => {
    let rowId = i + 1;
    let colId = String.fromCharCode(65 + j);
    addressBar.value = `${colId}${rowId}`;
  });
}
