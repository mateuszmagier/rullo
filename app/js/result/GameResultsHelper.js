// Singleton class

const GameResultsHelper = (function () {

    var instance = undefined; // instance of GameResultHelper

    // private vars and methods
    function init() {
        var results = []; // array of result objects (JSON)
        var resultElements = []; // array of HTML elements containing result info
        var gamesNumber = 0; // number of all games

        function fetchGamesNumber() {
            let games = localStorage.getItem("gamesNumber");
            if (games !== null)
                gamesNumber = games;
        }

        function fetchAllResults() {
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
                    }
                }
            }
        }

        function printJSON() {
            let json = "{\"games\": [";
            for (let i = 0; i < results.length - 1; i++) {
                json += JSON.stringify(results[i]) + ",";
            }
            if (results.length > 0) {
                json += JSON.stringify(results[results.length - 1]) + "]}"; // last object - without comma
                let beautifiedJSON = JSON.stringify(JSON.parse(json), null, "\t");
                console.log(beautifiedJSON);
                GameResultsHelper.jsonString = beautifiedJSON;
            } else {
                GameResultsHelper.jsonString = "";
            }
        }

        function fetchResultsFromMode(dim, min, max) {
            let modeResults = [];
            for (result of results) {
                if (result.dim == dim && result.min == min && result.max == max)
                    modeResults.push(result);
            }

            return modeResults;
        }

        fetchGamesNumber();
        fetchAllResults();
        printJSON();

        // public methods and variables
        return {
            getModeWins: function (dim, min, max) {
                let wins = 0;
                for (r of results) {
                    if (r.dim == dim && r.min == min && r.max == max && r.isWin)
                        wins++;
                }
                return wins;
            },
            getResultsView: function (dim, min, max) {
                let resultView, resultElement;
                let element = document.createElement("div");
                element.classList.add("results-group");
                element.dataset.groupName = "dim-" + dim + "-min-" + min + "-max-" + max;
                let modeResults = fetchResultsFromMode(dim, min, max); // json array

                if (modeResults.length > 0) {
                    for (let i = 0; i < modeResults.length; i++) {
                        resultView = new GameResultView(modeResults[i], i + 1);
                        resultElement = resultView.getResultElement();
                        element.appendChild(resultElement);
                    }
                } else {
                    element.innerText = "Brak rezultatów."
                }

                return element;
            }
        };

    };

    return {
        initialize: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };

})();
