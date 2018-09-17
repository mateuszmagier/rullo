const MainMenu = function () {
    var mainMenuContainer = null,
        classicModeButton = null,
        endlessModeButton = null;

    var initClassicGame = function () {
        const gameContainer = document.createElement("div");
        gameContainer.classList.add("game-container");
        document.querySelector(".container").appendChild(gameContainer);
        document.querySelector(".container").classList.add("container--visible");

        let options = {

        };
        const game = new Rullo(
            document.querySelector(".game-container"),
            options
        );
    }

    mainMenuContainer = document.querySelector(".main-menu-container");
    classicModeButton = document.querySelector(".classic-mode");
    classicModeButton.addEventListener("click", function () {
        mainMenuContainer.classList.add("main-menu-container--invisible");
        initClassicGame();
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const mainMenu = MainMenu();
});
