

class Box {

    constructor(w, h, x, y) {
        this.width = w;
        this.height = h;
        this.x = x || 0;
        this.y = y || 0;

        this.position = { x: this.x, y: this.y };
        this.dimensions = { width: this.width, height: this.height };
    }

    halfWidth() { return this.width / 2; }

    halfHeight() { return this.height / 2; }

    centerX() { return this.halfWidth() + this.x; }

    centerY() { return this.halfHeight() + this.y; }

    calc() {
        this.dataX = {
            [LEFT]: this.x,
            [RIGHT]: this.x + this.width,
            [CENTER]: this.x + this.halfWidth()
        };
        this.dataY = {
            [TOP]: this.y,
            [BOTTOM]: this.y + this.height,
            [CENTER]: this.y + this.halfHeight()
        };
    }

    get(x, y) {
        this.calc();
        return {
            x: x == undefined ? this.dataX : this.dataX[x],
            y: y == undefined ? this.dataY : this.dataY[y]
        };
    }

    draw(c) {
        color(c || 0);
        rect(this.x, this.y, this.width, this.height);
    }

    drawText(str) {
        text(str, this.x, this.dataY[BOTTOM] - (textAscent() / 4));
    }

}

class Layout extends Box {

    constructor(w, h, x, y) {
        super(w, h, x, y);
    }

    createBox(w, h, alignment, margin) {
        let b = new AlignedBox(w, h, this, alignment, margin);
        return b;
    }

}

class AlignedBox extends Box {

    constructor(w, h, layout, alignment, margin) {
        super(w, h);
        this.layout = layout;

        this.alignment = alignment || {x: CENTER, y: CENTER};

        this.margin = margin || {};
        if (this.margin.x == undefined) this.margin.x = 0;
        if (this.margin.y == undefined) this.margin.y = 0;

        this.distances = {};

        this.calc();
    }

    calc() {
        super.calc();
        this.calcX(this.layout);
        this.calcY(this.layout);
    }

    calcX(l) {
        if (this.alignment.x == LEFT) {
            this.x = l.x + this.margin.x;
        }
        else if (this.alignment.x == RIGHT) {
            this.x = l.x + l.width - this.width - this.margin.x;
        }
        else {
            this.x = l.x + l.halfWidth() - this.halfWidth() + this.margin.x;
        }

        this.distances[LEFT] = this.x;
        this.distances[RIGHT] = l.width - (this.x + this.width);
    }

    calcY(l) {
        if (this.alignment.y == TOP) {
            this.y = l.y + this.margin.y;
        }
        else if (this.alignment.y == BOTTOM) {
            this.y = l.y + l.height - this.height - this.margin.y;
        }
        else {
            this.y = l.y + l.halfHeight() - this.halfHeight() + this.margin.y;
        }

        this.distances[TOP] = this.y;
        this.distances[BOTTOM] = l.height - (this.y + this.height);
    }

    topLeftCorner() {
        this.calc();
        return {
            width: this.width,
            height: this.height,
            x: this.x,
            y: this.y
        };
    }

}