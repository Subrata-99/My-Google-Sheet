let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
for (let i = 0; i < rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.innerText = i + 1;
  addressCol.setAttribute("class", "address-col");
  addressColCont.appendChild(addressCol);
}

let addressRowCont = document.querySelector(".address-row-cont");
for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.innerText = i + 1;
  addressRow.setAttribute("class", "address-row");
  addressRowCont.appendChild(addressRow);
}
