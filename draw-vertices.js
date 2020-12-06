function drawVertices() {
    // Create an empty buffer object to store the vertex buffer


    //Bind appropriate array buffer to it

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Unbind the buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*======== Associating shaders to buffer objects ========*/

    // Bind vertex buffer object
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location




    /*============= Drawing the primitive ===============*/

    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit

    // gl.blendFunc(gl.ONE, gl.ONE);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // background(0, 255);

    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, amountOfDots);
}