const s = ( beamEditor ) => {
    beamEditor.setup = () => {
        beamEditor.createCanvas(190, 340);
        beamEditor.frameRate(60);
        beamEditor.rectMode(CORNERS);
        beamEditor.textFont('TimesNewRoman');
    };

    beamEditor.draw = () => {
        beamEditor.background(200);
        editorDrawCoordinateSystem(25, 165);

        if (shapeType.value == "full-rect") {
            drawFullRect();
        }
        else if (shapeType.value == "holl-rect") {
            drawHollRect();
        }
        else if (shapeType.value == "full-circ") {
            drawFullCirc();
        }
        else if (shapeType.value == "holl-circ") {
            drawHollCirc();
        }
        else if (shapeType.value == "i-section") {
            drawISection();
        }
    };
}

let editor = new p5(s, 'p5-beam-container');





/**
 * This function draws the rectangle section.
 */
function drawFullRect() {
    let displayWidth = map(editorValueB, 0, 10000, 0, 100);
    let displayHeight = map(editorValueA, 0, 10000, 0, 100);
    let centerX = 95;
    let centerY = 95;

    // drawing shape
    editor.stroke(0);
    editor.fill(255);
    if (displayWidth > 0 && displayHeight > 0) {
        editor.rect(centerX-displayWidth/2, centerY-displayHeight/2, centerX+displayWidth/2, centerY+displayHeight/2);
    }

    // drawing dimenisons
    editorDrawHorizontalDimension(centerX+displayWidth/2, centerY-displayHeight/2, displayWidth, "b", -10);
    editorDrawVerticalDimension(centerX+displayWidth/2, centerY-displayHeight/2, displayHeight, "a", 10);

    // finding moment of inertia
    beamEditorI = editorValueB*editorValueA*editorValueA*editorValueA/12;
    beamEditorI = Math.round(beamEditorI*1000)/1000;
    
    // drawing equation and answer
    let xPositionEquation = 10;
    let xPositionAnswer = 10;
    let yPositionEquation = 250;
    let yPositionAnswer = 300;
    editor.textAlign(LEFT, CENTER);
    xPositionEquation = editorTextLine("I", xPositionEquation, yPositionEquation, 15, ITALIC);
    xPositionEquation = editorTextLine("zz", xPositionEquation, yPositionEquation+3, 11, ITALIC);
    xPositionEquation = editorTextLine("   =   ", xPositionEquation, yPositionEquation, 12, ITALIC);
    editor.line(xPositionEquation, yPositionEquation, xPositionEquation+13, yPositionEquation);
    editorTextLine("12", xPositionEquation, yPositionEquation+10, 12, NORMAL);
    xPositionEquation = editorTextLine("ba", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    editorTextLine("3", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    editorDrawAnswer(xPositionAnswer, yPositionAnswer);
}





/**
 * This function draws the hollow rectangle section.
 */
function drawHollRect() {
    let displayWidth = map(editorValueB, 0, 10000, 0, 100);
    let displayHeight = map(editorValueA, 0, 10000, 0, 100);
    let innerWidth = map(editorValueD, 0, 10000, 0, 100);
    let innerHeight = map(editorValueC, 0, 10000, 0, 100);
    let centerX = 95;
    let centerY = 95;

    // drawing shape
    editor.stroke(0);
    editor.fill(255);
    if (displayWidth <= 0 || displayHeight <= 0 || (innerWidth >= displayWidth && innerHeight >= displayHeight)) {
        // draw nothing
    } else if (innerWidth <= 0 || innerHeight <= 0) {
        // draw regular rectangle
        editor.rect(centerX-displayWidth/2, centerY-displayHeight/2, centerX+displayWidth/2, centerY+displayHeight/2);
    } else if (innerHeight >= displayHeight) {
        // draw left and right sections
        editor.rect(centerX-displayWidth/2, centerY-displayHeight/2, centerX-innerWidth/2, centerY+displayHeight/2);
        editor.rect(centerX+displayWidth/2, centerY-displayHeight/2, centerX+innerWidth/2, centerY+displayHeight/2);
    } else if (innerWidth >= displayWidth) {
        // draw top and bottom sections
        editor.rect(centerX-displayWidth/2, centerY-displayHeight/2, centerX+displayWidth/2, centerY-innerHeight/2);
        editor.rect(centerX-displayWidth/2, centerY+displayHeight/2, centerX+displayWidth/2, centerY+innerHeight/2);
    } else {
        // draw the shape normally
        editor.rect(centerX-displayWidth/2, centerY-displayHeight/2, centerX+displayWidth/2, centerY+displayHeight/2);
        if (innerWidth > 0 && innerHeight > 0) {
            editor.fill(200);
            editor.rect(centerX-innerWidth/2, centerY-innerHeight/2, centerX+innerWidth/2, centerY+innerHeight/2);
        }
    }

    // drawing dimenisons
    editorDrawHorizontalDimension(centerX+displayWidth/2, centerY-displayHeight/2, displayWidth, "b", -10);
    editorDrawVerticalDimension(centerX+displayWidth/2, centerY-displayHeight/2, displayHeight, "a", 10);
    editorDrawHorizontalDimension(centerX+innerWidth/2, centerY+displayHeight/2, innerWidth, "d", 10);
    editorDrawVerticalDimension(centerX-displayWidth/2, centerY-innerHeight/2, innerHeight, "c", -10);

    // finding moment of inertia
    beamEditorI = editorValueB*editorValueA*editorValueA*editorValueA/12 - editorValueD*editorValueC*editorValueC*editorValueC/12;
    beamEditorI = Math.round(beamEditorI*1000)/1000;
    
    // drawing equation and answer
    let xPositionEquation = 10;
    let xPositionAnswer = 10;
    let yPositionEquation = 250;
    let yPositionAnswer = 300;
    editor.textAlign(LEFT, CENTER);
    xPositionEquation = editorTextLine("I", xPositionEquation, yPositionEquation, 15, ITALIC);
    xPositionEquation = editorTextLine("zz", xPositionEquation, yPositionEquation+3, 11, ITALIC);
    xPositionEquation = editorTextLine("   =   ", xPositionEquation, yPositionEquation, 12, ITALIC);
    editor.line(xPositionEquation, yPositionEquation, xPositionEquation+13, yPositionEquation);
    editorTextLine("12", xPositionEquation, yPositionEquation+10, 12, NORMAL);
    xPositionEquation = editorTextLine("ba", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    editorTextLine("3", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    xPositionEquation = editorTextLine("   -   ", xPositionEquation, yPositionEquation, 12, ITALIC);
    editor.line(xPositionEquation, yPositionEquation, xPositionEquation+13, yPositionEquation);
    editorTextLine("12", xPositionEquation, yPositionEquation+10, 12, NORMAL);
    xPositionEquation = editorTextLine("dc", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    editorTextLine("3", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    editorDrawAnswer(xPositionAnswer, yPositionAnswer);
}





/**
 * This function draws the circle section.
 */
function drawFullCirc() {
    let displayHeight = map(editorValueA, 0, 10000, 0, 100);
    let centerX = 95;
    let centerY = 95;

    // drawing shape
    editor.stroke(0);
    editor.fill(255);
    if (displayHeight > 0) {
        editor.circle(centerX, centerY, displayHeight);
    }

    // drawing dimenisons
    editorDrawVerticalDimension(centerX+displayHeight/2, centerY-displayHeight/2, displayHeight, "a", 10);
    
    // finding moment of inertia
    beamEditorI = PI*editorValueA*editorValueA*editorValueA*editorValueA/64;
    beamEditorI = Math.round(beamEditorI*1000)/1000;

    // drawing equation and answer
    let xPositionEquation = 10;
    let xPositionAnswer = 10;
    let yPositionEquation = 250;
    let yPositionAnswer = 300;
    editor.textAlign(LEFT, CENTER);
    xPositionEquation = editorTextLine("I", xPositionEquation, yPositionEquation, 15, ITALIC);
    xPositionEquation = editorTextLine("zz", xPositionEquation, yPositionEquation+3, 11, ITALIC);
    xPositionEquation = editorTextLine("   =   ", xPositionEquation, yPositionEquation, 12, ITALIC);
    editor.line(xPositionEquation, yPositionEquation, xPositionEquation+13, yPositionEquation);
    editorTextLine("64", xPositionEquation, yPositionEquation+10, 12, NORMAL);
    xPositionEquation = editorTextLine("πa", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    editorTextLine("3", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    editorDrawAnswer(xPositionAnswer, yPositionAnswer);
}





/**
 * This function draws the hollow circle section.
 */
function drawHollCirc() {
    let displayHeight = map(editorValueA, 0, 10000, 0, 100);
    let innerHeight = map(editorValueC, 0, 10000, 0, 100);
    let centerX = 95;
    let centerY = 95;

    // drawing shape
    editor.stroke(0);
    editor.fill(255);
    if (displayHeight <= 0 || innerHeight >= displayHeight) {
        // draw nothing
    } else if (innerHeight <= 0) {
        // draw regular circle
        editor.circle(centerX, centerY, displayHeight);
    } else {
        // draw the shape normally 
        editor.circle(centerX, centerY, displayHeight);
        editor.fill(200);
        editor.circle(centerX, centerY, innerHeight);
    }

    // drawing dimenisons
    editorDrawVerticalDimension(centerX+displayHeight/2, centerY-displayHeight/2, displayHeight, "a", 10);
    editorDrawVerticalDimension(centerX-displayHeight/2, centerY-innerHeight/2, innerHeight, "c", -10);
    
    // finding moment of inertia
    beamEditorI = PI*(editorValueA*editorValueA*editorValueA*editorValueA - editorValueC*editorValueC*editorValueC*editorValueC)/64;
    beamEditorI = Math.round(beamEditorI*1000)/1000;
    
    // drawing equation and answer
    let xPositionEquation = 10;
    let xPositionAnswer = 10;
    let yPositionEquation = 250;
    let yPositionAnswer = 300;
    editor.textAlign(LEFT, CENTER);
    xPositionEquation = editorTextLine("I", xPositionEquation, yPositionEquation, 15, ITALIC);
    xPositionEquation = editorTextLine("zz", xPositionEquation, yPositionEquation+3, 11, ITALIC);
    xPositionEquation = editorTextLine("   =   ", xPositionEquation, yPositionEquation, 12, ITALIC);
    editor.line(xPositionEquation, yPositionEquation, xPositionEquation+46, yPositionEquation);
    editorTextLine("64", xPositionEquation+16, yPositionEquation+10, 12, NORMAL);
    xPositionEquation = editorTextLine("π", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    xPositionEquation = editorTextLine(" (", xPositionEquation, yPositionEquation-8, 12, NORMAL);
    xPositionEquation = editorTextLine("a", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    xPositionEquation = editorTextLine("4", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    xPositionEquation = editorTextLine(" - c", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    xPositionEquation = editorTextLine("4", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    editorTextLine(")", xPositionEquation, yPositionEquation-8, 12, NORMAL);
    editorDrawAnswer(xPositionAnswer, yPositionAnswer);
}





/**
 * This function draws the I-Beam section.
 */
function drawISection() {
    let displayWidth = map(editorValueB, 0, 10000, 0, 100);
    let displayHeight = map(editorValueA, 0, 10000, 0, 100);
    let innerWidth = map(editorValueD/2, 0, 5000, 0, 50);
    let innerHeight = map(editorValueC, 0, 10000, 0, 100);
    let centerX = 95;
    let centerY = 95;

    // drawing shape
    editor.stroke(0);
    editor.fill(255);
    if (displayWidth <= 0 || displayHeight <= 0 || (editorValueC >= editorValueA && editorValueD >= editorValueB)) {
        // draw nothing
    } else if (innerWidth <= 0 || innerHeight <= 0) {
        // draw regular rectangle
        editor.rect(centerX-displayWidth/2, centerY-displayHeight/2, centerX+displayWidth/2, centerY+displayHeight/2);
    } else if (editorValueC >= editorValueA) {
        // draw middle seciton
        editor.rect(centerX-displayWidth/2+innerWidth, centerY-innerHeight/2, centerX+displayWidth/2-innerWidth, centerY+innerHeight/2);
    } else if (editorValueD >= editorValueB) {
        // draw top and bottom sections
        editor.rect(centerX-displayWidth/2, centerY-displayHeight/2, centerX+displayWidth/2, centerY-innerHeight/2);
        editor.rect(centerX-displayWidth/2, centerY+displayHeight/2, centerX+displayWidth/2, centerY+innerHeight/2);
    } else {
        // vertices are counterclockwise from the top left corner
        editor.beginShape();
        editor.vertex(centerX-displayWidth/2, centerY-displayHeight/2); // left side
        editor.vertex(centerX-displayWidth/2, centerY-innerHeight/2);
        editor.vertex(centerX-displayWidth/2+innerWidth, centerY-innerHeight/2);
        editor.vertex(centerX-displayWidth/2+innerWidth, centerY+innerHeight/2);
        editor.vertex(centerX-displayWidth/2, centerY+innerHeight/2);
        editor.vertex(centerX-displayWidth/2, centerY+displayHeight/2);
        editor.vertex(centerX+displayWidth/2, centerY+displayHeight/2); // right side
        editor.vertex(centerX+displayWidth/2, centerY+innerHeight/2);
        editor.vertex(centerX+displayWidth/2-innerWidth, centerY+innerHeight/2);
        editor.vertex(centerX+displayWidth/2-innerWidth, centerY-innerHeight/2);
        editor.vertex(centerX+displayWidth/2, centerY-innerHeight/2);
        editor.vertex(centerX+displayWidth/2, centerY-displayHeight/2);
        editor.endShape(CLOSE);
    }

    // drawing dimenisons
    editorDrawHorizontalDimension(centerX+displayWidth/2, centerY-displayHeight/2, displayWidth, "b", -10);
    editorDrawVerticalDimension(centerX+displayWidth/2, centerY-displayHeight/2, displayHeight, "a", 10);
    editorDrawHorizontalDimension(centerX+displayWidth/2, centerY+displayHeight/2, innerWidth, "d", 10);
    editor.line(centerX+displayWidth/2-innerWidth/2-5, centerY+displayHeight/2+34, centerX+displayWidth/2-innerWidth/2+5, centerY+displayHeight/2+34);
    editor.textStyle(NORMAL);
    editor.text("2", centerX+displayWidth/2-innerWidth/2, centerY+displayHeight/2+38);
    editorDrawVerticalDimension(centerX-displayWidth/2, centerY-innerHeight/2, innerHeight, "c", -10);

    // finding moment of inertia
    beamEditorI = editorValueB*editorValueA*editorValueA*editorValueA/12 - editorValueD*editorValueC*editorValueC*editorValueC/12;
    beamEditorI = Math.round(beamEditorI*1000)/1000;
    
    // drawing equation and answer
    let xPositionEquation = 10;
    let xPositionAnswer = 10;
    let yPositionEquation = 250;
    let yPositionAnswer = 300;
    editor.textAlign(LEFT, CENTER);
    xPositionEquation = editorTextLine("I", xPositionEquation, yPositionEquation, 15, ITALIC);
    xPositionEquation = editorTextLine("zz", xPositionEquation, yPositionEquation+3, 11, ITALIC);
    xPositionEquation = editorTextLine("   =   ", xPositionEquation, yPositionEquation, 12, ITALIC);
    editor.line(xPositionEquation, yPositionEquation, xPositionEquation+13, yPositionEquation);
    editorTextLine("12", xPositionEquation, yPositionEquation+10, 12, NORMAL);
    xPositionEquation = editorTextLine("ba", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    editorTextLine("3", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    xPositionEquation = editorTextLine("   -   ", xPositionEquation, yPositionEquation, 12, ITALIC);
    editor.line(xPositionEquation, yPositionEquation, xPositionEquation+13, yPositionEquation);
    editorTextLine("12", xPositionEquation, yPositionEquation+10, 12, NORMAL);
    xPositionEquation = editorTextLine("dc", xPositionEquation, yPositionEquation-8, 12, ITALIC);
    editorTextLine("3", xPositionEquation, yPositionEquation-12, 9, NORMAL);
    editorDrawAnswer(xPositionAnswer, yPositionAnswer);
}





/**
 * This function draws a coordinate system.
 * @param {number} x The position of the coordinate system from the left side of the canvas in pixels.
 * @param {number} y The position of the coordinate system from the top of the canvas in pixels.
 * @param {number} lineSize The length of the coordinate system lines.
 * @param {number} arrowSize The size of the coordinate system arrow heads.
 * @param {Color} colour The colour of the coordinate system.
 */
function editorDrawCoordinateSystem(x, y, lineSize = 30, arrowSize = 3, colour = color(0, 0, 200)) {
    editor.fill(colour);
    editor.stroke(colour);
  
    editor.textSize(14);
    editor.textStyle(ITALIC);
    editor.textAlign(CENTER, CENTER);
  
    editor.line(x, y, x, y-lineSize);
    editor.line(x, y, x+lineSize, y);
    editor.triangle(x, y-lineSize-arrowSize, x+arrowSize, y-lineSize+arrowSize, x-arrowSize, y-lineSize+arrowSize);
    editor.triangle(x+lineSize+arrowSize, y, x+lineSize-arrowSize, y-arrowSize, x+lineSize-arrowSize, y+arrowSize);
    editor.text("y", x-10, y-lineSize);
    editor.text("z", x+lineSize, y+10);
}

/**
 * This function draws a vertical dimension.
 * @param {number} x The position of the dimension from the left side of the canvas in pixels.
 * @param {number} y The position of the dimension from the top of the canvas in pixels.
 * @param {number} dHeight The length of dimension.
 * @param {number} xSpacing The offset of the dimension.
 * @param {Color} colour The colour of the dimension.
 */
function editorDrawVerticalDimension(x, y, dHeight, name, xSpacing, colour = color(120, 60, 120)) {
    editor.fill(colour);
    editor.stroke(colour);

    editor.line(x+xSpacing-3, y, x+xSpacing+3, y);
    editor.line(x+xSpacing-3, y+dHeight, x+xSpacing+3, y+dHeight);
    editor.line(x+xSpacing, y, x+xSpacing, y+dHeight);

    editor.textSize(12);
    editor.textStyle(ITALIC);

    if (xSpacing >= 0) {
        editor.textAlign(LEFT, CENTER);
        editor.text(name, x+xSpacing*2, y+dHeight/2);
    }
    else {
        editor.textAlign(RIGHT, CENTER);
        editor.text(name, x+xSpacing*2, y+dHeight/2);
    }
}

/**
 * This function draws a horizontal dimension.
 * @param {number} x The position of the dimension from the left side of the canvas in pixels.
 * @param {number} y The position of the dimension from the top of the canvas in pixels.
 * @param {number} dWidth The length of dimension.
 * @param {number} ySpacing The offset of the dimension.
 * @param {Color} colour The colour of the dimension.
 */
function editorDrawHorizontalDimension(x, y, dWidth, name, ySpacing, colour = color(120, 60, 120)) {
    editor.fill(colour);
    editor.stroke(colour);

    editor.line(x, y+ySpacing+3, x, y+ySpacing-3);
    editor.line(x-dWidth, y+ySpacing+3, x-dWidth, y+ySpacing-3);
    editor.line(x, y+ySpacing, x-dWidth, y+ySpacing);

    editor.textSize(12);
    editor.textStyle(ITALIC);

    if (ySpacing >= 0) {
        editor.textAlign(CENTER, TOP);
        editor.text(name, x-dWidth/2, y+ySpacing*2);
    }
    else {
        editor.textAlign(CENTER, BOTTOM);
        editor.text(name, x-dWidth/2, y+ySpacing*2);
    }
}

/**
 * This function draws text.
 * @param {number} text The text to draw.
 * @param {number} xPosition The position of the text from the left side of the canvas in pixels.
 * @param {number} yPosition The position of the text from the top of the canvas in pixels.
 * @param {number} size The size of the text.
 * @param {string} stlye The style of the text.
 * @returns {number} The position at the end of the drawn text.
 */
function editorTextLine(text, xPosition, yPosition, size, style) {
    editor.textStyle(style);
    editor.textSize(size);
    editor.text(text, xPosition, yPosition);
    return xPosition += editor.textWidth(text);
}

/**
 * This function the text for the moment of inertia answer.
 * @param {number} xPosition The position of the text from the left side of the canvas in pixels.
 * @param {number} yPosition The position of the text from the top of the canvas in pixels.
 */
function editorDrawAnswer(xPosition, yPosition) {
    xPosition = editorTextLine("I", xPosition, yPosition, 15, ITALIC);
    xPosition = editorTextLine("zz", xPosition, yPosition+3, 11, ITALIC);
    xPosition = editorTextLine("   =   ", xPosition, yPosition, 12, ITALIC);
    xPosition = editorTextLine(beamEditorI + " mm", xPosition, yPosition, 12, NORMAL);
    editorTextLine("4", xPosition, yPosition-4, 9, NORMAL);
}