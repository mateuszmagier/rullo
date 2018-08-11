let RulloRow = function (numbersArray) {
    this.numbers = numbersArray;
    this.rowSum = -1;
    this.rowElement = null;
};

/*
    calculates sum of numbers in object's array
*/
RulloRow.prototype.countSum = function () {
    let sum = 0;
    for (let i = 0; i < this.numbers.length; i++)
        sum += this.numbers[i];
    this.rowSum = sum;
};

RulloRow.prototype.getRowSum = function () {
    return this.rowSum;
};

/*
    creates and returns HTML element of row containing balls
*/
RulloRow.prototype.createRowElement = function () {
    let ball, number;
    let row = document.createElement("div");
    row.classList.add("row");
    for (let i = 0; i < this.numbers.length; i++) {
        ball = document.createElement("div");
        ball.classList.add("ball", "ball-on");
        number = document.createElement("span");
        number.classList.add("ball__number");
        number.textContent = this.numbers[i];
        ball.appendChild(number);
        row.appendChild(ball);
    }
    this.rowElement = row;
    return row;
};

RulloRow.prototype.getRowElement = function () {
    return this.rowElement;
};

let Rullo = function (container, options) {
    this.gameContainer = container; // HTML element which is a game container
    this.rows = []; // array of RulloRow objects

    const defaultOptions = {
        dim: 5, // number of balls in a row/column
        min: 1, // the smallest number that can be in a ball
        max: 9 // the biggest number that can be in a ball
    };
    this.options = Object.assign({}, defaultOptions, options);

    this.initNumbers();
    this.initBalls();
};

/* 
    array: array of numbers
    creates new RulloRow object and add it to rows array
*/
Rullo.prototype.addRulloRow = function (array) {
    let rulloRow = new RulloRow(array);
    rulloRow.countSum();
    this.rows.push(rulloRow);
};

/*
    generates random numbers from range and fill array of RulloRow objects
*/
Rullo.prototype.initNumbers = function () {
    let min = this.options.min;
    let max = this.options.max;
    let randomNumber, rulloRow;
    let row = "";
    for (let i = 1; i <= this.options.dim; i++) {
        let arr = [];
        for (let j = 1; j <= this.options.dim; j++) {
            randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
            row += randomNumber + " ";
            arr.push(randomNumber);
        }
        this.addRulloRow(arr);
        row += " | " + this.rows[i - 1].getRowSum();

        row += "\n";
    }
    console.log(row);
};

/*
    creates HTML elements for balls (and rows) and adds them to the game container
*/
Rullo.prototype.initBalls = function () {
    let row, ball;
    for (let i = 0; i < this.rows.length; i++) {
        row = this.rows[i].createRowElement();
        this.gameContainer.appendChild(row);
    }
}
