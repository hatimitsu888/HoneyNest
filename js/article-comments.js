'use strict'

// 記事欄（コメント欄）
let articles_obj = document.querySelector('.articles');

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
}

// 最新記事を見えない状態で追加
function add_comment(articles, tags) {
    for (let comment_count = 0; comment_count < Object.keys(articles).length; comment_count ++){
        const article = articles[comment_count];
        const write_html = `
            <div class="article hidden">
                <a class="article-link" href="${article.link}">
                    <div class="tag-icon" style="background-color:${tags[article.tag]['bgcolor']}">
                        <img src="/HoneyNest/img/icon/${tags[article.tag]['img']}">
                    </div>
                    <div class="article-text">
                        <div class="date">${article.date}</div>
                        <p class="title">${article.title}</p>
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

json_request();
