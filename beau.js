goyaOptimized = function(a, c) {
    return [
        Math.sin(c.a * a[0]) + Math.sin(c.b * a[1]) + Math.sin(c.c * a[2]),
        Math.sin(c.d * a[1]) + Math.tan(c.e * a[0]),
        a[2] + 0.1
    ];
}; { "a": 1.5, "b": 1, "c": 0.025, "d": 1, "e": 1, "f": 1, "x": 2.5, "y": 1.25, "tx": 0.8, "ty": 1.95, "tt": 2 } { "a": 1.15, "b": 1, "c": 0.025, "d": 1, "e": 1, "f": 1, "x": 30, "y": 15, "tx": 1.025, "ty": 2.36, "tt": 2 }

Exploring some distant regions of

    x_ { n + 1 } = sin(x_n * 1.15) + sin(y_n) + sin(z_n * 0.025)
y_ { n + 1 } = sin(y_n) + tan(x_n)
z_ { n + 1 } = z_n + 0.1

{ "a": 1.15, "b": 1, "c": 0.025, "d": 1, "e": 1, "f": 1, "x": 1, "y": 1, "tx": 0, "ty": 0 }