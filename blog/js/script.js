$(function() {
    // アコーディオン
    const summary = $('.detail-open-btn');
    const details = $('.sarch');
    const sarch_condition = $('.sarch-condition');
    let speed = 300;
    $(summary).click(function(e){
        e.preventDefault();
        const this_details = $(this).parent($(details));
        const sarch_detail = $(this).nextAll($(sarch_condition));
        console.log($(this_details).attr('open'));
        if($(this_details).attr('open') != undefined){
            $(this).removeClass('detail-open');
            $(sarch_detail).slideUp(speed, function(){
                $(this_details).removeAttr('open');
            });
        }else {
            $(this).addClass('detail-open');
            $(this_details).attr('open', 'true');
            $(sarch_detail).hide().slideDown(speed);
        }
    });

    // 並べ替え
    const sort_btn = $('.sort li');
    $(sort_btn).click(function() {
        $(sort_btn).toggleClass('selected');
    });

    // 絞り込み
    const filter_btn = $('.filter li');
    $(filter_btn).click(function() {
        $(this).toggleClass('selected');
    });

    // 絞り込み-全て
    const filter_all = $('.tag-all');
    const filter_remove = $('.tag-remove');
    $(filter_all).click(function() {
        $(filter_btn).addClass('selected');
    });
    $(filter_remove).click(function() {
        $(filter_btn).removeClass('selected');
    });

    // JSONファイルを表示
    const tags_json = '/HoneyNest/js/json/tags.json';
    const articles_json = '/HoneyNest/js/json/articles.json';
    let tags;
    let articles_area;
    let articles_data;
    let articles;
    let article_page = 0;
    $.getJSON(tags_json, function(data) {
        tags = data;
        $.getJSON(articles_json, function(data) {
            articles_data = data;
            // 記事を整形
            sort_articles();
            // 記事を表示
            write_artciles(0);
        });
    });

    // 記事を整形
    function sort_articles(newest = true, filter = [], cnt = 10) {
        articles_area = $('.articles-area');
        // フィルタリング
        let filtered_articles = [];
        if(filter[0]) {
            articles_data.forEach(e => {
                const this_article = e;
                filter.forEach(e => {
                    if(this_article.tag == e){
                        filtered_articles.push(this_article);
                    }
                });
            });
        }else{
            filtered_articles = articles_data;
        }
        const articles_cnt = Object.keys(filtered_articles).length;

        articles = [[]];
        for(let i = 0; i < articles_cnt; i ++){
            const j = Math.floor(i / cnt);
            const k = i % cnt;
            if(j == 0 && k == 0) {articles.push([])};
            if(newest){
                articles[j].push(filtered_articles[articles_cnt - 1 - i]);
            }else{
                articles[j].push(filtered_articles[i]);
            }
        }
    }

    // 記事を表示
    function write_artciles(page) {
        const write_area = $('.articles-area');
        articles[page].forEach(article => {
            const write_data =`
                <a class="article" href="${article.link}">
                    <div class="thumbnail">
                        <img src="${article.thumbnail == '#' || '' ? '/HoneyNest/img/noimage.webp' : article.thumbnail}">
                    </div>
                    <div class="article-text">
                        <div class="article-title">${article.title}</div>
                        <div class="article-tag" style="border-color: ${tags[article.tag]['color']};">${tags[article.tag]['name']}</div>
                        <div class="article-date">${article.date}</div>
                    </div>
                </a>
            `
            $(write_area).append(write_data);
        });
    }
});