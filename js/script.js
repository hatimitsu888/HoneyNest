'use strict'

// 記事欄（コメント欄）
let articles_obj = document.querySelector('.mainvisual.articles');
let new_articles_obj = document.querySelector('.new-articles');

// 記事・タグを取得
async function fetch_json(url) {
    let data = await fetch(url);
    const json = await data.json();
    return json;
}
async function json_request() {
    const articles_json = await fetch_json('./js/json/articles.json');
    const tags_json = await fetch_json('./js/json/tags.json');
    add_comment(articles_json, tags_json);
    add_new_article(articles_json, tags_json);
}

function create_comment_html(article, tags) {
    return `
        <div class="mainvisual article hidden">
            <a class="mainvisual article-link" href="${article.link}">
                <div class="mainvisual tag-icon" style="background-color:${tags[article.tag]['color']}">
                    <img src="/img/icon/${tags[article.tag]['img']}" alt="">
                </div>
                <div class="mainvisual article-text">
                    <div class="mainvisual date">${article.date}</div>
                    <p class="mainvisual title">${article.title}</p>
                </div>
            </a>
        </div>
    `;
}

let comment_interval;
let initial_comments_remaining = 0;
let random_articles;
let random_article_tags;
const max_comment_count = 15;

// 最新5件を順番に表示し、その後は記事をランダムに追加
function add_comment(articles, tags) {
    if (articles.length === 0) {
        return;
    }

    const latest_articles = articles.slice(-5).reverse();
    initial_comments_remaining = latest_articles.length;
    random_articles = articles;
    random_article_tags = tags;

    for (let i = latest_articles.length - 1; i >= 0; i--) {
        articles_obj.insertAdjacentHTML('afterbegin', create_comment_html(latest_articles[i], tags));
    }
    setTimeout(visible_comment, 1000);
    comment_interval = setInterval(visible_comment, 5000);
}

// 一定時間毎に表示
function visible_comment(){
    const next_comment = articles_obj.querySelector('.article.hidden');
    if (next_comment && initial_comments_remaining > 0) {
        next_comment.classList.remove('hidden');
        initial_comments_remaining--;
        return;
    }

    const article = random_articles[Math.floor(Math.random() * random_articles.length)];
    articles_obj.insertAdjacentHTML('beforeend', create_comment_html(article, random_article_tags));
    const random_comment = articles_obj.lastElementChild;
    if (articles_obj.children.length > max_comment_count) {
        articles_obj.firstElementChild.remove();
    }
    setTimeout(() => random_comment.classList.remove('hidden'), 50);
}

// 最新記事を追加
function add_new_article(articles, tags) {
    const articles_cnt = Object.keys(articles).length;
    let view_article = 8;
    if(window.innerWidth <= 800) {
        view_article = 5;
    }
    for(let i = 0; i < articles_cnt && i < view_article; i ++){
        const article = articles[articles_cnt - 1 - i];
        const write_html = `
            <a href="${article.link}" class="new-article article">
                <div class="new-article thumbnail">
                    <img src="${article.thumbnail && article.thumbnail !== '#' ? article.thumbnail : '/img/noimage.webp'}" alt="${article.title}">
                    <div class="new-article tag" style="border-color:${tags[article.tag]['color']};">
                        <span>${tags[article.tag]['name']}</span>
                    </div>
                </div>
                <div class="new-article title">
                    <h2>${article.title}</h2>
                </div>
                <div class="new-article date">
                    <span>${article.date}</span>
                </div>
            </a>
        `
        new_articles_obj.insertAdjacentHTML('beforeend', write_html);
    }
}

json_request();
