const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");


hamburger.addEventListener('click', function(){
    nav.classList.toggle("nav_active");
    hamburger.classList.toggle("hamburger_active");
});