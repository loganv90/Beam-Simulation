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
    drawSupportedEnd(leftOffset+valueL, heights[0], false);
  }
  else if (beamType.value == "s-cen-load") {
    drawSCenLoad(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueL, heights[0], false);
  }
  else if (beamType.value == "s-two-load") {
    drawSTwoLoad(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueL, heights[0], false);
  }
  else if (beamType.value == "s-uni-load") {
    drawSUniLoad(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueL, heights[0], false);
  }
  else if (beamType.value == "s-two-mome") {
    drawSTwoMome(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueL, heights[0], false);
  }
  else if (beamType.value == "s-one-mome") {
    drawSOneMome(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueL, heights[0], false);
  }
  else if (beamType.value == "s-cen-mome") {
    drawSCenMome(leftOffset, heights);
    drawSupportedEnd(leftOffset, heights[0], false);
    drawSupportedEnd(leftOffset+valueL, heights[0], false);
  }
  else if (beamType.value == "f-cen-load") {
    drawFCenLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
    drawFixedEnd(leftOffset+valueL, heights[0], true);
  }
  else if (beamType.value == "f-uni-load") {
    drawFUniLoad(leftOffset, heights);
    drawFixedEnd(leftOffset, heights[0], false);
    drawFixedEnd(leftOffset+valueL, heights[0], true);
  }

  fill(0);
  stroke(0);
  for (let i=0; i<heights.length; i++) {
    line(leftOffset, heights[i], leftOffset+valueL, heights[i]);
  }
}





/**
 * This function draws the c-end-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCEndLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueF < 0) {
    dimensionPosition = -1;
  }

  drawArrow(x, y, valueL, valueF, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxF*maxL*maxL*maxL)/(3*minE*minI);
  let maxDeflectionY = -(valueF*valueL*valueL*valueL)/(3*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(3*valueL-funcX)*(valueF*funcX*funcX)/(6*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY >= 0) {
    text("\u03B4max =  " + maxDeflectionY.toExponential(2) + " m", x+valueL, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max =  " + maxDeflectionY.toExponential(2) + " m", x+valueL, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxF;
  let maxShearY = valueF;
  let scaledMaxShearY = maxShearY/(abs(shearCalibration)/50);

  rect(x, y, x+valueL, y-scaledMaxShearY);

  fill(0);
  stroke(0);
  if (scaledMaxShearY >= 0) {
    text("Vmax =  " + maxShearY.toExponential(2) + " px/m^2", x, y-10-scaledMaxShearY);
  } else {
    text("Vmax =  " + maxShearY.toExponential(2) + " px/m^2", x, y+10-scaledMaxShearY);
  }

  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = -maxF*maxL;
  let maxMomentY = -valueF*valueL;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  triangle(x, y, x+valueL, y, x, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY > 0) {
    text("Mmax =  " + maxMomentY.toExponential(2) + " pxm", x, y-10-scaledMaxMomentY);
  } else {
    text("Mmax =  " + maxMomentY.toExponential(2) + " pxm", x, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the c-int-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCIntLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueF < 0) {
    dimensionPosition = -1;
  }

  drawArrow(x, y, valueA, valueF, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);
  drawDimAB(x, y, valueL, valueA, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(3*maxL-maxA)*(maxF*maxA*maxA)/(6*minE*minI);
  let maxDeflectionY = -(3*valueL-valueA)*(valueF*valueA*valueA)/(6*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY;
    if (funcX <= valueA) {
      funcY = -(3*valueA-funcX)*(valueF*funcX*funcX)/(6*valueE*valueI);
    } else {
      funcY = -(3*funcX-valueA)*(valueF*valueA*valueA)/(6*valueE*valueI);
    }
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxF;
  let maxShearY = valueF;
  let scaledMaxShearY = maxShearY/(abs(shearCalibration)/50);

  rect(x, y, x+valueA, y-scaledMaxShearY);

  fill(0);
  stroke(0);
  if (scaledMaxShearY >= 0) {
    text("Vmax = " + maxShearY + "px/m^2", x, y-10-scaledMaxShearY);
  } else {
    text("Vmax = " + maxShearY + "px/m^2", x, y+10-scaledMaxShearY);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = -maxF*maxA;
  let maxMomentY = -valueF*valueA;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  triangle(x, y, x+valueA, y, x, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY > 0) {
    text("Mmax = " + maxMomentY + "pxm", x, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the c-uni-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCUniLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueW < 0) {
    dimensionPosition = -1;
  }

  drawUniArrow(x, y, valueL, valueW, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(8*minE*minI);
  let maxDeflectionY = -(valueW*valueL*valueL*valueL*valueL)/(8*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(6*valueL*valueL-4*valueL*funcX+funcX*funcX)*(valueW*funcX*funcX)/(24*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxW*maxL;
  let maxShearY = valueW*valueL;
  let scaledMaxShearY = maxShearY/(abs(shearCalibration)/50);

  triangle(x, y, x+valueL, y, x, y-scaledMaxShearY);

  fill(0);
  stroke(0);
  if (scaledMaxShearY >= 0) {
    text("Vmax = " + maxShearY + "px/m^2", x, y-10-scaledMaxShearY);
  } else {
    text("Vmax = " + maxShearY + "px/m^2", x, y+10-scaledMaxShearY);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = -maxW*maxL*maxL/2;
  let maxMomentY = -valueW*valueL*valueL/2;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -valueW*(valueL-funcX)*(valueL-funcX)/2;
    vertex(x+funcX, map(funcY, -momentCalibration, momentCalibration, y-50, y+50, true));
  }
  vertex(x, y);
  vertex(x, y-scaledMaxMomentY);
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxMomentY > 0) {
    text("Mmax = " + maxMomentY + "pxm", x, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the c-tri-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCTriLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueW < 0) {
    dimensionPosition = -1;
  }

  drawTriArrow(x, y, valueL, valueW, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(30*minE*minI);
  let maxDeflectionY = -(valueW*valueL*valueL*valueL*valueL)/(30*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(10*valueL*valueL*valueL-10*valueL*valueL*funcX+5*valueL*funcX*funcX-funcX*funcX*funcX)*(valueW*funcX*funcX)/(120*valueL*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxW*maxL/2;
  let maxShearY = valueW*valueL/2;
  let scaledMaxShearY = maxShearY/(abs(shearCalibration)/50);

  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = (valueW-valueW*(funcX/valueL))*(valueL-funcX)/2;
    vertex(x+funcX, map(funcY, shearCalibration, -shearCalibration, y-50, y+50, true));
  }
  vertex(x, y);
  vertex(x, y-scaledMaxShearY);
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxShearY >= 0) {
    text("Vmax = " + maxShearY + "px/m^2", x, y-10-scaledMaxShearY);
  } else {
    text("Vmax = " + maxShearY + "px/m^2", x, y+10-scaledMaxShearY);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = -maxW*maxL*maxL/6;
  let maxMomentY = -valueW*valueL*valueL/6;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(valueW-valueW*(funcX/valueL))*(valueL-funcX)*(valueL-funcX)/6;
    vertex(x+funcX, map(funcY, -momentCalibration, momentCalibration, y-50, y+50, true));
  }
  vertex(x, y);
  vertex(x, y-scaledMaxMomentY);
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxMomentY > 0) {
    text("Mmax = " + maxMomentY + "pxm", x, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the c-end-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawCEndMome(x, heights) {
  // Draws the free body diagram
  let y = heights[0];

  drawMoment(x, y, valueL, valueM, color(200, 0, 0));
  drawDimL(x, y, valueL, 1);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxM*maxL*maxL)/(2*minE*minI);
  let maxDeflectionY = -(valueM*valueL*valueL)/(2*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(valueM*funcX*funcX)/(2*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = 1;
  let maxShearY = 0;
  let scaledMaxShearY = maxShearY/(abs(shearCalibration)/50);

  fill(0);
  stroke(0);
  if (scaledMaxShearY >= 0) {
    text("Vmax = " + maxShearY + "px/m^2", x, y-10-scaledMaxShearY);
  } else {
    text("Vmax = " + maxShearY + "px/m^2", x, y+10-scaledMaxShearY);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = -maxM;
  let maxMomentY = -valueM;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  rect(x, y, x+valueL, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY > 0) {
    text("Mmax = " + maxMomentY + "pxm", x, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the s-int-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSIntLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueF < 0) {
    dimensionPosition = -1;
  }

  drawArrow(x, y, valueA, valueF, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);
  drawDimAB(x, y, valueL, valueA, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxF*(maxA/2)*Math.pow(maxL*maxL-(maxA/2)*(maxA/2), 3/2))/(9*Math.sqrt(3)*maxL*minE*minI);
  let maxDeflectionX;
  let maxDeflectionY;
  if (valueA >= valueL/2) {
    maxDeflectionX = Math.sqrt((valueL*valueL-(valueL-valueA)*(valueL-valueA))/3);
    maxDeflectionY = -(valueF*(valueL-valueA)*Math.pow(valueL*valueL-(valueL-valueA)*(valueL-valueA), 3/2))/(9*Math.sqrt(3)*valueL*valueE*valueI);
  } else {
    maxDeflectionX = valueL-Math.sqrt((valueL*valueL-valueA*valueA)/3);
    maxDeflectionY = -(valueF*valueA*Math.pow(valueL*valueL-valueA*valueA, 3/2))/(9*Math.sqrt(3)*valueL*valueE*valueI);
  }
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY;
    if (funcX <= valueA) {
      funcY = -(valueL*valueL-(valueL-valueA)*(valueL-valueA)-funcX*funcX)*(valueF*(valueL-valueA)*funcX)/(6*valueL*valueE*valueI);
    } else {
      funcY = -(valueL*valueL-valueA*valueA-(valueL-funcX)*(valueL-funcX))*(valueF*valueA*(valueL-funcX))/(6*valueL*valueE*valueI);
    }
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+maxDeflectionX, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+maxDeflectionX, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxF;
  let maxShearY1 = valueF*(valueL-valueA)/valueL;
  let scaledMaxShearY1 = maxShearY1/(abs(shearCalibration)/50);
  let maxShearY2 = -valueF*valueA/valueL;
  let scaledMaxShearY2 = maxShearY2/(abs(shearCalibration)/50);

  rect(x, y, x+valueA, y-scaledMaxShearY1);
  rect(x+valueA, y, x+valueL, y-scaledMaxShearY2);

  fill(0);
  stroke(0);
  if (scaledMaxShearY1 >= 0) {
    text("V1max = " + maxShearY1 + "px/m^2", x, y-10-scaledMaxShearY1);
  } else {
    text("V1max = " + maxShearY1 + "px/m^2", x, y+10-scaledMaxShearY1);
  }
  if (scaledMaxShearY2 > 0) {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y-10-scaledMaxShearY2);
  } else {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y+10-scaledMaxShearY2);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxF*(maxA/2)*(maxA/2)/maxL;
  let maxMomentY = valueF*valueA*(valueL-valueA)/valueL;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  triangle(x, y, x+valueA, y, x+valueA, y-scaledMaxMomentY);
  triangle(x+valueL, y, x+valueA, y, x+valueA, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY >= 0) {
    text("Mmax = " + maxMomentY + "pxm", x+valueA, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x+valueA, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the s-cen-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSCenLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueF < 0) {
    dimensionPosition = -1;
  }

  drawArrow(x, y, valueL/2, valueF, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxF*maxL*maxL*maxL)/(48*minE*minI);
  let maxDeflectionY = -(valueF*valueL*valueL*valueL)/(48*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY;
    if (funcX <= valueL/2) {
      funcY = -(3*valueL*valueL-4*funcX*funcX)*(valueF*funcX)/(48*valueE*valueI);
    } else {
      funcY = -(3*valueL*valueL-4*(valueL-funcX)*(valueL-funcX))*(valueF*(valueL-funcX))/(48*valueE*valueI);
    }
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxF;
  let maxShearY1 = valueF/2;
  let scaledMaxShearY1 = maxShearY1/(abs(shearCalibration)/50);
  let maxShearY2 = -valueF/2;
  let scaledMaxShearY2 = maxShearY2/(abs(shearCalibration)/50);

  rect(x, y, x+valueL/2, y-scaledMaxShearY1);
  rect(x+valueL/2, y, x+valueL, y-scaledMaxShearY2);

  fill(0);
  stroke(0);
  if (scaledMaxShearY1 >= 0) {
    text("V1max = " + maxShearY1 + "px/m^2", x, y-10-scaledMaxShearY1);
  } else {
    text("V1max = " + maxShearY1 + "px/m^2", x, y+10-scaledMaxShearY1);
  }
  if (scaledMaxShearY2 > 0) {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y-10-scaledMaxShearY2);
  } else {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y+10-scaledMaxShearY2);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxF*maxL/4;
  let maxMomentY = valueF*valueL/4;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  triangle(x, y, x+valueL/2, y, x+valueL/2, y-scaledMaxMomentY);
  triangle(x+valueL, y, x+valueL/2, y, x+valueL/2, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY >= 0) {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the s-two-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSTwoLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueF < 0) {
    dimensionPosition = -1;
  }
  if (valueA > valueL/2) {
    valueA = valueL - valueA;
  }

  drawArrow(x, y, valueA, valueF, color(200, 0, 0));
  drawArrow(x, y, valueL-valueA, valueF, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);
  drawDimAA(x, y, valueL, valueA, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(3*maxL*maxL-4*(maxA/2)*(maxA/2))*(maxF*(maxA/2))/(24*minE*minI);
  let maxDeflectionY = -(3*valueL*valueL-4*valueA*valueA)*(valueF*valueA)/(24*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
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
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxF;
  let maxShearY1 = valueF;
  let scaledMaxShearY1 = maxShearY1/(abs(shearCalibration)/50);
  let maxShearY2 = -valueF;
  let scaledMaxShearY2 = maxShearY2/(abs(shearCalibration)/50);

  rect(x, y, x+valueA, y-scaledMaxShearY1);
  rect(x+valueL-valueA, y, x+valueL, y-scaledMaxShearY2);

  fill(0);
  stroke(0);
  if (scaledMaxShearY1 >= 0) {
    text("V1max = " + maxShearY1 + "px/m^2", x, y-10-scaledMaxShearY1);
  } else {
    text("V1max = " + maxShearY1 + "px/m^2", x, y+10-scaledMaxShearY1);
  }
  if (scaledMaxShearY2 > 0) {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y-10-scaledMaxShearY2);
  } else {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y+10-scaledMaxShearY2);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxF*(maxA/2);
  let maxMomentY = valueF*valueA;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  triangle(x, y, x+valueA, y, x+valueA, y-scaledMaxMomentY);
  triangle(x+valueL, y, x+valueL-valueA, y, x+valueL-valueA, y-scaledMaxMomentY);
  rect(x+valueA, y, x+valueL-valueA, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY >= 0) {
    text("Mmax = " + maxMomentY + "pxm", x+valueA, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x+valueA, y+10-scaledMaxMomentY);
  }
  valueA = parseFloat(inputA.value);
}





/**
 * This function draws the s-uni-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSUniLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueW < 0) {
    dimensionPosition = -1;
  }

  drawUniArrow(x, y, valueL, valueW, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(5*maxW*maxL*maxL*maxL*maxL)/(384*minE*minI);
  let maxDeflectionY = -(5*valueW*valueL*valueL*valueL*valueL)/(384*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(valueL*valueL*valueL-2*valueL*funcX*funcX+funcX*funcX*funcX)*(valueW*funcX)/(24*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxW*valueL/2;
  let maxShearY1 = valueW*valueL/2;
  let scaledMaxShearY1 = maxShearY1/(abs(shearCalibration)/50);
  let maxShearY2 = -valueW*valueL/2;
  let scaledMaxShearY2 = maxShearY2/(abs(shearCalibration)/50);

  triangle(x, y, x+valueL/2, y, x, y-scaledMaxShearY1);
  triangle(x+valueL, y, x+valueL/2, y, x+valueL, y+scaledMaxShearY1);

  fill(0);
  stroke(0);
  if (scaledMaxShearY1 >= 0) {
    text("V1max = " + maxShearY1 + "px/m^2", x, y-10-scaledMaxShearY1);
  } else {
    text("V1max = " + maxShearY1 + "px/m^2", x, y+10-scaledMaxShearY1);
  }
  if (scaledMaxShearY2 > 0) {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y-10-scaledMaxShearY2);
  } else {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y+10-scaledMaxShearY2);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxW*maxL*maxL/8;
  let maxMomentY = valueW*valueL*valueL/8;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  if (scaledMaxMomentY >= 0) {
    arc(x+valueL/2, y, valueL, scaledMaxDeflectionY*2, PI, 0);
  } else {
    arc(x+valueL/2, y, valueL, scaledMaxDeflectionY*2, 0, PI);
  }

  fill(0);
  stroke(0);
  if (scaledMaxMomentY >= 0) {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the s-two-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSTwoMome(x, heights) {
  // Draws the free body diagram
  let y = heights[0];

  drawMoment(x, y, 0, valueM, color(200, 0, 0));
  drawMoment(x, y, valueL, -valueM, color(200, 0, 0));
  drawDimL(x, y, valueL, 1);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxM*maxL*maxL)/(8*minE*minI);
  let maxDeflectionY = -(valueM*valueL*valueL)/(8*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(valueL-funcX)*(valueM*funcX)/(2*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = 1;
  let maxShearY1 = 0;
  let scaledMaxShearY1 = maxShearY1/(abs(shearCalibration)/50);
  let maxShearY2 = 0;
  let scaledMaxShearY2 = maxShearY2/(abs(shearCalibration)/50);

  fill(0);
  stroke(0);
  if (scaledMaxShearY1 >= 0) {
    text("V1max = " + maxShearY1 + "px/m^2", x, y-10-scaledMaxShearY1);
  } else {
    text("V1max = " + maxShearY1 + "px/m^2", x, y+10-scaledMaxShearY1);
  }
  if (scaledMaxShearY2 > 0) {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y-10-scaledMaxShearY2);
  } else {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y+10-scaledMaxShearY2);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxM;
  let maxMomentY = valueM;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  rect(x, y, x+valueL, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY >= 0) {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the s-one-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSOneMome(x, heights) {
  // Draws the free body diagram
  let y = heights[0];

  drawMoment(x, y, 0, valueM, color(200, 0, 0));
  drawDimL(x, y, valueL, 1);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxM*maxL*maxL)/(9*Math.sqrt(3)*minE*minI);
  let maxDeflectionX = valueL*(1-Math.sqrt(3)/3);
  let maxDeflectionY = -(valueM*valueL*valueL)/(9*Math.sqrt(3)*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(2*valueL*valueL-3*valueL*funcX+funcX*funcX)*(valueM*funcX)/(6*valueL*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+maxDeflectionX, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+maxDeflectionX, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = -maxM/maxL;
  let maxShearY = -valueM/valueL;
  let scaledMaxShearY = maxShearY/(abs(shearCalibration)/50);

  rect(x, y, x+valueL, y-scaledMaxShearY);

  fill(0);
  stroke(0);
  if (scaledMaxShearY >= 0) {
    text("V1max = " + maxShearY + "px/m^2", x, y-10-scaledMaxShearY);
  } else {
    text("V1max = " + maxShearY + "px/m^2", x, y+10-scaledMaxShearY);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxM;
  let maxMomentY = valueM;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  triangle(x, y, x+valueL, y, x, y-scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY >= 0) {
    text("Mmax = " + maxMomentY + "pxm", x, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the s-cen-mome figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawSCenMome(x, heights) {
  // Draws the free body diagram
  let y = heights[0];

  drawMoment(x, y, valueL/2, valueM, color(200, 0, 0));
  drawDimL(x, y, valueL, 1);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = (maxL*maxL-4*(0.5772156649*maxL/2)*(0.5772156649*maxL/2))*(maxM*(0.5772156649*maxL/2))/(24*maxL*minE*minI);
  let maxDeflectionX = 0.5772156649*valueL/2;
  let maxDeflectionY = (valueL*valueL-4*(0.5772156649*valueL/2)*(0.5772156649*valueL/2))*(valueM*(0.5772156649*valueL/2))/(24*valueL*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY;
    if (funcX <= valueL/2) {
      funcY = -(valueL*valueL-4*funcX*funcX)*(valueM*funcX)/(24*valueL*valueE*valueI);
    } else {
      funcY = (valueL*valueL-4*(valueL-funcX)*(valueL-funcX))*(valueM*(valueL-funcX))/(24*valueL*valueE*valueI);
    }
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+maxDeflectionX, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+maxDeflectionX, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = -maxM/maxL;
  let maxShearY = -valueM/valueL;
  let scaledMaxShearY = maxShearY/(abs(shearCalibration)/50);

  rect(x, y, x+valueL, y-scaledMaxShearY);

  fill(0);
  stroke(0);
  if (scaledMaxShearY >= 0) {
    text("V1max = " + maxShearY + "px/m^2", x, y-10-scaledMaxShearY);
  } else {
    text("V1max = " + maxShearY + "px/m^2", x, y+10-scaledMaxShearY);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxM/2;
  let maxMomentY = valueM/2;
  let scaledMaxMomentY = maxMomentY/(abs(momentCalibration)/50);

  triangle(x, y, x+valueL/2, y, x+valueL/2, y-scaledMaxMomentY);
  triangle(x+valueL, y, x+valueL/2, y, x+valueL/2, y+scaledMaxMomentY);

  fill(0);
  stroke(0);
  if (scaledMaxMomentY >= 0) {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y-10-scaledMaxMomentY);
  } else {
    text("Mmax = " + maxMomentY + "pxm", x+valueL/2, y+10-scaledMaxMomentY);
  }
}





/**
 * This function draws the f-cen-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawFCenLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueF < 0) {
    dimensionPosition = -1;
  }

  drawArrow(x, y, valueL/2, valueF, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxF*maxL*maxL*maxL)/(192*minE*minI);
  let maxDeflectionY = -(valueF*valueL*valueL*valueL)/(192*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY;
    if (funcX <= valueL/2) {
      funcY = -(3*valueL-4*funcX)*(valueF*funcX*funcX)/(48*valueE*valueI);
    } else {
      funcY = -(3*valueL-4*(valueL-funcX))*(valueF*(valueL-funcX)*(valueL-funcX))/(48*valueE*valueI);
    }
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxF;
  let maxShearY1 = valueF/2;
  let scaledMaxShearY1 = maxShearY1/(abs(shearCalibration)/50);
  let maxShearY2 = -valueF/2;
  let scaledMaxShearY2 = maxShearY2/(abs(shearCalibration)/50);

  rect(x, y, x+valueL/2, y-scaledMaxShearY1);
  rect(x+valueL/2, y, x+valueL, y-scaledMaxShearY2);

  fill(0);
  stroke(0);
  if (scaledMaxShearY1 >= 0) {
    text("V1max = " + maxShearY1 + "px/m^2", x, y-10-scaledMaxShearY1);
  } else {
    text("V1max = " + maxShearY1 + "px/m^2", x, y+10-scaledMaxShearY1);
  }
  if (scaledMaxShearY2 > 0) {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y-10-scaledMaxShearY2);
  } else {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y+10-scaledMaxShearY2);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxF*maxL/8;
  let maxMomentY1 = -valueF*valueL/8;
  let scaledMaxMomentY1 = maxMomentY1/(abs(momentCalibration)/50);
  let maxMomentY2 = valueF*valueL/8;
  let scaledMaxMomentY2 = maxMomentY2/(abs(momentCalibration)/50);

  triangle(x, y, x+valueL/4, y, x, y-scaledMaxMomentY1); // left
  triangle(x+valueL/4, y, x+valueL/2, y, x+valueL/2, y-scaledMaxMomentY2); // left middle
  triangle(x+valueL/2, y, x+3*valueL/4, y, x+valueL/2, y-scaledMaxMomentY2); // right middle
  triangle(x+3*valueL/4, y, x+valueL, y, x+valueL, y-scaledMaxMomentY1); // right

  fill(0);
  stroke(0);
  if (scaledMaxMomentY1 >= 0) {
    text("M1max = " + maxMomentY1 + "pxm", x, y-10-scaledMaxMomentY1);
  } else {
    text("M1max = " + maxMomentY1 + "pxm", x, y+10-scaledMaxMomentY1);
  }
  if (scaledMaxMomentY2 >= 0) {
    text("M2max = " + maxMomentY2 + "pxm", x+valueL/2, y-10-scaledMaxMomentY2);
  } else {
    text("M2max = " + maxMomentY2 + "pxm", x+valueL/2, y+10-scaledMaxMomentY2);
  }
  if (scaledMaxMomentY1 >= 0) {
    text("M3max = " + maxMomentY1 + "pxm", x+valueL, y-10-scaledMaxMomentY1);
  } else {
    text("M3max = " + maxMomentY1 + "pxm", x+valueL, y+10-scaledMaxMomentY1);
  }
}





/**
 * This function draws the f-uni-load figures.
 * @param {number} x The position of the leftmost portion the figures from the left side of the canvas in pixels.
 * @param {number[]} heights An array containing the positions of the figures from the top of the canvas in pixels.
 */
function drawFUniLoad(x, heights) {
  // Draws the free body diagram
  let y = heights[0];
  let dimensionPosition = 1;
  if (valueW < 0) {
    dimensionPosition = -1;
  }

  drawUniArrow(x, y, valueL, valueW, color(200, 0, 0));
  drawDimL(x, y, valueL, dimensionPosition);


  // Draws the deflection diagram
  y = heights[1];
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  let deflectionCalibration = -(maxW*maxL*maxL*maxL*maxL)/(384*minE*minI);
  let maxDeflectionY = -(valueW*valueL*valueL*valueL*valueL)/(384*valueE*valueI);
  let scaledMaxDeflectionY = maxDeflectionY/(abs(deflectionCalibration)/50);

  noFill();
  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(valueL-funcX)*(valueL-funcX)*(valueW*funcX*funcX)/(24*valueE*valueI);
    vertex(x+funcX, map(funcY, -deflectionCalibration, deflectionCalibration, y-50, y+50, true));
  }
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxDeflectionY > 0) {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y-10-scaledMaxDeflectionY);
  } else {
    text("\u03B4max = " + maxDeflectionY + "m", x+valueL/2, y+10-scaledMaxDeflectionY);
  }


  // Draws the shear diagram
  y = heights[2];
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  let shearCalibration = maxW*valueL/2;
  let maxShearY1 = valueW*valueL/2;
  let scaledMaxShearY1 = maxShearY1/(abs(shearCalibration)/50);
  let maxShearY2 = -valueW*valueL/2;
  let scaledMaxShearY2 = maxShearY2/(abs(shearCalibration)/50);

  triangle(x, y, x+valueL/2, y, x, y-scaledMaxShearY1);
  triangle(x+valueL, y, x+valueL/2, y, x+valueL, y+scaledMaxShearY1);

  fill(0);
  stroke(0);
  if (scaledMaxShearY1 >= 0) {
    text("V1max = " + maxShearY1 + "px/m^2", x, y-10-scaledMaxShearY1);
  } else {
    text("V1max = " + maxShearY1 + "px/m^2", x, y+10-scaledMaxShearY1);
  }
  if (scaledMaxShearY2 > 0) {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y-10-scaledMaxShearY2);
  } else {
    text("V2max = " + maxShearY2 + "px/m^2", x+valueL, y+10-scaledMaxShearY2);
  }


  // Draws the moment diagram
  y = heights[3];
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  let momentCalibration = maxW*maxL*maxL/12;
  let maxMomentY1 = -valueW*valueL*valueL/12;
  let scaledMaxMomentY1 = maxMomentY1/(abs(momentCalibration)/50);
  let maxMomentY2 = valueW*valueL*valueL/24;
  let scaledMaxMomentY2 = maxMomentY2/(abs(momentCalibration)/50);

  beginShape();
  for (let funcX = 0; funcX <= valueL; funcX++) {
    let funcY = -(6*valueL*funcX-6*funcX*funcX-valueL*valueL)*valueW/12;
    vertex(x+funcX, map(funcY, -momentCalibration, momentCalibration, y-50, y+50, true));
  }
  vertex(x+valueL, y-scaledMaxMomentY1);
  vertex(x+valueL, y);
  vertex(x, y);
  vertex(x, y-scaledMaxMomentY1);
  endShape();

  fill(0);
  stroke(0);
  if (scaledMaxMomentY1 >= 0) {
    text("M1max = " + maxMomentY1 + "pxm", x, y-10-scaledMaxMomentY1);
  } else {
    text("M1max = " + maxMomentY1 + "pxm", x, y+10-scaledMaxMomentY1);
  }
  if (scaledMaxMomentY2 >= 0) {
    text("M2max = " + maxMomentY2 + "pxm", x+valueL/2, y-10-scaledMaxMomentY2);
  } else {
    text("M2max = " + maxMomentY2 + "pxm", x+valueL/2, y+10-scaledMaxMomentY2);
  }
  if (scaledMaxMomentY1 >= 0) {
    text("M3max = " + maxMomentY1 + "pxm", x+valueL, y-10-scaledMaxMomentY1);
  } else {
    text("M3max = " + maxMomentY1 + "pxm", x+valueL, y+10-scaledMaxMomentY1);
  }
}





/**
 * This function draws an arrow for a force.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} forcePosition The position of the arrow from the left side of the figure in pixels.
 * @param {number} forceMagnitude The magnitude of the force.
 * @param {number} colour The colour of the arrow.
 */
function drawArrow(x, y, forcePosition, forceMagnitude, colour = color(255), label = true) {
  fill(colour);
  stroke(colour);
  triangle(x+forcePosition, y, x+forcePosition-forceMagnitude/6, y-forceMagnitude/3, x+forcePosition+forceMagnitude/6, y-forceMagnitude/3);
  rect(x+forcePosition-forceMagnitude/18, y-forceMagnitude/3, x+forcePosition+forceMagnitude/18, y-forceMagnitude);

  if (label) {
    fill(0);
    stroke(0);
    textAlign(CENTER, CENTER);
    if (forceMagnitude == 0) {
      text("F = " + forceMagnitude + "px", x+forcePosition, y-10);
    } else {
      text("F = " + forceMagnitude + "px", x+forcePosition, y-forceMagnitude-Math.sign(forceMagnitude)*10);
    }
  }
}

/**
 * This function draws an arrow for a rectangular distributed force.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} forceMagnitude The magnitude of the force.
 * @param {number} colour The colour of the arrow.
 */
function drawUniArrow(x, y, lenX, forceMagnitude, colour = color(255), label = true) {
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

  if (label) {
    fill(0);
    stroke(0);
    textAlign(CENTER, CENTER);
    if (forceMagnitude == 0) {
      text("W = " + forceMagnitude + "px", x+lenX/2, y-10);
    } else {
      text("W = " + forceMagnitude + "px", x+lenX/2, y-forceMagnitude-Math.sign(forceMagnitude)*10);
    }
  }
}

/**
 * This function draws an arrow for a triangular distributed force.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} forceMagnitude The maximum magnitude of the force.
 * @param {number} colour The colour of the arrow.
 */
function drawTriArrow(x, y, lenX, forceMagnitude, colour = color(255), label = true) {
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

  if (label) {
    fill(0);
    stroke(0);
    textAlign(CENTER, CENTER);
    if (forceMagnitude == 0) {
      text("W = " + forceMagnitude + "px", x, y-10);
    } else {
      text("W = " + forceMagnitude + "px", x, y-forceMagnitude-Math.sign(forceMagnitude)*10);
    }
  }
}

/**
 * This function draws an arrow for a moment.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} momentPosition The position of the center of the arrow's arc from the left side of the figure in pixels.
 * @param {number} momentMagnitude The magnitude of the moment.
 * @param {number} colour The colour of the arrow.
 */
function drawMoment(x, y, momentPosition, momentMagnitude, colour = color(255), label = true) {
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

  if (label) {
    fill(0);
    stroke(0);
    textAlign(CENTER, CENTER);
    if (momentMagnitude == 0) {
      text("M = " + momentMagnitude + "pxm", x+momentPosition, y-10);
    } else {
      text("M = " + momentMagnitude + "pxm", x+momentPosition, y-momentMagnitude-Math.sign(momentMagnitude)*10);
    }
  }
}

/**
 * This function draws the L dimension.
 * @param {number} x The position of the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} position If equals 1, puts dimension below figure. If equals -1, puts dimension above figure.
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
function drawDimL(x, y, lenX, position = 1, spacing = 20, colour = color(120, 60, 120)) {
  fill(colour);
  stroke(colour);
  let textL = "L = " + lenX + "px";
  let middleL = x+lenX/2;

  line(x, y+position*spacing, x, y+position*spacing+position*10); // left vertical bar
  line(x+lenX, y+position*spacing, x+lenX, y+position*spacing+position*10); // right vertical bar

  if (lenX < 100) {
    line(x, y+position*spacing+position*5, x+lenX+10, y+position*spacing+position*5); // horizontal bar
    textAlign(LEFT, CENTER);
    text(textL, x+lenX+20, y+position*spacing+position*5);
  } else {
    line(x, y+position*spacing+position*5, middleL-40, y+position*spacing+position*5); // left horizontal bar
    line(middleL+40, y+position*spacing+position*5, x+lenX, y+position*spacing+position*5); // right horizontal bar
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
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
function drawDimAB(x, y, lenX, lenA, position = 1, spacing = 40, colour = color(120, 60, 120)) {
  fill(colour);
  stroke(colour);
  let lenB = lenX-lenA;
  let textA = "A = " + lenA + "px";
  let textB = "B = " + lenB + "px";;
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
    line(x, y+position*spacing+position*5, middleA-40, y+position*spacing+position*5); // left horizontal bar
    line(middleA+40, y+position*spacing+position*5, x+lenA, y+position*spacing+position*5); // right horizontal bar
    textAlign(CENTER, CENTER);
    text(textA, middleA, y+position*spacing+position*5);
  }

  if (lenB < 100) {
    line(x+lenA, y+position*spacing+position*5, x+lenX+10, y+position*spacing+position*5); // horizontal bar
    textAlign(LEFT, CENTER);
    text(textB, x+lenX+20, y+position*spacing+position*5);
  } else {
    line(x+lenA, y+position*spacing+position*5, middleB-40, y+position*spacing+position*5); // left horizontal bar
    line(middleB+40, y+position*spacing+position*5, x+lenX, y+position*spacing+position*5); // right horizontal bar
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
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
 function drawDimAA(x, y, lenX, lenA, position = 1, spacing = 40, colour = color(120, 60, 120)) {
  fill(colour);
  stroke(colour);
  let textA = "A = " + lenA + "px";
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
    line(x, y+position*spacing+position*5, x+middleA-40, y+position*spacing+position*5); // left horizontal bar
    line(x+middleA+40, y+position*spacing+position*5, x+lenA, y+position*spacing+position*5); // right horizontal bar
    textAlign(CENTER, CENTER);
    text(textA, x+middleA, y+position*spacing+position*5);

    // right side
    line(x+lenX-lenA, y+position*spacing+position*5, x+lenX-lenA+middleA-40, y+position*spacing+position*5); // left horizontal bar
    line(x+lenX-lenA+middleA+40, y+position*spacing+position*5, x+lenX, y+position*spacing+position*5); // right horizontal bar
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