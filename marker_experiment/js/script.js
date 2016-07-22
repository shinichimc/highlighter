(function() {
    var highlightTxt = '';
    var ID_PFIX = 'highLight_id_';

    function pH () {
        $('#constantTargetText').text(highlightTxt);
    }

    function pC(pureContent) {
        $('#constantPureContent').text(pureContent);
    }

    $(document).ready(function() {

        highlightOnPageLoad();
        //highlightClear();

        /*%%%*/pH();
        // mouseup時のアクション
        $('body').mouseup(function(e) {
            // ハイライトするテキストをセット
            highlightTxt = getSelectedTextAndToggleColorPicker(e);
            /*%%%*/pH();
        });

        // colorpickerクリック時のアクション
        $(document).on('click', '.pkiepick', function() {

            // 付与するクラス名を取得する
            var colorClassName = geColorClassName(this);

            if (colorClassName.length > 0 && highlightTxt.length > 0) {
                // ターゲット文字列を指定した色でハイライトする
                highlightTargetedText(colorClassName, true);
            }
        });

        //　ハイライト箇所にマウスオーバーした場合のアクション
        $(document).on('mouseenter', '.marker', function(e) {
            toggleColorPicker(e);
            $('#pick-del').show();

            highlightTxt = $(this).prop('outerHTML');
            /*%%%*/pH();
        });

        // delボタンをクリックした時のアクション
        $(document).on('click', '#pick-del', function() {
            $('body').each(function()　{

                var scope = $(this).html();

                var idAndPureContents = fetchIdAndPureContents();

                if (idAndPureContents.length > 2) {
                    var highlightId = idAndPureContents[1];
                    var pureContent = idAndPureContents[2];
                    // 対象のハイライトを削除する
                    $(this).html(scope.replace(highlightTxt, pureContent));
                    console.log(highlightId);
                    console.log(pureContent);
                    removeItem(highlightId);
                }
            });
        });
    });

    /**
    * ハイライトする
    */
    function highlightTargetedText(colorClassName, storeData) {

        $('body').each(function(){
            var scope = $(this).html();

            var pureContent = fetchIdAndPureContents();

            // リプレースするテキスト
            var textToInsert = '';

            if (pureContent != null && pureContent.length > 1) {
                // すでにハイライトがなされている場合に色を変更する
                textToInsert = pureContent[1];
            }　else {
                // 未だハイライトが付いていない時にハイライトを施す
                textToInsert = highlightTxt;
            }
            var highlightId = ID_PFIX + getRandomString();
            // 置換処理をおこなう( = ハイライトする)
            $(this).html(scope.replace(highlightTxt,'<span class="marker ' + highlightId + ' ' + colorClassName + '">' + textToInsert + '</span>'));
            if (storeData) {
                store(highlightId , highlightTxt, colorClassName);
            }

        });
    }

    /**
    * <span>で囲まれたコンテンツを取得
    */
    function fetchIdAndPureContents() {
        var regexp = new RegExp('^<span.+?(' + ID_PFIX + '[^\\s]+?)\\s.+?>([\\s\\S]+)<\/span>$'); //[\s\S] = 改行を含む任意の一文字
        var pureContent = highlightTxt.match(regexp)
        if (pureContent) {
            return pureContent;
        }
        return '';
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
        return highlightTxt;
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


// SET to local storage
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


// GET from local storage
function getItem(key) {
    // ストレージが利用できるかをチェック
    if (localStorage) {
      // ローカルストレージをセット
      var storage = localStorage;
      // ストレージからキーlastAccessedを取得
      return storage.getItem(key);
    }
}

// REMOVE from local storage
function removeItem(key) {
    // ストレージが利用できるかをチェック
    if (localStorage) {
      // ローカルストレージをセット
      var storage = localStorage;
      // ストレージからキーlastAccessedを取得
      storage.removeItem(key);
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
            highlightTxt = data['targetTxt'];

            highlightTargetedText(data['color'], false);
        }
    }
}

// localstorageを全て削除(デバッグ用)
function highlightClear() {
    if (localStorage) {
        var storage = localStorage;
        storage.clear();
    }
}

})();
