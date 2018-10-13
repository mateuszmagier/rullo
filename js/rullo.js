/*
    ============
    RulloSum
    ============
*/

let RulloSum = function (targetSum, currentSum) {
    var targetSum = targetSum,
        targetSumElement = null,
        currentSum = currentSum,
        currentSumElement = null,
        sumElement = null,
        completed = false,
        locked = false;

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
        this.setCompleted(this.compare());
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

    this.isCompleted = function () {
        return completed;
    }

    this.setCompleted = function (bool) {
        completed = bool;
    }

    this.isLocked = function () {
        return locked;
    }

    this.setLocked = function (bool) {
        locked = bool;
    }

    this.compare = function () {
        return currentSum === targetSum;
    }

    this.setCompleted(this.compare());


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

    this.getRulloColumn = function () {
        return rulloColumn;
    }

    this.setRulloColumn = function (newRulloColumn) {
        rulloColumn = newRulloColumn;
    }

    this.createBallElement();
    this.addMouseEvents();
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
    click event for ball
*/
RulloBall.prototype.onClick = function () {
    let ball = this.getBallElement();
    if (ball.classList.contains("ball--on")) { // click on enabled ball
        ball.classList.remove("ball--on");
        ball.classList.add("ball--off");
        this.setEnabled(false);
    } else { // click on disabled ball
        ball.classList.remove("ball--off");
        ball.classList.add("ball--on");
        this.setEnabled(true);
    }

    // update current sum in row
    row = this.getRulloRow();
    if (row !== null) {
        row.countCurrentSum();
        row.updateCurrentSum();
    }

    // update current sum in row and column
    col = this.getRulloColumn();
    if (col !== null) {
        col.countCurrentSum();
        col.updateCurrentSum();
    }
}

/*
    registers mouse events for ball - click and long press
*/
RulloBall.prototype.addMouseEvents = function () {
    let row = null,
        col = null,
        longPress = false, // flag
        timeout,
        requiredHoldingTime = 500; // long press time

    let ballElem = this.getBallElement();

    ballElem.addEventListener("mousedown", function () {
        timeout = setTimeout(function () { // detect long press
            if (this.isLocked()) { // unlock ball
                ballElem.classList.remove("ball--locked");
                this.setLocked(false);
            } else { // lock ball
                console.log(JSON.stringify(this));
                ballElem.classList.add("ball--locked");
                this.setLocked(true);
            }
            longPress = true; // set long press flag
        }.bind(this), requiredHoldingTime);
    }.bind(this));

    ballElem.addEventListener("mouseup", function () {
        clearTimeout(timeout);
        if (!longPress && !this.isLocked()) { // if press time was short and ball isn't locked
            this.onClick();
        }
        longPress = false;
    }.bind(this));
}

RulloBall.prototype.reset = function () {
    this.getBallElement().classList.remove("ball--off");
    this.getBallElement().classList.add("ball--on");
    this.getBallElement().classList.remove("ball--locked");
    this.setEnabled(true);
    this.setLocked(false);
}

RulloBall.prototype.toJSON = function () {
    return "Jestem JSONem";
}


/*
    ============
    RulloRow
    ============
*/

let RulloRow = function (numbersArray) {
    // private members
    var numbers = numbersArray,
        targetNumbers = [],
        totalRowSum = -1, // total sum of all balls
        currentRowSum = -1, // current sum of enabled balls in row
        targetRowSum = -1, // target sum of enabled balls in row
        rowElement = null, // HTML element containing balls and sums
        balls = [], // array of RulloBall objects
        sum; // RulloSum object

    // getters and setters for private members
    this.getNumber = function (index) {
        return numbers[index];
    }

    this.getNumbers = function () {
        return numbers;
    }

    this.getTargetNumbers = function () {
        return targetNumbers;
    }

    this.setTargetNumbers = function (newTargetNumbers) {
        targetNumbers = newTargetNumbers;
    }

    this.getTargetNumber = function (index) {
        return targetNumbers[index];
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

    this.getSum = function () {
        return sum;
    }

    this.setSum = function (newSum) {
        sum = newSum;
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
        if (ball.isEnabled())
            sum += ball.getNumber();
    }
    this.setCurrentRowSum(sum);
}

/*
    updates current sum HTML elements in row
*/
RulloRow.prototype.updateCurrentSum = function () {
    this.getSum().setCurrentSum(this.getCurrentRowSum()); // update current sum in RulloSum object
    let completed = this.getSum().isCompleted();

    let currentRowSums = this.getRowElement().querySelectorAll(".sum--current");
    for (let currentRowSum of currentRowSums) {
        console.log("update");
        currentRowSum.querySelector(".sum__number").innerText = this.getCurrentRowSum();
        if (completed) {
            currentRowSum.parentElement.classList.add("sum--completed");
        } else {
            this.getSum().setLocked(false);
            currentRowSum.parentElement.classList.remove("sum--completed");
        }
    }
}

RulloRow.prototype.addLongClickEvent = function (targetSumElement) {
    let timeout, requiredHoldingTime = 500;
    let rulloSum = this.getSum();
    targetSumElement.addEventListener("mousedown", function () {
        timeout = setTimeout(function () { // detect long press
            if (rulloSum.isCompleted()) {
                console.log("Suma kompletna");
                if (rulloSum.isLocked()) { // user is unlocking balls in row
                    [].forEach.call(this.getBalls(), function (ball) {
                        ball.setLocked(false);
                        ball.getBallElement().classList.remove("ball--locked");
                        rulloSum.setLocked(false);
                    });
                } else { // user is locking all balls in row
                    [].forEach.call(this.getBalls(), function (ball) {
                        ball.setLocked(true);
                        ball.getBallElement().classList.add("ball--locked");
                        rulloSum.setLocked(true);
                    });
                }
            } else {
                console.log("Suma niekompletna");
            }
        }.bind(this), requiredHoldingTime);
    }.bind(this));

    targetSumElement.addEventListener("mouseup", function () {
        clearTimeout(timeout);
    });
};

/*
    creates and returns HTML element of row containing balls and sums
*/
RulloRow.prototype.createRowElement = function () {
    let rulloBall, number;
    let rulloSum, sumElementLeft, sumElementRight;
    let timeout, requiredHoldingTime = 500;
    let row = document.createElement("div");
    row.classList.add("row");
    rulloSum = new RulloSum(this.getTargetRowSum(), this.getCurrentRowSum());

    this.setSum(rulloSum);

    this.addLongClickEvent(rulloSum.getTargetSumElement());

    sumElementLeft = rulloSum.getSumElement();
    row.appendChild(sumElementLeft);
    for (let i = 0; i < this.getNumbers().length; i++) {
        rulloBall = new RulloBall(this.getNumber(i)); // RulloBall object
        rulloBall.setRulloRow(this);
        this.addBall(rulloBall); // add ball to array
        row.appendChild(rulloBall.getBallElement());
    }
    sumElementRight = sumElementLeft.cloneNode(true);
    let rightTargetSum = sumElementRight.querySelector(".sum--target");

    this.addLongClickEvent(rightTargetSum);

    row.appendChild(sumElementRight);
    this.setRowElement(row);
};

/*
    changes value of n random elements of array to zero and returns modified array
*/
function ignoreRandomBalls(array, n) {
    let length = array.length;
    let index; // index to ignore
    let ignoredIndexes = [];
    let modifiedArray = array.slice(0);
    for (let i = 0; i < n; i++) {
        do {
            index = Math.floor(Math.random() * length); // random index
        }
        while (ignoredIndexes.includes(index)); // ignored indexes must be unique
        ignoredIndexes.push(index);
    }

    for (let j = 0; j < ignoredIndexes.length; j++) { // reset all elements under ignored indexed
        modifiedArray[ignoredIndexes[j]] = 0;
    }

    console.log(ignoredIndexes);
    return modifiedArray;
}

function sumArrayElements(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++)
        sum += array[i];
    return sum;
}

RulloRow.prototype.generateTargetRowSum = function () {
    let dim = this.getNumbers().length;
    let targetNumbers, targetSum;
    let ballsToIgnore = Math.floor(Math.random() * (dim - 2) + 1); // number of numbers to ignore in target sum - [1,dim-2]
    console.log("Ignoruję " + ballsToIgnore + "/" + dim);
    targetNumbers = ignoreRandomBalls(this.getNumbers(), ballsToIgnore);
    this.setTargetNumbers(targetNumbers);
    console.log(this.getNumbers(), "---->", targetNumbers);
    targetSum = sumArrayElements(targetNumbers);
    console.log("Target: " + targetSum + "/" + this.getTotalRowSum());
    this.setTargetRowSum(targetSum);
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
        column = [], // all numbers in column
        targetColumnSum = -1, // target sum of "on" balls in column
        totalColumnSum = -1, // total sum of all balls in column
        sum = null, // RulloSum object
        topSumElement = null, // HTML sum element in top row
        bottomSumElement = null; // HTML sum element in bottom row

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

    this.getSum = function () {
        return sum;
    }

    this.setSum = function (newSum) {
        sum = newSum;
    }

    this.getTopSumElement = function () {
        return topSumElement;
    }

    this.setTopSumElement = function (newTopSumElement) {
        topSumElement = newTopSumElement;
    }

    this.getBottomSumElement = function () {
        return bottomSumElement;
    }

    this.setBottomSumElement = function (newBottomSumElement) {
        bottomSumElement = newBottomSumElement;
    }

    this.initColumnArray();

    // creates sum element for this column
    let rulloSum = new RulloSum(this.getTargetColumnSum(), this.getCurrentColumnSum());

    this.setSum(rulloSum);
    let sumElement = rulloSum.getSumElement();
    this.setTopSumElement(sumElement);
    this.setBottomSumElement(sumElement.cloneNode(true));

    this.addLongClickEventsForSum();
};

/*
    creates column array using rows array, and calculates current sum in column
*/
RulloColumn.prototype.initColumnArray = function () {
    let number, targetNumber, ball, sum = 0,
        targetSum = 0;
    for (let i = 0; i < this.getRowsArray().length; i++) {
        ball = this.getRowArray(i).getBall(this.getIndex());
        ball.setRulloColumn(this);
        number = this.getRowArray(i).getNumber(this.getIndex());
        targetNumber = this.getRowArray(i).getTargetNumber(this.getIndex());
        sum += number;
        targetSum += targetNumber;
        this.addNumberToColumn(number);
    }
    this.setCurrentColumnSum(sum);
    this.setTargetColumnSum(targetSum);
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
        if (ball.isEnabled()) {
            sum += ball.getNumber();
        }
    }
    this.setCurrentColumnSum(sum);
}

/*
    updates current sum HTML elements in column
*/
RulloColumn.prototype.updateCurrentSum = function () {
    let sumElem;
    this.getSum().setCurrentSum(this.getCurrentColumnSum()); // update current sum in RulloSum object
    let completed = this.getSum().isCompleted();
    let sumRows = document.querySelectorAll(".row:first-child, .row:last-child");
    for (let sumRow of sumRows) {
        sumElem = sumRow.querySelectorAll(".sum")[this.getIndex()];
        sumElem.querySelector(".sum--current .sum__number").innerText = this.getCurrentColumnSum();
        if (completed) {
            sumElem.classList.add("sum--completed");
        } else {
            sumElem.classList.remove("sum--completed");
        }
    }
}

RulloColumn.prototype.addLongClickEvent = function (targetElement) {
    let timeout, requiredHoldingTime = 500;

    targetElement.addEventListener("mousedown", function () {
        console.log("mousedown");
        timeout = setTimeout(function () {
            console.log("long");
            if (this.getSum().isCompleted()) {
                console.log("Suma kompletna");
                if (this.getSum().isLocked()) { // user is unlocking balls in column
                    [].forEach.call(this.getRowsArray(), function (row) {
                        row.getBall(this.getIndex()).setLocked(false);
                        row.getBall(this.getIndex()).getBallElement().classList.remove("ball--locked");
                        this.getSum().setLocked(false);
                    }.bind(this));
                } else { // user is locking all balls in column
                    [].forEach.call(this.getRowsArray(), function (row) {
                        row.getBall(this.getIndex()).setLocked(true);
                        row.getBall(this.getIndex()).getBallElement().classList.add("ball--locked");
                        this.getSum().setLocked(true);
                    }.bind(this));
                }
            } else {
                console.log("Suma niekompletna");
            }
        }.bind(this), requiredHoldingTime);
    }.bind(this));

    targetElement.addEventListener("mouseup", function () {
        console.log("mouseup");
        clearTimeout(timeout);
    });
}

RulloColumn.prototype.addLongClickEventsForSum = function () {
    let topTargetSum = this.getTopSumElement().querySelector(".sum--target");
    let bottomTargetSum = this.getBottomSumElement().querySelector(".sum--target");
    this.addLongClickEvent(topTargetSum);
    this.addLongClickEvent(bottomTargetSum);
}

/*
    ============
    Rullo
    ============
*/

let Rullo = function (container, timer, options) {
    var gameContainer = container, // HTML element which is a game container
        gameTimer = timer, // SimpleTimer object
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

    this.getGameTimer = function () {
        return gameTimer;
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
    setTimeout(function () {
        gameTimer.start();
    }, 800); // game container opacity animation duration is 800ms
};

/*
    generates random numbers from range and fill array of RulloRow objects
*/
Rullo.prototype.initRows = function () {
    let min = this.options.min;
    let max = this.options.max;
    console.log("INITROWS " + min + " " + max);
    let randomNumber, rulloRow;
    let row = "";
    for (let i = 1; i <= this.options.dim; i++) {
        let arr = [];
        for (let j = 1; j <= this.options.dim; j++) {
            randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
            console.log("RANDOMNUMBER " + randomNumber + " MIN " + min + " MAX " + max);
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
    checks if sum in every column is completed at the beginning of game
*/
Rullo.prototype.checkColumnSums = function () {
    for (let col of this.getColumns()) {
        let completed = col.getSum().isCompleted();
        let sumRows = document.querySelectorAll(".row:first-child, .row:last-child");
        for (let sumRow of sumRows) {
            sumElem = sumRow.querySelectorAll(".sum")[col.getIndex()];
            if (completed) {
                sumElem.classList.add("sum--completed");
            } else {
                sumElem.classList.remove("sum--completed");
            }
        }
    }
};

/*
    checks if game is completed
*/
Rullo.prototype.checkGameState = function () {
    for (let row of this.getRows()) {
        if (!row.getSum().isCompleted()) { // incomplete sum in row
            return false;
        }
    }
    for (let col of this.getColumns()) {
        if (!col.getSum().isCompleted()) { // incomplete sum in column
            return false;
        }
    }
    return true;
}

/*
    update games counter, update game mode wins counter, save game result
*/
Rullo.prototype.saveGameResult = function () {
    // increment number of games
    let gamesNumber = localStorage.getItem("gamesNumber");
    if (gamesNumber === null)
        gamesNumber = 0;
    localStorage.setItem("gamesNumber", ++gamesNumber);
    
    // increment number of wins in current game mode
    let mode = "dim-" + this.options.dim + "-min-" + this.options.min + "-max-" + this.options.max;
    let modeWinsNumber = localStorage.getItem(mode);
    if(modeWinsNumber === null)
        modeWinsNumber = 0;
    ++modeWinsNumber;
    localStorage.setItem(mode, modeWinsNumber);
    
    // save game result
    let result = new RulloResult(this.options.dim,
        this.options.min,
        this.options.max,
        true,
        this.getGameTimer().getStringTime());
    console.log(result);
    console.log(JSON.stringify(result));
    localStorage.setItem("game-" + gamesNumber, JSON.stringify(result));
}

Rullo.prototype.registerBallsListeners = function () {
    let balls = document.querySelectorAll(".ball");
    for (let ball of balls) {
        ball.addEventListener("click", function () {
            if (this.checkGameState()) {
                this.getGameTimer().stop();
                setTimeout(function () {
                    console.log(this.getGameTimer().getStringTime());
                    this.showResultPopup(this.getGameTimer().getStringTime());
                    this.saveGameResult();
                }.bind(this), 300);
            }
        }.bind(this));
    }
}

/*
    creates content of row containing sums
*/
Rullo.prototype.createSumRow = function (isTop) {
    let row = document.createElement("div");
    row.classList.add("row");
    if (isTop) {
        for (let i = 0; i < this.getColumns().length; i++) {
            sumElement = this.getColumn(i).getTopSumElement();
            row.appendChild(sumElement);
        }
    } else {
        for (let i = 0; i < this.getColumns().length; i++) {
            sumElement = this.getColumn(i).getBottomSumElement();
            row.appendChild(sumElement);
        }
    }
    return row;
};

/*
    creates HTML elements for balls (and rows) and adds them to the game container
*/
Rullo.prototype.initGameContainer = function () {
    let row, col, sumElementTop, sumElementBottom, ball;
    let topSumRow, bottomSumRow;

    // add top sum row
    topSumRow = this.createSumRow(true);
    this.getGameContainer().appendChild(topSumRow);

    // add rows containing balls
    for (let i = 0; i < this.getRows().length; i++) {
        this.getGameContainer().appendChild(this.getRow(i).getRowElement());
    }

    // add bottom sum row
    bottomSumRow = this.createSumRow(false);
    this.getGameContainer().appendChild(bottomSumRow);

    this.checkColumnSums();
    this.registerBallsListeners();

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

Rullo.prototype.reset = function () {
    console.log("reset");

    // reset balls
    [].forEach.call(this.getRows(), function (row) {
        for (let ball of row.getBalls()) {
            ball.reset();
        }

        // reset rows
        row.countCurrentSum();
        row.updateCurrentSum();
        row.getSum().setLocked(false);
    });

    // reset columns
    [].forEach.call(this.getColumns(), function (col) {
        col.countCurrentSum();
        col.updateCurrentSum();
    });
}

Rullo.prototype.showResultPopup = function (time) {
    let resultContainer = document.createElement("div");
    resultContainer.classList.add("result-container");
    let resultPopup = document.createElement("div");
    resultPopup.classList.add("result-popup");
    let resultMessage = document.createElement("div");
    resultMessage.classList.add("result-message");
    resultMessage.innerText = "Gratulacje! Twój wynik:";
    let resultTime = document.createElement("div");
    resultTime.classList.add("result-time");
    resultTime.innerText = time;
    let resultMenu = document.createElement("div");
    resultMenu.classList.add("result-menu");
    let homeButton = document.createElement("a");
    homeButton.classList.add("fas", "fa-home", "menu-button");
    homeButton.setAttribute("href", "index.html");
    let saveButton = document.createElement("i");
    saveButton.classList.add("fas", "fa-save", "menu-button");
    saveButton.addEventListener("click", function () {
        console.log("save result");
    });
    resultMenu.appendChild(homeButton);
    resultMenu.appendChild(saveButton);
    resultPopup.appendChild(resultMessage);
    resultPopup.appendChild(resultTime);
    resultPopup.appendChild(resultMenu);
    resultContainer.appendChild(resultPopup);
    document.querySelector("body").appendChild(resultContainer);
}
