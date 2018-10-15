const GameResultView = function (json) {
    var resultElement = null,
        effectElement = null,
        timeElement = null,
        model = json;
    
    function createEffectElement() {
        let element = document.createElement("div");
        element.classList.add("result-effect");
        if(model.isWin) {
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

    function createResultElement() {
        let element = document.createElement("div");
        element.classList.add("result");
        
        // add effect
        element.appendChild(effectElement);
        //add time
        element.appendChild(timeElement);

        resultElement = element;
    };

    this.getResultElement = function () {
        return resultElement;
    }
    
    createEffectElement();
    createTimeElement();
    createResultElement();
};

/*
    creates and returns HTML element that click clears all games stats
*/
GameResultView.createClearButton = function() {
    let button = document.createElement("a");
    button.classList.add("clr-button");
    button.setAttribute("href", "index1.html");
    button.innerText = "wyczyść wyniki";
    
    button.addEventListener("click", function(e) {
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
            for (let i = 1; i <= gamesNumber; i++) {
                resultLabel = "game-" + i;
                resultString = localStorage.getItem(resultLabel);
                if (resultString !== null) {
                    result = JSON.parse(resultString);
                    results.push(result);
                    resultView = new GameResultView(result);
                    resultElement = resultView.getResultElement();
                    resultElements.push(resultElement);
                }
            }
        }
    }
    
    this.createElement = function() {
        let element = document.createElement("div");
        element.classList.add("results-group");
        [].forEach.call(resultElements, function(resultElement) {
           element.appendChild(resultElement); 
        });
        return element;
    }

    fetchGamesNumber();
    fetchResults();
}
