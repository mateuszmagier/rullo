const MainMenu = function () {
    var menuContainer = null,
        mainMenu = null,
        rulloLogo = null,
        classicModeButton = null,
        classicMenu = null,
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

    menuContainer = document.querySelector(".menu-container");
    mainMenu = document.querySelector(".main-menu");
    rulloLogo = document.querySelector(".rullo-logo");
    classicModeButton = document.querySelector(".classic-mode");
    classicMenu = document.querySelector(".classic-menu");
    endlessModeButton = document.querySelector(".endless-mode");
    
    function hideMainMenu() {
        mainMenu.classList.add("main-menu--invisible");
        classicMenu.classList.remove("classic-menu--invisible");
    }
    
    function hideMenuContainer() {
        menuContainer.classList.add("menu-container--invisible");
        initClassicGame();
    }
    
    classicModeButton.addEventListener("click", function () {
        this.classList.add("classic-mode--invisible");
        endlessModeButton.classList.add("endless-mode--invisible");
        
        this.addEventListener("animationend", hideMainMenu); // hide main menu when animation is done
//        initClassicGame();
    });
    
    endlessModeButton.addEventListener("click", function () {
        this.classList.add("endless-mode--invisible");
        classicModeButton.classList.add("classic-mode--invisible");
        rulloLogo.classList.add("rullo-logo--invisible");
        
        this.addEventListener("animationend", hideMenuContainer); // hide main menu container when animation is done
//        initClassicGame();
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const mainMenu = MainMenu();
});
