export function getAmountOfItemsToDisplay() {
    // Tailwind's md breakpoint
    return window.innerWidth >= 768 ? 3 : 1;
}