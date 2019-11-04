let menuToggleButton = document.querySelector('.header__menu-toggle');

menuToggleButton.onclick = (e) => document.querySelector('.header__menu.menu').classList.toggle('menu--opened');