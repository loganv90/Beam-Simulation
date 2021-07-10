let inputF, inputW, inputA, inputL, inputM, inputI, inputE;
let valueF, valueW, valueA, valueL, valueM, valueI, valueE;
let maxF, maxW, maxA, maxL, maxM, maxI, maxE;
let beamType;

window.onload = () => {
  maxF = 50;
  maxW = 50;
  maxA = 400;
  maxL = 400;
  maxM = 50;
  minI = 100;
  minE = 100;

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
    inputF.value = validateInput(inputF.value, -maxF, maxF);
    valueF = parseFloat(inputF.value);
  }
  inputW.onchange = () => {
    inputW.value = validateInput(inputW.value, -maxW, maxW);
    valueW = parseFloat(inputW.value);
  }
  inputA.onchange = () => {
    inputA.value = validateInput(inputA.value, 0, maxA);
    valueA = parseFloat(inputA.value);
  }
  inputL.onchange = () => {
    inputL.value = validateInput(inputL.value, 0, maxL);
    valueL = parseFloat(inputL.value);
  }
  inputM.onchange = () => {
    inputM.value = validateInput(inputM.value, -maxM, maxM);
    valueM = parseFloat(inputM.value);
  }
  inputI.onchange = () => {
    inputI.value = validateInput(inputI.value, minI, 500);
    valueI = parseFloat(inputI.value);
  }
  inputE.onchange = () => {
    inputE.value = validateInput(inputE.value, minE, 500);
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