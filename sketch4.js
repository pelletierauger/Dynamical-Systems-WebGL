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

// let pos = { x: 0, y: 0, z: 0 };
let vertices = [];
var vertex_buffer;
var coord;
let pos = [0, 0, 0];
let c = { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, x: 0.5, y: 0.25 };
c = { a: 0.01, b: 1, c: 1.05, d: 1, e: 1, f: 1, x: 0.5, y: 0.25, tx: 0, ty: 0 };
// c.c = 10;
// {"a":0.1,"b":1,"c":0.9,"d":1,"e":1,"f":1,"x":1,"y":0.5}
// c.c = 0.1;
let amountOfDots = 200000;
amountOfDots = 200000;
vertices = new Float32Array(amountOfDots * 2);

function setup() {
    socket = io.connect('http://localhost:8080');
    // pixelDensity(1);
    cnvs = createCanvas(windowWidth, windowHeight, WEBGL);

    gl = canvas.getContext('webgl');
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
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
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // c.c = 10 * Math.sin(frameCount * 1e-11);
    // vertices = [];

    // pos = [0, 0, 0];
    // c.a = map(Math.sin(frameCount * 0.05), -1, 1, -0.1, 2);
    for (let i = 0; i < amountOfDots; i++) {
        pos = goyaOptimized(pos, c);
        vertices[i * 2] = (pos[0] + c.tx) * c.x;
        vertices[(i * 2) + 1] = (pos[1] + c.ty) * c.y;
        // vertices.push(pos[0] * 0.5, 0 + pos[1] * 0.125);
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



let goya = function(x, y, z, c) {
    return {
        x: Math.sin(c.a * x) + Math.sin(c.b * y) + Math.tan(c.c * z),
        y: Math.sin(c.d * y) + Math.tan(c.e * x) + Math.tan(c.f * z),
        z: z + 0.1
    };
};

// let goyaOptimized = function(a, c) {
//     return [
//         Math.sin(c.a * a[0]) + Math.sin(c.b * a[1]) + Math.tan(c.c * a[2]),
//         Math.sin(c.d * a[1]) + Math.tan(c.e * a[0]) + Math.tan(c.f * a[2]),
//         a[2] + 0.1
//     ];
// };
let goyaOptimized = function(a, c) {
    return [
        Math.sin(c.a * a[0]) + Math.sin(c.b * a[1]) + Math.sin(c.c * a[2]),
        Math.sin(c.d * a[1]) + Math.tan(c.e * a[0]) + Math.sin(c.f * a[2]),
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

function cl() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function cl2() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    pos = [0, 0, 0];
}