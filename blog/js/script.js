$(function() {
    // JSONファイルを表示
    const tags_json = '/js/json/tags.json';
    const articles_json = '/js/json/articles.json';
    let tags;
    let articles_area;
    let articles_data;
    let articles;
    $.getJSON(tags_json, function(data) {
        tags = data;
        $.getJSON(articles_json, function(data) {
            articles_data = data;
            // 絞り込み用のタグを追加]
            const filter_area = $('.filter');
            for(let tag in tags){
                const write_data = `
                    <li data-tag="${tag}" class="tag-${tag}">${tags[tag].name}</li>
                `;
                $(filter_area).append(write_data);
            }
            filter_btn = $('.filter li');
            // console.log(filter_btn);
            // 記事を整形
            sort_articles();
            // 記事を表示
            write_artciles(0);
            // ページネーション
            create_pagination();
        });
    });

    // 並べ替えと絞り込みを表示（スマホ）
    let filters_btn = $('.filters-btn');
    let filters = $('.filters-wrap');
    $(filters_btn).click(function(){
        $(filters).toggleClass('filters-close');
    });

    // 並べ替えと絞り込み用の変数
    let newest_bool = true;
    let filter_array = [];
    let search_query = '';
    // 最大ページ数
    let page_max = 0;
    // 表示させる数
    let page_article_max = 10;

    $('.article-search').on('submit', function(event) {
        event.preventDefault();
    });
    $('#article-search-input').on('input', function() {
        search_query = $(this).val().trim();
        sort_articles(newest_bool, filter_array, page_article_max);
        write_artciles(0);
        create_pagination();
    });

    // 並べ替え
    const sort_btn = $('.sort li');
    $(sort_btn).click(function() {
        // 並べ替えて表示
        if($(this).data('new') == '1'){
            if($(this).hasClass('selected')) {
                newest_bool = false;
            }else {
                newest_bool = true;
            }
        }else {
            if($(this).hasClass('selected')) {
                newest_bool = true;
            }else {
                newest_bool = false;
            }
        }
        $(sort_btn).toggleClass('selected');
        // 記事を整形して表示
        sort_articles(newest_bool, filter_array, page_article_max);
        write_artciles(0);
        this_page = 0;
        change_pagination();
    });

    // 絞り込み
    let filter_btn = $('.filter li');
    $('main').on('click', '.filter li', function() {
        // console.log('clikced');
        $(this).toggleClass('selected');
        // 絞り込んだタグを変数に
        const selected_tags = $('.filter .selected');
        filter_array = [];
        for(let i = 0; i < selected_tags.length; i ++){
            filter_array.push($(selected_tags[i]).data('tag'));
        }
        // 記事を整形して表示
        sort_articles(newest_bool, filter_array, page_article_max);
        write_artciles(0);
        create_pagination();
    });
    // 絞り込み-全て
    const filter_all = $('.tag-all');
    const filter_remove = $('.tag-remove');
    $(filter_all).click(function() {
        $(filter_btn).addClass('selected');
        filter_array = [];
        // 記事を整形して表示
        sort_articles(newest_bool, filter_array, page_article_max);
        write_artciles(0);
        create_pagination();
    });
    $(filter_remove).click(function() {
        $(filter_btn).removeClass('selected');
        filter_array = [];
        // 記事を整形して表示
        sort_articles(newest_bool, filter_array, page_article_max);
        write_artciles(0);
        create_pagination();
    });

    // ページを切り替え
    let this_page = 0;
    const paginations = $('.pagination li');
    $(paginations).click(function() {
        // 前へ次へ
        if($(this).data('page') == 'back'){
            this_page --;
            if(this_page < 0) {
                this_page = 0;
            }
        }else if($(this).data('page') == 'next'){
            this_page ++;
            if(this_page > page_max) {
                this_page = page_max;
            }
        }
        else{
            // 数字指定
            this_page = $(this).data('page');
        }
        change_pagination();

        // console.log(page_max);
        // console.log(this_page);
        
        // 記事を表示
        write_artciles(this_page);
    });

    // ページネーションの表示
    // 作る
    function create_pagination() {
        this_page = 0;
        change_pagination();
    }
    // 表示を切り替える
    function change_pagination() {
        const period = $('.period');
        const page_num = $('.page-num');
        const page_count = page_max + 1;
        let visible_pages;
        if (page_count <= 5) {
            visible_pages = Array.from({ length: page_count }, (_, index) => index);
            $(period).addClass('hidden');
        } else {
            let first_middle_page;
            if (this_page <= 2) {
                first_middle_page = 1;
            } else if (this_page >= page_max - 2) {
                first_middle_page = page_max - 3;
            } else {
                first_middle_page = this_page - 1;
            }
            visible_pages = [0, first_middle_page, first_middle_page + 1, first_middle_page + 2, page_max];
            $(period[0]).toggleClass('hidden', first_middle_page <= 1);
            $(period[1]).toggleClass('hidden', first_middle_page + 2 >= page_max - 1);
        }
        page_num.each(function(index) {
            const page = visible_pages[index];
            $(this).toggleClass('hidden', page === undefined);
            $(this).toggleClass('selected', page === this_page);
            if (page !== undefined) {
                $(this).attr('data-page', page).data('page', page);
                $(this).children().text(page + 1);
            }
        });
    }

    // 記事を整形
    function sort_articles(newest = true, filter = [], cnt = 10, query = search_query) {
        articles_area = $('.articles-area');
        const normalized_query = query.toLocaleLowerCase();
        const filtered_articles = articles_data.filter(article => {
            const matches_tag = filter.length === 0 || filter.includes(article.tag);
            const searchable_text = `${article.title} ${tags[article.tag]['name']} ${article.date}`.toLocaleLowerCase();
            return matches_tag && (!normalized_query || searchable_text.includes(normalized_query));
        });
        const articles_cnt = Object.keys(filtered_articles).length;
        // ページの最大数を設定
        page_max = Math.max(0, Math.ceil(articles_cnt / cnt) - 1);

        // ページを作成
        articles = [[]];
        for(let i = 0; i < articles_cnt; i ++){
            const j = Math.floor(i / cnt);
            const k = i % cnt;
            if(k == 0) {articles.push([])};
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
        // 既存の記事を削除
        $(write_area).children().remove();
        if (!articles[page] || articles[page].length === 0) {
            $(write_area).append('<p class="no-search-results" role="status">該当する記事が見つかりませんでした。</p>');
            return;
        }
        // 記事を表示させる
        articles[page].forEach(article => {
            const write_data =`
                <a class="article" href="${article.link}">
                    <div class="thumbnail">
                        <img src="${article.thumbnail && article.thumbnail !== '#' ? article.thumbnail : '/img/noimage.webp'}" alt="${article.title}">
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