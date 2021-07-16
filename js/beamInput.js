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
    let textArea = document.getElementById("output-calculations");

    if (beamType.value == "c-end-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{Fx^2}{6EI}(3L-x) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{FL^3}{3EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V_{max} = F \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M = -F(L-x) \\\\
                              & \\\\
                              & M_{max} = -FL, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "c-int-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = \\begin{cases}
                                  -\\frac{Fx^2}{6EI}(3a-x), & 0 \\leq x \\leq a \\\\
                                  -\\frac{Fa^2}{6EI}(3x-a), & a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{Fa^2}{6EI}(3L-a), \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = \\begin{cases}
                                  F, & 0 \\leq x \\leq a \\\\
                                  0, & a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{max} = F \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M = \\begin{cases}
                                  -F(a-x), & 0 \\leq x \\leq a \\\\
                                  0, & a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & M_{max} = -Fa, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "c-uni-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{wx^2}{24EI}(6L^2-4Lx+x^2) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{wL^4}{8EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = w(L-x) \\\\
                              & \\\\
                              & V_{max} = wL, \\quad x = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M = -w(L-x)^2/2 \\\\
                              & \\\\
                              & M_{max} = -wL^2/2, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "c-tri-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{wx^2}{120LEI}(10L^3-10L^2x+5Lx^2-x^3) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{wL^4}{30EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V_{max} = wL/2, \\quad x = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = -wL^2/6, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "c-end-mome") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{Mx^2}{2EI} \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{ML^2}{2EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V_{max} = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = -M \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-int-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{Fbx}{6LEI}(L^2-b^2-x^2), \\quad 0 \\leq x \\leq a \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{Fb(L^2-b^2)^{3/2}}{9\\sqrt{3}LEI}, \\quad x = \\sqrt{\\frac{L^2-b^2}{3}}, \\quad a \\geq b \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = \\begin{cases}
                                  Fb/L, & 0 \\leq x \\leq a \\\\
                                  -Fa/L, & a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = Fb/L \\\\
                              & V_{2max} = -Fa/L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = Fab/L, \\quad x = a \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-cen-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{Fx}{48EI}(3L^2-4x^2), \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{FL^3}{48EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = \\begin{cases}
                                  F/2, & 0 \\leq x \\leq L/2 \\\\
                                  -F/2, & L/2 \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = F/2 \\\\
                              & V_{2max} = -F/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = FL/4, \\quad x = L/2 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-two-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = \\begin{cases}
                                  -\\frac{Fx}{6EI}(3aL-3a^2-x^2), & 0 \\leq x \\leq a \\\\
                                  -\\frac{Fa}{6EI}(3Lx-3x^2-a^2), & a \\leq x \\leq L-a \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{Fa}{24EI}(3L^2-4a^2), \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = \\begin{cases}
                                  F, & 0 \\leq x \\leq a \\\\
                                  -F, & L-a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = F \\\\
                              & V_{2max} = -F \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = Fa, \\quad a \\leq x \\leq L-a \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-uni-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{wx}{24EI}(L^3-2Lx^2+x^3) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{5wL^4}{384EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = w(L/2-x) \\\\
                              & \\\\
                              & V_{1max} = wL/2, \\quad x = 0 \\\\
                              & V_{2max} = -wL/2, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = wL^2/8, \\quad x = L/2 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-two-mome") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{Mx}{2EI}(L-x) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{ML^2}{8EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V_{max} = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = M \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-one-mome") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{Mx}{6LEI}(2L^2-3Lx+x^2) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{ML^2}{9\\sqrt{3}EI}, \\quad x = L(1-\\sqrt{3}/3) \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V_{max} = -M/L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M_{max} = M, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-cen-mome") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = \\frac{Mx}{24LEI}(L^2-4x^2), \\quad 0 \\leq x \\leq L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V_{max} = -M/L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M = -Mx/L, \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & M_{max} = M/2, \\quad x = L/2 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "f-cen-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{Fx^2}{48EI}(3L-4x), \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{FL^3}{192EI}, \\quad x = L/2
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = \\begin{cases}
                                  F/2, & 0 \\leq x \\leq L/2 \\\\
                                  -F/2, & L/2 \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = F/2 \\\\
                              & V_{2max} = -F/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M = F(4x-L)/8, \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & M_{1max} = -FL^2/8, \\quad x = 0 \\\\
                              & M_{2max} = FL^2/8, \\quad x = L/2 \\\\
                              & M_{3max} = -FL^2/8, \\quad x = L \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "f-uni-load") {
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \u03B4 = -\\frac{wx^2}{24LEI}(L-x)^2 \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{wL^4}{384EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & V = w(L/2-x) \\\\
                              & \\\\
                              & V_{1max} = wL/2, \\quad x = 0 \\\\
                              & V_{2max} = -wL/2, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad

                            \\begin{aligned}[t]
                              & M = w(6Lx-6x^2-L^2)/12 \\\\
                              & \\\\
                              & M_{1max} = -wL^2/12, \\quad x = 0 \\\\
                              & M_{2max} = wL^2/24, \\quad x = L/2 \\\\
                              & M_{3max} = -wL^2/12, \\quad x = L \\\\
                            \\end{aligned}
                            \\]`;
    }

    MathJax.typeset();
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