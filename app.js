const addBtn = document.getElementById("addBtn");
const selBtn = document.getElementById("selBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");

const gameInput = document.getElementById("gameInput");
const display = document.getElementById("display");

let gameTitles = [];

let selecting = false;

let twinkleInterval = null;

function addGame(title) {
        clearInterval(twinkleInterval);
        display.style.color = "black";
        const div = document.createElement("div");
        const span = document.createElement("span");
        span.innerText = title;
        const deleteButton = document.createElement("button");
        let index = gameTitles.indexOf(title);
        deleteButton.addEventListener("click", () => {
                if (selecting) return;
                display.removeChild(div);
                gameTitles.splice(index, 1);
                selBtn.disabled = false;
                addBtn.disabled = false;
        });
        div.appendChild(span);
        div.appendChild(deleteButton);
        display.prepend(div);
}

function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

addBtn.addEventListener("click", () => {
        const text = gameInput.value;
        if (text.length <= 0) return;
        
        gameTitles.push(text);
        addGame(text);

        gameInput.value = "";
});

clearBtn.addEventListener("click", () => {
        gameInput.value = "";
        gameTitles = [];
        display.replaceChildren();
        selBtn.disabled = false;
        addBtn.disabled = false;
        resetBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
        gameInput.value = "";
        display.replaceChildren();
        gameTitles.forEach(title => {
                addGame(title);
        });
        selBtn.disabled = false;
        addBtn.disabled = false;
        resetBtn.disabled = true;
});

function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

let bulb = true
function twinkle() {
        if (bulb)
                display.style.color = "yellow"
        else
                display.style.color = "red"
        bulb = !bulb
}

async function select() {
        selecting = true;
        selBtn.disabled = true;
        addBtn.disabled = true;
        clearBtn.disabled = true;

        let timeToWait = 1000
        while (display.children.length > 1) {
                let index = getRandomInt(0, display.children.length - 1);
                const selected = display.children[index];

                selected.classList.add("selected");

                await wait(timeToWait);

                display.removeChild(selected);

                let popSound = new Audio("./assets/pop.wav");
                popSound.play();
                
                timeToWait /= 1.2;
        }

        await wait(1000);
        let tadaSound = new Audio("./assets/tada.flac");
        tadaSound.play();
        display.style.color = "red";
        bulb = true;
        twinkleInterval = setInterval(twinkle, 500);

        clearBtn.disabled = false;
        resetBtn.disabled = false;
        selecting = false;
}

selBtn.addEventListener("click", () => {
        select();
});

gameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addBtn.click();
});
