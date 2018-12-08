const ResultsMenu = function () {
    var resultsContainer = document.querySelector(".results-container"),
        gameResultsHelper = GameResultsHelper.initialize(),
        ranges = resultsContainer.querySelectorAll(".range"),
        sizes = resultsContainer.querySelectorAll(".size"),
        chosenRange = resultsContainer.querySelector(".range--chosen"),
        chosenSize = resultsContainer.querySelector(".size--chosen"),
        chosenRangeBg = resultsContainer.querySelector(".chosen-range-bg"),
        chosenSizeBg = resultsContainer.querySelector(".chosen-size-bg"),
        chosenGroup = null;

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