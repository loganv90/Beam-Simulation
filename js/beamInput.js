// the input text boxes
let inputF; // unit: kN
let inputW; // unit: kN/W
let inputA; // unit: m
let inputL; // unit: m
let inputM; // unit: kN*m
let inputI; // unit: mm^4
let inputE; // unit: GPa
// the input sliders
let sliderF; // unit: kN
let sliderW; // unit: kN/W
let sliderA; // unit: m
let sliderL; // unit: m
let sliderM; // unit: kN*m
let sliderI; // unit: mm^4
let sliderE; // unit: GPa
// converted values for the calculations
let valueF; // unit: N
let valueW; // unit: N/m
let valueA; // unit: m
let valueL; // unit: m
let valueM; // unit: N*m
let valueI; // unit: m^4
let valueE; // unit: Pa
// limits for the value variables
let maxF, minF;
let maxW, minW;
let maxA, minA;
let maxL, minL;
let maxM, minM;
let maxI, minI;
let maxE, minE;

// the zoom text boxes
let zoomF; // unit: percentage
let zoomD; // unit: percentage
let zoomS; // unit: percentage
let zoomM; // unit: percentage
// converted values for the calibrations
let scaleF; // unit: fraction
let scaleD; // unit: fraction
let scaleS; // unit: fraction
let scaleM; // unit: fraction
// limits for the scale variables
let maxZ, minZ;

// limits on the size of the figures
let heightPX;
let valueLPX;
let valueAPX;

// the buttons and a flag
let buttonA;
let buttonH;
let halfButton;

// the selected beam type
let beamType;

window.onload = () => {
  inputF = document.querySelector("#input-F");
  inputW = document.querySelector("#input-W");
  inputA = document.querySelector("#input-A");
  inputL = document.querySelector("#input-L");
  inputM = document.querySelector("#input-M");
  inputI = document.querySelector("#input-I");
  inputE = document.querySelector("#input-E");
  sliderF = document.querySelector("#slider-F");
  sliderW = document.querySelector("#slider-W");
  sliderA = document.querySelector("#slider-A");
  sliderL = document.querySelector("#slider-L");
  sliderM = document.querySelector("#slider-M");
  sliderI = document.querySelector("#slider-I");
  sliderE = document.querySelector("#slider-E");
  valueF = parseFloat(inputF.value)*1000;
  valueW = parseFloat(inputW.value)*1000;
  valueA = parseFloat(inputA.value);
  valueL = parseFloat(inputL.value);
  valueM = parseFloat(inputM.value)*1000;
  valueI = parseFloat(inputI.value)*0.000000000001;
  valueE = parseFloat(inputE.value)*1000000000;
  maxF = 100000;
  minF = -100000;
  maxW = 100000;
  minW = -100000;
  maxA = 1000;
  minA = 0;
  maxL = 1000;
  minL = 0.001;
  maxM = 100000;
  minM = -100000;
  maxI = 0.001;
  minI = 0.0000001;
  maxE = 1000000000000;
  minE = 10000000000;

  zoomF = document.querySelector("#zoom-F");
  zoomD = document.querySelector("#zoom-D");
  zoomS = document.querySelector("#zoom-S");
  zoomM = document.querySelector("#zoom-M");
  scaleF = parseFloat(zoomF.value)*0.01;
  scaleD = parseFloat(zoomD.value)*0.01;
  scaleS = parseFloat(zoomS.value)*0.01;
  scaleM = parseFloat(zoomM.value)*0.01;
  maxZ = 1e+50;
  minZ = 1;

  heightPX = 50;
  valueLPX = 400;
  valueAPX = map(valueA, 0, valueL, 0, valueLPX);

  buttonA = document.querySelector("#button-A");
  buttonH = document.querySelector("#button-H");
  halfButton = true;

  beamType = document.querySelector("#beam-select");


  // the functionality of the input text boxes
  inputF.onchange = () => {
    inputF.value = validateInput(inputF.value, minF/1000, maxF/1000);
    valueF = parseFloat(validateInput(inputF.value, minF/1000, maxF/1000))*1000;
    sliderF.value = inputF.value;
  }
  inputW.onchange = () => {
    inputW.value = validateInput(inputW.value, minW/1000, maxW/1000);
    valueW = parseFloat(validateInput(inputW.value, minW/1000, maxW/1000))*1000;
    sliderW.value = inputW.value;
  }
  inputA.onchange = () => {
    inputA.value = validateInput(inputA.value, minA, maxA);
    valueA = parseFloat(validateInput(inputA.value, minA, maxA));
    if (valueA > valueL) {
      inputL.value = validateInput(inputA.value, minL, maxL);
      sliderL.value = validateInput(inputA.value, minL, maxL);
      valueL = parseFloat(validateInput(inputA.value, minL, maxL));
    }
    valueAPX = map(valueA, 0, valueL, 0, valueLPX);
    sliderA.value = inputA.value;
  }
  inputL.onchange = () => {
    inputL.value = validateInput(inputL.value, minL, maxL);
    valueL = parseFloat(validateInput(inputL.value, minL, maxL));
    if (valueA > valueL) {
      inputA.value = validateInput(inputL.value, minA, maxA);
      sliderA.value = validateInput(inputL.value, minL, maxL);
      valueA = parseFloat(validateInput(inputL.value, minA, maxA));
    }
    valueAPX = map(valueA, 0, valueL, 0, valueLPX);
    sliderL.value = inputL.value;
  }
  inputM.onchange = () => {
    inputM.value = validateInput(inputM.value, minM/1000, maxM/1000);
    valueM = parseFloat(validateInput(inputM.value, minM/1000, maxM/1000))*1000;
    sliderM.value = inputM.value;
  }
  inputI.onchange = () => {
    inputI.value = validateInput(inputI.value, minI/0.000000000001, maxI/0.000000000001);
    valueI = parseFloat(validateInput(inputI.value, minI/0.000000000001, maxI/0.000000000001))*0.000000000001;
    sliderI.value = inputI.value;
  }
  inputE.onchange = () => {
    inputE.value = validateInput(inputE.value, minE/1000000000, maxE/1000000000);
    valueE = parseFloat(validateInput(inputE.value, minE/1000000000, maxE/1000000000))*1000000000;
    sliderE.value = inputE.value;
  }


  // the functionality of the input sliders
  sliderF.addEventListener("input", () => {
    inputF.value = validateInput(sliderF.value, minF/1000, maxF/1000);
    valueF = parseFloat(validateInput(sliderF.value, minF/1000, maxF/1000))*1000;
  })
  sliderW.addEventListener("input", () => {
    inputW.value = validateInput(sliderW.value, minW/1000, maxW/1000);
    valueW = parseFloat(validateInput(sliderW.value, minW/1000, maxW/1000))*1000;
  })
  sliderA.addEventListener("input", () => {
    inputA.value = validateInput(sliderA.value, minA, maxA);
    valueA = parseFloat(validateInput(sliderA.value, minA, maxA));
    if (valueA > valueL) {
      inputL.value = validateInput(sliderA.value, minL, maxL);
      sliderL.value = validateInput(sliderA.value, minL, maxL);
      valueL = parseFloat(validateInput(sliderA.value, minL, maxL));
    }
    valueAPX = map(valueA, 0, valueL, 0, valueLPX);
  })
  sliderL.addEventListener("input", () => {
    inputL.value = validateInput(sliderL.value, minL, maxL);
    valueL = parseFloat(validateInput(sliderL.value, minL, maxL));
    if (valueA > valueL) {
      inputA.value = validateInput(sliderL.value, minA, maxA);
      sliderA.value = validateInput(sliderL.value, minL, maxL);
      valueA = parseFloat(validateInput(sliderL.value, minA, maxA));
    }
    valueAPX = map(valueA, 0, valueL, 0, valueLPX);
  })
  sliderM.addEventListener("input", () => {
    inputM.value = validateInput(sliderM.value, minM/1000, maxM/1000);
    valueM = parseFloat(validateInput(sliderM.value, minM/1000, maxM/1000))*1000;
  })
  sliderI.addEventListener("input", () => {
    inputI.value = validateInput(sliderI.value, minI/0.000000000001, maxI/0.000000000001);
    valueI = parseFloat(validateInput(sliderI.value, minI/0.000000000001, maxI/0.000000000001))*0.000000000001;
  })
  sliderE.addEventListener("input", () => {
    inputE.value = validateInput(sliderE.value, minE/1000000000, maxE/1000000000);
    valueE = parseFloat(validateInput(sliderE.value, minE/1000000000, maxE/1000000000))*1000000000;
  })


  // the functionality of the zoom text boxes
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


  // the functionality of the buttons
  buttonA.onclick = () => {
    zoomF.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleF = parseFloat(zoomF.value)*0.01;

    zoomD.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleD = parseFloat(zoomD.value)*0.01;

    zoomS.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleS = parseFloat(zoomS.value)*0.01;

    zoomM.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleM = parseFloat(zoomM.value)*0.01;
  }
  buttonH.onclick = () => {
    halfButton = true;
  }


  // this function runs when the beam type is changed
  beamType.onchange = () => {
    halfButton = true;

    let boxes = document.getElementsByClassName("input-box");
    for (let i=0; i<boxes.length; i++) {
      boxes[i].disabled = false;
    }
    let sliders = document.getElementsByClassName("input-slider");
    for (let i=0; i<sliders.length; i++) {
      sliders[i].disabled = false;
    }
    let textArea = document.getElementById("output-calculations");

    if (beamType.value == "c-end-load") {
      boxes[1].disabled = true;
      boxes[2].disabled = true;
      boxes[3].disabled = true;
      sliders[1].disabled = true;
      sliders[2].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{Fx^2}{6EI}(3L-x) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{FL^3}{3EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V_{max} = F \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M = -F(L-x) \\\\
                              & \\\\
                              & M_{max} = -FL, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "c-int-load") {
      boxes[1].disabled = true;
      boxes[2].disabled = true;
      sliders[1].disabled = true;
      sliders[2].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = \\begin{cases}
                                  -\\frac{Fx^2}{6EI}(3a-x), & 0 \\leq x \\leq a \\\\
                                  -\\frac{Fa^2}{6EI}(3x-a), & a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{Fa^2}{6EI}(3L-a), \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = \\begin{cases}
                                  F, & 0 \\leq x \\leq a \\\\
                                  0, & a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{max} = F \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
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
      boxes[0].disabled = true;
      boxes[2].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[2].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{wx^2}{24EI}(6L^2-4Lx+x^2) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{wL^4}{8EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = w(L-x) \\\\
                              & \\\\
                              & V_{max} = wL, \\quad x = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M = -w(L-x)^2/2 \\\\
                              & \\\\
                              & M_{max} = -wL^2/2, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "c-tri-load") {
      boxes[0].disabled = true;
      boxes[2].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[2].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{wx^2}{120LEI}(10L^3-10L^2x+5Lx^2-x^3) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{wL^4}{30EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V_{max} = wL/2, \\quad x = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = -wL^2/6, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "c-end-mome") {
      boxes[0].disabled = true;
      boxes[1].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[1].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{M_{0}x^2}{2EI} \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{M_{0}L^2}{2EI}, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V_{max} = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = -M_{0} \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-int-load") {
      boxes[1].disabled = true;
      boxes[2].disabled = true;
      sliders[1].disabled = true;
      sliders[2].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{Fbx}{6LEI}(L^2-b^2-x^2), \\quad 0 \\leq x \\leq a \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{Fb(L^2-b^2)^{3/2}}{9\\sqrt{3}LEI}, \\quad x = \\sqrt{\\frac{L^2-b^2}{3}}, \\quad a \\geq b \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = \\begin{cases}
                                  Fb/L, & 0 \\leq x \\leq a \\\\
                                  -Fa/L, & a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = Fb/L \\\\
                              & V_{2max} = -Fa/L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = Fab/L, \\quad x = a \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-cen-load") {
      boxes[1].disabled = true;
      boxes[2].disabled = true;
      boxes[3].disabled = true;
      sliders[1].disabled = true;
      sliders[2].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{Fx}{48EI}(3L^2-4x^2), \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{FL^3}{48EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = \\begin{cases}
                                  F/2, & 0 \\leq x \\leq L/2 \\\\
                                  -F/2, & L/2 \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = F/2 \\\\
                              & V_{2max} = -F/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = FL/4, \\quad x = L/2 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-two-load") {
      boxes[1].disabled = true;
      boxes[2].disabled = true;
      sliders[1].disabled = true;
      sliders[2].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = \\begin{cases}
                                  -\\frac{Fx}{6EI}(3aL-3a^2-x^2), & 0 \\leq x \\leq a \\\\
                                  -\\frac{Fa}{6EI}(3Lx-3x^2-a^2), & a \\leq x \\leq L-a \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{Fa}{24EI}(3L^2-4a^2), \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = \\begin{cases}
                                  F, & 0 \\leq x \\leq a \\\\
                                  -F, & L-a \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = F \\\\
                              & V_{2max} = -F \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = Fa, \\quad a \\leq x \\leq L-a \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-uni-load") {
      boxes[0].disabled = true;
      boxes[2].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[2].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{wx}{24EI}(L^3-2Lx^2+x^3) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{5wL^4}{384EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = w(L/2-x) \\\\
                              & \\\\
                              & V_{1max} = wL/2, \\quad x = 0 \\\\
                              & V_{2max} = -wL/2, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = wL^2/8, \\quad x = L/2 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-two-mome") {
      boxes[0].disabled = true;
      boxes[1].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[1].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{M_{0}x}{2EI}(L-x) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{M_{0}L^2}{8EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V_{max} = 0 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = M_{0} = -M_{1} \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-one-mome") {
      boxes[0].disabled = true;
      boxes[1].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[1].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{M_{0}x}{6LEI}(2L^2-3Lx+x^2) \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{M_{0}L^2}{9\\sqrt{3}EI}, \\quad x = L(1-\\sqrt{3}/3) \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V_{max} = -M_{0}/L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M_{max} = M_{0}, \\quad x = 0 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "s-cen-mome") {
      boxes[0].disabled = true;
      boxes[1].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[1].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = \\frac{M_{0}x}{24LEI}(L^2-4x^2), \\quad 0 \\leq x \\leq L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V_{max} = -M_{0}/L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M = -M_{0}x/L, \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & M_{max} = M_{0}/2, \\quad x = L/2 \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "f-cen-load") {
      boxes[1].disabled = true;
      boxes[2].disabled = true;
      boxes[3].disabled = true;
      sliders[1].disabled = true;
      sliders[2].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{Fx^2}{48EI}(3L-4x), \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{FL^3}{192EI}, \\quad x = L/2
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = \\begin{cases}
                                  F/2, & 0 \\leq x \\leq L/2 \\\\
                                  -F/2, & L/2 \\leq x \\leq L \\\\
                                \\end{cases} \\\\
                              & \\\\
                              & V_{1max} = F/2 \\\\
                              & V_{2max} = -F/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
                              & M = F(4x-L)/8, \\quad 0 \\leq x \\leq L/2 \\\\
                              & \\\\
                              & M_{1max} = -FL^2/8, \\quad x = 0 \\\\
                              & M_{2max} = FL^2/8, \\quad x = L/2 \\\\
                              & M_{3max} = -FL^2/8, \\quad x = L \\\\
                            \\end{aligned}
                            \\]`;
    }
    else if (beamType.value == "f-uni-load") {
      boxes[0].disabled = true;
      boxes[2].disabled = true;
      boxes[3].disabled = true;
      sliders[0].disabled = true;
      sliders[2].disabled = true;
      sliders[3].disabled = true;
      textArea.innerHTML = `\\[
                            \\begin{aligned}[t]
                              & \\text{Deflection:} \\\\
                              & \\\\
                              & \\\\
                              & \u03B4 = -\\frac{wx^2}{24LEI}(L-x)^2 \\\\
                              & \\\\
                              & \u03B4_{max} = \\frac{wL^4}{384EI}, \\quad x = L/2 \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Shear:} \\\\
                              & \\\\
                              & \\\\
                              & V = w(L/2-x) \\\\
                              & \\\\
                              & V_{1max} = wL/2, \\quad x = 0 \\\\
                              & V_{2max} = -wL/2, \\quad x = L \\\\
                            \\end{aligned}

                            \\qquad\\qquad\\qquad\\qquad

                            \\begin{aligned}[t]
                              & \\text{Moment:} \\\\
                              & \\\\
                              & \\\\
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





/**
 * This function constrains and rounds a value.
 * @param {number} input The number to constrain and round.
 * @param {number} min The upper limit.
 * @param {number} max The lower limit.
 * @returns {number} The scaled and rounded number.
 */
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
