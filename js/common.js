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

const side_drawer_configs = [
    { selector: '.filters-wrap', close_class: 'filters-close', handle_selector: '.filters-btn' },
    { selector: '#sidebar', close_class: 'sidebar-toc-close', handle_selector: '.sidebar-toc-btn' }
];
let active_drawer_swipe = null;
let pending_swipe_click = null;

document.addEventListener('pointerdown', (event) => {
    pending_swipe_click = null;
    if (!['touch', 'pen'].includes(event.pointerType) || !window.matchMedia('(max-width: 800px)').matches) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
        return;
    }

    for (const config of side_drawer_configs) {
        const drawer = document.querySelector(config.selector);
        if (!drawer) {
            continue;
        }
        const is_closed = drawer.classList.contains(config.close_class);
        active_drawer_swipe = {
            drawer,
            close_class: config.close_class,
            start_x: event.clientX,
            start_y: event.clientY,
            click_target: target.closest('a, button, input, textarea, select, summary, [role], [onclick], img, .filters-btn, .sidebar-toc-btn, .thumbnails-area > div'),
            is_closed
        };
        return;
    }
});

document.addEventListener('pointerup', (event) => {
    if (!active_drawer_swipe) {
        return;
    }

    const swipe = active_drawer_swipe;
    active_drawer_swipe = null;
    const delta_x = event.clientX - swipe.start_x;
    const delta_y = event.clientY - swipe.start_y;
    if (Math.abs(delta_x) < 48 || Math.abs(delta_x) < Math.abs(delta_y) * 1.25) {
        return;
    }

    if ((swipe.is_closed && delta_x < 0) || (!swipe.is_closed && delta_x > 0)) {
        if (swipe.is_closed) {
            swipe.drawer.classList.remove(swipe.close_class);
        } else {
            swipe.drawer.classList.add(swipe.close_class);
        }
        pending_swipe_click = swipe.click_target ? {
            target: swipe.click_target,
            expires_at: performance.now() + 500
        } : null;
    }
});

document.addEventListener('pointercancel', () => {
    active_drawer_swipe = null;
});

document.addEventListener('click', (event) => {
    if (!pending_swipe_click) {
        return;
    }

    const pending_click = pending_swipe_click;
    if (performance.now() > pending_click.expires_at) {
        pending_swipe_click = null;
        return;
    }

    const target = event.target;
    if (target instanceof Node && (target === pending_click.target || pending_click.target.contains(target))) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
    pending_swipe_click = null;
}, true);

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
