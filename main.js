const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const name = document.querySelectorAll(".team__name");
const menu = document.querySelectorAll(".menu__item");
const left = document.querySelector(".slider__control_prev");
const right = document.querySelector(".slider__control_next");
const list = document.querySelector(".slider__list");



hamburger.addEventListener('click', function(){
    nav.classList.toggle("nav_active");
    hamburger.classList.toggle("hamburger_active");
});


for (let i = 0; i<name.length; i++){
    name[i].addEventListener('click', function(){

        if (name[i].classList.value == "team__name team__name_active"){
        name[i].classList.toggle('team__name_active');
        } else {
            if(document.querySelector(".team__name_active")){
            document.querySelector(".team__name_active").classList.remove('team__name_active');
            }

            name[i].classList.toggle("team__name_active");
        }    
    });
}




for (let i = 0; i<menu.length; i++){
    menu[i].addEventListener('click', function(){
        event.preventDefault();

if (menu[i].classList.value == "menu__item menu__item_active"){
    menu[i].classList.remove('menu__item_active');
} else{
    if(document.querySelector(".menu__item_active")){
        document.querySelector(".menu__item_active").classList.remove('menu__item_active');
    }
    menu[i].classList.toggle("menu__item_active");
}
        
    });

}

left.addEventListener("click", function (e){
    loop ("left", e);
});

right.addEventListener("click", function (e){
    loop ("right", e);
});

function loop(direction, e){
    e.preventDefault();

    if (direction === "right"){
        list.appendChild(list.firstElementChild);
    } else{
        list.insertBefore(list.lastElementChild, list.firstElementChild);
    }
}

