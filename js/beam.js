function setup() {
  let canvas = createCanvas(600, 800);
  canvas.parent("container");
  frameRate(60);

  rectMode(CORNERS);
}

function draw() {
  background(200);
  let leftOffset = 100;
  let heights = [height/5, 2*height/5, 3*height/5, 4*height/5];

  if (beamType.value == "c-end-load") {
    drawCEndLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
  }
  else if (beamType.value == "c-int-load") {
    drawCIntLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
  }
  else if (beamType.value == "c-uni-load") {
    drawCUniLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
  }
  else if (beamType.value == "c-tri-load") {
    drawCTriLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
  }
  else if (beamType.value == "c-end-mome") {
    drawCEndMome(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
  }
  else if (beamType.value == "s-int-load") {
    drawSIntLoad(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueLPX, heights[0], false);
  }
  else if (beamType.value == "s-cen-load") {
    drawSCenLoad(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueLPX, heights[0], false);
  }
  else if (beamType.value == "s-two-load") {
    drawSTwoLoad(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueLPX, heights[0], false);
  }
  else if (beamType.value == "s-uni-load") {
    drawSUniLoad(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueLPX, heights[0], false);
  }
  else if (beamType.value == "s-two-mome") {
    drawSTwoMome(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueLPX, heights[0], false);
  }
  else if (beamType.value == "s-one-mome") {
    drawSOneMome(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueLPX, heights[0], false);
  }
  else if (beamType.value == "s-cen-mome") {
    drawSCenMome(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueLPX, heights[0], false);
  }
  else if (beamType.value == "f-cen-load") {
    drawFCenLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
    drawFixedEnd(leftOffset+valueLPX, heights[0], true);
  }
  else if (beamType.value == "f-uni-load") {
    drawFUniLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
    drawFixedEnd(leftOffset+valueLPX, heights[0], true);
  }

  fill(0);
  stroke(0);
  for (let i=0; i<heights.length; i++) {
    line(leftOffset, heights[i], leftOffset+valueLPX, heights[i]);
  }

  if (autoScale) {
    zoomF.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleF = parseFloat(zoomF.value)*0.01;

    zoomD.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleD = parseFloat(zoomD.value)*0.01;

    zoomS.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleS = parseFloat(zoomS.value)*0.01;

    zoomM.value = Math.floor(validateInput(maxZ, minZ, maxZ));
    scaleM = parseFloat(zoomM.value)*0.01;

    autoScale = false;
  }
}





/**
 * This function draws the c-end-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCEndLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxF/scaleF;
  let maxForceY = valueF;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxF/scaleF;

  drawArrow(x+valueLPX, heights[0], scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawValue(x+valueLPX, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxF*maxL*maxL*maxL)/(3*minE*minI)/scaleD;
  let maxDeflectionY = -(valueF*valueL*valueL*valueL)/(3*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxF*maxL*maxL*maxL)/(3*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(3*valueL-funcX)*(valueF*funcX*funcX)/(6*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxF/scaleS;
  let maxShearY = valueF;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = maxF/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueLPX, heights[2]-scaledMaxShearY);
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", maxShearY, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = -maxF*maxL/scaleM;
  let maxMomentY = -valueF*valueL;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = -maxF*maxL/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueLPX, heights[3], x, heights[3]-scaledMaxMomentY);
  drawValue(x, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the c-int-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCIntLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxF/scaleF;
  let maxForceY = valueF;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxF/scaleF;

  drawArrow(x+valueAPX, heights[0], scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawDimAB(x, heights[0], valueLPX, valueAPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL, valueA);
  drawValue(x+valueAPX, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N");


  // Draws the deflection diagram
  let deflectionCalibration = -(3*maxL-maxA)*(maxF*maxA*maxA)/(6*minE*minI)/scaleD;
  let maxDeflectionY = -(3*valueL-valueA)*(valueF*valueA*valueA)/(6*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(3*maxL-maxA)*(maxF*maxA*maxA)/(6*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY;
    if (funcX <= valueA) {
      funcY = -(3*valueA-funcX)*(valueF*funcX*funcX)/(6*valueE*valueI);
    } else {
      funcY = -(3*funcX-valueA)*(valueF*valueA*valueA)/(6*valueE*valueI);
    }
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxF/scaleS;
  let maxShearY = valueF;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = maxF/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueAPX, heights[2]-scaledMaxShearY);
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", maxShearY, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = -maxF*maxA/scaleM;
  let maxMomentY = -valueF*valueA;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = -maxF*maxA/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueAPX, heights[3], x, heights[3]-scaledMaxMomentY);
  drawValue(x, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the c-uni-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCUniLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxW/scaleF;
  let maxForceY = valueW;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxW/scaleF;

  drawUniArrow(x, heights[0], valueLPX, scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawValue(x+valueLPX/2, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N/m");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(8*minE*minI)/scaleD;
  let maxDeflectionY = -(valueW*valueL*valueL*valueL*valueL)/(8*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(8*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(6*valueL*valueL-4*valueL*funcX+funcX*funcX)*(valueW*funcX*funcX)/(24*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxW*maxL/scaleS;
  let maxShearY = valueW*valueL;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = maxW*maxL/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  triangle(x, heights[2], x+valueLPX, heights[2], x, heights[2]-scaledMaxShearY);
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", maxShearY, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = -maxW*maxL*maxL/2/scaleM;
  let maxMomentY = -valueW*valueL*valueL/2;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = -maxW*maxL*maxL/2/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -valueW*(valueL-funcX)*(valueL-funcX)/2;
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -momentCalibration, momentCalibration, heights[3]-50, heights[3]+50, true));
  }
  vertex(x, heights[3]);
  vertex(x, heights[3]-scaledMaxMomentY);
  endShape();
  drawValue(x, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the c-tri-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCTriLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxW/scaleF;
  let maxForceY = valueW;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxW/scaleF;

  drawTriArrow(x, heights[0], valueLPX, scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawValue(x, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(30*minE*minI)/scaleD;
  let maxDeflectionY = -(valueW*valueL*valueL*valueL*valueL)/(30*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(30*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(10*valueL*valueL*valueL-10*valueL*valueL*funcX+5*valueL*funcX*funcX-funcX*funcX*funcX)*(valueW*funcX*funcX)/(120*valueL*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxW*maxL/2/scaleS;
  let maxShearY = valueW*valueL/2;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = maxW*maxL/2/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = (valueW-valueW*(funcX/valueL))*(valueL-funcX)/2;
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, shearCalibration, -shearCalibration, heights[2]-50, heights[2]+50, true));
  }
  vertex(x, heights[2]);
  vertex(x, heights[2]-scaledMaxShearY);
  endShape();
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", maxShearY, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = -maxW*maxL*maxL/6/scaleM;
  let maxMomentY = -valueW*valueL*valueL/6;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = -maxW*maxL*maxL/6/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(valueW-valueW*(funcX/valueL))*(valueL-funcX)*(valueL-funcX)/6;
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -momentCalibration, momentCalibration, heights[3]-50, heights[3]+50, true));
  }
  vertex(x, heights[3]);
  vertex(x, heights[3]-scaledMaxMomentY);
  endShape();
  drawValue(x, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the c-end-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCEndMome(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxM/scaleF;
  let maxForceY = valueM;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxM/scaleF;

  drawMoment(x, heights[0], valueLPX, scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, 1, valueL);
  drawValue(x+valueLPX, heights[0], scaledMaxForceY, 10, "M = ", maxForceY, " N*m");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxM*maxL*maxL)/(2*minE*minI)/scaleD;
  let maxDeflectionY = -(valueM*valueL*valueL)/(2*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxM*maxL*maxL)/(2*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(valueM*funcX*funcX)/(2*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = 1/scaleS;
  let maxShearY = 0;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = 1/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", 0, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = -maxM/scaleM;
  let maxMomentY = -valueM;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = -maxM/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  rect(x, heights[3], x+valueLPX, heights[3]-scaledMaxMomentY);
  drawValue(x, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the s-int-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSIntLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxF/scaleF;
  let maxForceY = valueF;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxF/scaleF;

  drawArrow(x+valueAPX, heights[0], scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawDimAB(x, heights[0], valueLPX, valueAPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL, valueA);
  drawValue(x+valueAPX, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxF*(maxA/2)*Math.pow(maxL*maxL-(maxA/2)*(maxA/2), 3/2))/(9*Math.sqrt(3)*maxL*minE*minI)/scaleD;
  let maxDeflectionXPX;
  let maxDeflectionY;
  if (valueA >= valueL/2) {
    maxDeflectionXPX = Math.sqrt((valueLPX*valueLPX-(valueLPX-valueAPX)*(valueLPX-valueAPX))/3);
    maxDeflectionY = -(valueF*(valueL-valueA)*Math.pow(valueL*valueL-(valueL-valueA)*(valueL-valueA), 3/2))/(9*Math.sqrt(3)*valueL*valueE*valueI);
  } else {
    maxDeflectionXPX = valueLPX-Math.sqrt((valueLPX*valueLPX-valueAPX*valueAPX)/3);
    maxDeflectionY = -(valueF*valueA*Math.pow(valueL*valueL-valueA*valueA, 3/2))/(9*Math.sqrt(3)*valueL*valueE*valueI);
  }
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxF*(maxA/2)*Math.pow(maxL*maxL-(maxA/2)*(maxA/2), 3/2))/(9*Math.sqrt(3)*maxL*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY;
    if (funcX <= valueA) {
      funcY = -(valueL*valueL-(valueL-valueA)*(valueL-valueA)-funcX*funcX)*(valueF*(valueL-valueA)*funcX)/(6*valueL*valueE*valueI);
    } else {
      funcY = -(valueL*valueL-valueA*valueA-(valueL-funcX)*(valueL-funcX))*(valueF*valueA*(valueL-funcX))/(6*valueL*valueE*valueI);
    }
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+maxDeflectionXPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxF/scaleS;
  let maxShearY1 = valueF*(valueL-valueA)/valueL;
  let scaledMaxShearY1 = limitValue(maxShearY1, shearCalibration, "S");
  shearCalibration = maxF/scaleS;
  let maxShearY2 = -valueF*valueA/valueL;
  let scaledMaxShearY2 = limitValue(maxShearY2, maxF/scaleS, "S");
  shearCalibration = maxF/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueAPX, heights[2]-scaledMaxShearY1);
  rect(x+valueAPX, heights[2], x+valueLPX, heights[2]-scaledMaxShearY2);
  drawValue(x, heights[2], scaledMaxShearY1, 10, "V1max =  ", maxShearY1, " N/m^2");
  drawValue(x+valueLPX, heights[2], scaledMaxShearY2, 10, "V2max =  ", maxShearY2, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxF*(maxA/2)*(maxA/2)/maxL/scaleM;
  let maxMomentY = valueF*valueA*(valueL-valueA)/valueL;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = maxF*(maxA/2)*(maxA/2)/maxL/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueAPX, heights[3], x+valueAPX, heights[3]-scaledMaxMomentY);
  triangle(x+valueLPX, heights[3], x+valueAPX, heights[3], x+valueAPX, heights[3]-scaledMaxMomentY);
  drawValue(x+valueAPX, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the s-cen-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSCenLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxF/scaleF;
  let maxForceY = valueF;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxF/scaleF;

  drawArrow(x+valueLPX/2, heights[0], scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawValue(x+valueLPX/2, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxF*maxL*maxL*maxL)/(48*minE*minI)/scaleD;
  let maxDeflectionY = -(valueF*valueL*valueL*valueL)/(48*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxF*maxL*maxL*maxL)/(48*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY;
    if (funcX <= valueL/2) {
      funcY = -(3*valueL*valueL-4*funcX*funcX)*(valueF*funcX)/(48*valueE*valueI);
    } else {
      funcY = -(3*valueL*valueL-4*(valueL-funcX)*(valueL-funcX))*(valueF*(valueL-funcX))/(48*valueE*valueI);
    }
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX/2, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxF/scaleS;
  let maxShearY1 = valueF/2;
  let scaledMaxShearY1 = limitValue(maxShearY1, shearCalibration, "S");
  shearCalibration = maxF/scaleS;
  let maxShearY2 = -valueF/2;
  let scaledMaxShearY2 = limitValue(maxShearY2, shearCalibration, "S");
  shearCalibration = maxF/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueLPX/2, heights[2]-scaledMaxShearY1);
  rect(x+valueLPX/2, heights[2], x+valueLPX, heights[2]-scaledMaxShearY2);
  drawValue(x, heights[2], scaledMaxShearY1, 10, "V1max =  ", maxShearY1, " N/m^2");
  drawValue(x+valueLPX, heights[2], scaledMaxShearY2, 10, "V2max =  ", maxShearY2, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxF*maxL/4/scaleM;
  let maxMomentY = valueF*valueL/4;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = maxF*maxL/4/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueLPX/2, heights[3], x+valueLPX/2, heights[3]-scaledMaxMomentY);
  triangle(x+valueLPX, heights[3], x+valueLPX/2, heights[3], x+valueLPX/2, heights[3]-scaledMaxMomentY);
  drawValue(x+valueLPX/2, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the s-two-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSTwoLoad(x, heights) {
  if (valueA > valueL/2) {
    valueAPX = valueLPX - valueAPX;
    valueA = valueL - valueA;
    inputA.value = valueA;
  }
  
  // Draws the free body diagram
  let forceCalibration = maxF/scaleF;
  let maxForceY = valueF;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxF/scaleF;

  drawArrow(x+valueAPX, heights[0], scaledMaxForceY);
  drawArrow(x+valueLPX-valueAPX, heights[0], scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawDimAA(x, heights[0], valueLPX, valueAPX, (scaledMaxForceY >= 0) ? 1 : -1, valueA);
  drawValue(x+valueAPX, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N");
  drawValue(x+valueLPX-valueAPX, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N");


  // Draws the deflection diagram
  let deflectionCalibration = -(3*maxL*maxL-4*(maxA/2)*(maxA/2))*(maxF*(maxA/2))/(24*minE*minI)/scaleD;
  let maxDeflectionY = -(3*valueL*valueL-4*valueA*valueA)*(valueF*valueA)/(24*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(3*maxL*maxL-4*(maxA/2)*(maxA/2))*(maxF*(maxA/2))/(24*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY;
    if (funcX <= valueA) {
      funcY = -(3*valueA*valueL-3*valueA*valueA-funcX*funcX)*(valueF*funcX)/(6*valueE*valueI);
    }
    else if (funcX >= valueL-valueA) {
      funcY = -(3*valueA*valueL-3*valueA*valueA-(valueL-funcX)*(valueL-funcX))*(valueF*(valueL-funcX))/(6*valueE*valueI);
    }
    else {
      funcY = -(3*valueL*funcX-3*funcX*funcX-valueA*valueA)*(valueF*valueA)/(6*valueE*valueI);
    }
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX/2, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxF/scaleS;
  let maxShearY1 = valueF;
  let scaledMaxShearY1 = limitValue(maxShearY1, shearCalibration, "S");
  shearCalibration = maxF/scaleS;
  let maxShearY2 = -valueF;
  let scaledMaxShearY2 = limitValue(maxShearY2, shearCalibration, "S");
  shearCalibration = maxF/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueAPX, heights[2]-scaledMaxShearY1);
  rect(x+valueLPX-valueAPX, heights[2], x+valueLPX, heights[2]-scaledMaxShearY2);
  drawValue(x, heights[2], scaledMaxShearY1, 10, "V1max =  ", maxShearY1, " N/m^2");
  drawValue(x+valueLPX, heights[2], scaledMaxShearY2, 10, "V2max =  ", maxShearY2, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxF*(maxA/2)/scaleM;
  let maxMomentY = valueF*valueA;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = maxF*(maxA/2)/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueAPX, heights[3], x+valueAPX, heights[3]-scaledMaxMomentY);
  triangle(x+valueLPX, heights[3], x+valueLPX-valueAPX, heights[3], x+valueLPX-valueAPX, heights[3]-scaledMaxMomentY);
  rect(x+valueAPX, heights[3], x+valueLPX-valueAPX, heights[3]-scaledMaxMomentY);
  drawValue(x+valueLPX/2, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the s-uni-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSUniLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxW/scaleF;
  let maxForceY = valueW;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxW/scaleF;

  drawUniArrow(x, heights[0], valueLPX, scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawValue(x+valueLPX/2, heights[0], scaledMaxForceY, 10, "W = ", maxForceY, " N/m");


  // Draws the deflection diagram
  let deflectionCalibration = -(5*maxW*maxL*maxL*maxL*maxL)/(384*minE*minI)/scaleD;
  let maxDeflectionY = -(5*valueW*valueL*valueL*valueL*valueL)/(384*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(5*maxW*maxL*maxL*maxL*maxL)/(384*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(valueL*valueL*valueL-2*valueL*funcX*funcX+funcX*funcX*funcX)*(valueW*funcX)/(24*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX/2, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxW*valueL/2/scaleS;
  let maxShearY1 = valueW*valueL/2;
  let scaledMaxShearY1 = limitValue(maxShearY1, shearCalibration, "S");
  shearCalibration = maxW*valueL/2/scaleS;
  let maxShearY2 = -valueW*valueL/2;
  let scaledMaxShearY2 = limitValue(maxShearY2, shearCalibration, "S");
  shearCalibration = maxW*valueL/2/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  triangle(x, heights[2], x+valueLPX/2, heights[2], x, heights[2]-scaledMaxShearY1);
  triangle(x+valueLPX, heights[2], x+valueLPX/2, heights[2], x+valueLPX, heights[2]+scaledMaxShearY1);
  drawValue(x, heights[2], scaledMaxShearY1, 10, "V1max =  ", maxShearY1, " N/m^2");
  drawValue(x+valueLPX, heights[2], scaledMaxShearY2, 10, "V2max =  ", maxShearY2, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxW*maxL*maxL/8/scaleM;
  let maxMomentY = valueW*valueL*valueL/8;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = maxW*maxL*maxL/8/scaleM;
  
  fill(200, 0, 0);
  stroke(100, 0, 0);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(valueL*funcX-funcX*funcX)*valueW/2;
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -momentCalibration, momentCalibration, heights[3]-50, heights[3]+50, true));
  }
  vertex(x+valueLPX, heights[3]);
  vertex(x, heights[3]);
  endShape();
  drawValue(x+valueLPX/2, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the s-two-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSTwoMome(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxM/scaleF;
  let maxForceY = valueM;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxM/scaleF;

  drawMoment(x, heights[0], 0, scaledMaxForceY);
  drawMoment(x, heights[0], valueLPX, -scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, 1, valueL);
  drawValue(x, heights[0], scaledMaxForceY, 10, "W1 = ", maxForceY, " N/m");
  drawValue(x+valueLPX, heights[0], -scaledMaxForceY, 10, "W2 = ", -maxForceY, " N/m");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxM*maxL*maxL)/(8*minE*minI)/scaleD;
  let maxDeflectionY = -(valueM*valueL*valueL)/(8*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxM*maxL*maxL)/(8*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(valueL-funcX)*(valueM*funcX)/(2*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX/2, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = 1/scaleS;
  let maxShearY = 0;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = 1/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", 0, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxM/scaleM;
  let maxMomentY = valueM;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = maxM/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  rect(x, heights[3], x+valueLPX, heights[3]-scaledMaxMomentY);
  drawValue(x, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the s-one-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSOneMome(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxM/scaleF;
  let maxForceY = valueM;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxM/scaleF;

  drawMoment(x, heights[0], 0, scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, 1, valueL);
  drawValue(x, heights[0], scaledMaxForceY, 10, "M = ", maxForceY, " N/m");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxM*maxL*maxL)/(9*Math.sqrt(3)*minE*minI)/scaleD;
  let maxDeflectionXPX = valueLPX*(1-Math.sqrt(3)/3);
  let maxDeflectionY = -(valueM*valueL*valueL)/(9*Math.sqrt(3)*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxM*maxL*maxL)/(9*Math.sqrt(3)*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(2*valueL*valueL-3*valueL*funcX+funcX*funcX)*(valueM*funcX)/(6*valueL*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+maxDeflectionXPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = -maxM/scaleS;
  let maxShearY = -valueM/valueL;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = -maxM/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueLPX, heights[2]-scaledMaxShearY);
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", maxShearY, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxM/scaleM;
  let maxMomentY = valueM;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = maxM/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueLPX, heights[3], x, heights[3]-scaledMaxMomentY);
  drawValue(x, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the s-cen-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSCenMome(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxM/scaleF;
  let maxForceY = valueM;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxM/scaleF;
  
  drawMoment(x, heights[0], valueLPX/2, scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, 1, valueL);
  drawValue(x+valueLPX/2, heights[0], scaledMaxForceY, 10, "M = ", maxForceY, " N/m");


  // Draws the deflection diagram
  let deflectionCalibration = (maxL*maxL-4*(0.5772156649*maxL/2)*(0.5772156649*maxL/2))*(maxM*(0.5772156649*maxL/2))/(24*maxL*minE*minI)/scaleD;
  let maxDeflectionXPX = 0.5772156649*valueLPX/2;
  let maxDeflectionY = (valueL*valueL-4*(0.5772156649*valueL/2)*(0.5772156649*valueL/2))*(valueM*(0.5772156649*valueL/2))/(24*valueL*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = (maxL*maxL-4*(0.5772156649*maxL/2)*(0.5772156649*maxL/2))*(maxM*(0.5772156649*maxL/2))/(24*maxL*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY;
    if (funcX <= valueL/2) {
      funcY = -(valueL*valueL-4*funcX*funcX)*(valueM*funcX)/(24*valueL*valueE*valueI);
    } else {
      funcY = (valueL*valueL-4*(valueL-funcX)*(valueL-funcX))*(valueM*(valueL-funcX))/(24*valueL*valueE*valueI);
    }
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+maxDeflectionXPX, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = -maxM/scaleS;
  let maxShearY = -valueM/valueL;
  let scaledMaxShearY = limitValue(maxShearY, shearCalibration, "S");
  shearCalibration = -maxM/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueLPX, heights[2]-scaledMaxShearY);
  drawValue(x, heights[2], scaledMaxShearY, 10, "Vmax =  ", maxShearY, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = -maxM/2/scaleM;
  let maxMomentY = -valueM/2;
  let scaledMaxMomentY = limitValue(maxMomentY, momentCalibration, "M");
  momentCalibration = -maxM/2/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueLPX/2, heights[3], x+valueLPX/2, heights[3]-scaledMaxMomentY);
  triangle(x+valueLPX, heights[3], x+valueLPX/2, heights[3], x+valueLPX/2, heights[3]+scaledMaxMomentY);
  drawValue(x+valueLPX/2, heights[3], scaledMaxMomentY, 10, "Mmax =  ", maxMomentY, " N*m");
}





/**
 * This function draws the f-cen-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawFCenLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxF/scaleF;
  let maxForceY = valueF;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxF/scaleF;

  drawArrow(x+valueLPX/2, heights[0], scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawValue(x+valueLPX/2, heights[0], scaledMaxForceY, 10, "F = ", maxForceY, " N/m");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxF*maxL*maxL*maxL)/(192*minE*minI)/scaleD;
  let maxDeflectionY = -(valueF*valueL*valueL*valueL)/(192*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxF*maxL*maxL*maxL)/(192*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY;
    if (funcX <= valueL/2) {
      funcY = -(3*valueL-4*funcX)*(valueF*funcX*funcX)/(48*valueE*valueI);
    } else {
      funcY = -(3*valueL-4*(valueL-funcX))*(valueF*(valueL-funcX)*(valueL-funcX))/(48*valueE*valueI);
    }
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX/2, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxF/scaleS;
  let maxShearY1 = valueF/2;
  let scaledMaxShearY1 = limitValue(maxShearY1, shearCalibration, "S");
  shearCalibration = maxF/scaleS;
  let maxShearY2 = -valueF/2;
  let scaledMaxShearY2 = limitValue(maxShearY2, shearCalibration, "S");
  shearCalibration = maxF/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  rect(x, heights[2], x+valueLPX/2, heights[2]-scaledMaxShearY1);
  rect(x+valueLPX/2, heights[2], x+valueLPX, heights[2]-scaledMaxShearY2);
  drawValue(x, heights[2], scaledMaxShearY1, 10, "V1max =  ", maxShearY1, " N/m^2");
  drawValue(x+valueLPX, heights[2], scaledMaxShearY2, 10, "V2max =  ", maxShearY2, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxF*maxL/8/scaleM;
  let maxMomentY1 = -valueF*valueL/8;
  let scaledMaxMomentY1 = limitValue(maxMomentY1, momentCalibration, "M");
  momentCalibration = maxF*maxL/8/scaleM;
  let maxMomentY2 = valueF*valueL/8;
  let scaledMaxMomentY2 = limitValue(maxMomentY2, momentCalibration, "M");
  momentCalibration = maxF*maxL/8/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  triangle(x, heights[3], x+valueLPX/4, heights[3], x, heights[3]-scaledMaxMomentY1);
  triangle(x+valueLPX/4, heights[3], x+valueLPX/2, heights[3], x+valueLPX/2, heights[3]-scaledMaxMomentY2);
  triangle(x+valueLPX/2, heights[3], x+3*valueLPX/4, heights[3], x+valueLPX/2, heights[3]-scaledMaxMomentY2);
  triangle(x+3*valueLPX/4, heights[3], x+valueLPX, heights[3], x+valueLPX, heights[3]-scaledMaxMomentY1);
  drawValue(x, heights[3], scaledMaxMomentY1, 10, "M1max =  ", maxMomentY1, " N*m");
  drawValue(x+valueLPX/2, heights[3], scaledMaxMomentY2, 10, "M2max =  ", maxMomentY2, " N*m");
  drawValue(x+valueLPX, heights[3], scaledMaxMomentY1, 10, "M3max =  ", maxMomentY1, " N*m");
}





/**
 * This function draws the f-uni-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawFUniLoad(x, heights) {
  // Draws the free body diagram
  let forceCalibration = maxW/scaleF;
  let maxForceY = valueW;
  let scaledMaxForceY = limitValue(maxForceY, forceCalibration, "F");
  forceCalibration = maxW/scaleF;

  drawUniArrow(x, heights[0], valueLPX, scaledMaxForceY);
  drawDimL(x, heights[0], valueLPX, (scaledMaxForceY >= 0) ? 1 : -1, valueL);
  drawValue(x+valueLPX/2, heights[0], scaledMaxForceY, 10, "W = ", maxForceY, " N/m");


  // Draws the deflection diagram
  let deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(384*minE*minI)/scaleD;
  let maxDeflectionY = -(valueW*valueL*valueL*valueL*valueL)/(384*valueE*valueI);
  let scaledMaxDeflectionY = limitValue(maxDeflectionY, deflectionCalibration, "D");
  deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(384*minE*minI)/scaleD;

  noFill();
  stroke(0, 0, 100);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(valueL-funcX)*(valueL-funcX)*(valueW*funcX*funcX)/(24*valueE*valueI);
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -deflectionCalibration, deflectionCalibration, heights[1]-50, heights[1]+50, true));
  }
  endShape();
  drawValue(x+valueLPX/2, heights[1], scaledMaxDeflectionY, 10, "\u03B4max =  ", maxDeflectionY, " m");


  // Draws the shear diagram
  let shearCalibration = maxW*valueL/2/scaleS;
  let maxShearY1 = valueW*valueL/2;
  let scaledMaxShearY1 = limitValue(maxShearY1, shearCalibration, "S");
  shearCalibration = maxW*valueL/2/scaleS;
  let maxShearY2 = -valueW*valueL/2;
  let scaledMaxShearY2 = limitValue(maxShearY2, shearCalibration, "S");
  shearCalibration = maxW*valueL/2/scaleS;

  fill(0, 200, 0);
  stroke(0, 100, 0);
  triangle(x, heights[2], x+valueLPX/2, heights[2], x, heights[2]-scaledMaxShearY1);
  triangle(x+valueLPX, heights[2], x+valueLPX/2, heights[2], x+valueLPX, heights[2]+scaledMaxShearY1);
  drawValue(x, heights[2], scaledMaxShearY1, 10, "V1max =  ", maxShearY1, " N/m^2");
  drawValue(x+valueLPX, heights[2], scaledMaxShearY2, 10, "V2max =  ", maxShearY2, " N/m^2");


  // Draws the moment diagram
  let momentCalibration = maxW*maxL*maxL/12/scaleM;
  let maxMomentY1 = -valueW*valueL*valueL/12;
  let scaledMaxMomentY1 = limitValue(maxMomentY1, momentCalibration, "M");
  momentCalibration = maxW*maxL*maxL/12/scaleM;
  let maxMomentY2 = valueW*valueL*valueL/24;
  let scaledMaxMomentY2 = limitValue(maxMomentY2, momentCalibration, "M");
  momentCalibration = maxW*maxL*maxL/12/scaleM;

  fill(200, 0, 0);
  stroke(100, 0, 0);
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX+=valueL/100) {
    let funcY = -(6*valueL*funcX-6*funcX*funcX-valueL*valueL)*valueW/12;
    vertex(x+map(funcX, 0, valueL, 0, valueLPX), map(funcY, -momentCalibration, momentCalibration, heights[3]-50, heights[3]+50, true));
  }
  vertex(x+valueLPX, heights[3]-scaledMaxMomentY1);
  vertex(x+valueLPX, heights[3]);
  vertex(x, heights[3]);
  vertex(x, heights[3]-scaledMaxMomentY1);
  endShape();
  drawValue(x, heights[3], scaledMaxMomentY1, 10, "M1max =  ", maxMomentY1, " N*m");
  drawValue(x+valueLPX/2, heights[3], scaledMaxMomentY2, 10, "M2max =  ", maxMomentY2, " N*m");
  drawValue(x+valueLPX, heights[3], scaledMaxMomentY1, 10, "M3max =  ", maxMomentY1, " N*m");
}





/**
 * This function draws an arrow for a force.
 * @param {number} x The position of the arrow from the left side of the canvas in pixels.
 * @param {number} y The position of the arrow from the top of the canvas in pixels.
 * @param {number} forceMagnitude The magnitude of the force.
 * @param {number} colour The colour of the arrow.
 */
function drawArrow(x, y, forceMagnitude, colour = color(200, 0, 0)) {
  fill(colour);
  stroke(colour);
  triangle(x, y, x-forceMagnitude/6, y-forceMagnitude/3, x+forceMagnitude/6, y-forceMagnitude/3);
  rect(x-forceMagnitude/18, y-forceMagnitude/3, x+forceMagnitude/18, y-forceMagnitude);
}

/**
 * This function draws an arrow for a rectangular distributed force.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} forceMagnitude The magnitude of the force.
 * @param {number} colour The colour of the arrow.
 */
function drawUniArrow(x, y, lenX, forceMagnitude, colour = color(200, 0, 0)) {
  fill(colour);
  stroke(colour);

  let arrowCount = round(lenX/abs(forceMagnitude));
  if (arrowCount > 10) {
    arrowCount = 10;
  }
  else if (arrowCount < 2) {
    arrowCount = 2;
  }
  
  let arrowSpacing = lenX/arrowCount;
  for (let i=0; i < lenX-1; i+=arrowSpacing) {
    line(x+i, y, x+i, y-forceMagnitude);
    triangle(x+i, y, x+i-forceMagnitude/10, y-forceMagnitude/6, x+i+forceMagnitude/10, y-forceMagnitude/6);
  }
  line(x+lenX, y, x+lenX, y-forceMagnitude);
  triangle(x+lenX, y, x+lenX-forceMagnitude/10, y-forceMagnitude/6, x+lenX+forceMagnitude/10, y-forceMagnitude/6);
  line(x, y-forceMagnitude, x+lenX, y-forceMagnitude);
}

/**
 * This function draws an arrow for a triangular distributed force.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} forceMagnitude The maximum magnitude of the force.
 * @param {number} colour The colour of the arrow.
 */
function drawTriArrow(x, y, lenX, forceMagnitude, colour = color(200, 0, 0)) {
  fill(colour);
  stroke(colour);

  let arrowCount = round(lenX/abs(forceMagnitude));
  if (arrowCount > 10) {
    arrowCount = 10;
  }
  else if (arrowCount < 2) {
    arrowCount = 2;
  }
  
  let arrowSpacing = lenX/arrowCount;
  for (let i=0; i < lenX-arrowSpacing-1; i+=arrowSpacing) {
    line(x+i, y, x+i, y-(forceMagnitude-forceMagnitude*(i/lenX)));
    triangle(x+i, y, x+i-forceMagnitude/10, y-forceMagnitude/6, x+i+forceMagnitude/10, y-forceMagnitude/6);
  }
  line(x, y-forceMagnitude, x+lenX, y);
}

/**
 * This function draws an arrow for a moment.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} momentPosition The position of the center of the arrow's arc from the left side of the figure in pixels.
 * @param {number} momentMagnitude The magnitude of the moment.
 * @param {number} colour The colour of the arrow.
 */
function drawMoment(x, y, momentPosition, momentMagnitude, colour = color(200, 0, 0)) {
  noFill();
  stroke(colour);
  if (momentMagnitude >= 0) {
    arc(x+momentPosition, y, momentMagnitude*2, momentMagnitude*2, 7*PI/6, 0);
    fill(colour);
    triangle(x+momentPosition+momentMagnitude,                   y+momentMagnitude/6,
             x+momentPosition+momentMagnitude-momentMagnitude/6, y-momentMagnitude/6,
             x+momentPosition+momentMagnitude+momentMagnitude/6, y-momentMagnitude/6);
  } else {
    arc(x+momentPosition, y, momentMagnitude*2, momentMagnitude*2, 0, 5*PI/6);
    fill(colour);
    triangle(x+momentPosition-momentMagnitude,                   y+momentMagnitude/6,
             x+momentPosition-momentMagnitude-momentMagnitude/6, y-momentMagnitude/6,
             x+momentPosition-momentMagnitude+momentMagnitude/6, y-momentMagnitude/6);
  }
  circle(x+momentPosition, y, 5);
}

/**
 * This function draws the L dimension.
 * @param {number} x The position of the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} position If equals 1, puts dimension below figure. If equals -1, puts dimension above figure.
 * @param {number} numL The value of the dimension L.
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
function drawDimL(x, y, lenX, position = 1, numL = 1000, spacing = 20, colour = color(120, 60, 120)) {
  fill(colour);
  stroke(colour);
  let textL = "L = " + numL.toExponential(2) + " m";
  let middleL = x+lenX/2;

  line(x, y+position*spacing, x, y+position*spacing+position*10); // left vertical bar
  line(x+lenX, y+position*spacing, x+lenX, y+position*spacing+position*10); // right vertical bar

  if (lenX < 100) {
    line(x, y+position*spacing+position*5, x+lenX+10, y+position*spacing+position*5); // horizontal bar
    textAlign(LEFT, CENTER);
    text(textL, x+lenX+20, y+position*spacing+position*5);
  } else {
    line(x, y+position*spacing+position*5, middleL-45, y+position*spacing+position*5); // left horizontal bar
    line(middleL+45, y+position*spacing+position*5, x+lenX, y+position*spacing+position*5); // right horizontal bar
    textAlign(CENTER, CENTER);
    text(textL, middleL, y+position*spacing+position*5);
  }
}

/**
 * This function draws the A and B dimensions.
 * @param {number} x The position of the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} lenA The horizontal length of the "A" portion of the figure in pixels.
 * @param {number} position If equals 1, puts dimension below figure. If equals -1, puts dimension above figure.
 * @param {number} numL The value of the dimension L.
 * @param {number} numA The value of the dimension A.
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
function drawDimAB(x, y, lenX, lenA, position = 1, numL = 1000, numA = 1000, spacing = 40, colour = color(120, 60, 120)) {
  fill(colour);
  stroke(colour);
  let lenB = lenX-lenA;
  let numB = numL-numA;
  let textA = "A = " + numA.toExponential(2) + " m";
  let textB = "B = " + numB.toExponential(2) + " m";;
  let middleA = x+lenA/2;
  let middleB = x+lenA+lenB/2;

  line(x, y+position*spacing, x, y+position*spacing+position*10); // left vertical bar
  line(x+lenX, y+position*spacing, x+lenX, y+position*spacing+position*10); // right vertical bar
  line(x+lenA, y+position*spacing, x+lenA, y+position*spacing+position*10); // middle vertical bar

  if (lenA < 100) {
    line(x-10, y+position*spacing+position*5, x+lenA, y+position*spacing+position*5); // horizontal bar
    textAlign(RIGHT, CENTER);
    text(textA, x-20, y+position*spacing+position*5);
  } else {
    line(x, y+position*spacing+position*5, middleA-45, y+position*spacing+position*5); // left horizontal bar
    line(middleA+45, y+position*spacing+position*5, x+lenA, y+position*spacing+position*5); // right horizontal bar
    textAlign(CENTER, CENTER);
    text(textA, middleA, y+position*spacing+position*5);
  }

  if (lenB < 100) {
    line(x+lenA, y+position*spacing+position*5, x+lenX+10, y+position*spacing+position*5); // horizontal bar
    textAlign(LEFT, CENTER);
    text(textB, x+lenX+20, y+position*spacing+position*5);
  } else {
    line(x+lenA, y+position*spacing+position*5, middleB-45, y+position*spacing+position*5); // left horizontal bar
    line(middleB+45, y+position*spacing+position*5, x+lenX, y+position*spacing+position*5); // right horizontal bar
    textAlign(CENTER, CENTER);
    text(textB, middleB, y+position*spacing+position*5);
  }
}

/**
 * This function draws two A dimensions.
 * @param {number} x The position of the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} lenA The horizontal length of the "A" portion of the figure in pixels.
 * @param {number} position If equals 1, puts dimension below figure. If equals -1, puts dimension above figure.
 * @param {number} numA The value of the dimension A.
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
 function drawDimAA(x, y, lenX, lenA, position = 1, numA = 1000, spacing = 40, colour = color(120, 60, 120)) {
  fill(colour);
  stroke(colour);
  let textA = "A = " + numA.toExponential(2) + " m";
  let middleA = lenA/2;

  line(x, y+position*spacing, x, y+position*spacing+position*10); // left vertical bar
  line(x+lenX, y+position*spacing, x+lenX, y+position*spacing+position*10); // right vertical bar
  line(x+lenA, y+position*spacing, x+lenA, y+position*spacing+position*10); // left middle vertical bar
  line(x+lenX-lenA, y+position*spacing, x+lenX-lenA, y+position*spacing+position*10); // right middle vertical bar

  if (lenA < 100) {
    // left side
    line(x-10, y+position*spacing+position*5, x+lenA, y+position*spacing+position*5); // horizontal bar
    textAlign(RIGHT, CENTER);
    text(textA, x-20, y+position*spacing+position*5);

    // right side
    line(x+lenX-lenA, y+position*spacing+position*5, x+lenX+10, y+position*spacing+position*5); // horizontal bar
    textAlign(LEFT, CENTER);
    text(textA, x+lenX+20, y+position*spacing+position*5);
  } else {
    // left side
    line(x, y+position*spacing+position*5, x+middleA-45, y+position*spacing+position*5); // left horizontal bar
    line(x+middleA+45, y+position*spacing+position*5, x+lenA, y+position*spacing+position*5); // right horizontal bar
    textAlign(CENTER, CENTER);
    text(textA, x+middleA, y+position*spacing+position*5);

    // right side
    line(x+lenX-lenA, y+position*spacing+position*5, x+lenX-lenA+middleA-45, y+position*spacing+position*5); // left horizontal bar
    line(x+lenX-lenA+middleA+45, y+position*spacing+position*5, x+lenX, y+position*spacing+position*5); // right horizontal bar
    textAlign(CENTER, CENTER);
    text(textA, x+lenX-lenA+middleA, y+position*spacing+position*5);
  }
}

/**
 * This function draws the fixed end symbol.
 * @param {number} x The position to draw the symbol from the left side of the canvas in pixels.
 * @param {number} y The position to draw the symbol from the top of the canvas in pixels.
 * @param {number} facingLeft If true, the symbol is drawn facing left. If false, the symbol is drawn facing right.
 */
function drawFixedEnd(x, y, facingLeft) {
  fill(0);
  stroke(0);

  let deltaX;
  if (facingLeft) {
    deltaX = 5;
  } else {
    deltaX = -5;
  }

  line(x, y-9, x+deltaX, y-4);
  line(x, y-4, x+deltaX, y+1);
  line(x, y+1, x+deltaX, y+6);
  line(x, y+6, x+deltaX, y+11);
  line(x, y-10, x, y+10); // vertical line

  line(x, y-10, x+deltaX, y-5);
  line(x, y-5, x+deltaX, y+0);
  line(x, y+0, x+deltaX, y+5);
  line(x, y+5, x+deltaX, y+10);
  line(x, y-10, x, y+10); // vertical line
}

/**
 * This function draws the supported end symbol.
 * @param {number} x The position to draw the symbol from the left side of the canvas in pixels.
 * @param {number} y The position to draw the symbol from the top of the canvas in pixels.
 */
function drawSupportedEnd(x, y) {
  fill(0);
  stroke(0);

  triangle(x, y, x+3, y+5, x-3, y+5);
  
  line(x+9, y+5, x+4, y+10);
  line(x+4, y+5, x-1, y+10);
  line(x-1, y+5, x-6, y+10);
  line(x-6, y+5, x-11, y+10);
  line(x-10, y+5, x+10, y+5); // horizontal line

  line(x+9, y+5, x+4, y+10);
  line(x+4, y+5, x-1, y+10);
  line(x-1, y+5, x-6, y+10);
  line(x-6, y+5, x-11, y+10);
  line(x-10, y+5, x+10, y+5); // horizontal line
}

/**
 * This function draws the values for the figures.
 * @param {number} x The position to draw the value from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} yOffset The vertical offset from the figure caused by its graphical value in pixels.
 * @param {number} yExtension The vertical separation of the text and the figure.
 * @param {string} name The name of the value.
 * @param {number} value The value itself.
 * @param {string} unit The unit of the value.
 */
function drawValue(x, y, yOffset, yExtension, name, value, unit) {
  fill(0);
  stroke(0);
  textAlign(CENTER, CENTER);

  if (yOffset >= 0) {
    text(name + value.toExponential(2) + unit, x, y-yOffset-yExtension);
  } else {
    text(name + value.toExponential(2) + unit, x, y-yOffset+yExtension);
  }
}

/**
 * This function constrains a value and adjusts the scale.
 * @param {number} max The maximum number to constrain.
 * @param {number} calibration The maximum number that could be constrained.
 * @param {string} type chooses the scale variable to adjust
 * @param {number} limit The upper and lower bound of the number.
 * @returns {number} The scaled and constrained number.
 */
function limitValue(max, calibration, type = "N/A", limit = heightPX) {
  let num = max/(abs(calibration)/limit);

  if (num > limit) {
    if (type == "F") {
      zoomF.value = Math.floor(validateInput(zoomF.value*(limit/num), minZ, maxZ));
      scaleF = parseFloat(zoomF.value)*0.01;
    } else if (type == "D") {
      zoomD.value = Math.floor(validateInput(zoomD.value*(limit/num), minZ, maxZ));
      scaleD = parseFloat(zoomD.value)*0.01;
    } else if (type == "S") {
      zoomS.value = Math.floor(validateInput(zoomS.value*(limit/num), minZ, maxZ));
      scaleS = parseFloat(zoomS.value)*0.01;
    } else if (type == "M") {
      zoomM.value = Math.floor(validateInput(zoomM.value*(limit/num), minZ, maxZ));
      scaleM = parseFloat(zoomM.value)*0.01;
    }
    return limit;
  }
  else if (num < -limit) {
    if (type == "F") {
      zoomF.value = Math.floor(validateInput(zoomF.value*(limit/-num), minZ, maxZ));
      scaleF = parseFloat(zoomF.value)*0.01;
    } else if (type == "D") {
      zoomD.value =  Math.floor(validateInput(zoomD.value*(limit/-num), minZ, maxZ));
      scaleD = parseFloat(zoomD.value)*0.01;
    } else if (type == "S") {
      zoomS.value =  Math.floor(validateInput(zoomS.value*(limit/-num), minZ, maxZ));
      scaleS = parseFloat(zoomS.value)*0.01;
    } else if (type == "M") {
      zoomM.value =  Math.floor(validateInput(zoomM.value*(limit/-num), minZ, maxZ));
      scaleM = parseFloat(zoomM.value)*0.01;
    }
    return -limit;
  }
  return num;
}
