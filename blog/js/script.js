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
    
    // アコーディオン
    const summary = $('.detail-open-btn');
    const details = $('.sarch');
    const sarch_condition = $('.sarch-condition');
    let speed = 300;
    $(summary).click(function(e){
        // アコーディオンのデフォルトの開け閉め挙動がされないように
        e.preventDefault();
        const this_details = $(this).parent($(details));
        const sarch_detail = $(this).nextAll($(sarch_condition));
        if($(this_details).attr('open') != undefined){
            // 閉じる
            $(this).removeClass('detail-open');
            $(sarch_detail).slideUp(speed, function(){
                $(this_details).removeAttr('open');
            });
        }else {
            // 開ける
            $(this).addClass('detail-open');
            $(this_details).attr('open', 'true');
            $(sarch_detail).hide().slideDown(speed);
        }
    });

    // 並べ替えと絞り込み用の変数
    let newest_bool = true;
    let filter_array = [];
    // 最大ページ数
    let page_max = 0;
    // 表示させる数
    let page_article_max = 10;

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
        const period = $('.period');
        const page_num = $('.page-num');
        // hiddenクラスをリセット
        $(period).removeClass('hidden');
        $(page_num).removeClass('hidden');
        // selectedクラスをリセット
        $(page_num).removeClass('selected');
        let this_page_num = $(page_num)[0];
        $(this_page_num).addClass('selected');
        // page_maxが1以上なら最大値設定
        if(page_max > 0){
            const this_page_num = $(page_num)[4];
            $(this_page_num).data('page', page_max);
            $(this_page_num).children().text(page_max + 1)
        }else {
            // 0以下なら最大値を消す
            const this_page_num = $(page_num)[4];
            $(this_page_num).addClass('hidden');
        }
        // 最初の...を消す
        let this_period = $(period)[0];
        $(this_period).addClass('hidden');
        // 5ページ以下なら
        if(page_max < 5){
            // 最後の...を消す
            let this_period = $(period)[1];
            $(this_period).addClass('hidden');
            // 4ページ以下
            if(page_max < 4){
                let this_page_num = $(page_num)[3];
                $(this_page_num).addClass('hidden');
                // 3ページ以下
                if(page_max < 3){
                    let this_page_num = $(page_num)[2];
                    $(this_page_num).addClass('hidden');
                    // 2ページ以下
                    if(page_max < 2){
                        let this_page_num = $(page_num)[1];
                        $(this_page_num).addClass('hidden');
                    }
                }
            }
        }
    }
    // 表示を切り替える
    function change_pagination() {
        let page_num = $('.page-num');
        // 6ページ以上なら
        if(page_max > 4) {
            let period = $('.period');
            // 3以上もしくは最大-2以下なら押した場所に応じて書き換え
            if(this_page > 1 && this_page < page_max - 1){
                for(let i = -1; i < 2; i ++){
                    const this_page_num = $(page_num)[i + 2];
                    $(this_page_num).data('page', this_page + i);
                    $(this_page_num).children().text(this_page + i + 1);
                }
            }
            // 押したのが1だったら
            if(this_page == 0) {
                for(let i = 0; i < 3; i ++){
                    const this_page_num = $(page_num)[i + 1];
                    $(this_page_num).data('page', i + 1);
                    $(this_page_num).children().text(i + 2);
                }
            }
            // 押したのが最後のページだったら
            if(this_page == page_max) {
                for(let i = 0; i < 3; i ++){
                    const this_page_num = $(page_num)[i + 1];
                    $(this_page_num).data('page', page_max - 3 + i);
                    $(this_page_num).children().text( page_max - 2 + i);
                }
            }
            // 左の...を表示
            if(this_page > 2){
                const this_period = $(period)[0];
                $(this_period).removeClass('hidden');
            }else {
                const this_period = $(period)[0];
                $(this_period).addClass('hidden');
            }
            // 右の...を表示
            if(this_page < page_max - 2){
                const this_period = $(period)[1];
                $(this_period).removeClass('hidden');
            }else {
                const this_period = $(period)[1];
                $(this_period).addClass('hidden');
            }

        }
        // selectedクラスを削除
        $(page_num).removeClass('selected');
        // 押した位置にselectedを追加
        for(let i = 0; i < page_num.length; i ++){
            const this_page_num = $(page_num)[i];
            if($(this_page_num).data('page') == this_page){
                $(this_page_num).addClass('selected');
            }
        }
    }

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
        // ページの最大数を設定
        page_max = Math.floor(articles_cnt / cnt);

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
        // 記事を表示させる
        articles[page].forEach(article => {
            const write_data =`
                <a class="article" href="${article.link}">
                    <div class="thumbnail">
                        <img src="${article.thumbnail == '#' || '' ? '/img/noimage.webp' : article.thumbnail}">
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