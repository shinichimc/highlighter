(function() {
    var activeHighlightTxt = '';
    var activeColor = '';
    var activeHighLightId = '';

    var ID_PFIX = 'highLight_id_';

    $(document).ready(function() {

        // 保存しているハイライトを出現させる
        highlightOnPageLoad();

        //////////////////////////
        // MOUSEUP 時のアクション
        //////////////////////////
        $('body').mouseup(function(e) {
            // ハイライトするテキストをセット
            activeHighlightTxt = getSelectedTextAndToggleColorPicker(e);

        });

        //////////////////////////
        // ハイライトに MOUSEOVER た場合のアクション
        // 1) 色変更時
        // 2) 削除時
        //////////////////////////
        $(document).on('mouseenter', '.marker', function(e) {
            toggleColorPicker(e);
            $('#pick-del').show();

            activeHighlightTxt = $(this).prop('outerHTML');
        });

        //////////////////////////
        // COLORPICKERクリック時のアクション
        //　1) 新規登録時
        // 2) 色変更時
        //////////////////////////
        $(document).on('click', '.pkiepick', function() {

            // 付与するクラス名を取得する (red, green, yellow, blue)
            activeColor = geColorClassName(this);

            if (activeColor.length > 0 && activeHighlightTxt.length > 0) {
                // ターゲット文字列を指定した色でハイライトする
                highlightTargetedText(false);
            }
        });

        //////////////////////////
        // DELETEボタンをクリックした場合のアクション
        //////////////////////////
        $(document).on('click', '#pick-del', function() {
            $('body').each(function()　{

                var scope = $(this).html();

                var idAndPureContents = fetchIdAndPureContents(activeHighlightTxt);

                if (idAndPureContents.length > 2) {
                    activeHighLightId = idAndPureContents[1];
                    var pureContent = idAndPureContents[2];
                    // 対象のハイライトを削除する
                    $(this).html(scope.replace(activeHighlightTxt, pureContent));

                    removeItem(activeHighLightId);
                }
            });
        });
    });

    // ページロード時に保存されているハイライトを出現させる
    function highlightOnPageLoad() {
        if (localStorage) {
            var storage = localStorage;
            // ストレージの内容を順番に取り出し、リストに整形（1）
            for (var i = 0; i < storage.length; ++i) {
                // i番目のキーを取得（2）
                var k = storage.key(i);
                // 指定されたキーの値を取得（3）

                var data = JSON.parse(storage.getItem(k));
                activeHighlightTxt = data['targetTxt'];
                activeColor = data['color'];
                activeHighLightId = k;

                highlightTargetedText(true);
            }
        }
    }

    /**
    * ハイライトする
    *
    * 1) 新規でハイライトする場合
    * 2) ページロード時
    * 3) 色を変更する場合
    */
    function highlightTargetedText(onPageLoad) {

        $('body').each(function() {

            var scope = $(this).html();

            // 色変更時のみ取得可能
            var idAndPureContents = fetchIdAndPureContents(activeHighlightTxt);

            // 挿入するテキスト
            var textToInsert = '';


            ////////////////////////////
            // 色を変更する場合
            ////////////////////////////
            if (idAndPureContents.length > 2) {
                alert('色変更');

                activeHighLightId = idAndPureContents[1];
                textToInsert = idAndPureContents[2];

            } else if (onPageLoad) {
            ////////////////////////////
            // ページロード時
            ///////////////////////////
                alert('ページロード');
                activeHighLightId = activeHighLightId;
                textToInsert = activeHighlightTxt;
            } else {
            ////////////////////////////
            // 新規にハイライトを施す場合
            ////////////////////////////
                alert('新規');
                activeHighLightId = ID_PFIX + getRandomString();
                textToInsert = activeHighlightTxt;
            }


            // 置換処理をおこなう( = ハイライトする)
            $(this).html(scope.replace(activeHighlightTxt,'<span class="marker ' + activeHighLightId + ' ' + activeColor + '">' + textToInsert + '</span>'));

            // ストレージに保存
            if (!onPageLoad) {
                store(activeHighLightId , textToInsert, activeColor);
            }

        });
    }

    function geColorClassName(obj) {

        var id = $(obj).prop('id');
        if (!id) {
            return '';
        }

        if (id == 'pick-red') return 'red';
        else if (id == 'pick-blue') return 'blue';
        else if (id == 'pick-yellow') return 'yellow';
        else if (id == 'pick-green') return 'green';
        else return 'yellow';
    }

    /**
    * 選択した文字を取得しカラーピッカーを表示させる
    */
    function getSelectedTextAndToggleColorPicker(e) {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }

        // 文字が選択されている場合
        if (html.length > 0) {
            $('.color-picker-wrp').show().css('top', e.clientY).css('left', e.clientX);
            return html;
        }

        // 文字を取得できな買った場合
        $('#pick-del').hide();
        $('.color-picker-wrp').hide();
        return activeHighlightTxt;
    }

    /**
    * カラーピッカーを表示/非表示させる
    */
    function toggleColorPicker(e) {
        if (!$('.color-picker-wrp').is(':visible')) {
            $('.color-picker-wrp').show().css('top', e.clientY).css('left', e.clientX);
        } else {
            $('.color-picker-wrp').hide();
        }
    }


// ID作成用のランダム文字列を生成する
function getRandomString() {
    // 生成する文字列の長さ
    var l = 15;

    // 生成する文字列に含める文字セット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";

    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
      r += c[Math.floor(Math.random()*cl)];
    }

    return r;
}


// localstorageを全て削除(デバッグ用)
function highlightClear() {
    if (localStorage) {
        var storage = localStorage;
        storage.clear();
    }
}

/**
* ある文字列がspanで囲まれている場合持っているハイライトIDとタグ内の文字列を返す。
*/
function fetchIdAndPureContents(txt) {
    var regexp = new RegExp('^<span.+?(' + ID_PFIX + '[^\\s]+?)\\s.+?>([\\s\\S]+)<\/span>$'); //[\s\S] = 改行を含む任意の一文字
    var result = txt.match(regexp)
    if (result) {
        return result;
    }
    return '';
}

})();

// ローカルストレージに保存する
function store(key, targetTxt, color) {
    // ストレージが利用できるかをチェック
    if (localStorage) {
      // ローカルストレージを呼び出し
        var storage = localStorage;

        var datalist = {
            targetTxt: targetTxt,
            color: color
        }

      // ストレージにキーと値をセット
      storage.setItem(key, JSON.stringify(datalist));
    }
}


// ローカルストレージからキーに対する値を取得する
function getItem(key) {
    // ストレージが利用できるかをチェック
    if (localStorage) {
      // ローカルストレージをセット
      var storage = localStorage;
      // ストレージからキーlastAccessedを取得
      return storage.getItem(key);
    }
}

// ローカルストレージから指定してデータを削除する
function removeItem(key) {
    // ストレージが利用できるかをチェック
    if (localStorage) {
      // ローカルストレージをセット
      var storage = localStorage;
      // ストレージからキーlastAccessedを取得
      storage.removeItem(key);
    }
}
