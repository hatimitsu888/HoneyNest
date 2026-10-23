'use strict'

// ハンバーガーメニュー
let hamburger = document.querySelector('.hamburger');
let header = document.querySelector('header');
let header_link = document.querySelector('.header-link')
const scroll_lock_reasons = new Set();

function lockPageScroll(reason) {
    if (scroll_lock_reasons.has(reason)) {
        return;
    }
    if (scroll_lock_reasons.size === 0) {
        document.body.style.setProperty('--scroll-lock-offset', `-${window.scrollY}px`);
    }
    scroll_lock_reasons.add(reason);
    document.body.classList.add('scroll-locked');
}

function unlockPageScroll(reason) {
    scroll_lock_reasons.delete(reason);
    if (scroll_lock_reasons.size !== 0) {
        return;
    }
    const scroll_position = Math.abs(parseFloat(document.body.style.getPropertyValue('--scroll-lock-offset')) || 0);
    document.body.classList.remove('scroll-locked');
    document.body.style.removeProperty('--scroll-lock-offset');
    window.scrollTo(0, scroll_position);
}

hamburger.addEventListener('click', () => {
    header.classList.toggle('open');
    header_link.classList.toggle('open');
    hamburger.classList.toggle('open');
    if (window.matchMedia('(max-width: 800px)').matches && header.classList.contains('open')) {
        lockPageScroll('menu');
    } else {
        unlockPageScroll('menu');
    }
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
