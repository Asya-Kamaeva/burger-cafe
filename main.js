

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
const body = document.getElementsByTagName('body')[0];
const more = document.querySelectorAll(".feeds__parent_link");


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

//slider

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

//form

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

      body.classList.add('hidden');
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
  closeElement.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.removeChild(overlayElement);
    body.classList.remove('hidden');
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

//яндекс карты

let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [59.938477, 30.322235],
    zoom: 11,
    controls: []
  });

  const coords = [
    [59.975457, 30.314638],
    [59.950235, 30.385900],
    [59.931656, 30.271322],
    [59.945328, 30.241630]
  ];

  const myCollection = new ymaps.GeoObjectCollection({}, {

    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: '../img/map-marker.svg',
    iconImageSize: [44, 55],
    iconImageOffset: [-35, -52]
  });

  for (var i = 0; i < coords.length; i++) {
    myCollection.add(new ymaps.Placemark(coords[i]));
  }

  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);

//player

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: '640',
    height: '360',
    videoId: 'ZLywUPpuOig',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },

    playerVars: {
      'showinfo': 0,
      'rel': 0,
      'modestbranding': 1
    }

  });
}


function onPlayerReady(event) {
  event.target.playVideo();
}


let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}


//onepage scroll

const sections = $(".section");
const display = $(".maincontent");

let inScroll = false;

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

const countSectionPosition = (sectionEq) => {

  const position = sectionEq * -100;
  if (isNaN(position))
    console.error("передано не верное значение в countSectionPositon");

  return position;
};

const resetActiveClass = (item, eq) => {
  item.eq(eq).addClass("active").siblings().removeClass("active");
};

const resetSidebarActiveClass = (item, eq) => {
  item.eq(eq).addClass("sidebar__active").siblings().removeClass("sidebar__active");
};

const performTransition = (sectionEq) => {
  if (inScroll) return;

  inScroll = true;

  const position = countSectionPosition(sectionEq);
  const trasitionOver = 1000;
  const mouseInertionOver = 300;

  resetActiveClass(sections, sectionEq);

  display.css({
    transform: `translateY(${position}%)`,
  });

  setTimeout(() => {
    resetSidebarActiveClass($(".sidebar__item"), sectionEq);
    inScroll = false;
  }, trasitionOver + mouseInertionOver);
};

const scroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index());
      }
    },
    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    },
  };
};

$(window).on("wheel", (e) => {
  const deltaY = e.originalEvent.deltaY;
  const windowScroller = scroller();

  if (deltaY > 0) {
    windowScroller.next();
  }

  if (deltaY < 0) {
    windowScroller.prev();
  }
});

$(document).on("keydown", (e) => {
  const tagName = e.target.tagName.toLowerCase();
  const windowScroller = scroller();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38:
      windowScroller.prev();
      break;
    case 40:
      windowScroller.next();
      break;
  }
});

$("[data-scroll-to]").on("click", (e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");

  performTransition(target);
});

if (isMobile) {
  // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    swipe: (event, direction) => {
      let scrollDirection;
      const windowScroller = scroller();

      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";

      windowScroller[scrollDirection]();
    },
  });
}

//feeds

for (var i = 0; i < more.length; i++) {
  more[i].addEventListener('click', function () {
    let reviewParent = this.parentNode;
    let reviewText = reviewParent.querySelector('.feeds__text').innerText;


    let reviewOverlay = createOverlay(reviewText);
    document.body.appendChild(reviewOverlay);

  });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5jb25zdCBoYW1idXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhhbWJ1cmdlclwiKTtcbmNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2XCIpO1xuY29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGVhbV9fbmFtZVwiKTtcbmNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1lbnVfX2l0ZW1cIik7XG5jb25zdCBsZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2NvbnRyb2xfcHJldlwiKTtcbmNvbnN0IHJpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2NvbnRyb2xfbmV4dFwiKTtcbmNvbnN0IGxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fbGlzdFwiKTtcbmNvbnN0IG15Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteUZvcm0nKTtcbmNvbnN0IHNlbmRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2VuZEJ1dHRvbicpO1xuY29uc3Qgc3VjY2Vzc092ZXJsYXkgPSBjcmVhdGVPdmVybGF5KFwiPGI+0KHQutC+0YDQviDRgtGLINCx0YPQtNC10YjRjCDQvdCw0LrQvtGA0LzQu9C10L0hPC9iPlwiKTtcbmNvbnN0IGZhaWxPdmVybGF5ID0gY3JlYXRlT3ZlcmxheShcIjxiPtCh0LjQtNC4INCz0L7Qu9C+0LTQvdGL0LksINGC0Ysg0L3QtSDQt9Cw0YHQu9GD0LbQuNC7ITwvYj5cIik7XG5jb25zdCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcbmNvbnN0IG1vcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZlZWRzX19wYXJlbnRfbGlua1wiKTtcblxuXG5oYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gIG5hdi5jbGFzc0xpc3QudG9nZ2xlKFwibmF2X2FjdGl2ZVwiKTtcbiAgaGFtYnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoXCJoYW1idXJnZXJfYWN0aXZlXCIpO1xufSk7XG5cblxuZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XG4gIG5hbWVbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAobmFtZVtpXS5jbGFzc0xpc3QudmFsdWUgPT0gXCJ0ZWFtX19uYW1lIHRlYW1fX25hbWVfYWN0aXZlXCIpIHtcbiAgICAgIG5hbWVbaV0uY2xhc3NMaXN0LnRvZ2dsZSgndGVhbV9fbmFtZV9hY3RpdmUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGVhbV9fbmFtZV9hY3RpdmVcIikpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZWFtX19uYW1lX2FjdGl2ZVwiKS5jbGFzc0xpc3QucmVtb3ZlKCd0ZWFtX19uYW1lX2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICBuYW1lW2ldLmNsYXNzTGlzdC50b2dnbGUoXCJ0ZWFtX19uYW1lX2FjdGl2ZVwiKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cblxuXG5mb3IgKGxldCBpID0gMDsgaSA8IG1lbnUubGVuZ3RoOyBpKyspIHtcbiAgbWVudVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKG1lbnVbaV0uY2xhc3NMaXN0LnZhbHVlID09IFwibWVudV9faXRlbSBtZW51X19pdGVtX2FjdGl2ZVwiKSB7XG4gICAgICBtZW51W2ldLmNsYXNzTGlzdC5yZW1vdmUoJ21lbnVfX2l0ZW1fYWN0aXZlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVfX2l0ZW1fYWN0aXZlXCIpKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudV9faXRlbV9hY3RpdmVcIikuY2xhc3NMaXN0LnJlbW92ZSgnbWVudV9faXRlbV9hY3RpdmUnKTtcbiAgICAgIH1cbiAgICAgIG1lbnVbaV0uY2xhc3NMaXN0LnRvZ2dsZShcIm1lbnVfX2l0ZW1fYWN0aXZlXCIpO1xuICAgIH1cblxuICB9KTtcblxufVxuXG4vL3NsaWRlclxuXG5sZWZ0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBsb29wKFwibGVmdFwiLCBlKTtcbn0pO1xuXG5yaWdodC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgbG9vcChcInJpZ2h0XCIsIGUpO1xufSk7XG5cbmZ1bmN0aW9uIGxvb3AoZGlyZWN0aW9uLCBlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICBpZiAoZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICBsaXN0LmFwcGVuZENoaWxkKGxpc3QuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICB9IGVsc2Uge1xuICAgIGxpc3QuaW5zZXJ0QmVmb3JlKGxpc3QubGFzdEVsZW1lbnRDaGlsZCwgbGlzdC5maXJzdEVsZW1lbnRDaGlsZCk7XG4gIH1cbn1cblxuLy9mb3JtXG5cbnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblxuXG4gIGlmICh2YWxpZGF0ZUZvcm0obXlGb3JtKSkge1xuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGZvcm1EYXRhLmFwcGVuZChcInRvXCIsIFwiYXMua2FtYWV2YUB5YW5kZXgucnVcIik7XG4gICAgZm9ybURhdGEuYXBwZW5kKFwibmFtZVwiLCBteUZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKFwicGhvbmVcIiwgbXlGb3JtLmVsZW1lbnRzLnBob25lLnZhbHVlKVxuICAgIGZvcm1EYXRhLmFwcGVuZChcImNvbW1lbnRcIiwgbXlGb3JtLmVsZW1lbnRzLmNvbW1lbnQudmFsdWUpO1xuXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BPU1QnLCAnaHR0cHM6Ly93ZWJkZXYtYXBpLmxvZnRzY2hvb2wuY29tL3NlbmRtYWlsJyk7XG5cbiAgICB4aHIuc2VuZChmb3JtRGF0YSk7XG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xuXG4gICAgICBpZiAocmVzdWx0LnN0YXR1cykge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Y2Nlc3NPdmVybGF5KTtcbiAgICAgICAgY29uc3QgZm9ybUNsZWFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vcmRlcl9fYnV0dG9uX25vbmVcIik7XG4gICAgICAgIGZvcm1DbGVhbi5jbGljaygpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZhaWxPdmVybGF5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59KTtcblxuXG5mdW5jdGlvbiBjcmVhdGVPdmVybGF5KGNvbnRlbnQpIHtcbiAgY29uc3Qgb3ZlcmxheUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBvdmVybGF5RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwib3JkZXJfX292ZXJsYXlcIik7XG5cbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI292ZXJsYXlUZW1wbGF0ZVwiKTtcbiAgb3ZlcmxheUVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuICBvdmVybGF5RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUudGFyZ2V0ID09IG92ZXJsYXlFbGVtZW50KSB7XG4gICAgICBjbG9zZUVsZW1lbnQuY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGNsb3NlRWxlbWVudCA9IG92ZXJsYXlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcl9fb3ZlcmxheV9jbG9zZScpO1xuICBjbG9zZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG92ZXJsYXlFbGVtZW50KTtcbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICB9KTtcblxuICBjb25zdCBjb250ZW50RWxlbWVudCA9IG92ZXJsYXlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3JkZXJfX292ZXJsYXlfY29udGVudFwiKTtcbiAgY29udGVudEVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblxuXG4gIHJldHVybiBvdmVybGF5RWxlbWVudDtcblxufVxuXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVGb3JtKG15Rm9ybSkge1xuICBsZXQgdmFsaWQgPSB0cnVlO1xuXG4gIGlmICghdmFsaWRhdGVGaWVsZChteUZvcm0uZWxlbWVudHMubmFtZSkpIHtcbiAgICB2YWxpZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCF2YWxpZGF0ZUZpZWxkKG15Rm9ybS5lbGVtZW50cy5waG9uZSkpIHtcbiAgICB2YWxpZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCF2YWxpZGF0ZUZpZWxkKG15Rm9ybS5lbGVtZW50cy5zdHJlZXQpKSB7XG4gICAgdmFsaWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghdmFsaWRhdGVGaWVsZChteUZvcm0uZWxlbWVudHMuaG91c2UpKSB7XG4gICAgdmFsaWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghdmFsaWRhdGVGaWVsZChteUZvcm0uZWxlbWVudHMuYXBhcnRtZW50KSkge1xuICAgIHZhbGlkID0gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdmFsaWQ7XG5cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVGaWVsZChvcmRlcl9fYmxvY2spIHtcbiAgb3JkZXJfX2Jsb2NrLm5leHRFbGVtZW50U2libGluZy50ZXh0Q29udGVudCA9IG9yZGVyX19ibG9jay52YWxpZGF0aW9uTWVzc2FnZTtcbiAgcmV0dXJuIG9yZGVyX19ibG9jay5jaGVja1ZhbGlkaXR5KCk7XG5cbn1cblxuLy/Rj9C90LTQtdC60YEg0LrQsNGA0YLRi1xuXG5sZXQgbXlNYXA7XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIG15TWFwID0gbmV3IHltYXBzLk1hcChcIm1hcFwiLCB7XG4gICAgY2VudGVyOiBbNTkuOTM4NDc3LCAzMC4zMjIyMzVdLFxuICAgIHpvb206IDExLFxuICAgIGNvbnRyb2xzOiBbXVxuICB9KTtcblxuICBjb25zdCBjb29yZHMgPSBbXG4gICAgWzU5Ljk3NTQ1NywgMzAuMzE0NjM4XSxcbiAgICBbNTkuOTUwMjM1LCAzMC4zODU5MDBdLFxuICAgIFs1OS45MzE2NTYsIDMwLjI3MTMyMl0sXG4gICAgWzU5Ljk0NTMyOCwgMzAuMjQxNjMwXVxuICBdO1xuXG4gIGNvbnN0IG15Q29sbGVjdGlvbiA9IG5ldyB5bWFwcy5HZW9PYmplY3RDb2xsZWN0aW9uKHt9LCB7XG5cbiAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgIGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcbiAgICBpY29uSW1hZ2VIcmVmOiAnLi4vaW1nL21hcC1tYXJrZXIuc3ZnJyxcbiAgICBpY29uSW1hZ2VTaXplOiBbNDQsIDU1XSxcbiAgICBpY29uSW1hZ2VPZmZzZXQ6IFstMzUsIC01Ml1cbiAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBteUNvbGxlY3Rpb24uYWRkKG5ldyB5bWFwcy5QbGFjZW1hcmsoY29vcmRzW2ldKSk7XG4gIH1cblxuICBteU1hcC5nZW9PYmplY3RzLmFkZChteUNvbGxlY3Rpb24pO1xuXG4gIG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKCdzY3JvbGxab29tJyk7XG59XG5cbnltYXBzLnJlYWR5KGluaXQpO1xuXG4vL3BsYXllclxuXG5sZXQgcGxheWVyO1xuZnVuY3Rpb24gb25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkoKSB7XG4gIHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoJ3BsYXllcicsIHtcbiAgICB3aWR0aDogJzY0MCcsXG4gICAgaGVpZ2h0OiAnMzYwJyxcbiAgICB2aWRlb0lkOiAnWkx5d1VQcHVPaWcnLFxuICAgIGV2ZW50czoge1xuICAgICAgJ29uUmVhZHknOiBvblBsYXllclJlYWR5LFxuICAgICAgJ29uU3RhdGVDaGFuZ2UnOiBvblBsYXllclN0YXRlQ2hhbmdlXG4gICAgfSxcblxuICAgIHBsYXllclZhcnM6IHtcbiAgICAgICdzaG93aW5mbyc6IDAsXG4gICAgICAncmVsJzogMCxcbiAgICAgICdtb2Rlc3RicmFuZGluZyc6IDFcbiAgICB9XG5cbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gb25QbGF5ZXJSZWFkeShldmVudCkge1xuICBldmVudC50YXJnZXQucGxheVZpZGVvKCk7XG59XG5cblxubGV0IGRvbmUgPSBmYWxzZTtcbmZ1bmN0aW9uIG9uUGxheWVyU3RhdGVDaGFuZ2UoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuUExBWUlORyAmJiAhZG9uZSkge1xuICAgIHNldFRpbWVvdXQoc3RvcFZpZGVvLCA2MDAwKTtcbiAgICBkb25lID0gdHJ1ZTtcbiAgfVxufVxuZnVuY3Rpb24gc3RvcFZpZGVvKCkge1xuICBwbGF5ZXIuc3RvcFZpZGVvKCk7XG59XG5cblxuLy9vbmVwYWdlIHNjcm9sbFxuXG5jb25zdCBzZWN0aW9ucyA9ICQoXCIuc2VjdGlvblwiKTtcbmNvbnN0IGRpc3BsYXkgPSAkKFwiLm1haW5jb250ZW50XCIpO1xuXG5sZXQgaW5TY3JvbGwgPSBmYWxzZTtcblxuY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbmNvbnN0IGlzTW9iaWxlID0gbWQubW9iaWxlKCk7XG5cbmNvbnN0IGNvdW50U2VjdGlvblBvc2l0aW9uID0gKHNlY3Rpb25FcSkgPT4ge1xuXG4gIGNvbnN0IHBvc2l0aW9uID0gc2VjdGlvbkVxICogLTEwMDtcbiAgaWYgKGlzTmFOKHBvc2l0aW9uKSlcbiAgICBjb25zb2xlLmVycm9yKFwi0L/QtdGA0LXQtNCw0L3QviDQvdC1INCy0LXRgNC90L7QtSDQt9C90LDRh9C10L3QuNC1INCyIGNvdW50U2VjdGlvblBvc2l0b25cIik7XG5cbiAgcmV0dXJuIHBvc2l0aW9uO1xufTtcblxuY29uc3QgcmVzZXRBY3RpdmVDbGFzcyA9IChpdGVtLCBlcSkgPT4ge1xuICBpdGVtLmVxKGVxKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xufTtcblxuY29uc3QgcmVzZXRTaWRlYmFyQWN0aXZlQ2xhc3MgPSAoaXRlbSwgZXEpID0+IHtcbiAgaXRlbS5lcShlcSkuYWRkQ2xhc3MoXCJzaWRlYmFyX19hY3RpdmVcIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcInNpZGViYXJfX2FjdGl2ZVwiKTtcbn07XG5cbmNvbnN0IHBlcmZvcm1UcmFuc2l0aW9uID0gKHNlY3Rpb25FcSkgPT4ge1xuICBpZiAoaW5TY3JvbGwpIHJldHVybjtcblxuICBpblNjcm9sbCA9IHRydWU7XG5cbiAgY29uc3QgcG9zaXRpb24gPSBjb3VudFNlY3Rpb25Qb3NpdGlvbihzZWN0aW9uRXEpO1xuICBjb25zdCB0cmFzaXRpb25PdmVyID0gMTAwMDtcbiAgY29uc3QgbW91c2VJbmVydGlvbk92ZXIgPSAzMDA7XG5cbiAgcmVzZXRBY3RpdmVDbGFzcyhzZWN0aW9ucywgc2VjdGlvbkVxKTtcblxuICBkaXNwbGF5LmNzcyh7XG4gICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3Bvc2l0aW9ufSUpYCxcbiAgfSk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgcmVzZXRTaWRlYmFyQWN0aXZlQ2xhc3MoJChcIi5zaWRlYmFyX19pdGVtXCIpLCBzZWN0aW9uRXEpO1xuICAgIGluU2Nyb2xsID0gZmFsc2U7XG4gIH0sIHRyYXNpdGlvbk92ZXIgKyBtb3VzZUluZXJ0aW9uT3Zlcik7XG59O1xuXG5jb25zdCBzY3JvbGxlciA9ICgpID0+IHtcbiAgY29uc3QgYWN0aXZlU2VjdGlvbiA9IHNlY3Rpb25zLmZpbHRlcihcIi5hY3RpdmVcIik7XG4gIGNvbnN0IG5leHRTZWN0aW9uID0gYWN0aXZlU2VjdGlvbi5uZXh0KCk7XG4gIGNvbnN0IHByZXZTZWN0aW9uID0gYWN0aXZlU2VjdGlvbi5wcmV2KCk7XG5cbiAgcmV0dXJuIHtcbiAgICBuZXh0KCkge1xuICAgICAgaWYgKG5leHRTZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICBwZXJmb3JtVHJhbnNpdGlvbihuZXh0U2VjdGlvbi5pbmRleCgpKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHByZXYoKSB7XG4gICAgICBpZiAocHJldlNlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHBlcmZvcm1UcmFuc2l0aW9uKHByZXZTZWN0aW9uLmluZGV4KCkpO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59O1xuXG4kKHdpbmRvdykub24oXCJ3aGVlbFwiLCAoZSkgPT4ge1xuICBjb25zdCBkZWx0YVkgPSBlLm9yaWdpbmFsRXZlbnQuZGVsdGFZO1xuICBjb25zdCB3aW5kb3dTY3JvbGxlciA9IHNjcm9sbGVyKCk7XG5cbiAgaWYgKGRlbHRhWSA+IDApIHtcbiAgICB3aW5kb3dTY3JvbGxlci5uZXh0KCk7XG4gIH1cblxuICBpZiAoZGVsdGFZIDwgMCkge1xuICAgIHdpbmRvd1Njcm9sbGVyLnByZXYoKTtcbiAgfVxufSk7XG5cbiQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICBjb25zdCB0YWdOYW1lID0gZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCB3aW5kb3dTY3JvbGxlciA9IHNjcm9sbGVyKCk7XG4gIGNvbnN0IHVzZXJUeXBpbmdJbklucHV0cyA9IHRhZ05hbWUgPT09IFwiaW5wdXRcIiB8fCB0YWdOYW1lID09PSBcInRleHRhcmVhXCI7XG5cbiAgaWYgKHVzZXJUeXBpbmdJbklucHV0cykgcmV0dXJuO1xuXG4gIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgY2FzZSAzODpcbiAgICAgIHdpbmRvd1Njcm9sbGVyLnByZXYoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgNDA6XG4gICAgICB3aW5kb3dTY3JvbGxlci5uZXh0KCk7XG4gICAgICBicmVhaztcbiAgfVxufSk7XG5cbiQoXCJbZGF0YS1zY3JvbGwtdG9dXCIpLm9uKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIGNvbnN0ICR0aGlzID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICBjb25zdCB0YXJnZXQgPSAkdGhpcy5hdHRyKFwiZGF0YS1zY3JvbGwtdG9cIik7XG5cbiAgcGVyZm9ybVRyYW5zaXRpb24odGFyZ2V0KTtcbn0pO1xuXG5pZiAoaXNNb2JpbGUpIHtcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdHRicnlzb24vVG91Y2hTd2lwZS1KcXVlcnktUGx1Z2luXG4gICQoXCJib2R5XCIpLnN3aXBlKHtcbiAgICBzd2lwZTogKGV2ZW50LCBkaXJlY3Rpb24pID0+IHtcbiAgICAgIGxldCBzY3JvbGxEaXJlY3Rpb247XG4gICAgICBjb25zdCB3aW5kb3dTY3JvbGxlciA9IHNjcm9sbGVyKCk7XG5cbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwidXBcIikgc2Nyb2xsRGlyZWN0aW9uID0gXCJuZXh0XCI7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBcImRvd25cIikgc2Nyb2xsRGlyZWN0aW9uID0gXCJwcmV2XCI7XG5cbiAgICAgIHdpbmRvd1Njcm9sbGVyW3Njcm9sbERpcmVjdGlvbl0oKTtcbiAgICB9LFxuICB9KTtcbn1cblxuLy9mZWVkc1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IG1vcmUubGVuZ3RoOyBpKyspIHtcbiAgbW9yZVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcmV2aWV3UGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICAgIGxldCByZXZpZXdUZXh0ID0gcmV2aWV3UGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZWVkc19fdGV4dCcpLmlubmVyVGV4dDtcblxuXG4gICAgbGV0IHJldmlld092ZXJsYXkgPSBjcmVhdGVPdmVybGF5KHJldmlld1RleHQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmV2aWV3T3ZlcmxheSk7XG5cbiAgfSk7XG59Il19
