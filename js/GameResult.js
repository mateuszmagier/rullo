/*,
    counter - result number of displayed results
*/
const GameResultView = function (json, counter) {
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

        // debugging
        //        element.innerText += " ||| " + model.dim + "x" + model.dim + " " + model.min + "-" + model.max;

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

        element.addEventListener("click", function () {
            let resultName = "game-" + model.id;
            console.log(resultName);
            let resultElement = this.parentElement;
            resultElement.classList.add("removed");
            localStorage.removeItem(resultName);

            resultElement.addEventListener("transitionend", function () {
                console.dir(resultElement.parentElement);
                let resultsGroup = resultElement.parentElement;
                if (resultsGroup !== null)
                    resultsGroup.removeChild(resultElement);
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
    button.classList.add("clr-button", "button");
    button.setAttribute("href", "index.html");
    button.innerText = "wyczyść wyniki";

    button.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location = this.getAttribute("href");
    });

    return button;
}

GameResultView.createExportButton = function () {
    let button = document.createElement("a");
    let file = new Blob([GameResultsHelper.jsonString], {
        type: 'text/plain'
    });
    button.classList.add("export-button", "button");
    button.setAttribute("href", URL.createObjectURL(file));
    button.setAttribute("download", "export.json");
    button.innerText = "eksportuj";

    return button;
}

/*
    reads JSON file (File object; given as a parameter) and returns its content
*/
function readJSONFile(file) {
    let reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        console.log("File contents: " + contents);
    };
    reader.readAsText(file);
}

GameResultView.createImportButton = function () {
    let button = document.createElement("div");
    button.classList.add("import-button", "button");
    let buttonInput = document.createElement("input");
    buttonInput.setAttribute("type", "file");
    buttonInput.setAttribute("accept", ".json");
    buttonInput.setAttribute("id", "file-import");
    buttonInput.classList.add("import-input");
    button.appendChild(buttonInput);
    let buttonLabel = document.createElement("label");
    buttonLabel.setAttribute("for", "file-import");
    buttonLabel.classList.add("import-label");
    buttonLabel.innerHTML = "importuj";
    button.appendChild(buttonLabel);

    // import z pliku JSON
    buttonInput.addEventListener("change", function (e) {
        let files = e.target.files;
        if (files.length > 0) { // file were chosen
            console.log(files[0].name);
            readJSONFile(files[0]);

        } else { // file were not chosen
            console.log("Anulowano");
        }
    });

    return button;
}

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
            let json = "[";
            for (let i = 0; i < results.length - 1; i++)
                json += JSON.stringify(results[i]) + ",";
            json += JSON.stringify(results[results.length - 1]) + "]"; // last object - without comma
            let beautifiedJSON = JSON.stringify(JSON.parse(json), null, "\t");
            console.log(beautifiedJSON);
            GameResultsHelper.jsonString = beautifiedJSON;
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
                let resultView, resultElement, nr = 0;
                let element = document.createElement("div");
                element.classList.add("results-group");
                element.dataset.groupName = "dim-" + dim + "-min-" + min + "-max-" + max;
                let modeResults = fetchResultsFromMode(dim, min, max); // json array

                if (modeResults.length > 0) {
                    for (let i = 0; i < modeResults.length; i++) {
                        nr++;
                        resultView = new GameResultView(modeResults[i], i + 1, nr);
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
