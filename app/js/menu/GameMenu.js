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