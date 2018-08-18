/*
    ============
    RulloSum
    ============
*/

let RulloSum = function(sum) {
    var targetSum = sum,
        targetSumElement = null;
    
    this.getTargetSum = function() {
        return targetSum;
    }
    
    this.setTargetSum = function(newTargetSum) {
        targetSum = newTargetSum;
    }
    
    this.getTargetSumElement = function() {
        return targetSumElement;
    }
    
    this.setTargetSumElement = function(newTargetSumElement) {
        targetSumElement = newTargetSumElement;
    }
    
    this.createTargetSumElement();
}

/*
    creates and returns HTML element containing target sum in row
*/
RulloSum.prototype.createTargetSumElement = function() {
    let targetSumElem = document.createElement("div");
    targetSumElem.classList.add("target-sum");
    let number = document.createElement("span");
    number.classList.add("sum__number");
    number.textContent = this.getTargetSum();
    targetSumElem.appendChild(number);
    this.setTargetSumElement(targetSumElem);
}


/*
    ============
    RulloBall
    ============
*/

let RulloBall = function (number) {
    // private members
    var number = number,
        enabled = true,
        locked = false,
        ballElement = null;

    // getters and setters
    this.getNumber = function () {
        return number;
    }

    this.setNumber = function (newNumber) {
        number = newNumber;
    }

    this.isEnabled = function () {
        return enabled;
    }

    this.setEnabled = function (bool) {
        enabled = bool;
    }

    this.isLocked = function () {
        return locked;
    }

    this.setLocked = function (bool) {
        locked = bool;
    }

    this.getBallElement = function () {
        return ballElement;
    }

    this.setBallElement = function (newBallElement) {
        ballElement = newBallElement;
    }


    this.createBallElement();
    this.addClickEvent();
}

/*
    creates and sets HTML element representing ball
*/
RulloBall.prototype.createBallElement = function () {
    let ballElem, numberElem;
    ballElem = document.createElement("div");
    ballElem.classList.add("ball", "ball--on");
    numberElem = document.createElement("span");
    numberElem.classList.add("ball__number");
    numberElem.textContent = this.getNumber();
    ballElem.appendChild(numberElem);
    this.setBallElement(ballElem);
}


RulloBall.prototype.addClickEvent = function () {
    let ballElem = this.getBallElement();
    ballElem.addEventListener("click", function () {
        if (this.classList.contains("ball--on")) { // click on enabled ball
            this.classList.remove("ball--on");
            this.classList.add("ball--off");
        } else { // click on disabled ball
            this.classList.remove("ball--off");
            this.classList.add("ball--on");
        }
    });
}


/*
    ============
    RulloRow
    ============
*/

let RulloRow = function (numbersArray) {
    // private members
    var numbers = numbersArray,
        totalRowSum = -1, // total sum of all balls
        currentRowSum = -1, // current sum of enabled balls in row
        targetRowSum = -1, // target sum of enabled balls in row
        rowElement = null, // HTML element containing balls and sums
        balls = []; // array of RulloBall objects

    // getters and setters for private members
    this.getNumber = function (index) {
        return numbers[index];
    }

    this.getNumbers = function () {
        return numbers;
    }

    this.getTotalRowSum = function () {
        return totalRowSum;
    }

    this.setTotalRowSum = function (newTotalRowSum) {
        totalRowSum = newTotalRowSum;
    }

    this.getCurrentRowSum = function () {
        return currentRowSum;
    }

    this.setCurrentRowSum = function (newCurrentRowSum) {
        currentRowSum = newCurrentRowSum;
    }

    this.getTargetRowSum = function () {
        return targetRowSum;
    }

    this.setTargetRowSum = function (newTargetRowSum) {
        targetRowSum = newTargetRowSum;
    }

    this.getRowElement = function () {
        return rowElement;
    }

    this.setRowElement = function (newRowElement) {
        rowElement = newRowElement;
    }

    this.addBall = function (ball) {
        balls.push(ball);
    }

    this.getBalls = function () {
        return balls;
    }

    this.getBall = function (index) {
        return balls[index];
    }

    this.countTotalSum(); // sum all numbers in array
    this.generateTargetRowSum();
    this.createRowElement(); // creates and sets rowElement
    this.addClickEvent(); // apply changes when user clicks on ball in a row

};

/*
    calculates sum of numbers in object's array
*/
RulloRow.prototype.countTotalSum = function (numbers) {
    let sum = 0;
    for (let i = 0; i < this.getNumbers().length; i++)
        sum += this.getNumber(i);
    this.setTotalRowSum(sum);
    this.setCurrentRowSum(sum);
};

RulloRow.prototype.countCurrentSum = function () {
    let ball, ballElem, sum = 0;
    for (let i = 0; i < this.getBalls().length; i++) {
        ball = this.getBall(i);
        ballElem = ball.getBallElement();
        if (ballElem.classList.contains("ball--on"))
            sum += ball.getNumber();
    }
    this.setCurrentRowSum(sum);
}

RulloRow.prototype.addClickEvent = function () {
    this.getRowElement().addEventListener("click", function () {
        this.countCurrentSum();
        console.log(this.getCurrentRowSum() + "/" + this.getTotalRowSum());
    }.bind(this));
};
/*
    creates and returns HTML element of row containing balls and sums
*/
RulloRow.prototype.createRowElement = function () {
    let rulloBall, number;
    let rulloSum, targetSumElement;
    let row = document.createElement("div");
    row.classList.add("row");
    rulloSum = new RulloSum(this.getTotalRowSum());
    targetSumElement = rulloSum.getTargetSumElement();
    row.appendChild(targetSumElement);
    for (let i = 0; i < this.getNumbers().length; i++) {
        rulloBall = new RulloBall(this.getNumber(i)); // RulloBall object
        this.addBall(rulloBall); // add ball to array
        row.appendChild(rulloBall.getBallElement());
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

    this.getRowsArray = function () {
        return rowsArray;
    }

    this.getRowArray = function (index) {
        return rowsArray[index];
    }

    this.getIndex = function () {
        return index;
    }

    this.getCurrentColumnSum = function () {
        return currentColumnSum;
    }

    this.setCurrentColumnSum = function (newCurrentColumnSum) {
        currentColumnSum = newCurrentColumnSum;
    }

    this.addNumberToColumn = function (number) {
        column.push(number);
    }

    this.getTargetColumnSum = function () {
        return targetColumnSum;
    }

    this.setTargetColumnSum = function (newTargetColumnSum) {
        targetColumnSum = newTargetColumnSum;
    }

    this.getColumnElement = function () {
        return columnElement;
    }

    this.setColumnElement = function (newColumnElement) {
        columnElement = newColumnElement;
    }

    this.initColumnArray();
    
    // creates sum element for this column
    let rulloSum = new RulloSum(this.getCurrentColumnSum());
    this.setColumnElement(rulloSum.getTargetSumElement());
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

    this.getGameContainer = function () {
        return gameContainer;
    }

    this.addRow = function (row) {
        rows.push(row);
    }

    this.getRows = function () {
        return rows;
    }

    this.getRow = function (index) {
        return rows[index];
    }

    this.addColumn = function (column) {
        columns.push(column);
    }

    this.getColumns = function () {
        return columns;
    }

    this.getColumn = function (index) {
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
    for (let i = 0; i < this.getColumns().length; i++) {
        rowCol.appendChild(this.getColumn(i).getColumnElement());
    }
    this.getGameContainer().appendChild(rowCol);

    for (let i = 0; i < this.getRows().length; i++) {
        this.getGameContainer().appendChild(this.getRow(i).getRowElement());
    }

    this.getGameContainer().appendChild(rowCol.cloneNode(true));
};
