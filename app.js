const addBtn = document.getElementById("addBtn");
const selBtn = document.getElementById("selBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");

const gameInput = document.getElementById("gameInput");
const display = document.getElementById("display");

let gameTitles = [];

function addGame(title) {
        const p = document.createElement("p");
        p.innerText = title;
        display.prepend(p);
}

function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

addBtn.addEventListener("click", () => {
        const text = gameInput.value;
        if (text.length < 0) return;
        
        addGame(text);
        gameTitles.push(text);

        gameInput.value = "";
});

clearBtn.addEventListener("click", () => {
        gameInput.value = "";
        gameTitles = [];
        display.replaceChildren();
        selBtn.disabled = false;
        addBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
        gameInput.value = "";
        display.replaceChildren();
        gameTitles.forEach(title => {
                addGame(title);
        });
        selBtn.disabled = false;
        addBtn.disabled = false;
});

function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

async function select() {
        selBtn.disabled = true;
        addBtn.disabled = true;
        clearBtn.disabled = true;
        resetBtn.disabled = true;
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
        clearBtn.disabled = false;
        resetBtn.disabled = false;
}

selBtn.addEventListener("click", () => {
        select();
});

gameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addBtn.click();
});
