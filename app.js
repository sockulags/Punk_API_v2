import { cards } from "./constants.js";
import { loadShow } from "./functions.js";

const randomBeerUrl = "https://api.punkapi.com/v2/beers/random";

async function loadRandomBeer() {
  let randomBeer;
  randomBeer = await fetchRandomBeer();
  cards.slider.insertAdjacentElement("beforeend", card(randomBeer));
  cards.items = document.querySelectorAll(".slider .item");
}

async function fetchRandomBeer() {
  try {
    const beerResponse = await fetch(randomBeerUrl);
    if (!beerResponse.ok) {
      throw new Error("Response was unsuccesful.");
    }
    const beerData = await beerResponse.json();
    console.log(beerData[0]);
    return beerData[0];
  } catch (error) {
    console.error("Error fetching random beer:", error);
    throw error;
  }
}

const card = (beer) => {
  const div = document.createElement("div");
  div.classList.add("item");
  div.style.transform = `translateX(${350}px) scale(${
    1 - 0.2
  }) perspective(500px) rotateY(180deg)`;
  div.style.color = "black";
  div.style.opacity = 0;
  const name = document.createElement("h1");
  name.textContent = beer.name;
  const imgDiv = document.createElement("div");
  imgDiv.classList.add("img-container");
  const img = document.createElement("img");
  img.src = beer.image_url ?? "img/beer.png";
  imgDiv.appendChild(img);
  div.append(name, imgDiv);
  return div;
};

loadRandomBeer();
// Card slider functionality

/**
 * Represents the index of the currently active item.
 * @type {number}
 */
let active = 0;

loadShow(cards.items, active);

/**
 * Handles the next button click event by incrementing the active item index
 * and updating the displayed show.
 */
cards.next.onclick = async function () {
  if (active === 0) {
    cards.prev.classList.remove("hider");
  }
  active++;
  if (active === cards.items.length) {
    await loadRandomBeer();
    setTimeout(loadShow(cards.items, active), 0);
  } else {
    loadShow(cards.items, active);
  }
};

/**
 * Handles the previous button click event by decrementing the active item index
 * and updating the displayed show.
 */
cards.prev.onclick = function () {
    let current = active;
    active = active === 0 ? 0 : active -1;
   if (active === 0) cards.prev.classList.add("hider");
if(current !== active)
  loadShow(cards.items, active);
};
