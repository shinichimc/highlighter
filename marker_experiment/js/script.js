(function() {
    // ハイライト対象の文字列
    var activeHighlightTxt = '';
    // 対象のハイライトのカラー
    var activeColor = '';
    //　対象のハイライトのID
    var activeHighLightId = '';
    // ハイライト変更色モードか
    var colorChangeMode = false;

    // ハイライトIDのprefix
    var ID_PFIX = 'highLight_id_';

    $(document).ready(function() {

        // ハイライトに関する情報を表示しておく(デバッグ用)
        $(document).mousemove(function (e) {
            $('.Info').html(
                '<p>clientX: ' + e.clientX + '</p>'
                + '<p>clientY: ' + e.clientY + '</p>'
                + '<p>activeHighLightTxt: ' + activeHighlightTxt + '</p>'
                + '<p>activeColor: ' + activeColor + '</p>'
                + '<p>activeHightLightId: ' + activeHighLightId + '</p>'
                + '<p>colorChangeMode: ' + colorChangeMode + '</p>'
            );
        })

        // 保存しているハイライトを出現させる
        highlightOnPageLoad();

        //////////////////////////
        // MOUSEUP 時のアクション
        //////////////////////////
        $(window).mouseup(function(e) {

            // ハイライトするテキストを取得
            var selectedText = getSelectedHtml();
            if (selectedText.length > 0) {
                // 取得できた場合はセットする
                setActiveHighlightTxt(selectedText);
                // ハイライトメニューを表示
                showHighLightMenu(e);

                setActiveHighLightId('');

                colorChangeMode = false;
            } else {
                // ハイライトメニューを非表示
                hideHighLightMenu();
            }
        });

        //////////////////////////
        // ハイライトメニューのカラーをクリック時のアクション
        // - 新規登録時
        // - 色変更時
        //////////////////////////
        $(document).on('click', '.pkiepick', function() {
            // 付与するクラス名を取得し、セットする(red, green, yellow, blue)
            setActiveColor(geColorClassName(this));

            if (activeColor.length > 0 && activeHighlightTxt.length > 0) {
                // ターゲット文字列を指定した色でハイライトする
                highLight(false);
            } else {
                alert('何らかの理由によりハイライトできませんでした。')
            }
        });

        //////////////////////////
        // ハイライトに MOUSEOVER た場合のアクション
        // - 色変更時
        // - 削除時
        //////////////////////////
        $(document)
        .on('mouseenter', '.marker', function(e) {

            var text = $(this).prop('outerHTML');

            var highlightId = getHighLightId(text);
            if (highlightId.length > 0) {
                var pureHtml = store.get(highlightId).targetTxt;

                // ハイライトidをセットする
                setActiveHighLightId(highlightId);

                // ハイライト文字列をセットする
                setActiveHighlightTxt(pureHtml);

                colorChangeMode = true;

                showHighLightMenu(e);
                $('#pick-del').show();
            }
        })
        .on('mouseleave', '.marker', function(e) {

        });

        //////////////////////////
        // DELETEボタンをクリックした場合のアクション
        //////////////////////////
        $(document).on('click', '#pick-del', function() {

            // 想定するハイライトIDを持った要素が存在しなければ処理を終了する
            if (activeHighLightId.length == 0 || !$('.' + activeHighLightId)[0] ) return;

            var $highlightElem = $('.' + activeHighLightId);
            $highlightElem.contents().unwrap();

            // local storageから削除する
            store.remove(activeHighLightId);

        });
    });

    /**
     * ハイライトする
     *
     * 1) 色を変更する場合
     * 2) ページロード時
     * 3) 新規でハイライトする場合
     *
     * @param onPageLoad
     * @returns
     */
    function highLight(onPageLoad) {

        if (colorChangeMode) {
          /////////////////////////
          // 色を変更する場合
          /////////////////////////

          // 想定するハイライトIDを持った要素が存在しなければ処理を終了する
          if (activeHighLightId.length == 0 || !$('.' + activeHighLightId)[0] ) return;
          var $highlightElem = $('.' + activeHighLightId);
          var currentColor = store.get(activeHighLightId).color;

          $highlightElem.removeClass(currentColor).addClass(activeColor);
          store.set(activeHighLightId, { targetTxt: activeHighlightTxt, color: activeColor });

        } else {
          /////////////////////////
          // 新規にハイライト OR ページロード時
          /////////////////////////
          $('.left').each(function() {

              var pureHtml = activeHighlightTxt;

              // ハイライトIDがセットされていない場合(= 新規でハイライトする場合)新しいIDをセットする
              if (activeHighLightId.length == 0) {
                  setActiveHighLightId(ID_PFIX + getRandomString());
              }

              ////////////////////////////
              // テキストの加工処理を行う
              ////////////////////////////

              var modifiedHtml = pureHtml;

              var regexpHEAD = new RegExp('(</?[^>]+>|^)([^<]+)', 'gim');
              modifiedHtml = modifiedHtml.replace(regexpHEAD,'$1<span class="marker ' + activeHighLightId + ' ' + activeColor + '">$2');

              var regexpTAIL = new RegExp('([^>]+?)(</?[^>]+>|$)', 'gim');
              modifiedHtml = modifiedHtml.replace(regexpTAIL, '$1</span>$2');

              ////////////////////////////
              // ハイライト + ストレージに保存する
              ////////////////////////////

              // 置換前の文字列がちゃんと存在するか確認する
              var scope = $(this).html();
              if (!onPageLoad) {console.log(scope.indexOf(pureHtml)); console.log(pureHtml); console.log(modifiedHtml); console.log($('body').html());}
              if(scope.search(pureHtml) != -1) {
                  // 置換処理をおこなう( = ハイライトする)
                  $(this).html(scope.replace(pureHtml, modifiedHtml));

                  // ページロード時以外はストレージに保存
                  if (!onPageLoad) {
                      store.set(activeHighLightId, { targetTxt: pureHtml, color: activeColor });
                  }
              } else {
                alert('失敗しました');
              }
          });
        }
    }

    /**
     * ページロード時に保存されているハイライトを出現させる
     * @returns
     */
    function highlightOnPageLoad() {

      colorChangeMode = false;

      store.forEach(function(key, data) {

          // keyがハイライトIDの場合のみ処理する
          if (key.indexOf(ID_PFIX) === 0) {
            setActiveHighLightId(key);
            setActiveHighlightTxt(data.targetTxt);
            setActiveColor(data.color);

            highLight(true);
          }
      });
    }

    /**
     * 選択された色の情報を返す
     * @param obj
     * @returns
     */
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
     * 反転させた文字列を取得する
     * @returns
     */
    function getSelectedHtml() {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
                var replaced = html.replace(/^<p>([\s\S]+)<\/p>$/, '$1');
            }
        }

        // 文字が選択されている場合
        if (replaced.length > 0) {
            return replaced;
        }

        // 文字を取得できな買った場合
        return '';
    }

    /**
     * ハイライトメニューを表示させる
     * @param e
     * @returns
     */
    function showHighLightMenu(e) {
        var scrollHeight = $(window).scrollTop();
        // $('.color-picker-wrp').delay(450).fadeIn(100).css('top', e.clientY).css('left', e.clientX);
        $('.color-picker-wrp').show().css('left', e.clientX).css('top', e.clientY + scrollHeight);
    }

    /**
     * ハイライトメニューを非表示にする
     * @returns
     */
    function hideHighLightMenu() {
        if ($('.color-picker-wrp').is(':visible')) {
            $('.color-picker-wrp').hide();
            $('#pick-del').hide();
        }
    }

    /**
     * ある文字列がハイライト用の<span>で囲まれている場合持っているハイライトIDとタグ内の文字列を返す。
     * @param txt
     * @returns
     */
    function getHighLightIdAndPureHTML(txt) {

        // 引数が適切でない場合は空文字を返す
        if (txt == null || txt.length == 0) {
            return '';
        }
        var regexp = new RegExp('^<span.+?(' + ID_PFIX + '[^\\s]+?)\\s.+?>([\\s\\S]+)<\/span>$'); //[\s\S] = 改行を含む任意の一文字
        var result = txt.match(regexp);
        if (result) {
            return result;
        }
        return '';
    }

    /**
     * 指定した文字列の中にハイライトIDが含まれていれば返す
     * @param txt
     * @returns ハイライトID, もしくは空文字
     */
    function getHighLightId(txt) {

        // 引数が適切でない場合は空文字を返す
        if (txt == null || txt.length == 0) {
            return '';
        }
        var regexp = new RegExp('^<span.+?(' + ID_PFIX + '[^\\s]+?)\\s.+?>[\\s\\S]+<\/span>$'); //[\s\S] = 改行を含む任意の一文字
        var result = txt.match(regexp);
        if (result) {
            return result[1];
        }
        return '';
    }

    /**
     * ハイライト対象の文字列をセットする
     * @param text
     * @returns
     */
    function setActiveHighlightTxt(text) {
        activeHighlightTxt = text;
    }
　　　　
    /**
     * ハイライト対象の文字列の色をセットする
     * @param color
     * @returns
     */
    function setActiveColor(color) {
        activeColor = color;
    }

    /**
     * ハイライト対象の文字列のIDをセットする
     * @param id
     * @returns
     */
    function setActiveHighLightId(id) {
        activeHighLightId = id;
    }

})();

/**
 * ID作成用のランダム文字列を生成する
 * @returns
 */
function getRandomString() {
    // 生成する文字列の長さ
    var l = 15;

    // 生成する文字列に含める文字セット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";

    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
      r += c[Math.floor(Math.random() * cl)];
    }

    return r;
}
