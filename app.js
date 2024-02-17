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


document.body.addEventListener("click", (e) =>{
    if(e.target.classList.contains("exit-btn")){
        const readMore = document.querySelector(".read-more");
        readMore.style.animation = "contract 0.3s linear forwards"; // Apply the contract animation
        document.getElementById("next").style.display = "";
        document.getElementById("prev").style.display= "";
        setTimeout(() => {
            readMore.innerHTML = ""; // Clear content after animation completes
            readMore.classList.add("hider"); // Optionally hide the element
            readMore.style.animation = "expand 0.3s linear forwards";
           
        }, 300); // Adjust the timeout to match the animation duration
    }
});
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
button.addEventListener("click", () => {
    document.querySelector(".read-more").innerHTML = createReadMoreCard(beer);
    document.querySelector(".read-more").classList.remove("hider");  
    document.getElementById("next").style.display = "none";
    document.getElementById("prev").style.display= "none"; 
})
  button.textContent = "Read more";
  div.append(name, imgDiv, button);
  return div;
};

const createReadMoreCard = (beer) => {
    const maltIngredients = [...new Set(beer.ingredients.malt.map(m => m.name))].join(", ");
    const hops = [...new Set(beer.ingredients.hops.map(m => m.name))].join(", ");

    return `   
    <div class="title-img">
      <div class="text">
          <h1>${beer.name}</h1>
          <div class="tagline">${beer.tagline}</div>
      </div>
      <img src="${beer.image_url ?? "img/beer.png"}" />
      <span class="exit-btn">x</span>
    </div>
    <div class="description"><strong>Description: </strong> ${beer.description}</div> 
      <div class="tips"><strong>Tips: </strong>${beer.brewers_tips}</div>
      <div class="info"><strong>Alcohol by volume: </strong>${beer.abv}%</div>
      <div class="info"><strong>Volume: </strong> ${beer.volume.value} ${beer.volume.unit}</div>
      <div class="info"><strong>Hops: </strong>${hops}</div>
      <div class="info"><strong>Food pairing: </strong>${beer.food_pairing.join(", ")}</div>
     <div class="info"><strong>Ingridients: </strong>${maltIngredients}</div>
    `
}



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


// Function to make API request to search for beers by name
function searchBeersByName(searchQuery) {  
    if (searchQuery.trim() !== '') {
        // Construct the API URL with the search query
        const apiUrl = `https://api.punkapi.com/v2/beers?page=1&per_page=10&beer_name=${encodeURIComponent(searchQuery)}`;

        // Make the API request
        fetch(apiUrl)
            .then(response => response.json())
            .then(beers => {
                   console.log('Search results:', beers);
            })
            .catch(error => {              
                console.error('Error fetching search results:', error);
            });
    }
}

// Get the search input element and search form
const searchInput = document.querySelector('.search-bar input');
const searchForm = document.querySelector('.search-bar');

// Add an event listener for the submit event of the search form
searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // Get the value of the search input
    const searchQuery = searchInput.value;
    // Call the function to search for beers by name
    searchBeersByName(searchQuery);
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
