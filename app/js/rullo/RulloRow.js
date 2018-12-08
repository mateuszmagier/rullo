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