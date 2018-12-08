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