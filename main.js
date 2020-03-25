const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const name = document.querySelectorAll(".team__name");
const menu = document.querySelectorAll(".menu__item");
// let x;

hamburger.addEventListener('click', function(){
    nav.classList.toggle("nav_active");
    hamburger.classList.toggle("hamburger_active");
});

for (let i = 0; i<name.length; i++){
    
    name[i].addEventListener('click', function(){
        // x = document.querySelectorAll(".team__name_active");

        name[i].classList.toggle("team__name_active");
        
    });

}

for (let i = 0; i<name.length; i++){
    
    menu[i].addEventListener('click', function(){
        event.preventDefault();
        menu[i].classList.toggle("menu__item_active");
        
    });

}


