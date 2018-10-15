/*
    id = game-id from LS label,
    counter - result number of displayed results
*/
const GameResultView = function (json, id, counter) {
    var resultElement = null,
        numberElement = null,
        effectElement = null,
        timeElement = null,
        datetimeElement = null,
        removeElement = null,
        model = json;

    function createNumberElement() {
        let element = document.createElement("div");
        element.classList.add("result-number");
        element.innerText = counter;

        numberElement = element;
    }

    function createEffectElement() {
        let element = document.createElement("div");
        element.classList.add("result-effect");
        if (model.isWin) {
            element.classList.add("win");
        } else {
            element.classList.add("defeat");
        }

        effectElement = element;
    }

    function createTimeElement() {
        let element = document.createElement("div");
        element.classList.add("result-time");
        element.innerText = model.time;

        timeElement = element;
    }

    function createDatetimeElement() {
        let element = document.createElement("div");
        element.classList.add("result-datetime");
        if (model.datetime !== undefined)
            element.innerText = model.datetime;
        else
            element.innerText = "???";
        
        datetimeElement = element;
    }
    
    function createRemoveElement() {
        let element = document.createElement("i");
        element.classList.add("result-remove", "far", "fa-trash-alt");
        
        element.addEventListener("click", function() {
            let resultName = "game-" + id;
            let resultElement = this.parentElement;
            resultElement.classList.add("removed");
            localStorage.removeItem(resultName);
            
            resultElement.addEventListener("transitionend", function() {
                resultElement.parentElement.removeChild(resultElement);
            });
            
        });
        
        removeElement = element;
    }

    function createResultElement() {
        let element = document.createElement("div");
        element.classList.add("result");

        // add number
        element.appendChild(numberElement);
        // add effect
        element.appendChild(effectElement);
        // add time
        element.appendChild(timeElement);
        // add datetime
        element.appendChild(datetimeElement);
        // add remove button
        element.appendChild(removeElement);

        resultElement = element;
    };

    this.getResultElement = function () {
        return resultElement;
    }

    createNumberElement();
    createEffectElement();
    createTimeElement();
    createDatetimeElement();
    createRemoveElement();
    createResultElement();
};

/*
    creates and returns HTML element that click clears all games stats
*/
GameResultView.createClearButton = function () {
    let button = document.createElement("a");
    button.classList.add("clr-button");
    button.setAttribute("href", "index1.html");
    button.innerText = "wyczyść wyniki";

    button.addEventListener("click", function (e) {
        e.preventDefault();
    });

    return button;
}

const GameResultsHelper = function () {

    var results = []; // array of result objects (JSON)
    var resultElements = []; // array of HTML elements containing result info
    var gamesNumber = 0; // number of all games

    function fetchGamesNumber() {
        let games = localStorage.getItem("gamesNumber");
        if (games !== null)
            gamesNumber = games;
    }

    function fetchResults() {
        if (gamesNumber > 0) { // there are game(s) results saved in LS
            let result; // result object (JSON)
            let resultView; // GameResultView object
            let resultLabel; // label of result in LS: game-X
            let resultString; // result fetched from LS in String format
            let resultElement; // HTML element containing result info
            let nr = 0;
            for (let i = 1; i <= gamesNumber; i++) {
                resultLabel = "game-" + i;
                resultString = localStorage.getItem(resultLabel);
                if (resultString !== null) {
                    nr++;
                    result = JSON.parse(resultString);
                    results.push(result);
                    resultView = new GameResultView(result, i, nr);
                    resultElement = resultView.getResultElement();
                    resultElements.push(resultElement);
                }
            }
        }
    }

    this.createElement = function () {
        let element = document.createElement("div");
        element.classList.add("results-group");
        [].forEach.call(resultElements, function (resultElement) {
            element.appendChild(resultElement);
        });
        return element;
    }

    fetchGamesNumber();
    fetchResults();
}
