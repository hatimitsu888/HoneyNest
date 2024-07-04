'use strict'

// ハンバーガーメニュー
let hamburger = document.querySelector('.hamburger');
let header = document.querySelector('header');
let header_link = document.querySelector('.header-link')
hamburger.addEventListener('click', () => {
    header.classList.toggle('open');
    header_link.classList.toggle('open');
    hamburger.classList.toggle('open');
});

// トップへ戻る
$(document).ready(function () {
    let pagetop = $('.page-top');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 160) {
            pagetop.fadeIn();
        } else {
            pagetop.fadeOut();
        }
    });
    pagetop.click(function () {
        $('body, html').animate({ scrollTop: 0 }, 500);
        return false;
    });
});
