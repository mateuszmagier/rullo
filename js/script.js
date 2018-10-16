const GameMenu = function () {
    var menuElement = null,
        game = null,
        homeButton = null,
        resetButton = null;

    this.setGame = function (newGame) {
        game = newGame;
    }

    function init() {
        menuElement = document.createElement("div");
        menuElement.classList.add("game-menu");
        homeButton = document.createElement("a");
        homeButton.classList.add("fas", "fa-home", "menu-button");
        homeButton.setAttribute("href", "index.html");
        resetButton = document.createElement("i");
        resetButton.classList.add("fas", "fa-sync-alt", "menu-button");

        resetButton.addEventListener("click", function () {
            game.reset();
        });

        menuElement.appendChild(homeButton);
        menuElement.appendChild(resetButton);
    }

    init();

    this.getElement = function () {
        return menuElement;
    }
}

var ClassicMenu = function () {
    var classicMenu = null,
        rulloLogo = null,
        ranges = null,
        chosenRange = null,
        chosenRangeIndex = 1,
        chosenRangeText = "1-9",
        choseRangeLine = null,
        sizes = null,
        chosenSize = null,
        chosenSizeText = "";

    var initClassicGame = function (dimension, minimum, maximum) {
        const simpleTimer = new SimpleTimer();
        const gameContainer = document.createElement("div");
        gameContainer.classList.add("game-container");
        const gameMenuContainer = document.createElement("div");
        gameMenuContainer.classList.add("game-menu-container");
        gameMenuContainer.appendChild(simpleTimer.getElement());
        const gameMenu = new GameMenu(this);
        gameMenuContainer.appendChild(gameMenu.getElement());

        document.querySelector(".container").appendChild(gameContainer);
        document.querySelector(".container").appendChild(gameMenuContainer);
        document.querySelector(".container").classList.add("container--visible");


        let options = {
            dim: dimension,
            min: minimum,
            max: maximum
        };
        const game = new Rullo(
            document.querySelector(".game-container"),
            simpleTimer,
            options
        );

        gameMenu.setGame(game);
    }

    function hideMenuContainer() {
        menuContainer.classList.add("menu-container--invisible");
        //        initClassicGame();
    }

    classicMenu = document.querySelector(".classic-menu");
    rulloLogo = document.querySelector(".rullo-logo");
    ranges = classicMenu.querySelectorAll(".range");
    chosenRange = classicMenu.querySelector(".range--chosen");
    choseRangeLine = classicMenu.querySelector(".chosen-range-line");
    sizes = classicMenu.querySelectorAll(".size");

    function registerRangeClickListeners() {
        [].forEach.call(ranges, function (range) {
            range.addEventListener("click", function () {
                //                let newChosenRange = this;
                if (chosenRange !== this) { // range change
                    let newChosenRangeIndex = this.dataset.rangeIndex;
                    choseRangeLine.classList.remove("chosen-range-line-" + chosenRangeIndex);
                    chosenRangeIndex = newChosenRangeIndex;
                    choseRangeLine.classList.add("chosen-range-line-" + chosenRangeIndex);

                    chosenRange.classList.remove("range--chosen");
                    chosenRange = this;
                    chosenRangeText = chosenRange.innerText;
                    chosenRange.classList.add("range--chosen");

                    setWinsNumber();
                }
            });
        });
    }

    function registerSizeClickListeners() {
        [].forEach.call(sizes, function (size) {
            size.addEventListener("click", function () {
                let dim, min, max;
                chosenSize = this;
                chosenSizeText = chosenSize.innerText;
                console.log("Wybrane ustawienia: RANGE: " + chosenRangeText + ", SIZE: " + chosenSizeText);
                dim = parseInt(this.dataset.sizeDim);
                min = parseInt(chosenRange.dataset.rangeMin);
                max = parseInt(chosenRange.dataset.rangeMax);
                console.log("DIM: " + dim + ", MIN: " + min + ", MAX: " + max);
                rulloLogo.classList.add("rullo-logo--invisible");
                classicMenu.classList.add("classic-menu--fadeOut");
                rulloLogo.addEventListener("animationend", function () {
                    document.querySelector(".menu-container").classList.add("menu-container--invisible");
                    initClassicGame(dim, min, max);
                });
            });
        });
    }

    function setWinsNumber() {
        [].forEach.call(sizes, function (size) {
            let dim = size.dataset.sizeDim;
            let min = chosenRange.dataset.rangeMin;
            let max = chosenRange.dataset.rangeMax;

            let modeName = "dim-" + dim + "-min-" + min + "-max-" + max;
            let modeWinsNumber = localStorage.getItem(modeName);
            if (modeWinsNumber === null)
                modeWinsNumber = 0;
            let modeWinsNumberElement = size.parentElement.querySelector(".size-wins-number");
            modeWinsNumberElement.innerText = modeWinsNumber;
        });
    }

    registerRangeClickListeners();
    registerSizeClickListeners();
    setWinsNumber();
}

const ResultsMenu = function () {
    var resultsContainer = document.querySelector(".results-container"),
        gameResultsHelper = new GameResultsHelper(),
        ranges = resultsContainer.querySelectorAll(".range"),
        sizes = resultsContainer.querySelectorAll(".size"),
        chosenRange = resultsContainer.querySelector(".range--chosen"),
        chosenSize = resultsContainer.querySelector(".size--chosen"),
        chosenRangeBg = resultsContainer.querySelector(".chosen-range-bg"),
        chosenSizeBg = resultsContainer.querySelector(".chosen-size-bg"),
        chosenGroup = null;
    //        chosenGroup = resultsContainer.querySelector("[data-group-name=\"dim-5-min-1-max-9\"]");

    function loadAllResultsGroups() {
        let resultsGroup;
        let resultsGroupsWrapper = document.createElement("div");
        resultsGroupsWrapper.classList.add("results-groups-wrapper");
        let allDimensions = [5, 6, 7, 8];
        let allRanges = [
            {
                min: 1,
                max: 9
            },
            {
                min: 1,
                max: 19
            },
            {
                min: 2,
                max: 4
            }
        ];
        for (dim of allDimensions) {
            for (range of allRanges) {
                resultsGroup = gameResultsHelper.getResultsView(dim, range.min, range.max);
                resultsGroupsWrapper.appendChild(resultsGroup);
            }
        }
        resultsContainer.appendChild(resultsGroupsWrapper);
    }

    function updateActiveGroup() {
        let dim = chosenSize.dataset.sizeDim;
        let min = chosenRange.dataset.rangeMin;
        let max = chosenRange.dataset.rangeMax;
        let groupName = "dim-" + dim + "-min-" + min + "-max-" + max;

        // remove chosen class from previously chosen group
        let chosenGroup = resultsContainer.querySelector(".results-group--chosen");
        if (chosenGroup !== null) {
            chosenGroup.classList.remove("results-group--chosen");
        }

        chosenGroup = resultsContainer.querySelector("[data-group-name=\"" + groupName + "\"]");
        chosenGroup.classList.add("results-group--chosen");
    }

    // range click event listeners
    [].forEach.call(ranges, function (range) {
        range.addEventListener("click", function () {
            if (this !== chosenRange) { // range change
                chosenRangeBg.classList.remove("chosen-range-bg-" + chosenRange.dataset.rangeIndex);
                chosenRange = this;
                chosenRangeBg.classList.add("chosen-range-bg-" + chosenRange.dataset.rangeIndex);
                updateActiveGroup();
            }
        });
    });

    // size click event listeners
    [].forEach.call(sizes, function (size) {
        size.addEventListener("click", function () {
            if (this !== chosenSize) { // size change
                chosenSizeBg.classList.remove("chosen-size-bg-" + chosenSize.dataset.sizeIndex);
                chosenSize = this;
                chosenSizeBg.classList.add("chosen-size-bg-" + chosenSize.dataset.sizeIndex);
                updateActiveGroup();
            }
        });
    });

    loadAllResultsGroups();
    updateActiveGroup();

    let buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    buttonsContainer.appendChild(GameResultView.createClearButton());
    buttonsContainer.appendChild(GameResultView.createExportButton());
    buttonsContainer.appendChild(GameResultView.createImportButton());
    resultsContainer.insertBefore(buttonsContainer, resultsContainer.querySelector(".results-menu"));
    resultsContainer.classList.remove("invisible");
};


const MainMenu = function () {
    var menuContainer = null,
        mainMenu = null,
        rulloLogo = null,
        classicModeButton = null,
        classicMenu = null,
        endlessModeButton = null,
        tutorialButton = null,
        resultsButton = null,
        resultsMenu = null;

    var initEndlessGame = function () {

    }

    menuContainer = document.querySelector(".menu-container");
    mainMenu = document.querySelector(".main-menu");
    rulloLogo = document.querySelector(".rullo-logo");
    classicModeButton = document.querySelector(".classic-mode");
    classicMenu = document.querySelector(".classic-menu");
    endlessModeButton = document.querySelector(".endless-mode");
    tutorialButton = document.querySelector(".tutorial");
    resultsButton = document.querySelector(".results");

    function showClassicMenu() {
        mainMenu.classList.add("main-menu--invisible");
        classicMenu.classList.remove("classic-menu--invisible");
    }

    function hideMenuContainer() {
        menuContainer.classList.add("menu-container--invisible");
        //        initClassicGame();
    }

    function showResultsContainer() {
        mainMenu.classList.add("main-menu--invisible");
        resultsMenu = new ResultsMenu();
    }

    function hideMainMenuButtons() {
        endlessModeButton.classList.add("main-menu-item--invisible");
        tutorialButton.classList.add("main-menu-item--invisible");
        resultsButton.classList.add("main-menu-item--invisible");
        classicModeButton.classList.add("main-menu-item--invisible");
    }

    classicModeButton.addEventListener("click", function () {
        hideMainMenuButtons();
        this.addEventListener("animationend", showClassicMenu); // hide main menu when animation is done
    });

    endlessModeButton.addEventListener("click", function () {
        rulloLogo.classList.add("rullo-logo--invisible");
        hideMainMenuButtons();
        this.addEventListener("animationend", initEndlessGame); // hide main menu container when animation is done
    });

    tutorialButton.addEventListener("click", function () {
        hideMainMenuButtons();
    });

    resultsButton.addEventListener("click", function () {
        hideMainMenuButtons();
        this.addEventListener("animationend", showResultsContainer);
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const mainMenu = new MainMenu();
    const classicMenu = new ClassicMenu();
});
