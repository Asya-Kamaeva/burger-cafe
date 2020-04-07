

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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuY29uc3QgaGFtYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oYW1idXJnZXJcIik7XG5jb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5hdlwiKTtcbmNvbnN0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRlYW1fX25hbWVcIik7XG5jb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tZW51X19pdGVtXCIpO1xuY29uc3QgbGVmdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19jb250cm9sX3ByZXZcIik7XG5jb25zdCByaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19jb250cm9sX25leHRcIik7XG5jb25zdCBsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2xpc3RcIik7XG5jb25zdCBteUZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlGb3JtJyk7XG5jb25zdCBzZW5kQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NlbmRCdXR0b24nKTtcbmNvbnN0IHN1Y2Nlc3NPdmVybGF5ID0gY3JlYXRlT3ZlcmxheShcIjxiPtCh0LrQvtGA0L4g0YLRiyDQsdGD0LTQtdGI0Ywg0L3QsNC60L7RgNC80LvQtdC9ITwvYj5cIik7XG5jb25zdCBmYWlsT3ZlcmxheSA9IGNyZWF0ZU92ZXJsYXkoXCI8Yj7QodC40LTQuCDQs9C+0LvQvtC00L3Ri9C5LCDRgtGLINC90LUg0LfQsNGB0LvRg9C20LjQuyE8L2I+XCIpO1xuY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF07XG5jb25zdCBtb3JlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mZWVkc19fcGFyZW50X2xpbmtcIik7XG5cblxuaGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICBuYXYuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdl9hY3RpdmVcIik7XG4gIGhhbWJ1cmdlci5jbGFzc0xpc3QudG9nZ2xlKFwiaGFtYnVyZ2VyX2FjdGl2ZVwiKTtcbn0pO1xuXG5cbmZvciAobGV0IGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykge1xuICBuYW1lW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKG5hbWVbaV0uY2xhc3NMaXN0LnZhbHVlID09IFwidGVhbV9fbmFtZSB0ZWFtX19uYW1lX2FjdGl2ZVwiKSB7XG4gICAgICBuYW1lW2ldLmNsYXNzTGlzdC50b2dnbGUoJ3RlYW1fX25hbWVfYWN0aXZlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlYW1fX25hbWVfYWN0aXZlXCIpKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGVhbV9fbmFtZV9hY3RpdmVcIikuY2xhc3NMaXN0LnJlbW92ZSgndGVhbV9fbmFtZV9hY3RpdmUnKTtcbiAgICAgIH1cblxuICAgICAgbmFtZVtpXS5jbGFzc0xpc3QudG9nZ2xlKFwidGVhbV9fbmFtZV9hY3RpdmVcIik7XG4gICAgfVxuICB9KTtcbn1cblxuXG5cblxuZm9yIChsZXQgaSA9IDA7IGkgPCBtZW51Lmxlbmd0aDsgaSsrKSB7XG4gIG1lbnVbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChtZW51W2ldLmNsYXNzTGlzdC52YWx1ZSA9PSBcIm1lbnVfX2l0ZW0gbWVudV9faXRlbV9hY3RpdmVcIikge1xuICAgICAgbWVudVtpXS5jbGFzc0xpc3QucmVtb3ZlKCdtZW51X19pdGVtX2FjdGl2ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51X19pdGVtX2FjdGl2ZVwiKSkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVfX2l0ZW1fYWN0aXZlXCIpLmNsYXNzTGlzdC5yZW1vdmUoJ21lbnVfX2l0ZW1fYWN0aXZlJyk7XG4gICAgICB9XG4gICAgICBtZW51W2ldLmNsYXNzTGlzdC50b2dnbGUoXCJtZW51X19pdGVtX2FjdGl2ZVwiKTtcbiAgICB9XG5cbiAgfSk7XG5cbn1cblxuLy9zbGlkZXJcblxubGVmdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgbG9vcChcImxlZnRcIiwgZSk7XG59KTtcblxucmlnaHQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGxvb3AoXCJyaWdodFwiLCBlKTtcbn0pO1xuXG5mdW5jdGlvbiBsb29wKGRpcmVjdGlvbiwgZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgaWYgKGRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgbGlzdC5hcHBlbmRDaGlsZChsaXN0LmZpcnN0RWxlbWVudENoaWxkKTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0Lmluc2VydEJlZm9yZShsaXN0Lmxhc3RFbGVtZW50Q2hpbGQsIGxpc3QuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICB9XG59XG5cbi8vZm9ybVxuXG5zZW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cblxuICBpZiAodmFsaWRhdGVGb3JtKG15Rm9ybSkpIHtcblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJ0b1wiLCBcImFzLmthbWFldmFAeWFuZGV4LnJ1XCIpO1xuICAgIGZvcm1EYXRhLmFwcGVuZChcIm5hbWVcIiwgbXlGb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUpO1xuICAgIGZvcm1EYXRhLmFwcGVuZChcInBob25lXCIsIG15Rm9ybS5lbGVtZW50cy5waG9uZS52YWx1ZSlcbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJjb21tZW50XCIsIG15Rm9ybS5lbGVtZW50cy5jb21tZW50LnZhbHVlKTtcblxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgJ2h0dHBzOi8vd2ViZGV2LWFwaS5sb2Z0c2Nob29sLmNvbS9zZW5kbWFpbCcpO1xuXG4gICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcblxuICAgICAgaWYgKHJlc3VsdC5zdGF0dXMpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdWNjZXNzT3ZlcmxheSk7XG4gICAgICAgIGNvbnN0IGZvcm1DbGVhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3JkZXJfX2J1dHRvbl9ub25lXCIpO1xuICAgICAgICBmb3JtQ2xlYW4uY2xpY2soKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmYWlsT3ZlcmxheSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufSk7XG5cblxuZnVuY3Rpb24gY3JlYXRlT3ZlcmxheShjb250ZW50KSB7XG4gIGNvbnN0IG92ZXJsYXlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgb3ZlcmxheUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm9yZGVyX19vdmVybGF5XCIpO1xuXG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdmVybGF5VGVtcGxhdGVcIik7XG4gIG92ZXJsYXlFbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlLmlubmVySFRNTDtcbiAgb3ZlcmxheUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlLnRhcmdldCA9PSBvdmVybGF5RWxlbWVudCkge1xuICAgICAgY2xvc2VFbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBjbG9zZUVsZW1lbnQgPSBvdmVybGF5RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcub3JkZXJfX292ZXJsYXlfY2xvc2UnKTtcbiAgY2xvc2VFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChvdmVybGF5RWxlbWVudCk7XG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgfSk7XG5cbiAgY29uc3QgY29udGVudEVsZW1lbnQgPSBvdmVybGF5RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm9yZGVyX19vdmVybGF5X2NvbnRlbnRcIik7XG4gIGNvbnRlbnRFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cblxuICByZXR1cm4gb3ZlcmxheUVsZW1lbnQ7XG5cbn1cblxuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlRm9ybShteUZvcm0pIHtcbiAgbGV0IHZhbGlkID0gdHJ1ZTtcblxuICBpZiAoIXZhbGlkYXRlRmllbGQobXlGb3JtLmVsZW1lbnRzLm5hbWUpKSB7XG4gICAgdmFsaWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghdmFsaWRhdGVGaWVsZChteUZvcm0uZWxlbWVudHMucGhvbmUpKSB7XG4gICAgdmFsaWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghdmFsaWRhdGVGaWVsZChteUZvcm0uZWxlbWVudHMuc3RyZWV0KSkge1xuICAgIHZhbGlkID0gZmFsc2U7XG4gIH1cblxuICBpZiAoIXZhbGlkYXRlRmllbGQobXlGb3JtLmVsZW1lbnRzLmhvdXNlKSkge1xuICAgIHZhbGlkID0gZmFsc2U7XG4gIH1cblxuICBpZiAoIXZhbGlkYXRlRmllbGQobXlGb3JtLmVsZW1lbnRzLmFwYXJ0bWVudCkpIHtcbiAgICB2YWxpZCA9IGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHZhbGlkO1xuXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlRmllbGQob3JkZXJfX2Jsb2NrKSB7XG4gIG9yZGVyX19ibG9jay5uZXh0RWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQgPSBvcmRlcl9fYmxvY2sudmFsaWRhdGlvbk1lc3NhZ2U7XG4gIHJldHVybiBvcmRlcl9fYmxvY2suY2hlY2tWYWxpZGl0eSgpO1xuXG59XG5cbi8v0Y/QvdC00LXQutGBINC60LDRgNGC0YtcblxubGV0IG15TWFwO1xuXG5jb25zdCBpbml0ID0gKCkgPT4ge1xuICBteU1hcCA9IG5ldyB5bWFwcy5NYXAoXCJtYXBcIiwge1xuICAgIGNlbnRlcjogWzU5LjkzODQ3NywgMzAuMzIyMjM1XSxcbiAgICB6b29tOiAxMSxcbiAgICBjb250cm9sczogW11cbiAgfSk7XG5cbiAgY29uc3QgY29vcmRzID0gW1xuICAgIFs1OS45NzU0NTcsIDMwLjMxNDYzOF0sXG4gICAgWzU5Ljk1MDIzNSwgMzAuMzg1OTAwXSxcbiAgICBbNTkuOTMxNjU2LCAzMC4yNzEzMjJdLFxuICAgIFs1OS45NDUzMjgsIDMwLjI0MTYzMF1cbiAgXTtcblxuICBjb25zdCBteUNvbGxlY3Rpb24gPSBuZXcgeW1hcHMuR2VvT2JqZWN0Q29sbGVjdGlvbih7fSwge1xuXG4gICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICBpY29uTGF5b3V0OiAnZGVmYXVsdCNpbWFnZScsXG4gICAgaWNvbkltYWdlSHJlZjogJy4uL2ltZy9tYXAtbWFya2VyLnN2ZycsXG4gICAgaWNvbkltYWdlU2l6ZTogWzQ0LCA1NV0sXG4gICAgaWNvbkltYWdlT2Zmc2V0OiBbLTM1LCAtNTJdXG4gIH0pO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbXlDb2xsZWN0aW9uLmFkZChuZXcgeW1hcHMuUGxhY2VtYXJrKGNvb3Jkc1tpXSkpO1xuICB9XG5cbiAgbXlNYXAuZ2VvT2JqZWN0cy5hZGQobXlDb2xsZWN0aW9uKTtcblxuICBteU1hcC5iZWhhdmlvcnMuZGlzYWJsZSgnc2Nyb2xsWm9vbScpO1xufVxuXG55bWFwcy5yZWFkeShpbml0KTtcblxuLy9wbGF5ZXJcblxubGV0IHBsYXllcjtcbmZ1bmN0aW9uIG9uWW91VHViZUlmcmFtZUFQSVJlYWR5KCkge1xuICBwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCdwbGF5ZXInLCB7XG4gICAgd2lkdGg6ICc2NDAnLFxuICAgIGhlaWdodDogJzM2MCcsXG4gICAgdmlkZW9JZDogJ1pMeXdVUHB1T2lnJyxcbiAgICBldmVudHM6IHtcbiAgICAgICdvblJlYWR5Jzogb25QbGF5ZXJSZWFkeSxcbiAgICAgICdvblN0YXRlQ2hhbmdlJzogb25QbGF5ZXJTdGF0ZUNoYW5nZVxuICAgIH0sXG5cbiAgICBwbGF5ZXJWYXJzOiB7XG4gICAgICAnc2hvd2luZm8nOiAwLFxuICAgICAgJ3JlbCc6IDAsXG4gICAgICAnbW9kZXN0YnJhbmRpbmcnOiAxXG4gICAgfVxuXG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIG9uUGxheWVyUmVhZHkoZXZlbnQpIHtcbiAgZXZlbnQudGFyZ2V0LnBsYXlWaWRlbygpO1xufVxuXG5cbmxldCBkb25lID0gZmFsc2U7XG5mdW5jdGlvbiBvblBsYXllclN0YXRlQ2hhbmdlKGV2ZW50KSB7XG4gIGlmIChldmVudC5kYXRhID09IFlULlBsYXllclN0YXRlLlBMQVlJTkcgJiYgIWRvbmUpIHtcbiAgICBzZXRUaW1lb3V0KHN0b3BWaWRlbywgNjAwMCk7XG4gICAgZG9uZSA9IHRydWU7XG4gIH1cbn1cbmZ1bmN0aW9uIHN0b3BWaWRlbygpIHtcbiAgcGxheWVyLnN0b3BWaWRlbygpO1xufVxuXG5cbi8vb25lcGFnZSBzY3JvbGxcblxuY29uc3Qgc2VjdGlvbnMgPSAkKFwiLnNlY3Rpb25cIik7XG5jb25zdCBkaXNwbGF5ID0gJChcIi5tYWluY29udGVudFwiKTtcblxubGV0IGluU2Nyb2xsID0gZmFsc2U7XG5cbmNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5jb25zdCBpc01vYmlsZSA9IG1kLm1vYmlsZSgpO1xuXG5jb25zdCBjb3VudFNlY3Rpb25Qb3NpdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcblxuICBjb25zdCBwb3NpdGlvbiA9IHNlY3Rpb25FcSAqIC0xMDA7XG4gIGlmIChpc05hTihwb3NpdGlvbikpXG4gICAgY29uc29sZS5lcnJvcihcItC/0LXRgNC10LTQsNC90L4g0L3QtSDQstC10YDQvdC+0LUg0LfQvdCw0YfQtdC90LjQtSDQsiBjb3VudFNlY3Rpb25Qb3NpdG9uXCIpO1xuXG4gIHJldHVybiBwb3NpdGlvbjtcbn07XG5cbmNvbnN0IHJlc2V0QWN0aXZlQ2xhc3MgPSAoaXRlbSwgZXEpID0+IHtcbiAgaXRlbS5lcShlcSkuYWRkQ2xhc3MoXCJhY3RpdmVcIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbn07XG5cbmNvbnN0IHJlc2V0U2lkZWJhckFjdGl2ZUNsYXNzID0gKGl0ZW0sIGVxKSA9PiB7XG4gIGl0ZW0uZXEoZXEpLmFkZENsYXNzKFwic2lkZWJhcl9fYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJzaWRlYmFyX19hY3RpdmVcIik7XG59O1xuXG5jb25zdCBwZXJmb3JtVHJhbnNpdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcbiAgaWYgKGluU2Nyb2xsKSByZXR1cm47XG5cbiAgaW5TY3JvbGwgPSB0cnVlO1xuXG4gIGNvbnN0IHBvc2l0aW9uID0gY291bnRTZWN0aW9uUG9zaXRpb24oc2VjdGlvbkVxKTtcbiAgY29uc3QgdHJhc2l0aW9uT3ZlciA9IDEwMDA7XG4gIGNvbnN0IG1vdXNlSW5lcnRpb25PdmVyID0gMzAwO1xuXG4gIHJlc2V0QWN0aXZlQ2xhc3Moc2VjdGlvbnMsIHNlY3Rpb25FcSk7XG5cbiAgZGlzcGxheS5jc3Moe1xuICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZVkoJHtwb3NpdGlvbn0lKWAsXG4gIH0pO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHJlc2V0U2lkZWJhckFjdGl2ZUNsYXNzKCQoXCIuc2lkZWJhcl9faXRlbVwiKSwgc2VjdGlvbkVxKTtcbiAgICBpblNjcm9sbCA9IGZhbHNlO1xuICB9LCB0cmFzaXRpb25PdmVyICsgbW91c2VJbmVydGlvbk92ZXIpO1xufTtcblxuY29uc3Qgc2Nyb2xsZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGFjdGl2ZVNlY3Rpb24gPSBzZWN0aW9ucy5maWx0ZXIoXCIuYWN0aXZlXCIpO1xuICBjb25zdCBuZXh0U2VjdGlvbiA9IGFjdGl2ZVNlY3Rpb24ubmV4dCgpO1xuICBjb25zdCBwcmV2U2VjdGlvbiA9IGFjdGl2ZVNlY3Rpb24ucHJldigpO1xuXG4gIHJldHVybiB7XG4gICAgbmV4dCgpIHtcbiAgICAgIGlmIChuZXh0U2VjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgcGVyZm9ybVRyYW5zaXRpb24obmV4dFNlY3Rpb24uaW5kZXgoKSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwcmV2KCkge1xuICAgICAgaWYgKHByZXZTZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICBwZXJmb3JtVHJhbnNpdGlvbihwcmV2U2VjdGlvbi5pbmRleCgpKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufTtcblxuJCh3aW5kb3cpLm9uKFwid2hlZWxcIiwgKGUpID0+IHtcbiAgY29uc3QgZGVsdGFZID0gZS5vcmlnaW5hbEV2ZW50LmRlbHRhWTtcbiAgY29uc3Qgd2luZG93U2Nyb2xsZXIgPSBzY3JvbGxlcigpO1xuXG4gIGlmIChkZWx0YVkgPiAwKSB7XG4gICAgd2luZG93U2Nyb2xsZXIubmV4dCgpO1xuICB9XG5cbiAgaWYgKGRlbHRhWSA8IDApIHtcbiAgICB3aW5kb3dTY3JvbGxlci5wcmV2KCk7XG4gIH1cbn0pO1xuXG4kKGRvY3VtZW50KS5vbihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgY29uc3QgdGFnTmFtZSA9IGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgY29uc3Qgd2luZG93U2Nyb2xsZXIgPSBzY3JvbGxlcigpO1xuICBjb25zdCB1c2VyVHlwaW5nSW5JbnB1dHMgPSB0YWdOYW1lID09PSBcImlucHV0XCIgfHwgdGFnTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiO1xuXG4gIGlmICh1c2VyVHlwaW5nSW5JbnB1dHMpIHJldHVybjtcblxuICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgIGNhc2UgMzg6XG4gICAgICB3aW5kb3dTY3JvbGxlci5wcmV2KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDQwOlxuICAgICAgd2luZG93U2Nyb2xsZXIubmV4dCgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG4kKFwiW2RhdGEtc2Nyb2xsLXRvXVwiKS5vbihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICBjb25zdCAkdGhpcyA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgY29uc3QgdGFyZ2V0ID0gJHRoaXMuYXR0cihcImRhdGEtc2Nyb2xsLXRvXCIpO1xuXG4gIHBlcmZvcm1UcmFuc2l0aW9uKHRhcmdldCk7XG59KTtcblxuaWYgKGlzTW9iaWxlKSB7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0YnJ5c29uL1RvdWNoU3dpcGUtSnF1ZXJ5LVBsdWdpblxuICAkKFwiYm9keVwiKS5zd2lwZSh7XG4gICAgc3dpcGU6IChldmVudCwgZGlyZWN0aW9uKSA9PiB7XG4gICAgICBsZXQgc2Nyb2xsRGlyZWN0aW9uO1xuICAgICAgY29uc3Qgd2luZG93U2Nyb2xsZXIgPSBzY3JvbGxlcigpO1xuXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBcInVwXCIpIHNjcm9sbERpcmVjdGlvbiA9IFwibmV4dFwiO1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJkb3duXCIpIHNjcm9sbERpcmVjdGlvbiA9IFwicHJldlwiO1xuXG4gICAgICB3aW5kb3dTY3JvbGxlcltzY3JvbGxEaXJlY3Rpb25dKCk7XG4gICAgfSxcbiAgfSk7XG59XG5cbi8vZmVlZHNcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBtb3JlLmxlbmd0aDsgaSsrKSB7XG4gIG1vcmVbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHJldmlld1BhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgICBsZXQgcmV2aWV3VGV4dCA9IHJldmlld1BhcmVudC5xdWVyeVNlbGVjdG9yKCcuZmVlZHNfX3RleHQnKS5pbm5lclRleHQ7XG5cblxuICAgIGxldCByZXZpZXdPdmVybGF5ID0gY3JlYXRlT3ZlcmxheShyZXZpZXdUZXh0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJldmlld092ZXJsYXkpO1xuXG4gIH0pO1xufVxuXG4iXX0=
