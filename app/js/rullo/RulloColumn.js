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