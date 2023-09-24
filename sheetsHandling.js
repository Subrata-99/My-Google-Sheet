let activeSheetColor = "#ced6e0";
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

//For adding multiple sheets
addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetFolders.length);

  sheet.innerHTML = `<div class="sheet-content">Sheet ${
    allSheetFolders.length + 1
  }</div>`;

  sheetsFolderCont.appendChild(sheet);

  //New DB create
  createSheetDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);
  sheet.click();
});

function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    // Right click
    if (e.button !== 2) return;

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    if (allSheetFolders.length === 1) {
      alert("You need to have atleast one sheet!");
      return;
    }

    let response = confirm(
      "Your sheet will be removed permanently, are you sure ?"
    );
    if (response === false) return;

    //DB remove
    let sheetIndex = Number(sheet.getAttribute("id"));
    collectedSheetDB.splice(sheetIndex, 1);
    collectedGraphComponent.splice(sheetIndex, 1);

    // UI remove
    handleSheetUIRemoval(sheet);

    //By default assign DB to sheet 1 (active)
    sheetDB = collectedSheetDB[0];
    graphComponentMatrix = collectedGraphComponent[0];
    handleSheetProperties();
  });
}

function handleSheetUIRemoval(sheet) {
  sheet.remove();
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].setAttribute("id", i);
    let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
    allSheetFolders[i].style.backgroundColor = "transparent";
  }

  allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIndex) {
  sheetDB = collectedSheetDB[sheetIndex];
  graphComponentMatrix = collectedGraphComponent[sheetIndex];
}

function handleSheetProperties() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.click();
    }
  }

  //Default select first cell via DOM
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

function handleSheetUI(sheet) {
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIndex = Number(sheet.getAttribute("id"));

    handleSheetDB(sheetIndex);
    handleSheetProperties();
    handleSheetUI(sheet);
    console.log("handleSheetActiveness", sheetDB);
  });
}

function createSheetDB() {
  let sheetDB = [];

  //Creating the data storage for all cell attributes as matrix format
  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
      let cellProp = {
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
      sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
  }
  collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
  let graphComponentMatrix = [];

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      //why array ? -> More than one child relation
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  collectedGraphComponent.push(graphComponentMatrix);
}
