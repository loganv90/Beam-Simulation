let inputF, inputW, inputA, inputL, inputM, inputI, inputE;
let valueF, valueW, valueA, valueL, valueM, valueI, valueE;
let beamType;

window.onload = () => {
  //Prevent right-click on simulation from bringing up the context menu
  //document.oncontextmenu = function() {if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {return false;}}

  inputF = document.querySelector("#input-F");
  inputW = document.querySelector("#input-W");
  inputA = document.querySelector("#input-A");
  inputL = document.querySelector("#input-L");
  inputM = document.querySelector("#input-M");
  inputI = document.querySelector("#input-I");
  inputE = document.querySelector("#input-E");
  valueF = parseFloat(inputF.value);
  valueW = parseFloat(inputW.value);
  valueA = parseFloat(inputA.value);
  valueL = parseFloat(inputL.value);
  valueM = parseFloat(inputM.value);
  valueI = parseFloat(inputI.value);
  valueE = parseFloat(inputE.value);
  beamType = document.querySelector("#beam-select");

  inputF.onchange = () => {
    inputF.value = validateInput(inputF.value, -50, 50);
    valueF = parseFloat(inputF.value);
  }
  inputW.onchange = () => {
    inputW.value = validateInput(inputW.value);
    valueW = parseFloat(inputW.value);
  }
  inputA.onchange = () => {
    inputA.value = validateInput(inputA.value, 0, 400, 0);
    valueA = parseFloat(inputA.value);
  }
  inputL.onchange = () => {
    inputL.value = validateInput(inputL.value, 0, 400, 0);
    valueL = parseFloat(inputL.value);
  }
  inputM.onchange = () => {
    inputM.value = validateInput(inputM.value);
    valueM = parseFloat(inputM.value);
  }
  inputI.onchange = () => {
    inputI.value = validateInput(inputI.value, 0, 400, 0);
    valueI = parseFloat(inputI.value);
  }
  inputE.onchange = () => {
    inputE.value = validateInput(inputE.value, 0, 400, 0);
    valueE = parseFloat(inputE.value);
  }
}

function validateInput(input, min = -10, max = 10, def = 0) {
  if (isNaN(input) || input == "") {
    return def;
  } else if (input > max) {
    return max;
  } else if (input < min) {
    return min;
  }
  return Math.round(input*100)/100;
}