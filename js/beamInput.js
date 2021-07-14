let inputF; // unit: kN
let inputW; // unit: kN/W
let inputA; // unit: m
let inputL; // unit: m
let inputM; // unit: kN*m
let inputI; // unit: mm^4
let inputE; // unit: GPa

let valueF; // unit: N
let valueW; // unit: N/m
let valueA; // unit: m
let valueL; // unit: m
let valueM; // unit: N*m
let valueI; // unit: m^4
let valueE; // unit: Pa

// same units as value variables
let maxF;
let maxW;
let maxA;
let maxL;
let maxM;
let maxI;
let maxE;

// used to select the draw function
let beamType;

// used to draw figures in the correct scale
let valueLPX;
let valueAPX;

window.onload = () => {
  maxF = 1000000;
  maxW = 3000000;
  maxA = 3000;
  maxL = 3000;
  maxM = 2000000000;
  minI = 0.0000001;
  minE = 10000000000;

  inputF = document.querySelector("#input-F");
  inputW = document.querySelector("#input-W");
  inputA = document.querySelector("#input-A");
  inputL = document.querySelector("#input-L");
  inputM = document.querySelector("#input-M");
  inputI = document.querySelector("#input-I");
  inputE = document.querySelector("#input-E");
  valueF = parseFloat(inputF.value)*1000;
  valueW = parseFloat(inputW.value)*1000;
  valueA = parseFloat(inputA.value);
  valueL = parseFloat(inputL.value);
  valueM = parseFloat(inputM.value)*1000;
  valueI = parseFloat(inputI.value)/1000000000000;
  valueE = parseFloat(inputE.value)*1000000000;
  beamType = document.querySelector("#beam-select");
  valueLPX = map(valueL, 0, 3000, 0, 400);
  valueAPX = map(valueA, 0, 3000, 0, 400);

  inputF.onchange = () => {
    inputF.value = validateInput(inputF.value, -1000, 1000);
    valueF = parseFloat(inputF.value)*1000;
  }
  inputW.onchange = () => {
    inputW.value = validateInput(inputW.value, -3000, 3000);
    valueW = parseFloat(inputW.value)*1000;
  }
  inputA.onchange = () => {
    inputA.value = validateInput(inputA.value, 0, 3000);
    valueA = parseFloat(inputA.value);
    valueAPX = map(valueA, 0, 3000, 0, 400);
    if (valueA > valueL) {
      inputL.value = validateInput(valueA, 0, 3000);
      valueL = parseFloat(inputL.value);
      valueLPX = map(valueL, 0, 3000, 0, 400);
    }
  }
  inputL.onchange = () => {
    inputL.value = validateInput(inputL.value, 0, 3000);
    valueL = parseFloat(inputL.value);
    valueLPX = map(valueL, 0, 3000, 0, 400);
    if (valueA > valueL) {
      inputA.value = validateInput(valueL, 0, 3000);
      valueA = parseFloat(inputA.value);
      valueAPX = map(valueA, 0, 3000, 0, 400);
    }
  }
  inputM.onchange = () => {
    inputM.value = validateInput(inputM.value, -2000000, 2000000);
    valueM = parseFloat(inputM.value)*1000;
  }
  inputI.onchange = () => {
    inputI.value = validateInput(inputI.value, 100000, 1000000000);
    valueI = parseFloat(inputI.value)/1000000000000;
  }
  inputE.onchange = () => {
    inputE.value = validateInput(inputE.value, 10, 500);
    valueE = parseFloat(inputE.value)*1000000000;
  }
}

function validateInput(input, min = -10, max = 10) {
  if (isNaN(input) || input == "") {
    return max;
  } else if (input > max) {
    return max;
  } else if (input < min) {
    return min;
  }
  return Math.round(input*1000)/1000;
}