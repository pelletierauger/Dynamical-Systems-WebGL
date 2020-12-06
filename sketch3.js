let looping = true;
let keysActive = true;
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
var vertex_buffer;
var coord;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
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
    frameRate(20);
    if (!looping) {
        noLoop();
    }
    game.initialize();
    vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);
}
// frameRate(20);

draw = function() {
    // game.initialize(10 + frameCount * 0.001);
    // game.update();
    // if (frameCount % 30 == 0) {
    // background(0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //     translate(width / 2, height / 2);
    //     noiseWheel.x = Math.cos(noiseTime) * 1;
    //     noiseWheel.y = Math.sin(noiseTime) * 1;
    //     noiseTime += noiseIncrement;
    // if (noiseTime >= Math.PI * 2 - noiseIncrement) {
    //     // console.log("yurp!", p.frameCount);
    //     // noiseTime = 0;
    // }
    // r
    // c.a = 1.1 + noiseWheel.x * 1;
    // c.b = 1.1 + noiseWheel.y * 1;
    // c.c = -20;
    // c.f = -20;
    // c.a = 2;
    // c.b = 1;
    c.c = 10 * sin(frameCount * 1e-11);
    // c.d = 1;
    // c.e = 4;
    // c.f = 2;
    // c.a = 0.9 + Math.sin(frameCount * 0.1) * 0.1;
    // c.b = 0.1 + Math.cos(frameCount * 0.1) * 0.1;
    //     c.a = 0.9913634045759203;
    //     c.b = 0.10591846907073832;
    //     c.d = 1;
    // c.d = -2;
    // les terminaisons différentes
    //     c.a *= 0.1;
    //     c.b *= 0.75;
    // c.f = 3550;
    // c.f = 15550;
    // c.f += 0.05;
    //     c.c += 0.01;
    // }
    vertices = [];
    // pos = { x: 0, y: 0, z: 0 };
    pos = [0, 0, 0];
    for (let i = 0; i < 120000; i++) {
        pos = goyaOptimized(pos, c);
        vertices.push(pos[0] * 0.5, 0 + pos[1] * 0.125, 0.0);
    }
    drawVertices();
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}

function keyPressed() {
    if (keysActive) {
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
}


let c = { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1 };
let goya = function(x, y, z, c) {
    return {
        x: Math.sin(c.a * x) + Math.sin(c.b * y) + Math.tan(c.c * z),
        y: Math.sin(c.d * y) + Math.tan(c.e * x) + Math.tan(c.f * z),
        z: z + 0.1
    };
};

let goyaOptimized = function(a, c) {
    return [
        Math.sin(c.a * a[0]) + Math.sin(c.b * a[1]) + Math.tan(c.c * a[2]),
        Math.sin(c.d * a[1]) + Math.tan(c.e * a[0]) + Math.tan(c.f * a[2]),
        a[2] + 0.1
    ];
};

// goya = function(x, y, z, c) {
//     return {
//         x: Math.sin(c.a * x) + Math.sin(c.c * z),
//         y: Math.sin(c.b * y) + Math.cos(c.f * z),
//         z: z + 0.1
//     };
// };