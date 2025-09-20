const addBtn = document.getElementById("addBtn");
const selBtn = document.getElementById("selBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");

const gameInput = document.getElementById("gameInput");
const display = document.getElementById("display");

const rouletteMode = document.getElementById("rouletteMode");

let gameTitles = [];

let selecting = false;

let twinkleInterval = null;

let rm = false;

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
        const selected = document.getElementsByClassName("selected")[0];
        if (bulb) {
                if (rm)
                        selected.style.color = "yellow"
                else
                        display.style.color = "yellow"
        } else {
                if (rm)
                        selected.style.color = "red"
                else 
                        display.style.color = "red"
        }
        bulb = !bulb
}

async function select() {
        rm = false;
        selecting = true;
        selBtn.disabled = true;
        addBtn.disabled = true;
        clearBtn.disabled = true;

        let timeToWait = 1000
        while (display.children.length > 1) {
                let index = getRandomInt(0, display.children.length - 1);
                const selected = display.children[index];
                selected.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

async function selectRoulette() {
        rm = true;
        selecting = true;
        selBtn.disabled = true;
        addBtn.disabled = true;
        clearBtn.disabled = true;

        let waitingTime = 1000
        let index = 0;
        for (let i=0; i<10; i++) {
                let popSound = new Audio("./assets/pop.wav");
                popSound.play();
                display.children[index].classList.add("selected");
                display.children[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
                await wait(waitingTime);
                display.children[index].classList.remove("selected");
                waitingTime /= 1.25;
                index++;
                if (index >= display.children.length) index = 0;
        }
        
        let random = getRandomInt(25,25+display.children.length);
        for (let i=0; i<random; i++) {
                let popSound = new Audio("./assets/pop.wav");
                popSound.play();
                display.children[index].classList.add("selected");
                display.children[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
                await wait(waitingTime);
                display.children[index].classList.remove("selected")
                index++;
                if (index >= display.children.length) index = 0;
        }
        
        for (let i=0; i<10; i++) {
                let popSound = new Audio("./assets/pop.wav");
                popSound.play();
                display.children[index].classList.add("selected");
                display.children[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
                await wait(waitingTime);
                waitingTime *= 1.25;
                display.children[index].classList.remove("selected");
                index++;
                if (index >= display.children.length) index = 0;
        }
        display.children[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        display.children[index].classList.add("selected")
        let tadaSound = new Audio("./assets/tada.flac");
        tadaSound.play();
        twinkleInterval = setInterval(twinkle, 500);
        
        clearBtn.disabled = false;
        resetBtn.disabled = false;
        selecting = false;
}

selBtn.addEventListener("click", () => {
        if (rouletteMode.checked)
                selectRoulette();
        else
                select();
});

gameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addBtn.click();
});
