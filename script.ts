"use strict";


interface Dish {
    dish: string;
    ingredients: string[];
}

interface GameParameters {
    score: number;
    timeLeft: number;
    currentDishIndex: number;
}

const dishes: Dish[] = [
    { dish: "Toast 🍞", ingredients: ["🍞", "🧈"] },
    { dish: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { dish: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { dish: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { dish: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
    { dish: "Burger 🍔", ingredients: ["🥩", "🍞", "🧀", "🍅", "🥬"] },
    { dish: "Taco 🌮", ingredients: ["🌮", "🥩", "🧀", "🥬", "🍅"] },
    { dish: "Sushi 🍣", ingredients: ["🍚", "🐟", "🥢", "🥑", "🍋"] },
    { dish: "Ramen 🍜", ingredients: ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"] },
    { dish: "Feast 🍽️", ingredients: ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"] },
];

let currentDishIndex = 0;
let score = 0;
let timeLeft = 60;
let timerInterval: number | undefined;


const orderElement = document.querySelector("#order") as HTMLElement;
const ingredientsElement = document.querySelector("#ingredients")as HTMLElement;
const scoreElement = document.querySelector("#score")as HTMLElement;
const timeElement = document.querySelector("#time")as HTMLElement;
const loadingBar = document.querySelector("#progress")as HTMLElement;

function saveGameParameters(){
    const gameParameters: GameParameters = {score, timeLeft, currentDishIndex};
    localStorage.setItem("kitchenGameParameters", JSON.stringify(gameParameters));
}

function loadGameParameters(): GameParameters | null {
    const savedParameters = localStorage.getItem("kitchenGameParameters");
    return savedParameters? JSON.parse(savedParameters) : null;
}

function startGame() {
    const parameters = loadGameParameters();
    if (parameters && parameters.timeLeft > 0) {
        score = parameters.score;
        currentDishIndex = parameters.currentDishIndex;
        timeLeft = parameters.timeLeft;
    } else {
        score = 0;
        currentDishIndex = 0;
        timeLeft = 60;
    }

    loadNextDish();
    startTimer();
}


function loadNextDish() {
    if (currentDishIndex >= dishes.length) {
        alert(`Game Over! Final Score: ${score}`);
        clearInterval(timerInterval);
        return;
    }

    const currentDish = dishes[currentDishIndex];
    orderElement.innerHTML = `
    <div>
      <strong>${currentDish.dish}</strong>
      <div>${currentDish.ingredients.map((ingredient) => `<span>${ingredient}</span>`).join(" ")}</div>
    </div>
  `;

    updateIngredients();
    selectedIngredients = [];
    saveGameParameters();
}


function updateIngredients() {
    const allPossibleIngredients = [
        "🍞", "🧈", "🥬", "🥕", "🥒", "🌭", "🧅", "🍅", "🧀", "🥩",
        "🌮", "🍚", "🐟", "🥢", "🥑", "🍋", "🍜", "🥚", "🌿", "🧄",
        "🍖", "🍗", "🍷", "🥗", "🧁", "🍇", "🍩", "🥦", "🍯", "🍝"
    ];

    ingredientsElement.innerHTML = allPossibleIngredients
        .map((ingredient) => `<div>${ingredient}</div>`)
        .join("");

    const ingredientElements = ingredientsElement.querySelectorAll("div");
    ingredientElements.forEach((element) =>
        element.addEventListener("click", () => {
            handleIngredientSelection(element.textContent || "");
        })
    );
}


let selectedIngredients: string[] = [];
function handleIngredientSelection(ingredient: string) {
    const currentDish = dishes[currentDishIndex];

    if (currentDish.ingredients.indexOf(ingredient) >=0 ) {
        selectedIngredients.push(ingredient);

        let isAllIncluded = true;

        selectedIngredients.forEach((ingredient) => {
            if (currentDish.ingredients.indexOf(ingredient) === -1) {
                isAllIncluded = false
            }
        })

        if (
            selectedIngredients.length === currentDish.ingredients.length &&
            isAllIncluded
        ) {
            updateScore();
            currentDishIndex++;
            loadNextDish();
        }
    }
}


function updateScore() {
    score += 10;
    scoreElement.textContent = `Score: ${score}`;
    saveGameParameters();
}


function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`Final Score: ${score}`);

        }

        saveGameParameters();

        if (timeLeft >=0) {
            loadingBar.style.width = timeLeft / 0.6 + '%'
        }


    }, 1000);
}


startGame();

