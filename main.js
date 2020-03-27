const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const name = document.querySelectorAll(".team__name");
const menu = document.querySelectorAll(".menu__item");
const left = document.querySelector(".slider__control_prev");
const right = document.querySelector(".slider__control_next");
const list = document.querySelector(".slider__list");
const myForm = document.querySelector('#myForm');
const sendButton = document.querySelector('#sendButton');
const successOverlay = createOverlay("<b>Скоро ты будешь накормлен!</b>");
const failOverlay = createOverlay("<b>Сиди голодный, ты не заслужил!</b>");


hamburger.addEventListener('click', function () {
    nav.classList.toggle("nav_active");
    hamburger.classList.toggle("hamburger_active");
});


for (let i = 0; i < name.length; i++) {
    name[i].addEventListener('click', function () {

        if (name[i].classList.value == "team__name team__name_active") {
            name[i].classList.toggle('team__name_active');
        } else {
            if (document.querySelector(".team__name_active")) {
                document.querySelector(".team__name_active").classList.remove('team__name_active');
            }

            name[i].classList.toggle("team__name_active");
        }
    });
}




for (let i = 0; i < menu.length; i++) {
    menu[i].addEventListener('click', function () {
        event.preventDefault();

        if (menu[i].classList.value == "menu__item menu__item_active") {
            menu[i].classList.remove('menu__item_active');
        } else {
            if (document.querySelector(".menu__item_active")) {
                document.querySelector(".menu__item_active").classList.remove('menu__item_active');
            }
            menu[i].classList.toggle("menu__item_active");
        }

    });

}

left.addEventListener("click", function (e) {
    loop("left", e);
});

right.addEventListener("click", function (e) {
    loop("right", e);
});

function loop(direction, e) {
    e.preventDefault();

    if (direction === "right") {
        list.appendChild(list.firstElementChild);
    } else {
        list.insertBefore(list.lastElementChild, list.firstElementChild);
    }
}



sendButton.addEventListener("click", function (e) {
    event.preventDefault();



    if (validateForm(myForm)) {

        const formData = new FormData();

        formData.append("to", "as.kamaeva@yandex.ru");
        formData.append("name", myForm.elements.name.value);
        formData.append("phone", myForm.elements.phone.value)
        formData.append("comment", myForm.elements.comment.value);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');

        xhr.send(formData);
        xhr.addEventListener('load', function () {
            let result = JSON.parse(xhr.response);

            if (result.status) {
                document.body.appendChild(successOverlay);
                    const formClean = document.querySelector(".order__button_none");
                    formClean.click();
           
            } else {
                document.body.appendChild(failOverlay);
            }
        });
    }

});


function createOverlay(content) {
    const overlayElement = document.createElement("div");
    overlayElement.classList.add("order__overlay");

    const template = document.querySelector("#overlayTemplate");
    overlayElement.innerHTML = template.innerHTML;
    overlayElement.addEventListener('click', function (e) {
        if (e.target == overlayElement) {
            closeElement.click();
        }
    });

    const closeElement = overlayElement.querySelector('.order__overlay_close');
    closeElement.addEventListener('click', function(e){
        e.preventDefault();
        document.body.removeChild(overlayElement);

    });

    const contentElement = overlayElement.querySelector(".order__overlay_content");
    contentElement.innerHTML = content;


    return overlayElement;

}



function validateForm(myForm) {
    let valid = true;

    if (!validateField(myForm.elements.name)) {
        valid = false;
    }

    if (!validateField(myForm.elements.phone)) {
        valid = false;
    }

    if (!validateField(myForm.elements.street)) {
        valid = false;
    }

    if (!validateField(myForm.elements.house)) {
        valid = false;
    }

    if (!validateField(myForm.elements.apartment)) {
        valid = false;
    }

    return valid;

}

function validateField(order__block) {
    order__block.nextElementSibling.textContent = order__block.validationMessage;
    return order__block.checkValidity();

}
