
/// <reference path="../../node_modules/@types/p5/global.d.ts" />

// p5
let canvas;

// env style
const strokeWidth = 1;
let backgroundColor;

// env
let env;
const envWidth = 10, envHeight = 20;
const gridRes = 25;
const previewSize = 10;

let layout;
let playArea;
let scoreArea;
let pieceArea;

let shouldFall = true;

// objs
let piece;
let pq = [];
const qSize = 4;

// logic
const STATES = {
    unfinished: 0,
    completed: 1
};

let gamePaused = false;
let state =  STATES.unfinished;
let score = 0;

const DIRECTIONS = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1],
    none: [0, 0]
}

const PIECES = {
    longboi: {
        structure: [[1,1,1,1]],
        color: [0, 242, 240],
        origin: [0, 0]
    },
    lboione: {
        structure: [[1, 0, 0], [1, 1, 1]],
        color: [2, 0, 241],
        origin: [1, 0]
    },
    lboitwo: {
        structure: [[0, 0, 1], [1, 1, 1]],
        color: [238, 160, 0],
        origin: [1, 0]
    },
    boxboi: {
        structure: [[1, 1], [1, 1]],
        color: [239, 241, 1],
        origin: [1, 0]
    },
    zigzagboi: {
        structure: [[0, 1, 1], [1, 1, 0]],
        color: [0, 240, 0],
        origin: [1, 0]
    },
    zagzigboi: {
        structure: [[1, 1, 0], [0, 1, 1]],
        color: [240, 1, 0],
        origin: [1, 0]
    },
    triangleboi: {
        structure: [[0, 1, 0], [1, 1, 1]],
        color: [160, 0, 241],
        origin: [1, 0]
    },
    uboi: {
        structure: 
        [
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 1]
        ],
        color: [200, 50, 170],
        origin: [1, 1]
    }
}

const SCORE_NUM_LINES = [
    0,
    40,
    100,
    300,
    1200
]

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(document.querySelector("#canvas-container"));

    backgroundColor = color(255);
    frameRate(60);

    resetLayout();
    reset();
}

function resetLayout() {
    layout = new Layout(windowWidth, windowHeight);
    playArea = layout.createBox(coord(envWidth), coord(envHeight), {x: CENTER, y: CENTER});
    playArea.calc();
    pieceArea = layout.createBox(200, 50, {x: LEFT, y: CENTER}, {x: playArea.dataX.right + 50, y: playArea.distances[TOP]});
    scoreArea = layout.createBox(200, 50, {x: LEFT, y: TOP}, {x: pieceArea.x, y: pieceArea.distances[TOP]- 150});
    scoreArea.calc();
}

function reset() {
    score = 0;
    env = new Environment(envWidth, envHeight);
    setState(STATES.unfinished);

    for (let i = 0; i < qSize; i++) pq.push(randomPiece().construct());

    shiftQueue();
}

function shiftQueue() {
    const p = pq.shift();
    piece = p;
    pq.push(randomPiece().construct());
}

function randomPiece(x, y) {
    const keys = Object.keys(PIECES);
    const randomType = PIECES[random(keys)];
    return new Piece(randomType, x, y);
}

function draw() {
    update();
    paint();
}

function paint() {
    background(backgroundColor);
    strokeWeight(strokeWidth);

    paintPlayArea();
    paintPiece();
    paintQueue();
    env.draw();
}

function paintPiece() {
    piece.draw();
}

function paintPlayArea() {

    const xOffset = playArea.x;
    const yOffset = playArea.y;

    env.forEach((v, x, y) => {
        noFill();
        stroke(0);
        strokeWeight(strokeWidth);
        square(coord(x) + xOffset, coord(y) + yOffset, gridRes);
    });
}

function paintQueue() {

    noFill();
    stroke(0);
    pieceArea.draw();

    let xPointer = previewSize;
    pq.forEach((p, i) => {
        const pos = pieceArea.get(LEFT, TOP);
        const marginTop = pieceArea.halfHeight() - (previewSize);

        p.draw(pos.x + xPointer, pos.y + marginTop, previewSize);

        xPointer += (p.width + 1) * previewSize;
    });
    pieceArea.width = xPointer;

    noFill();
    stroke(0);
    scoreArea.draw();
    fill(0, 80, 255);
    noStroke();
    textSize(35);
    textFont("Comic Sans MS");
    scoreArea.drawText(`SCORE: ${score}`);
}

function update() {
    if (state != STATES.completed) {
        piece.update();
        env.update();
    }
    else {
        showLose();
    }
}

function setState(s) {
    state = s;
    stateChanged(s);
}

function stateChanged(s) {}

function showLose() {
    noStroke();
    fill(255, 0, 0);
    textSize(50);
    textStyle(BOLD);
    rectMode(CENTER);
    text("loseText", 100, height / 2);
    rectMode(CORNER);
}

function keyPressed() {
    keyInput();
}

function keyInput() {
    let dir = DIRECTIONS.none;

    switch (keyCode) {
        case 37:
        case 65:
            dir = DIRECTIONS.left;
            break;
        case 39:
        case 68:
            dir = DIRECTIONS.right;
            break;
        case 83:
        case 18:
            piece.move(DIRECTIONS.down);
            break;
        case 38:
        case 87:
            piece.rotate(1);
            break;
    }

    piece.move(dir);
}

function windowResized() {
    canvas.size(windowWidth, windowHeight);
    resetLayout();
}

class Environment {
    constructor(w, h) {
        this.mat = createMatrix(w, h, undefined);
        this.width = w;
        this.height = h;
    }
    get(x, y) {
        if (y < 0 || x < 0 || y >= this.mat.length || x >= this.mat[y].length) return undefined;
        return this.mat[y][x];
    }
    fill(x, y, c) {
        this.mat[y][x] = c || color(0);
    }
    forEach(callb) {
        for (let y = 0; y < this.height; y++) {
            for (let x =
                 0; x < this.width; x++) {
                callb(this.get(x, y), x, y);
            }
        }
    }
    testBounds(x, y) {
        return !(x < 0 || x >= env.width || y < 0 || y >= env.height);
    }
    draw() {
        this.forEach((s, x, y) => {
            if (s != undefined) {
                fill(s);
                drawSquare(x, y, playArea.x, playArea.y);
            }
        })
    }
    filledLines() {
        const lines = [];
        for (let y = 0; y < this.height; y++) {
            const line = this.mat[y];
            if (!contains(line, undefined)) lines.push({line: line, y: y});
        }
        return lines;
    }
    freeze(piece) {
        for (let i = 0; i < piece.items.length; i++) {
            const item = piece.items[i];
            this.fill(piece.x + item.x, piece.y + item.y, piece.color);
        }
    }
    update() {
        const lines = this.filledLines();
        const numLines = lines.length;
        if (numLines > 0) {
            lines.forEach((l) => {
                this.mat.splice(l.y, 1);
                this.mat.unshift(createArray(this.width, undefined));
            });
        }
        const s = SCORE_NUM_LINES[numLines < SCORE_NUM_LINES.length ? numLines : SCORE_NUM_LINES.length - 1];
        score += s;
    }
}

class Piece {
    constructor(type, x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.type = type;

        this.beingPlaced = false;
        this.placementTries = 3;
        this.placementCounter = 0;


        this.clock = 0;
        this.clockMax = 30;
    }
    construct() {
        let structure = this.type.structure;
        let c = color(this.type.color[0], this.type.color[1], this.type.color[2]);
        this.color = c;
        this.items = [];

        for (let y = 0; y < structure.length; y++) {
            for (let x = 0; x < width; x++) {
                if (structure[y][x] == 1) {
                    let item = new Item(x, y, c);
                    this.items.push(item);
                }
            }
        }

        this.calc();

        return this;
    }
    calc() {
        this.itemData = {
            xMin: undefined,
            yMin: undefined,
            xMax: undefined,
            yMax: undefined
        };

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            if (this.itemData.xMax == undefined || item.x > this.itemData.xMax) this.itemData.xMax = item.x;
            if (this.itemData.xMin == undefined || item.x < this.itemData.xMin) this.itemData.xMin = item.x;

            if (this.itemData.yMin == undefined || item.y < this.itemData.yMin) this.itemData.yMin = item.y;
            if (this.itemData.yMax == undefined || item.y > this.itemData.yMax) this.itemData.yMax = item.y;
        }

        this.width = this.itemData.xMax - this.itemData.xMin + 1;
        this.height = this.itemData.yMax - this.itemData.yMin + 1;
    }
    data() {
        return {
            xMin: this.x + this.itemData.xMin,
            yMin: this.y + this.itemData.yMin,
            xMax: this.x + this.itemData.xMax,
            yMax: this.y + this.itemData.yMax
        };
    }
    rotate() {
        const angle = HALF_PI;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const x = item.x - this.type.origin[0];
            const y = item.y - this.type.origin[1];

            item.x = (x * cos(angle)) - (y * sin(angle));
            item.y = ((y * cos(angle)) + (x * sin(angle)));
            item.x = round(item.x);
            item.y = round(item.y);
            item.x += this.type.origin[0];
            item.y += this.type.origin[1];
        }
        this.calc();
    }
    move(dir) {

        if (gamePaused || state != STATES.unfinished) return;

        const boundsResult = this.testBounds(dir);
        const envResult = this.testEnvironment(dir);

        const allowedX = boundsResult[DIRECTIONS.left] && boundsResult[DIRECTIONS.right];
        const allowedY = boundsResult[DIRECTIONS.up] && boundsResult[DIRECTIONS.down];

        let blockedDirection = false;
        let shouldBePlaced = false;

        for (let i = 0; i < envResult.items.length; i++) {
            const ri = envResult.items[i];
            if (ri[dir]) blockedDirection = true;
            if (ri[DIRECTIONS.down]) shouldBePlaced = true;
        }

        if (shouldBePlaced || !boundsResult[DIRECTIONS.down]) this.triggerPlacement();

        if (allowedX && ! blockedDirection) {
            this.x += boundsResult.xDir;
        }
        if (allowedY && ! blockedDirection) {
            this.y += boundsResult.yDir;
        }

        if (this.beingPlaced) {
            this.placementCounter++;
            if (this.placementCounter >= this.placementTries) {
                this.placementCounter = 0;
                this.beingPlaced = false;
                this.place();
            }
        }
    }
    testBounds(dir) {

        const data = this.data();
        const xDir = dir[0];
        const yDir = dir[1];

        return {
            xDir: xDir,
            yDir: yDir,
            [DIRECTIONS.left]: env.testBounds(data.xMin + xDir, data.yMin),
            [DIRECTIONS.right]: env.testBounds(data.xMax + xDir, data.yMin),
            [DIRECTIONS.down]: env.testBounds(data.xMin, data.yMax + yDir),
            [DIRECTIONS.up]: env.testBounds(data.xMin, data.yMin + yDir)
        };
    }
    testEnvironment() {
        
        const results = {
            items: []
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const x = this.x + item.x;
            const y = this.y + item.y;

            const directions = {
                [DIRECTIONS.left]: env.get(x - 1, y) != undefined,
                [DIRECTIONS.right]: env.get(x + 1, y) != undefined,
                [DIRECTIONS.up]: env.get(x, y - 1) != undefined,
                [DIRECTIONS.down]: env.get(x, y + 1) != undefined
            };
            results.items.push(directions);
        }

        return results;

    }
    triggerPlacement() {
        this.beingPlaced = true;
    }
    place() {
        env.freeze(this);
        if (this.data().yMin + this.y <= 0) state = STATES.completed;
        if (piece == this) piece = undefined;
        shiftQueue();
    }
    update() {
        this.updateClock();
    }
    updateClock() {
        this.clock++;
        if (this.clock >= this.clockMax) {
            this.clock = 0;
            this.clockTicked();
        }
    }
    clockTicked() {
        if (shouldFall)
        this.move(DIRECTIONS.down);
    }
    draw(x, y, size) {
        const b = x != undefined && y != undefined;
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            const s = size || gridRes;
            if (!b) item.draw(playArea.x + coord(this.x), playArea.y + coord(this.y));
            else item.freeDraw(x + (item.x * s), y + (item.y * s), s);
        }
    }
}

class Item {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;
        this.color = c || color(255);
    }
    draw(x, y, scale) {
        fill(this.color);
        noStroke();
        drawSquare(this.x, this.y, x, y, scale);
    }
    freeDraw(x, y, size) {
        fill(this.color);
        noStroke();
        square(x, y, size);
    }
    pos() {
        return [this.x, this.y];
    }
}