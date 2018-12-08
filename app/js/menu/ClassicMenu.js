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
        document.querySelector(".container").classList.add("container--visible", "container--" + dimension);


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
        let grh = GameResultsHelper.initialize();
        [].forEach.call(sizes, function (size) {
            let dim = size.dataset.sizeDim;
            let min = chosenRange.dataset.rangeMin;
            let max = chosenRange.dataset.rangeMax;

            let modeWinsNumber = grh.getModeWins(dim, min, max);
            let modeWinsNumberElement = size.parentElement.querySelector(".size-wins-number");
            modeWinsNumberElement.innerText = modeWinsNumber;
        });
    }

    registerRangeClickListeners();
    registerSizeClickListeners();
    setWinsNumber();
}