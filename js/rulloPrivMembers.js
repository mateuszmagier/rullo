/*
    ============
    RulloSum
    ============
*/

let RulloSum = function (targetSum) {
    var targetSum = targetSum,
        targetSumElement = null,
        currentSum = targetSum,
        currentSumElement = null,
        sumElement = null;

    this.getTargetSum = function () {
        return targetSum;
    }

    this.setTargetSum = function (newTargetSum) {
        targetSum = newTargetSum;
    }

    this.getTargetSumElement = function () {
        return targetSumElement;
    }

    this.setTargetSumElement = function (newTargetSumElement) {
        targetSumElement = newTargetSumElement;
    }

    this.getCurrentSum = function () {
        return currentSum;
    }

    this.setCurrentSum = function (newCurrentSum) {
        currentSum = newCurrentSum;
    }

    this.getCurrentSumElement = function () {
        return currentSumElement;
    }

    this.setCurrentSumElement = function (newCurrentSumElement) {
        currentSumElement = newCurrentSumElement;
    }

    this.getSumElement = function () {
        return sumElement;
    }

    this.setSumElement = function (newSumElement) {
        sumElement = newSumElement;
    }

    this.createCurrentSumElement();
    this.createTargetSumElement();
    this.createSumElement();
}

/*
    creates and sets HTML element containing target sum in row
*/
RulloSum.prototype.createTargetSumElement = function () {
    let targetSumElem = document.createElement("div");
    targetSumElem.classList.add("sum--target");
    let number = document.createElement("span");
    number.classList.add("sum__number");
    number.textContent = this.getTargetSum();
    targetSumElem.appendChild(number);
    this.setTargetSumElement(targetSumElem);
}

/*
    creates and sets HTML element containing current sum in row
*/
RulloSum.prototype.createCurrentSumElement = function () {
    let currentSumElem = document.createElement("div");
    currentSumElem.classList.add("sum--current");
    let number = document.createElement("span");
    number.classList.add("sum__number");
    number.textContent = this.getCurrentSum();
    currentSumElem.appendChild(number);
    this.setCurrentSumElement(currentSumElem);
}

/*
    creates and sets HTML element containing target and current sum in row
*/
RulloSum.prototype.createSumElement = function () {
    let sumElem = document.createElement("div");
    sumElem.classList.add("sum");
    sumElem.appendChild(this.getTargetSumElement());
    sumElem.appendChild(this.getCurrentSumElement());
    this.setSumElement(sumElem);
}

/*
    add mouseover and mouseout events for top/left and bottom/right sum elements
*/
function onSumHover(firstElement, secondElement) {
    firstElement.addEventListener("mouseover", function () {
        this.parentElement.querySelector(".sum--current").classList.add("sum--current--visible");
        secondElement.parentElement.querySelector(".sum--current").classList.add("sum--current--visible");
    });
    firstElement.addEventListener("mouseout", function () {
        this.parentElement.querySelector(".sum--current").classList.remove("sum--current--visible");
        secondElement.parentElement.querySelector(".sum--current").classList.remove("sum--current--visible");
    });
}

/*
    register hover events for all target sum elements
*/
RulloSum.addSumMouseHoverEvents = function (firstSelector, secondSelector) {
    let topSumElements = document.querySelectorAll(firstSelector);
    let bottomSumElements = document.querySelectorAll(secondSelector);

    for (let i = 0; i < topSumElements.length; i++) {

        onSumHover(topSumElements[i], bottomSumElements[i]);
        onSumHover(bottomSumElements[i], topSumElements[i]);
    }
}

/*
    add click events for top/left and bottom/right target/current sum elements
*/
function onSumClick(firstElement, secondElement) {
    firstElement.addEventListener("click", function (e) {
        let currSums;
        if (e.target.closest(".sum--current")) { // clear visible current sum
            this.querySelector(".sum--current--still-visible").classList.remove("sum--current--still-visible");
            secondElement.querySelector(".sum--current--still-visible").classList.remove("sum--current--still-visible");
        } else {
            currSums = document.querySelectorAll(".sum--current--still-visible");
            for (let curr of currSums) {
                curr.classList.remove("sum--current--still-visible");
            }
            this.querySelector(".sum--current").classList.add("sum--current--still-visible");
            secondElement.querySelector(".sum--current").classList.add("sum--current--still-visible");
        }
    });
}

/*
    register click events for sum elements
*/
RulloSum.addSumClickEvents = function (firstSelector, secondSelector) {
    let topSumElements = document.querySelectorAll(firstSelector);
    let bottomSumElements = document.querySelectorAll(secondSelector);

    for (let i = 0; i < topSumElements.length; i++) {
        onSumClick(topSumElements[i], bottomSumElements[i]);
        onSumClick(bottomSumElements[i], topSumElements[i]);
    }
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
        ballElement = null,
        rulloColumn = null,
        rulloRow = null;

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

    this.getRulloRow = function () {
        return rulloRow;
    }

    this.setRulloRow = function (newRulloRow) {
        rulloRow = newRulloRow;
    }
    
    this.getRulloColumn = function() {
        return rulloColumn;
    }
    
    this.setRulloColumn = function(newRulloColumn) {
        rulloColumn = newRulloColumn;
    }

    this.createBallElement();
    this.addClickListener();
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

/*
    registers click event for ball
*/
RulloBall.prototype.addClickListener = function () {
    let row = null, col = null;
    let ballElem = this.getBallElement();
    ballElem.addEventListener("click", function () {
        let ball = this.getBallElement();
        if (ball.classList.contains("ball--on")) { // click on enabled ball
            ball.classList.remove("ball--on");
            ball.classList.add("ball--off");
        } else { // click on disabled ball
            ball.classList.remove("ball--off");
            ball.classList.add("ball--on");
        }

        // update current sum in row
        row = this.getRulloRow();
        if(row !== null) {
            row.countCurrentSum();
            row.updateCurrentSum();
        }
        
        // update current sum in row and column
        col = this.getRulloColumn();
        if(col !== null) {
            col.countCurrentSum();
            col.updateCurrentSum();
        }
    }.bind(this));
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

/*
    calculates sum of enabled balls in row
*/
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

/*
    updates current sum HTML elements in row
*/  
RulloRow.prototype.updateCurrentSum = function () {
    let currentRowSums = this.getRowElement().querySelectorAll(".sum--current");
    for (let currentRowSum of currentRowSums) {
        console.log("update");
        currentRowSum.querySelector(".sum__number").innerText = this.getCurrentRowSum();
    }
}

/*
    creates and returns HTML element of row containing balls and sums
*/
RulloRow.prototype.createRowElement = function () {
    let rulloBall, number;
    let rulloSum, sumElementLeft, sumElementRight;
    let row = document.createElement("div");
    row.classList.add("row");
    rulloSum = new RulloSum(this.getTotalRowSum());
    sumElementLeft = rulloSum.getSumElement();
    row.appendChild(sumElementLeft);
    for (let i = 0; i < this.getNumbers().length; i++) {
        rulloBall = new RulloBall(this.getNumber(i)); // RulloBall object
        rulloBall.setRulloRow(this);
        this.addBall(rulloBall); // add ball to array
        row.appendChild(rulloBall.getBallElement());
    }
    sumElementRight = sumElementLeft.cloneNode(true);
    row.appendChild(sumElementRight);
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
        totalColumnSum = -1, // total sum of all balls in column
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

    this.getTotalColumnSum = function () {
        return totalColumnSum;
    }

    this.setTotalColumnSum = function (newTotalColumnSum) {
        totalColumnSum = newTotalColumnSum;
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
    this.setColumnElement(rulloSum.getSumElement());
};

/*
    creates column array using rows array, and calculates current sum in column
*/
RulloColumn.prototype.initColumnArray = function () {
    let number, ball, sum = 0;
    for (let i = 0; i < this.getRowsArray().length; i++) {
        ball = this.getRowArray(i).getBall(this.getIndex());
        ball.setRulloColumn(this);
        number = this.getRowArray(i).getNumber(this.getIndex());
        sum += number;
        this.addNumberToColumn(number);
    }
    this.setCurrentColumnSum(sum);
    this.setTotalColumnSum(sum);
};

/*
    calculates and sets current sum - sum of enabled balls in column
*/
RulloColumn.prototype.countCurrentSum = function () {
    let row, ball, ballElem, sum = 0;
    let index = this.getIndex();
    for (let i = 0; i < this.getRowsArray().length; i++) {
        row = this.getRowArray(i);
        ball = row.getBall(index);
        ballElem = ball.getBallElement();
        if (ballElem.classList.contains("ball--on"))
            sum += ball.getNumber();
    }
    this.setCurrentColumnSum(sum);
}

/*
    updates current sum HTML elements in column
*/
RulloColumn.prototype.updateCurrentSum = function () {
    let sumElem;
    let sumRows = document.querySelectorAll(".row:first-child, .row:last-child");
    for(let sumRow of sumRows) {
        sumElem = sumRow.querySelectorAll(".sum")[this.getIndex()];
        sumElem.querySelector(".sum--current .sum__number").innerText = this.getCurrentColumnSum();
    }
}

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
    let row, col, sumElementTop, sumElementBottom, ball;

    let rowCol = document.createElement("div");
    rowCol.classList.add("row");
    for (let i = 0; i < this.getColumns().length; i++) {
        sumElementTop = this.getColumn(i).getColumnElement();
        rowCol.appendChild(sumElementTop);
    }
    this.getGameContainer().appendChild(rowCol);

    for (let i = 0; i < this.getRows().length; i++) {
        this.getGameContainer().appendChild(this.getRow(i).getRowElement());
    }

    this.getGameContainer().appendChild(rowCol.cloneNode(true));

    RulloSum.addSumMouseHoverEvents(".row:first-child .sum .sum--target", ".row:last-child .sum .sum--target");
    RulloSum.addSumMouseHoverEvents(
        ".row:not(:first-child):not(:last-child) .sum:first-child .sum--target",
        ".row:not(:first-child):not(:last-child) .sum:last-child .sum--target"
    );
    RulloSum.addSumClickEvents(".row:first-child .sum", ".row:last-child .sum");
    RulloSum.addSumClickEvents(
        ".row:not(:first-child):not(:last-child) .sum:first-child",
        ".row:not(:first-child):not(:last-child) .sum:last-child"
    );
};