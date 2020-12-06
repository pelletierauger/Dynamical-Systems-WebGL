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
let goyaBox;

let gpu, gpuGoya;

function setup() {
    socket = io.connect('http://localhost:8080');
    cnvs = createCanvas(windowWidth, windowHeight, WEBGL);

    gl = canvas.getContext('webgl');
    // gpu = new GPU({ webGl: gl });

    // gpuGoya = gpu.createKernel(function(a, b, c, d, e, f, arr) {
    //     var x = 0;
    //     var y = 0;
    //     var z = 0;
    //     for (var i = 0; i < 100000; i++) {
    //         x = Math.sin(a * x) + Math.sin(b * y) + Math.tan(c * z);
    //         y = Math.sin(d * y) + Math.tan(e * x) + Math.tan(f * z);
    //         z = z + 0.1;
    //         arr[i * 2] = x;
    //         arr[i * 2 + 1] = y;
    //     }
    //     return arr;
    // }).setOutput([200000]);
    // goyaBox = gpuGoya(c.a, c.b, c.c, c.d, c.e, c.f, new Float32Array(200000));
    // gpuGoya = gpu.createKernel(function() {
    //     return this.thread.x;
    // }).setOutput([100]);


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
    background(0);
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
    c.e = 0.1 + Math.cos(frameCount * 0.1) * 0.1;
    c.a = 0.9913634045759203;
    // c.b = 0.10591846907073832;
    c.d = -1;
    // }



    // les terminaisons différentes
    c.a *= 0.1;
    // gpuGoya(c.a, c.b, c.c, c.d, c.e, c.f);



    vertices = [];
    for (let i = 0; i < 100000; i++) {
        pos = goya(pos.x, pos.y, pos.z, c);
        vertices.push(2 + pos.x * 1, 0 + pos.y * 0.25, 0.0);
    }
    drawVertices();

    if (exporting && frameCount < maxFrames) {
        frameExport();
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
let goya = function(x, y, z, c) {
    return {
        x: Math.sin(c.a * x) + Math.sin(c.b * y) + Math.tan(c.c * z),
        y: Math.sin(c.d * y) + Math.tan(c.e * x) + Math.tan(c.f * z),
        z: z + 0.1
    };
};

// goya = function(x, y, z, c) {
//     return {
//         x: Math.sin(c.a * x) + Math.sin(c.c * z),
//         y: Math.sin(c.b * y) + Math.cos(c.f * z),
//         z: z + 0.1
//     };
// };