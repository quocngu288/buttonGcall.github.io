let panel = document.getElementById("GPanel");
let button = document.getElementById("GButton");
let close = document.getElementById("close");

button.addEventListener('click', showPanel);
function showPanel() {
    panel.style.visibility = "visible";
    button.style.visibility = "hidden";
}
close.addEventListener('click', closePanel);
function closePanel() {
    panel.style.visibility = "hidden";
    button.style.visibility = "visible";
}



