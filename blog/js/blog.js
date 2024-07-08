$(function() {
    // 目次を作成
    const toc_area = $('.toc ol');
    $('#blog h2').each(function() {
        const title = $(this).text();
        const id = $(this).attr('id');
        const write_toc = `<a href="#${id}"><li>${title}</li></a>`;
        $(toc_area).append(write_toc);
    });

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
});