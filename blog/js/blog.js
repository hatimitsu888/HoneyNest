$(function() {
    // 目次を作成
    const toc_area = $('.toc ol');
    let toc_layer = 0;
    let write_toc = '';
    $('#blog h2, #blog h3').each(function() {
        const title = $(this).text();

        // タグを付ける
        $(this).removeAttr('id');
        $(this).attr('id', title);

        // 前がh2で今がh3なら
        if ($(this).prop('tagName') == 'H3' && toc_layer == 0){
            write_toc += '<ul>';
        }
        // 前がh3で今がh2なら
        if ($(this).prop('tagName') == 'H2' && toc_layer == 1){
            write_toc += '</ul>';
        }

        // 目次を作成
        write_toc += `<li><a href="#${title}">${title}</a></li>`;

        // 見出しタグの種類を保存
        if ($(this).prop('tagName') == 'H2'){ toc_layer = 0 }
        else{ toc_layer = 1 }
    });
    
    // 書き出し
    $(toc_area).append(write_toc);

    // 目次をクリック
    $('main').on('click', '.toc a', function() {
        // スクロール速度
        const speed = 500;
        // 目次のリンク先を取得
        const href = $(this).attr('href');
        const target = $(href);
        // ヘッダーの高さを取得
        const header_height = $('header').height();
        // 何px上にするか決める
        const offset = 64;
        // 位置を計算
        const pos = target.offset().top - header_height - offset;

        // 移動
        $('body, html').animate({ scrollTop: pos }, speed);
    });

    // 画像をクリック
    const img = $('#blog img');
    const modal = $('#modal');
    $(img).click(function(){
        $(modal).removeClass('hidden');
        const url = $(this).attr('src');
        const alt = $(this).attr('alt');
        const a = $(modal).find('a');
        const img = $(modal).find('img');
        $(img).attr('src', url);
        $(img).attr('alt', alt);
        $(a).attr('href', url);
        $(a).text(alt);
    });

    $(modal).click(function(){
        $(modal).addClass('hidden');
    });
});