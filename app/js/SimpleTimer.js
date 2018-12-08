var SimpleTimer = function () {
    let minsSpan, secsSpan, milisSpan;
    let mins = 0,
        secs = 0,
        milis = 0;
    let minsInterval, secsInterval, milisInterval;
    let timerElement;
    
    init();
    
    this.getElement = function() {
        return timerElement;
    };

    function prefixZero(number) {
        if (number < 10)
            return "0" + number;
        return number;
    }

    function init() {
        timerElement = document.createElement("div");
        timerElement.classList.add("timer");
        minsSpan = document.createElement("span");
        minsSpan.classList.add("mins");
        minsSpan.textContent = "00";
        secsSpan = document.createElement("span");
        secsSpan.classList.add("secs");
        secsSpan.textContent = "00";
        milisSpan = document.createElement("span");
        milisSpan.classList.add("milis");
        milisSpan.textContent = "0";
        timerElement.appendChild(minsSpan);
        timerElement.appendChild(secsSpan);
        timerElement.appendChild(milisSpan);
    }

//    minsSpan = document.querySelector(".mins");
//    secsSpan = document.querySelector(".secs");
//    milisSpan = document.querySelector(".milis");

    this.start = function () {
        milisInterval = setInterval(function () {
            milis++;
            if (milis === 10) {
                milis = 0;
            }
            milisSpan.innerText = milis;
        }, 100);

        secsInterval = setInterval(function () {
            secs++;
            if (secs === 60) {
                secs = 0;
            }
            secsSpan.innerText = prefixZero(secs);
        }, 1000);

        minsInterval = setInterval(function () {
            mins++;
            // if(milis === 10) {
            //   milis = 0;
            // }
            minsSpan.innerText = prefixZero(mins);
        }, 60000);
    };

    this.stop = function () {
        clearInterval(milisInterval);
        clearInterval(secsInterval);
        clearInterval(minsInterval);
    };
    
    this.getStringTime = function() {
        let time = "";
        time += prefixZero(mins) + ":" + prefixZero(secs) + ":" + milis;
        return time;
    }
};
