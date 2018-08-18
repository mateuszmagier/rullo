/*
    ============
    RulloRow
    ============
*/

let RulloRow = function (numbersArray) {
    this.numbers = numbersArray;
    this.currentRowSum = -1; // current sum of "on" balls in row
    this.targetRowSum = -1; // target sum of "on" balls in row
    this.rowElement = null;
};

/*
    calculates sum of numbers in object's array
*/
RulloRow.prototype.countSum = function () {
    let sum = 0;
    for (let i = 0; i < this.numbers.length; i++)
        sum += this.numbers[i];
    this.currentRowSum = sum;
};

RulloRow.prototype.getCurrentRowSum = function () {
    return this.currentRowSum;
};

RulloRow.prototype.createTargetSumElement = function () {
    let targetSumElem = document.createElement("div");
    targetSumElem.classList.add("target-sum");
    let number = document.createElement("span");
    number.classList.add("sum__number");
    number.textContent = this.currentRowSum;
    targetSumElem.appendChild(number);
    return targetSumElem;
};

/*
    creates and returns HTML element of row containing balls
*/
RulloRow.prototype.createRowElement = function () {
    let ball, number;
    let targetSum;
    let row = document.createElement("div");
    row.classList.add("row");
    targetSum = this.createTargetSumElement();
    row.appendChild(targetSum);
    for (let i = 0; i < this.numbers.length; i++) {
        ball = document.createElement("div");
        ball.classList.add("ball", "ball--on");
        number = document.createElement("span");
        number.classList.add("ball__number");
        number.textContent = this.numbers[i];
        ball.appendChild(number);
        row.appendChild(ball);
    }
    row.appendChild(targetSum.cloneNode(true));
    this.rowElement = row;
    return row;
};

RulloRow.prototype.getRowElement = function () {
    return this.rowElement;
};

RulloRow.prototype.generateTargetRowSum = function () {
    let dim = this.numbers.length;
    let fieldsToSumNumber = Math.floor(Math.random() * (dim - 1) + 1); // number of numbers to sum and save in target sum
    console.log("Sumuję " + fieldsToSumNumber + "/" + dim);
}

/*
    ============
    RulloColumn
    ============
*/

/*
    rulloRowsArray: array of RulloRow objects
    index: index of column
*/
let RulloColumn = function (rulloRowsArray, index) {
    this.rowsArray = rulloRowsArray;
    this.index = index;
    this.currentColumnSum = -1; // current sum of "on" balls in column
    this.targetColumnSum = -1; // target sum of "on" balls in column
    this.column = [];
    this.columnElement = null;

    this.createColumn();
};

RulloColumn.prototype.createColumn = function () {
    this.currentColumnSum = 0;
    let number;
    for (let i = 0; i < this.rowsArray.length; i++) {
        number = this.rowsArray[i].numbers[this.index];
        this.currentColumnSum += number;
        this.column.push(number);
    }
};

RulloColumn.prototype.getCurrentColumnSum = function () {
    return this.currentColumnSum;
};

RulloColumn.prototype.createColumnElement = function() {
    let column, number;
    column = document.createElement("div");
    column.classList.add("target-sum");
    number = document.createElement("span");
    number.classList.add("sum__number");
    number.textContent = this.currentColumnSum;
    column.appendChild(number);
    this.columnElement = column;
    return column;
};

/*
    ============
    Rullo
    ============
*/

let Rullo = function (container, options) {
    this.gameContainer = container; // HTML element which is a game container
    this.rows = []; // array of RulloRow objects
    this.columns = []; // array of RulloColumn objects

    const defaultOptions = {
        dim: 5, // number of balls in a row/column
        min: 1, // the smallest number that can be in a ball
        max: 9 // the biggest number that can be in a ball
    };
    this.options = Object.assign({}, defaultOptions, options);

    this.initRows();
    this.initColumns();
    this.initGameContainer();
};

/* 
    array: array of numbers
    creates new RulloRow object and add it to rows array
*/
Rullo.prototype.addRulloRow = function (array) {
    let rulloRow = new RulloRow(array);
    rulloRow.countSum();
    rulloRow.generateTargetRowSum();
    this.rows.push(rulloRow);
};

/*
    generates random numbers from range and fill array of RulloRow objects
*/
Rullo.prototype.initRows = function () {
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
        row += " | " + this.rows[i - 1].getCurrentRowSum();

        row += "\n";
    }
    console.log(row);
};

/*
    generates RulloColumn objects based on RulloRow objects and puts them into an array
*/
Rullo.prototype.initColumns = function () {
    let column;
    for (let i = 0; i < this.options.dim; i++) {
        column = new RulloColumn(this.rows, i);
        this.columns.push(column);
        console.log("Kolumna " + (i + 1) + ": " + column.currentColumnSum);
    }
};

/*
    creates HTML elements for balls (and rows) and adds them to the game container
*/
Rullo.prototype.initGameContainer = function () {
    let row, col, ball;
    
    let rowCol = document.createElement("div");
    rowCol.classList.add("row");
    for(let i = 0; i < this.columns.length; i++) {
        col = this.columns[i].createColumnElement();
        rowCol.appendChild(col);
    }
    this.gameContainer.appendChild(rowCol);
    
    for (let i = 0; i < this.rows.length; i++) {
        row = this.rows[i].createRowElement();
        this.gameContainer.appendChild(row);
    }
    
    this.gameContainer.appendChild(rowCol.cloneNode(true));
};