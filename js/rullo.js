/*
    ============
    RulloRow
    ============
*/

let RulloRow = function (numbersArray) {
    // private members
    var numbers = numbersArray,
        currentRowSum = -1, // current sum of "on" balls in row
        targetRowSum = -1, // target sum of "on" balls in row
        rowElement = null; // HTML element containing balls and sums
    
    // getters and setters for private members
    this.getNumber = function(index) {
        return numbers[index];
    }
    
    this.getNumbers = function() {
        return numbers;
    }
    
    this.getCurrentRowSum = function() {
        return currentRowSum;
    }
    
    this.setCurrentRowSum = function(newCurrentRowSum) {
        currentRowSum = newCurrentRowSum;
    }
    
    this.getTargetRowSum = function() {
        return targetRowSum;
    }
    
    this.setTargetRowSum = function(newTargetRowSum) {
        targetRowSum = newTargetRowSum;
    }
    
    this.getRowElement = function() {
        return rowElement;
    }
    
    this.setRowElement = function(newRowElement) {
        rowElement = newRowElement;
    }
    
    this.countSum(); // sum numbers in array
    this.generateTargetRowSum();
    this.createRowElement(); // creates and sets rowElement
};

/*
    calculates sum of numbers in object's array
*/
RulloRow.prototype.countSum = function () {
    let sum = 0;
    for (let i = 0; i < this.getNumbers().length; i++)
        sum += this.getNumber(i);
    this.setCurrentRowSum(sum);
};

/*
    creates and returns HTML element containing target sum in row
*/
RulloRow.prototype.createTargetSumElement = function () {
    let targetSumElem = document.createElement("div");
    targetSumElem.classList.add("target-sum");
    let number = document.createElement("span");
    number.classList.add("sum__number");
    number.textContent = this.getCurrentRowSum();
    targetSumElem.appendChild(number);
    return targetSumElem;
};

/*
    creates and returns HTML element of row containing balls and sums
*/
RulloRow.prototype.createRowElement = function () {
    let ball, number;
    let targetSumElement;
    let row = document.createElement("div");
    row.classList.add("row");
    targetSumElement = this.createTargetSumElement();
    row.appendChild(targetSumElement);
    for (let i = 0; i < this.getNumbers().length; i++) {
        ball = document.createElement("div");
        ball.classList.add("ball", "ball--on");
        number = document.createElement("span");
        number.classList.add("ball__number");
        number.textContent = this.getNumber(i);
        ball.appendChild(number);
        row.appendChild(ball);
    }
    row.appendChild(targetSumElement.cloneNode(true));
    this.setRowElement(row);
};

RulloRow.prototype.generateTargetRowSum = function () {
    let dim = this.getNumbers().length;
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
    var rowsArray = rulloRowsArray,
        index = index, // index of column
        currentColumnSum = -1, // current sum of "on" balls in column
        column = [], // numbers in column
        targetColumnSum = -1, // target sum of "on" balls in column
        columnElement = null; // HTML element containing sum in column
    
    this.getRowsArray = function() {
        return rowsArray;
    }
    
    this.getRowArray = function(index) {
        return rowsArray[index];
    }
    
    this.getIndex = function() {
        return index;
    }
    
    this.getCurrentColumnSum = function() {
        return currentColumnSum;
    }
    
    this.setCurrentColumnSum = function(newCurrentColumnSum) {
        currentColumnSum = newCurrentColumnSum;
    }
    
    this.addNumberToColumn = function(number) {
        column.push(number);
    }
    
    this.getTargetColumnSum = function() {
        return targetColumnSum;
    }
    
    this.setTargetColumnSum = function(newTargetColumnSum) {
        targetColumnSum = newTargetColumnSum;
    }
    
    this.getColumnElement = function() {
        return columnElement;
    }
    
    this.setColumnElement = function(newColumnElement) {
        columnElement = newColumnElement;
    }

    this.initColumnArray();
    this.createColumnElement();
};

/*
    creates column array using rows array, and calculates current sum in column
*/
RulloColumn.prototype.initColumnArray = function () {
    let number, sum = 0;
    for (let i = 0; i < this.getRowsArray().length; i++) {
        number = this.getRowArray(i).getNumber(this.getIndex());
        sum += number;
        this.addNumberToColumn(number);
    }
    this.setCurrentColumnSum(sum);
};

/*
    creates HTML element containing sum in column
*/
RulloColumn.prototype.createColumnElement = function() {
    let column, number;
    column = document.createElement("div");
    column.classList.add("target-sum");
    number = document.createElement("span");
    number.classList.add("sum__number");
    number.textContent = this.getCurrentColumnSum();
    column.appendChild(number);
    this.setColumnElement(column);
};

/*
    ============
    Rullo
    ============
*/

let Rullo = function (container, options) {
    var gameContainer = container, // HTML element which is a game container
        rows = [], // array of RulloRow objects
        columns = []; // array of RulloColumn objects

    const defaultOptions = {
        dim: 5, // number of balls in a row/column
        min: 1, // the smallest number that can be in a ball
        max: 9 // the biggest number that can be in a ball
    };
    this.options = Object.assign({}, defaultOptions, options);
    
    this.getGameContainer = function() {
        return gameContainer;
    }
    
    this.addRow = function(row) {
        rows.push(row);
    }
    
    this.getRows = function() {
        return rows;
    }
    
    this.getRow = function(index) {
        return rows[index];
    }
    
    this.addColumn = function(column) {
        columns.push(column);
    }
    
    this.getColumns = function() {
        return columns;
    }
    
    this.getColumn = function(index) {
        return columns[index];
    }

    this.initRows();
    this.initColumns();
    this.initGameContainer();
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
        rulloRow = new RulloRow(arr);
        this.addRow(rulloRow);
        row += " | " + this.getRow(i - 1).getCurrentRowSum();

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
        column = new RulloColumn(this.getRows(), i);
        this.addColumn(column);
        console.log("Kolumna " + (i + 1) + ": " + column.getCurrentColumnSum());
    }
};

/*
    creates HTML elements for balls (and rows) and adds them to the game container
*/
Rullo.prototype.initGameContainer = function () {
    let row, col, ball;
    
    let rowCol = document.createElement("div");
    rowCol.classList.add("row");
    for(let i = 0; i < this.getColumns().length; i++) {
        rowCol.appendChild(this.getColumn(i).getColumnElement());
    }
    this.getGameContainer().appendChild(rowCol);
    
    for (let i = 0; i < this.getRows().length; i++) {
        this.getGameContainer().appendChild(this.getRow(i).getRowElement());
    }
    
    this.getGameContainer().appendChild(rowCol.cloneNode(true));
};