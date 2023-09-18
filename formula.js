//Basically after adding value to each cell on blur event we have to store the value to cell property
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activecell, cellProp] = getCellAndCellProp(address);

      //storing cell value to cell property
      let enteredData = activecell.innerText;

      if (enteredData === cellProp.value) return; // the value doesn't change we need not to update anything
      cellProp.value = enteredData;

      //If we changes cell data by directly putting value,
      //1. remove child parent relationship
      //2. make the formula to empty string
      //3. update children cells according to the new value provided.
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildrenCells(address);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    let evaluatedValue = evaluateFormula(inputFormula);

    // If we change formula for particular cell then break the dependency relationship, evaluate new formula, add new relationship
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (inputFormula !== cellProp.formula)
      removeChildFromParent(cellProp.formula);

    addChildToGraphComponent(inputFormula, address);
    //Check if formula is cyclic or not, then only evaluate
    let isCyclic = isGraphCyclic(graphComponentMatrix);
    if (isCyclic === true) {
      alert("The given formula is cyclic");
      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    //To update UI and cellProp in db
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    addChildToParent(inputFormula);
    // console.log(sheetDB);

    //To update children cells
    updateChildrenCells(address);
  }
});

//To add children relationships from graph
function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIdCIdFromAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIdCIdFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

//To remove children relationships from graph
function removeChildFromGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIdCIdFromAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIdCIdFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

//For recursively updating all the dpendency relationships or children when any changes made on formula.
function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);

    //For recursively updating all the dpendency relationships or children when any changes made
    updateChildrenCells(childAddress);
  }
}

function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0); //Taking the 0 rth index of first string( eg: for 'B2' 0th will be B)
    if (asciiValue >= 65 && asciiValue <= 90) {
      // 65-90 range represents A-Z
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]); //Using the same cell and props function
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0); //Taking the 0 rth index of first string( eg: for 'B2' 0th will be B)
    if (asciiValue >= 65 && asciiValue <= 90) {
      // 65-90 range represents A-Z
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]); //Using the same cell and props function
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

//******************Function to evaluate formula*********************//
function evaluateFormula(formula) {
  //Keep in mind formula provided by user must be space separated
  let encodedFormula = formula.split(" ");

  //Decoding encoded formula
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0); //Taking the 0 rth index of first string( eg: for 'B2' 0th will be B)
    if (asciiValue >= 65 && asciiValue <= 90) {
      // 65-90 range represents A-Z
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]); //Using the same cell and props function
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula); //eval function in js used to execute formula and return result. It takes formula  as string format.
}

//Function to update cell for UI and storage
function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = getCellAndCellProp(address);

  //UI update
  cell.innerText = evaluatedValue;

  // storage update
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
