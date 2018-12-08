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
        // TODO
    });

    tutorialButton.addEventListener("click", function () {
        // TODO
    });

    resultsButton.addEventListener("click", function () {
        hideMainMenuButtons();
        this.addEventListener("animationend", showResultsContainer);
    });
}