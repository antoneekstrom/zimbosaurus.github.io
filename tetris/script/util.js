

function rotationMatrix(w, h, theta) {
    const mat = createMatrix(w, h, 0);
    mat[0][0] = cos(theta);
    mat[0][w] = -sin(theta);
    mat[h][0] = sin(theta);
    mat[h][w] = cos(theta);
    return mat;
}

function multiplyMatrices(a, b) {
    
}

function directionIsOpposite(a, b) {
    let n = negateDirection([...a]);
    return n[0] == b[0] && n[1] == b[1];
}

function negateDirection(d) {
    d[0] = -d[0];
    d[1] = -d[1];
    return d;
}

function coord(c) {
    return c * gridRes;
}

function drawSquare(x, y, xOff, yOff, scale) {
    square(coord(x) + strokeWidth + (xOff || 0), coord(y) + strokeWidth + (yOff || 0), gridRes * (scale || 1) - strokeWidth);
}

function doesCollide(a, b) {
    return a[0] == b[0] && a[1] == b[1];
}

function contains(array, item) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == item) return true;
    }
    return false;
}

function createMatrix(width, height, fill) {
    let m = [];

    for (let h = 0; h < height; h++) {
        m.push(createArray(width, fill));
    }

    return m;
}

function createArray(length, fill) {
    let arr = [];
    for (let l = 0; l < length; l++) {
        arr.push(fill);
    }
    return arr;
}

function iterateMatrix(matrix, func) {
    let height = matrix[0].length;
    let width = matrix.length;
    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            func(matrix[y][x], x, y);
        }
    }
}

function drawGrid() {
    noFill();
    stroke(0);
    for (let x = 0; x < gridWidth(); x++) {
        for (let y = 0; y < gridHeight(); y++) {
            square(coord(x), coord(y), gridRes);
        }
    }
}