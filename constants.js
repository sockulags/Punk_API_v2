/**
 * Represents a collection of elements related to the slider functionality.
 * @typedef {Object} cards
 * @property {HTMLElement} slider - The element that holds all cards
 * @property {NodeListOf<Element>} items - Collection of cards with the class "item" inside the slider.
 * @property {HTMLElement} next - Next button element for the slider.
 * @property {HTMLElement} prev - Previous button element for the slider.
 */

/**
 * Collection of elements related to the slider functionality.
 * @type {cards}
 */
export const cards = {
    slider: document.querySelector(".slider"),
    items: document.querySelectorAll(".slider .item"),
    next: document.getElementById("next"),
    prev: document.getElementById("prev")
};