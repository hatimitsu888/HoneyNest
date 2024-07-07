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

// 最新記事を見えない状態で追加
function add_comment(articles, tags) {
    for (let i = 0; i < Object.keys(articles).length; i ++){
        const article = articles[i];
        const write_html = `
            <div class="mainvisual article hidden">
                <a class="mainvisual article-link" href="${article.link}">
                    <div class="mainvisual tag-icon" style="background-color:${tags[article.tag]['color']}">
                        <img src="/img/icon/${tags[article.tag]['img']}">
                    </div>
                    <div class="mainvisual article-text">
                        <div class="mainvisual date">${article.date}</div>
                        <p class="mainvisual title">${article.title}</p>
                    </div>
                </a>
            </div>
        `;
        articles_obj.insertAdjacentHTML('afterbegin', write_html);
    }
    setTimeout(visible_comment, 1000);
    comment_interval = setInterval(visible_comment, 10000);
}
// 一定時間毎に表示
let comment_interval;
function visible_comment(){
    try {
        let comments = document.querySelectorAll('.article.hidden');
        comments[0].classList.remove('hidden');
    }
    catch {
        clearInterval(comment_interval);
    }
}

// 最新記事を追加
function add_new_article(articles, tags) {
    const articles_cnt = Object.keys(articles).length;
    for(let i = 0; i < articles_cnt && i < 11; i ++){
        const article = articles[articles_cnt - 1 - i];
        const write_html = `
            <a href="${article.link}" class="new-article article">
                <div class="new-article thumbnail">
                    <img src="${article.thumbnail == '#' || '' ? '/img/noimage.webp' : article.thumbnail}">
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
