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
let maxF, minF;
let maxW, minW;
let maxA, minA;
let maxL, minL;
let maxM, minM;
let maxI, minI;
let maxE, minE;

// used to select the draw function
let beamType;

// used to draw figures in the correct scale
let heightPX;
let valueLPX;
let valueAPX;

// used to control the scale of the figures
let zoomF, scaleF;
let zoomD, scaleD;
let zoomS, scaleS;
let zoomM, scaleM;

// limits for the zoom variables
let maxZ, minZ;

// used for setting the scale variables
let buttonA;
let autoScale;


window.onload = () => {
  maxF = 1000000;
  minF = -1000000;

  maxW = 3000000;
  minW = -3000000;

  maxA = 3000;
  minA = 0;

  maxL = 3000;
  minL = 0;

  maxM = 2000000000;
  minM = -2000000000;

  maxI = 0.001;
  minI = 0.0000001;

  maxE = 500000000000;
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
  valueI = parseFloat(inputI.value)*0.000000000001;
  valueE = parseFloat(inputE.value)*1000000000;

  beamType = document.querySelector("#beam-select");

  heightPX = 50;
  valueLPX = 400;
  valueAPX = map(valueA, 0, valueL, 0, valueLPX);

  zoomF = document.querySelector("#zoom-F");
  zoomD = document.querySelector("#zoom-D");
  zoomS = document.querySelector("#zoom-S");
  zoomM = document.querySelector("#zoom-M");

  scaleF = parseFloat(zoomF.value)*0.01;
  scaleD = parseFloat(zoomD.value)*0.01;
  scaleS = parseFloat(zoomS.value)*0.01;
  scaleM = parseFloat(zoomM.value)*0.01;

  maxZ = 100000000000000;
  minZ = 1;

  buttonA = document.querySelector("#button-A");
  autoScale = false;
  

  inputF.onchange = () => {
    inputF.value = validateInput(inputF.value, minF/1000, maxF/1000);
    valueF = parseFloat(inputF.value)*1000;
  }
  inputW.onchange = () => {
    inputW.value = validateInput(inputW.value, minW/1000, maxW/1000);
    valueW = parseFloat(inputW.value)*1000;
  }
  inputA.onchange = () => {
    inputA.value = validateInput(inputA.value, minA, maxA);
    valueA = parseFloat(inputA.value);
    if (valueA > valueL) {
      inputL.value = validateInput(inputA.value, minL, maxL);
      valueL = parseFloat(inputL.value);
    }
    valueAPX = map(valueA, 0, valueL, 0, valueLPX);
  }
  inputL.onchange = () => {
    inputL.value = validateInput(inputL.value, minL, maxL);
    valueL = parseFloat(inputL.value);
    if (valueA > valueL) {
      inputA.value = validateInput(inputL.value, minA, maxA);
      valueA = parseFloat(inputA.value);
    }
    valueAPX = map(valueA, 0, valueL, 0, valueLPX);
  }
  inputM.onchange = () => {
    inputM.value = validateInput(inputM.value, minM/1000, maxM/1000);
    valueM = parseFloat(inputM.value)*1000;
  }
  inputI.onchange = () => {
    inputI.value = validateInput(inputI.value, minI/0.000000000001, maxI/0.000000000001);
    valueI = parseFloat(inputI.value)*0.000000000001;
  }
  inputE.onchange = () => {
    inputE.value = validateInput(inputE.value, minE/1000000000, maxE/1000000000);
    valueE = parseFloat(inputE.value)*1000000000;
  }

  zoomF.onchange = () => {
    zoomF.value = Math.floor(validateInput(zoomF.value, minZ, maxZ));
    scaleF = parseFloat(zoomF.value)*0.01;
  }
  zoomD.onchange = () => {
    zoomD.value = Math.floor(validateInput(zoomD.value, minZ, maxZ));
    scaleD = parseFloat(zoomD.value)*0.01;
  }
  zoomS.onchange = () => {
    zoomS.value = Math.floor(validateInput(zoomS.value, minZ, maxZ));
    scaleS = parseFloat(zoomS.value)*0.01;
  }
  zoomM.onchange = () => {
    zoomM.value = Math.floor(validateInput(zoomM.value, minZ, maxZ));
    scaleM = parseFloat(zoomM.value)*0.01;
  }

  buttonA.onclick = () => {
    autoScale = true;
  }

  beamType.onchange = () => {
    let textArea = document.querySelector("#output-calculations");

    if (beamType.value == "c-end-load") {

    }
    else if (beamType.value == "c-int-load") {

    }
    else if (beamType.value == "c-uni-load") {

    }
    else if (beamType.value == "c-tri-load") {

    }
    else if (beamType.value == "c-end-mome") {

    }
    else if (beamType.value == "s-int-load") {

    }
    else if (beamType.value == "s-cen-load") {

    }
    else if (beamType.value == "s-two-load") {

    }
    else if (beamType.value == "s-uni-load") {

    }
    else if (beamType.value == "s-two-mome") {

    }
    else if (beamType.value == "s-one-mome") {

    }
    else if (beamType.value == "s-cen-mome") {

    }
    else if (beamType.value == "f-cen-load") {

    }
    else if (beamType.value == "f-uni-load") {

    }
  }
}


function validateInput(input, min, max) {
  if (isNaN(input) || input == "") {
    return max;
  } else if (input > max) {
    return max;
  } else if (input < min) {
    return min;
  }
  return Math.round(input*1000)/1000;
}