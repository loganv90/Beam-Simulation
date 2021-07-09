let leftOffset = 100;

function setup() {
  let canvas = createCanvas(600, 800);
  canvas.parent("container");
  frameRate(60);

  rectMode(CORNERS);
}

function draw() {
  background(200);

  drawFreeBodyDiagram(leftOffset, height/5);
  drawDeflection(leftOffset, 2*height/5);
  drawShear(leftOffset, 3*height/5);
  drawMoment(leftOffset, 4*height/5);
}

/**
 * This function draws the free body diagram figure.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 */
function drawFreeBodyDiagram(x, y) {
  if (valueF >= 0) {
    dimensionPosition = 1;
  } else {
    dimensionPosition = -1;
  }

  if (beamType.value == "c-end-load") {
    drawArrow(x, y, valueL, valueF, color(200, 0, 0));
    drawDimL(x, y, valueL, dimensionPosition);
  }
  else if (beamType.value == "c-int-load") {
    drawArrow(x, y, valueA, valueF, color(200, 0, 0));
    drawDimL(x, y, valueL, dimensionPosition);
    drawDimAB(x, y, valueL, valueA, dimensionPosition);
  }
  else if (beamType.value == "s-int-load") {
    drawArrow(x, y, valueA, valueF, color(200, 0, 0));
    drawDimL(x, y, valueL, dimensionPosition);
    drawDimAB(x, y, valueL, valueA, dimensionPosition);
  }
  else if (beamType.value == "s-cen-load") {
    drawArrow(x, y, valueL/2, valueF, color(200, 0, 0));
    drawDimL(x, y, valueL, dimensionPosition);
  }

  fill(0);
  stroke(0);
  line(x, y, x + parseFloat(valueL), y);
}

/**
 * This function draws the deflection figure.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 */
function drawDeflection(x, y) {
  fill(0, 0, 200);
  stroke(0, 0, 100);
  textAlign(CENTER, CENTER);

  if (beamType.value == "c-end-load") {
    let calibration = (50*400*400*400)/(3*100*100);
    let canvY;

    noFill();
    beginShape();
    for (let canvX = x; canvX <= x+valueL; canvX++) {
      funcX = canvX - x;
      funcY = (3*valueL-funcX)*(valueF*funcX*funcX)/(6*valueE*valueI);
      canvY = map(funcY, -calibration, calibration, y-50, y+50, true);
      vertex(canvX, canvY);
    }
    endShape();

    fill(0);
    stroke(0);
    if (canvY >= y) {
      text("\u03B4max = " + canvY + "px/m^2", x+valueL, canvY+10);
    } else {
      text("\u03B4max = " + canvY + "px/m^2", x+valueL, canvY-10);
    }
  }
  else if (beamType.value == "c-int-load") {
    let calibration = (50*400*400*400)/(3*100*100);
    let canvY;

    noFill();
    beginShape();
    for (let canvX = x; canvX <= x+valueL; canvX++) {
      funcX = canvX - x;
      if (funcX <= valueA) {
        funcY = (3*valueA-funcX)*(valueF*funcX*funcX)/(6*valueE*valueI);
      } else {
        funcY = (3*funcX-valueA)*(valueF*valueA*valueA)/(6*valueE*valueI);
      }
      canvY = map(funcY, -calibration, calibration, y-50, y+50, true);
      vertex(canvX, canvY);
    }
    endShape();

    fill(0);
    stroke(0);
    if (canvY >= y) {
      text("\u03B4max = " + canvY + "px/m^2", x+valueL, canvY+10);
    } else {
      text("\u03B4max = " + canvY + "px/m^2", x+valueL, canvY-10);
    }
  }
  else if (beamType.value == "s-int-load") {
    let calibration = 6666.666;
    let valueB = valueL-valueA;
    let maxDeflectionX;
    let maxDeflectionY;
    if (valueA >= valueL/2) {
      maxDeflectionX = Math.sqrt((valueL*valueL-valueB*valueB)/3);
      maxDeflectionY = (valueF*valueB*Math.pow(valueL*valueL-valueB*valueB, 3/2))/(9*Math.sqrt(3)*valueL*valueE*valueI);
    } else {
      maxDeflectionX = valueL-Math.sqrt((valueL*valueL-valueA*valueA)/3);
      maxDeflectionY = (valueF*valueA*Math.pow(valueL*valueL-valueA*valueA, 3/2))/(9*Math.sqrt(3)*valueL*valueE*valueI);
    }

    noFill();
    beginShape();
    for (let canvX = x; canvX <= x+valueL; canvX++) {
      funcX = canvX - x;
      if (funcX <= valueA) {
        funcY = (valueL*valueL-valueB*valueB-funcX*funcX)*(valueF*valueB*funcX)/(6*valueL*valueE*valueI);
      } else {
        funcY = (valueL*valueL-valueA*valueA-(valueL-funcX)*(valueL-funcX))*(valueF*valueA*(valueL-funcX))/(6*valueL*valueE*valueI);
      }
      let canvY = map(funcY, -calibration, calibration, y-50, y+50, true);
      vertex(canvX, canvY);
    }
    endShape();

    fill(0);
    stroke(0);
    if (maxDeflectionY >= 0) {
      text("\u03B4max = " + maxDeflectionY + "px/m^2", x+maxDeflectionX, y+10+maxDeflectionY/133.33);
    } else {
      text("\u03B4max = " + maxDeflectionY + "px/m^2", x+maxDeflectionX, y-10+maxDeflectionY/133.33);
    }
  }
  else if (beamType.value == "s-cen-load") {
    let calibration = 6666.666;
    let maxDeflectionX = valueL/2;
    let maxDeflectionY = (valueF*valueL*valueL*valueL)/(48*valueE*valueI);

    noFill();
    beginShape();
    for (let canvX = x; canvX <= x+valueL; canvX++) {
      funcX = canvX - x;
      if (funcX <= valueL/2) {
        funcY = (3*valueL*valueL-4*funcX*funcX)*(valueF*funcX)/(48*valueE*valueI);
      } else {
        funcY = (3*valueL*valueL-4*(valueL-funcX)*(valueL-funcX))*(valueF*(valueL-funcX))/(48*valueE*valueI);
      }
      let canvY = map(funcY, -calibration, calibration, y-50, y+50, true);
      vertex(canvX, canvY);
    }
    endShape();

    fill(0);
    stroke(0);
    if (maxDeflectionY >= 0) {
      text("\u03B4max = " + maxDeflectionY + "px/m^2", x+maxDeflectionX, y+10+maxDeflectionY/133.33);
    } else {
      text("\u03B4max = " + maxDeflectionY + "px/m^2", x+maxDeflectionX, y-10+maxDeflectionY/133.33);
    }
  }

  fill(0);
  stroke(0);
  line(x, y, x + parseFloat(valueL), y);
}

/**
 * This function draws the shear figure.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 */
function drawShear(x, y) {
  fill(0, 200, 0);
  stroke(0, 100, 0);
  textAlign(CENTER, CENTER);

  if (beamType.value == "c-end-load") {
    let maxShear = valueF;
    rect(x, y, x+valueL, y-maxShear);

    fill(0);
    stroke(0);
    if (maxShear >= 0) {
      text("Vmax = " + maxShear + "px/m^2", x, y-maxShear-10);
    } else {
      text("Vmax = " + maxShear + "px/m^2", x, y-maxShear+10);
    }
  }
  else if (beamType.value == "c-int-load") {
    let maxShear = valueF;
    rect(x, y, x+valueA, y-maxShear);

    fill(0);
    stroke(0);
    if (maxShear >= 0) {
      text("Vmax = " + maxShear + "px/m^2", x, y-maxShear-10);
    } else {
      text("Vmax = " + maxShear + "px/m^2", x, y-maxShear+10);
    }
  }
  else if (beamType.value == "s-int-load") {
    let maxShearA = 0;
    let maxShearB = 0;
    if (valueA > 0 && valueA < valueL) {
      maxShearA = valueF*(valueL-valueA)/valueL;
      maxShearB = -valueF*valueA/valueL;
      rect(x, y, x+valueA, y-maxShearA);
      rect(x+valueA, y, x+valueL, y-maxShearB);
    }

    fill(0);
    stroke(0);
    if (maxShearA >= 0) {
      text("V1max = " + maxShearA + "px/m^2", x, y-maxShearA-10);
    } else {
      text("V1max = " + maxShearA + "px/m^2", x, y-maxShearA+10);
    }
    if (maxShearB > 0) {
      text("V2max = " + maxShearB + "px/m^2", x+valueL, y-maxShearB-10);
    } else {
      text("V2max = " + maxShearB + "px/m^2", x+valueL, y-maxShearB+10);
    }
  }
  else if (beamType.value == "s-cen-load") {
    let maxShearA = 0;
    let maxShearB = 0;
    maxShearA = valueF/2;
    maxShearB = -valueF/2;
    rect(x, y, x+valueL/2, y-maxShearA);
    rect(x+valueL/2, y, x+valueL, y-maxShearB);

    fill(0);
    stroke(0);
    if (maxShearA >= 0) {
      text("V1max = " + maxShearA + "px/m^2", x, y-maxShearA-10);
    } else {
      text("V1max = " + maxShearA + "px/m^2", x, y-maxShearA+10);
    }
    if (maxShearB > 0) {
      text("V2max = " + maxShearB + "px/m^2", x+valueL, y-maxShearB-10);
    } else {
      text("V2max = " + maxShearB + "px/m^2", x+valueL, y-maxShearB+10);
    }
  }

  fill(0);
  stroke(0);
  line(x, y, x + parseFloat(valueL), y);
}

/**
 * This function draws the moment figure.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 */
function drawMoment(x, y) {
  fill(200, 0, 0);
  stroke(100, 0, 0);
  textAlign(CENTER, CENTER);

  if (beamType.value == "c-end-load") {
    maxMoment = -valueF*valueL/400;
    triangle(x, y, x+valueL, y, x, y-maxMoment);

    fill(0);
    stroke(0);
    if (maxMoment > 0) {
      text("Mmax = " + maxMoment + "pxm", x, y-maxMoment-10);
    } else {
      text("Mmax = " + maxMoment + "pxm", x, y-maxMoment+10);
    }
  }
  else if (beamType.value == "c-int-load") {
    maxMoment = -valueF*valueA/400;
    triangle(x, y, x+valueA, y, x, y-maxMoment);

    fill(0);
    stroke(0);
    if (maxMoment > 0) {
      text("Mmax = " + maxMoment + "pxm", x, y-maxMoment-10);
    } else {
      text("Mmax = " + maxMoment + "pxm", x, y-maxMoment+10);
    }
  }
  else if (beamType.value == "s-int-load") {
    maxMoment = valueF*valueA*(valueL-valueA)/valueL/100;
    triangle(x, y, x+valueA, y, x+valueA, y-maxMoment);
    triangle(x+valueL, y, x+valueA, y, x+valueA, y-maxMoment);

    fill(0);
    stroke(0);
    if (maxMoment >= 0) {
      text("Mmax = " + maxMoment + "pxm", x+valueA, y-maxMoment-10);
    } else {
      text("Mmax = " + maxMoment + "pxm", x+valueA, y-maxMoment+10);
    }
  }
  else if (beamType.value == "s-cen-load") {
    maxMoment = valueF*valueL/400;
    triangle(x, y, x+valueL/2, y, x+valueL/2, y-maxMoment);
    triangle(x+valueL, y, x+valueL/2, y, x+valueL/2, y-maxMoment);

    fill(0);
    stroke(0);
    if (maxMoment >= 0) {
      text("Mmax = " + maxMoment + "pxm", x+valueL/2, y-maxMoment-10);
    } else {
      text("Mmax = " + maxMoment + "pxm", x+valueL/2, y-maxMoment+10);
    }
  }

  fill(0);
  stroke(0);
  line(x, y, x + parseFloat(valueL), y);
}

/**
 * This function draws an arrow for a force.
 * @param {number} x The position of the leftmost portion the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} forcePosition The position of the arrow from the left side of the figure in pixels.
 * @param {number} forceMagnitude The magnitude of the force.
 * @param {number} colour The colour of the arrow.
 */
function drawArrow(x, y, forcePosition, forceMagnitude, colour = color(255)) {
  fill(colour);
  stroke(colour);
  triangle(x+forcePosition, y, x+forcePosition-forceMagnitude/6, y-forceMagnitude/3, x+forcePosition+forceMagnitude/6, y-forceMagnitude/3);
  rect(x+forcePosition-forceMagnitude/18, y-forceMagnitude/3, x+forcePosition+forceMagnitude/18, y-forceMagnitude);

  fill(0);
  stroke(0);
  textAlign(CENTER, CENTER);
  if (forceMagnitude == 0) {
    text("F = " + forceMagnitude + "px", x+forcePosition, y-10);
  } else {
    text("F = " + forceMagnitude + "px", x+forcePosition, y-forceMagnitude-Math.sign(forceMagnitude)*10);
  }
}

/**
 * This function draws the L dimension.
 * @param {number} x The position of the figure from the left side of the canvas in pixels.
 * @param {number} y The position of the figure from the top of the canvas in pixels.
 * @param {number} lenX The horizontal length of the figure in pixels.
 * @param {number} position If equals 1, puts dimension below figure. If equals -1, puts dimension abown figure.
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
function drawDimL(x, y, lenX, position = 1, spacing = 10, colour = color(120, 60, 120)) {
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
 * @param {number} position If equals 1, puts dimension below figure. If equals -1, puts dimension abown figure.
 * @param {number} spacing The spacing between the figure and the dimension in pixels.
 */
function drawDimAB(x, y, lenX, lenA, position = 1, spacing = 30, colour = color(120, 60, 120)) {
  fill(colour);
  stroke(colour);
  let lenB = lenX-lenA;
  let textA = "A = " + lenA + "px";
  let textB = "B = " + lenB + "px";;
  let middleA = x+lenA/2;
  let middleB = x+lenA+lenB/2;

  line(x, y+position*spacing, x, y+position*spacing+position*10); // left vertical bar
  line(x+lenX, y+position*spacing, x+lenX, y+position*spacing+position*10); // middle vertical bar
  line(x+lenA, y+position*spacing, x+lenA, y+position*spacing+position*10); // right vertical bar

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
