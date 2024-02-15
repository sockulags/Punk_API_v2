import { cards } from "./constants.js";
import { loadShow } from "./functions.js";

/**
 * The URL endpoint to fetch a random beer.
 * @type {string}
 */
const randomBeerUrl = "https://api.punkapi.com/v2/beers/random";

/**
 * The index of the currently active item in the slider.
 * @type {number}
 */
let active = 0;

// Load a random beer when the document content has been fully loaded.
document.addEventListener('DOMContentLoaded', loadRandomBeer);

/**
 * Fetches and displays a random beer.
 * Disables navigation buttons during the fetch operation and re-enables them afterwards.
 */
async function loadRandomBeer() {
    cards.next.disabled = true;
    cards.prev.disabled = true;
  
    try {
      const randomBeer = await fetchRandomBeer();
      cards.slider.insertAdjacentElement("beforeend", createCardElement(randomBeer));
      cards.items = document.querySelectorAll(".slider .item");
      loadShow(cards.items, active);
    } catch (error) {
      console.error("Error fetching random beer:", error);
    } finally {    
      cards.next.disabled = false;
      cards.prev.disabled = false;
    }
}

/**
 * Fetches a random beer from the API.
 * @returns {Promise<Object>} The data of the fetched beer.
 * @throws {Error} When the response is unsuccessful.
 */
async function fetchRandomBeer() {
  try {
    const response = await fetch(randomBeerUrl);
    if (!response.ok) {
      throw new Error("Response was unsuccessful.");
    }
    const beerData = await response.json();
    console.log(beerData[0]);
    return beerData[0];
  } catch (error) {
    console.error("Error fetching random beer:", error);
    throw error;
  }
}

/**
 * Creates a card element for the beer.
 * @param {Object} beer The beer data to display in the card.
 * @returns {HTMLElement} A div element styled as a card for the beer.
 */
const createCardElement = (beer) => {
  const div = document.createElement("div");
  div.classList.add("item");
  // Reset transformation for newly added beer cards
  div.style.transform = "translateX(0px) scale(1)";
  div.style.opacity = 1;
  const name = document.createElement("h1");
  name.textContent = beer.name;
  const imgDiv = document.createElement("div");
  imgDiv.classList.add("img-container");
  const img = document.createElement("img");
  img.src = beer.image_url ?? "img/beer.png";
  imgDiv.appendChild(img);

  const button = document.createElement("button");
//   button.addEventListener();
button.classList.add("read-more-btn");
  button.textContent = "Read more";
  div.append(name, imgDiv, button);
  return div;
};



// Add event listener for the next button.
cards.next.addEventListener('click', async () => {
    if (active === 0) {
      cards.prev.classList.remove("hider");
    }    
    
    if (active + 1 === cards.items.length) {
      const startTime = new Date().getTime(); 
      await loadRandomBeer();
      await dynamicDelay(startTime);
    }

    ++active;
    loadShow(cards.items, active);
  
    if (active > 0) {
      cards.prev.classList.remove("hider");
    }
});

// Add event listener for the previous button.
cards.prev.addEventListener('click', () => {
    if (active > 0) {
        --active;
        loadShow(cards.items, active);
    }
    if (active === 0) {
      cards.prev.classList.add("hider");
    }
});

/**
 * Waits for a minimum duration, adjusting for the elapsed time since startTime.
 * @param {number} startTime The start time in milliseconds.
 * @param {number} [minimumDuration=350] The minimum duration to wait in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the remaining time.
 */
function dynamicDelay(startTime, minimumDuration = 350) {
  const endTime = new Date().getTime();
  const elapsedTime = endTime - startTime;
  const remainingTime = minimumDuration - elapsedTime;

  return new Promise((resolve) => {
    if (remainingTime > 0) {
      setTimeout(resolve, remainingTime);
    } else {
      resolve();
    }
  });
}
