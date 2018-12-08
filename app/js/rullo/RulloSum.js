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