/* ===============================
script.js (embedded for now)
=============================== */
/* Copy this part into script.js */


// THEME TOGGLE
function toggleTheme() {
const body = document.body;
const isDark = body.getAttribute("data-theme") === "dark";
body.setAttribute("data-theme", isDark ? "light" : "dark");
}


// PROJECT FILTERING
function filterProjects(category) {
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
const categories = card.dataset.category.split(' ');
if (category === 'all' || categories.includes(category)) {
card.style.display = 'block';
} else {
card.style.display = 'none';
}
});
}