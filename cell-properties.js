/*------------------Storage--------------------*/
let sheetDB = [];

//Creating the data storage for all cell attributes as matrix format
for (let i = 0; i < rows; i++) {
  let sheetRow = [];
  for (let j = 0; j < cols; j++) {
    let cellProps = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      bgColor: "transparent",
      value: "", // This property is to store whatever value we provide to each cell
      formula: "", // This property is to store the formula that executes for individual cells
      children: [], // This property is to store other dependent cells
    };
    sheetRow.push(cellProps);
  }
  sheetDB.push(sheetRow);
}

//Selectors fro cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bg-color-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

//Application of two way binding
//Attach property listeners
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.bold = !cellProp.bold; //Storage change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //UI change (1)

  bold.style.backgroundColor = cellProp.bold //UI change (2)
    ? activeColorProp
    : inactiveColorProp;
});

italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.italic = !cellProp.italic; //Storage change
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //UI change (1)

  italic.style.backgroundColor = cellProp.italic //UI change (2)
    ? activeColorProp
    : inactiveColorProp;
});

underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.underline = !cellProp.underline; //Storage change
  cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //UI change (1)

  underline.style.backgroundColor = cellProp.underline //UI change (2)
    ? activeColorProp
    : inactiveColorProp;
});

fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);
  //Modification
  cellProp.fontSize = fontSize.value; //data change
  cell.style.fontSize = cellProp.fontSize + "px"; //UI change (1)

  fontSize.value = cellProp.fontSize; //UI change (2)
});

fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.fontFamily = fontFamily.value; //data change
  cell.style.fontFamily = cellProp.fontFamily; //UI change (1)

  fontFamily.value = cellProp.fontFamily; //UI change (2)
});

fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.fontColor = fontColor.value; //data change
  cell.style.color = cellProp.fontColor; //UI change (1)

  fontColor.value = cellProp.fontColor; //UI change (2)
});

bgColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.bgColor = bgColor.value; //data change
  cell.style.backgroundColor = cellProp.bgColor; //UI change (1)

  bgColor.value = cellProp.bgColor; //UI change (2)
});

alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //Modification
    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue; //data change
    cell.style.textAlign = cellProp.alignment; //UI change (1)
    switch (
      alignValue //UI change (2)
    ) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;

        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;

        break;

      default:
        break;
    }
  });
});

//Sync between individual cell and properties tab (We are doing this to basically set properties correctly for each cell so that every cell remebers the properties in sync)
let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
  //
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rid, cid] = decodeRIdCIdFromAddress(address);
    let cellProp = sheetDB[rid][cid];

    //Applying cell properties
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.bgColor;
    cell.style.textAlign = cellProp.alignment;

    //Applying properties to UI props container
    bold.style.backgroundColor = cellProp.bold //UI change (2)
      ? activeColorProp
      : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic //UI change (2)
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline //UI change (2)
      ? activeColorProp
      : inactiveColorProp;

    //We don't need to change UI every time for fontsize and font family
    fontSize.value = cellProp.fontSize; //UI change (2)
    fontFamily.value = cellProp.fontFamily; //UI change (2)

    fontColor.value = cellProp.fontColor; //UI change (2)
    bgColor.value = cellProp.bgColor; //UI change (2)

    switch (
      cellProp.alignment //UI change (2)
    ) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;

        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;

        break;

      default:
        break;
    }

    //For accessing formula for individual cells
    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.value = cellProp.value;
  });
}

//Functions for getting particular cell and cell properties
function getCellAndCellProp(address) {
  let [rid, cid] = decodeRIdCIdFromAddress(address);
  //Access cell and sheet storage
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeRIdCIdFromAddress(address) {
  let rid = +(address.slice(1) - 1);
  let cid = +address.charCodeAt(0) - 65;
  return [rid, cid];
}
