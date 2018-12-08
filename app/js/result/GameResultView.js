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

function importJSON(json) {
    let maxID = 0;
    localStorage.clear();
    for (game of json.games) {
        localStorage.setItem("game-" + game.id, JSON.stringify(game));
        if (game.id > maxID)
            maxID = game.id;
    }
    localStorage.setItem("gamesNumber", maxID);
}

/*
    reads JSON file (File object; given as a parameter) and returns its content
*/
function readJSONFile(file) {
    let reader = new FileReader();
    reader.onload = function (e) {
        let jsonString, json;
        jsonString = e.target.result;
        json = JSON.parse(jsonString);
        importJSON(json);
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
        let json, jsonString;
        if (files.length > 0) { // file were chosen
            console.log(files[0].name);
            readJSONFile(files[0]);
        } else { // file were not chosen
            console.log("Anulowano");
        }
    });

    return button;
}
