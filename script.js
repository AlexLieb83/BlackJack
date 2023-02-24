let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true; // allows player to draw while yourSum <= 21

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
};

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(`${values[j]}-${types[i]}`); // A-C -> K-C, A-D -> K-D
    }
  }
  console.log(deck);
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    // grab card at random index
    let j = Math.floor(Math.random() * deck.length); // (0 to 1) * 52 => (0 to 51)

    // swap current card with random card chosen
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function startGame() {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  // console.log(hidden);
  // console.log(dealerSum);
  while (dealerSum < 17) {
    // <img src=''>
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = `./cards/${card}.png`;

    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealerCards").append(cardImg);
  }
  console.log(dealerSum);

  for (let i = 0; i < 2; i++) {
    // <img src=''>
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = `./cards/${card}.png`;

    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("yourCards").append(cardImg);
  }

  console.log(yourSum);
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
  if (!canHit) {
    return;
  }
  // give player a card, they're allowed to hit
  // <img src=''>
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = `./cards/${card}.png`;

  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById("yourCards").append(cardImg);

  // if you have over 21, you cannot hit anymore
  if (reduceAce(yourSum, yourAceCount) > 21) {
    canHit = false;
  }
}

function stay() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;
  // reveal hidden card
  document.getElementById("hidden").src = `./cards/${hidden}.png`;

  let message = "";

  if (yourSum > 21) {
    message = "You Lose...";
  } else if (dealerSum > 21) {
    message = "You Win!";
  } else if (yourSum === dealerSum) {
    message = "You tied.";
  } else if (yourSum > dealerSum) {
    message = "You Win!";
  } else if (yourSum < dealerSum) {
    message = "You Lose...";
  }

  // display on Page
  document.getElementById("dealerSum").innerText = dealerSum;
  document.getElementById("yourSum").innerText = yourSum;
  document.getElementById("results").innerText = message;
}

function getValue(card) {
  let data = card.split("-"); // '4-C' -> ['4', 'C']
  let value = data[0];

  // if value isn't a number, check if it's an ace and return value
  if (isNaN(value)) {
    if (value === "A") {
      return 11;
    }
    return 10;
  }
  // if value is not a face card or Ace, return it's value as an Int
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] === "A") {
    return 1;
  } else {
    return 0;
  }
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount--;
  }
  return playerSum;
}
