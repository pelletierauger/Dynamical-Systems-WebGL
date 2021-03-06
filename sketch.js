let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let gl, shaderProgram;
const seed = Date.now();
const openSimplex = openSimplexNoise(seed);
const framesPerLoop = 300;
const noiseIncrement = Math.PI * 2 / framesPerLoop;
let noiseTime = 0;
let noiseWheel = { x: 0, y: 0 };
let noiseScalar = 1;

let pos = { x: 0, y: 0, z: 0 };
let vertices = [];
let drawCount = 0;
let exportedFrame = 1;

function setup() {
    socket = io.connect('http://localhost:8080');
    cnvs = createCanvas(windowWidth, windowHeight, WEBGL);

    gl = canvas.getContext('webgl');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);
    setShaders();

    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    frameRate(30);
    if (!looping) {
        noLoop();
    }
    game.initialize();
}

function draw() {
    // game.initialize(10 + frameCount * 0.001);
    // game.update();
    // if (frameCount % 30 == 0) {
    // background(0);
    translate(width / 2, height / 2);



    noiseWheel.x = Math.cos(noiseTime) * 1;
    noiseWheel.y = Math.sin(noiseTime) * 1;
    noiseTime += noiseIncrement;
    if (noiseTime >= Math.PI * 2 - noiseIncrement) {
        // console.log("yurp!", p.frameCount);
        // noiseTime = 0;
    }
    // r


    // c.a = 1.1 + noiseWheel.x * 1;
    // c.b = 1.1 + noiseWheel.y * 1;
    // c.c = -20;
    // c.f = -20;
    c.a = 1.1;
    c.b = 10;
    // c.a = 0.9 + Math.sin(frameCount * 0.1) * 0.1;
    // c.b = 0.1 + Math.cos(frameCount * 0.1) * 0.1;
    c.a = 0.9913634045759203;
    c.b = 0.10591846907073832;
    c.d = -1;

    // c.d = -2;

    // les terminaisons différentes
    c.a *= 0.1;
    c.b *= 0.75;
    c.f = 3550;
    // c.f = 15550;
    // c.c = 24;

    // }
    vertices = [];
    for (let i = 0; i < 100000; i++) {
        pos = goya(pos.x, pos.y, pos.z, c);
        vertices.push(2 + pos.x * 1, 0 + pos.y * 0.25, 0.0);
        // vertices.push(0.25 + pos.y * 0.25, 0.125 + pos.x * 1, 0.0);
        // vertices.push(3.75 + pos.x * 2, -0.65 + pos.y * 0.5, 0.0);
    }
    drawVertices();

    drawCount++;
    // if (exporting && frameCount < maxFrames) {
    if (exporting && drawCount == 128) {
        // if (drawCount == 128) {
        frameExport();
        drawCount = 0;
        exportedFrame++;
        background(0);
        // c.c += 0.1;
        c.e += 0.0001;
    }
}

function keyPressed() {
    if (keyCode === 32) {
        if (looping) {
            noLoop();
            looping = false;
        } else {
            loop();
            looping = true;
        }
    }
    if (key == 'p' || key == 'P') {
        frameExport();
    }
    if (key == 'r' || key == 'R') {
        window.location.reload();
    }
    if (key == 'm' || key == 'M') {
        redraw();
    }
}


let c = { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1 };
c.f = 3550;
let goya = function(x, y, z, c) {
    return {
        x: Math.sin(c.a * x) + Math.sin(c.b * y) + Math.tan(c.c * z),
        y: Math.sin(c.d * y) + Math.tan(c.e * x) + Math.tan(c.f * z),
        z: z + 0.1
    };
};
// c.f = 2;
// goya = function(x, y, z, c) {
//     return {
//         x: Math.tan(c.a * x * 0.01) + Math.sin(c.b * y) + Math.sin(c.c * z),
//         y: Math.sin(c.d * y) + Math.sin(c.e * x) + Math.tan(c.f * z),
//         z: z + 0.1
//     };
// };

// goya = function(x, y, z, c) {
//     return {
//         x: Math.sin(c.a * x) + Math.sin(c.c * z),
//         y: Math.sin(c.b * y) + Math.cos(c.f * z),
//         z: z + 0.1
//     };
// };