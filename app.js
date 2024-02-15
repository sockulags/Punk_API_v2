import { cards } from "./constants.js";
import { loadShow } from "./functions.js";

const randomBeerUrl = "https://api.punkapi.com/v2/beers/random";

let active = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadRandomBeer(); 
  });

async function loadRandomBeer() {
    cards.next.disabled = true;
    cards.prev.disabled = true;
  
    try {
      let randomBeer = await fetchRandomBeer();
      cards.slider.insertAdjacentElement("beforeend", card(randomBeer));
      cards.items = document.querySelectorAll(".slider .item");
      loadShow(cards.items, active)
    } catch (error) {
      console.error("Error fetching random beer:", error);
    } finally {    
      cards.next.disabled = false;
      cards.prev.disabled = false;
    }
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
  
  cards.prev.addEventListener('click', () => {
      if (active > 0) {
          active--;
          loadShow(cards.items, active);
      }
      if (active === 0) {
        cards.prev.disabled = true;
      }
  });

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
