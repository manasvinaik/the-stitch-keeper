/* =========================================================
   THE STITCH KEEPER
   Counter Logic
========================================================= */

const MAX_HISTORY_LENGTH = 32;

const PIP_WINDOW_SIZE = {
    width: 300,
    height: 190
};




/* =========================================================
   COUNTER CLASS
========================================================= */

class Counter {

    constructor(elementId, storageKey) {

        this.element = document.getElementById(elementId);
        this.storageKey = storageKey;

        this.count = Number(
            localStorage.getItem(storageKey) || 0
        );

        this.history = [];

        this.render();
    }


    render() {
        this.element.textContent = this.count;
    }


    set(value) {

        this.history.push(this.count);

        if (this.history.length > MAX_HISTORY_LENGTH) {
            this.history.shift();
        }

        this.count = Math.max(0, Number(value));

        localStorage.setItem(
            this.storageKey,
            this.count
        );

        this.render();
    }


    increase() {
        this.set(this.count + 1);
    }


    undo() {

        if (!this.history.length) {
            return;
        }

        this.count = this.history.pop();

        localStorage.setItem(
            this.storageKey,
            this.count
        );

        this.render();
    }
}


/* =========================================================
   COUNTERS
========================================================= */

const stitchesCounter = new Counter(
    "stitches-counter",
    "stitches"
);

const rowsCounter = new Counter(
    "rows-counter",
    "rows"
);


/* =========================================================
   INPUTS
========================================================= */

const stitchesInput =
    document.getElementById("input-stitches");

const autoIncreaseInput =
    document.getElementById("input-autoincrease");


stitchesInput.value =
    localStorage.getItem("input_stitches") || 170;

autoIncreaseInput.checked =
    localStorage.getItem("input_autoincrease") === "true";


/* =========================================================
   STITCH LOGIC
========================================================= */

function increaseStitch() {

    const stitchesPerRow =
        Number(stitchesInput.value);


    if (
        autoIncreaseInput.checked &&
        stitchesPerRow > 0 &&
        stitchesCounter.count + 1 >= stitchesPerRow
    ) {

        rowsCounter.increase();

        stitchesCounter.set(0);

        return;
    }


    stitchesCounter.increase();
}


function increaseRow() {

    rowsCounter.increase();

    stitchesCounter.set(0);
}


/* =========================================================
   RESET
========================================================= */

function resetCounters() {

    rowsCounter.set(0);

    stitchesCounter.set(0);
}


/* =========================================================
   UNDO
========================================================= */

function undoCounters() {

    rowsCounter.undo();

    stitchesCounter.undo();
}


/* =========================================================
   EDIT VALUES
========================================================= */

function editValues() {

    const stitches =
        Number(
            prompt(
                "Stitches:",
                stitchesCounter.count
            )
        );

    const rows =
        Number(
            prompt(
                "Rows:",
                rowsCounter.count
            )
        );


    if (!Number.isNaN(stitches)) {
        stitchesCounter.set(stitches);
    }

    if (!Number.isNaN(rows)) {
        rowsCounter.set(rows);
    }
}


/* =========================================================
   PROJECT NAME
========================================================= */

const projectDisplay =
    document.getElementById("display-name");


projectDisplay.addEventListener("click", () => {

    const currentName =
        projectDisplay.textContent.trim();

    const newName =
        prompt(
            "Enter project name:",
            currentName
        );

    if (newName !== null) {

        projectDisplay.textContent =
            newName.trim() || "Nothing! (Edit this)";
    }
});


/* =========================================================
   SAVE SETTINGS
========================================================= */

stitchesInput.addEventListener("change", () => {

    let value = Number(stitchesInput.value);

    if (value < 1 || Number.isNaN(value)) {
        value = 1;
    }

    stitchesInput.value = value;

    localStorage.setItem(
        "input_stitches",
        value
    );
});


autoIncreaseInput.addEventListener("change", () => {

    localStorage.setItem(
        "input_autoincrease",
        autoIncreaseInput.checked
    );
});


/* =========================================================
   BUTTON EVENTS
========================================================= */

document
    .getElementById("button-stitch")
    .addEventListener("click", increaseStitch);


document
    .getElementById("button-row")
    .addEventListener("click", increaseRow);


document
    .getElementById("button-undo")
    .addEventListener("click", undoCounters);


document
    .getElementById("button-reset")
    .addEventListener("click", resetCounters);


document
    .getElementById("button-edit")
    .addEventListener("click", editValues);


/* =========================================================
   INFO WINDOW
========================================================= */

const infoButton =
    document.getElementById("info-button");

const infoBox =
    document.getElementById("info-box");



infoButton.addEventListener("click", () => {

    const isVisible =
        infoBox.style.display === "block";

    infoBox.style.display =
        isVisible ? "none" : "block";
});


const closeInfo = document.getElementById("close-info");

closeInfo.addEventListener("click", () => {
    document.getElementById("info-box").style.display = "none";
});




/* =========================================================
   PICTURE-IN-PICTURE
========================================================= */

const smallWindowButton =
    document.getElementById("button-small-window");

smallWindowButton.addEventListener("click", async () => {

    /* Check browser support */

    if (!("documentPictureInPicture" in window)) {
        alert("Picture-in-picture is not supported in this browser.");
        return;
    }

    /* Don't open multiple windows */

    if (window.documentPictureInPicture.window) {
        return;
    }

    try {

        /* Create PiP window */

        const pipWindow =
            await window.documentPictureInPicture.requestWindow({
                width: 300,
                height: 190
            });


        /* Copy stylesheets */

        [...document.styleSheets].forEach((styleSheet) => {

            try {

                const style =
                    document.createElement("style");

                style.textContent =
                    [...styleSheet.cssRules]
                        .map(rule => rule.cssText)
                        .join("\n");

                pipWindow.document.head.appendChild(style);

            } catch (error) {

                if (styleSheet.href) {

                    const link =
                        document.createElement("link");

                    link.rel = "stylesheet";
                    link.href = styleSheet.href;

                    pipWindow.document.head.appendChild(link);
                }
            }
        });


        /* PiP body */

        pipWindow.document.body.style.margin = "0";
        pipWindow.document.body.style.width = "100%";
        pipWindow.document.body.style.height = "100%";
        pipWindow.document.body.style.overflow = "hidden";


        /* Background */

        pipWindow.document.body.style.background =
            "url('media/stbg.png') bottom/cover no-repeat";


        /* Get counter element */

        const pipElement =
            document.getElementById("div-pip-element");

        const pipContainer =
            document.getElementById("div-pip-container");


        if (!pipElement) {
            console.error(
                "Could not find #div-pip-element"
            );
            return;
        }


        /* Move element into PiP */

        pipWindow.document.body.appendChild(
            pipElement
        );


        /* Put it back when PiP closes */

        pipWindow.addEventListener(
            "pagehide",
            () => {

                if (pipContainer) {
                    pipContainer.appendChild(
                        pipElement
                    );
                }

            }
        );

    } catch (error) {

        console.error(
            "Picture-in-picture failed:",
            error
        );

    }

});
