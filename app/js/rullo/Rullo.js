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

function prefixZero(number) {
    if (number < 10)
        return "0" + number;
    return number;
}

function formatDate(date) {
    var secs = prefixZero(date.getSeconds());
    var mins = prefixZero(date.getMinutes());
    var hours = prefixZero(date.getHours());
    var day = prefixZero(date.getDate());
    var month = prefixZero(date.getMonth() + 1);
    var year = date.getFullYear();

    return year + "/" + month + "/" + day + " " + hours + ":" + mins + ":" + secs;
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
    
    let result = {
        id: gamesNumber,
        dim: this.options.dim,
        min: this.options.min,
        max: this.options.max,
        isWin: true,
        time: this.getGameTimer().getStringTime(),
        datetime: formatDate(new Date())
    };
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
