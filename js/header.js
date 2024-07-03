'use strict'

// ハンバーガーメニュー
let hamburger = document.querySelector('.hamburger');
let header = document.querySelector('header');
let header_link = document.querySelector('.header-link')
hamburger.addEventListener('click',() => {
    header.classList.toggle('open');
    header_link.classList.toggle('open');
    hamburger.classList.toggle('open');
});
