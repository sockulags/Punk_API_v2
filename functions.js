/**
 * Adjusts the visual presentation of cards to display a centered active item,
 * and other items positioned before and after it accordingly.
 * @param {Object} items - Collection of cards with the class "item" inside the slider.
 * @param {number} activeIndex - The index of the currently active item.
 */
function loadShow(items, activeIndex) {
    let step = 0;
  
    // Set styles for the active item
    items[activeIndex].style.transform = `none`;
    items[activeIndex].style.zIndex = 1;
    items[activeIndex].style.color = "black";    
    items[activeIndex].style.opacity = 1;
  
    // Position items after the active item
    for (let i = activeIndex + 1; i < items.length; i++) {
      step++;
      items[i].style.transform = `translateX(${350 * step}px) scale(${1 - 0.2 * step}) perspective(500px) rotateY(180deg)`;
      items[i].style.color = "black";
      items[i].style.opacity = 0;
    }
  
    // Reset step counter
    step = 0;
  
    // Position items before the active item
    for (let i = activeIndex - 1; i >= 0; i--) {
      step++;
      items[i].style.transform = `translateX(${-20 * step}px) scale(${1 - 0.05 * step}) perspective(500px)`;
      items[i].style.zIndex = -step;
      items[i].style.opacity = step > 3 ? 0 : 1;
      items[i].style.color = "transparent"
    }
}

// Export the function for use in other files (e.g., main.js)
export { loadShow };
