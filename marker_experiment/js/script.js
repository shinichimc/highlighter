var highlightTxt = '';

$(document).ready(function() {

  // mouseup時のアクション
  $('body').mouseup(function(e) {

    // ハイライトするテキストをセット
    highlightTxt = getSelectedTextAndToggleColorPicker(e);

  });

  // colorpickerクリック時のアクション
  $('.pkiepick').click(function() {

    // 付与するクラス名を取得する
    var colorClassName = geColorClassName(this);

    if (colorClassName.length > 0 && highlightTxt.length > 0) {
      // ターゲット文字列を指定した色でハイライトする
      highlightTargetedText(colorClassName);
    }
  });

  //　ハイライト箇所にマウスオーバーした場合のアクション
  $(document)
  .on('mouseenter', '.marker', function(e) {
      toggleColorPicker(e);
      $('#pick-del').show();
      // $(this).contents().unwrap();

  })
  .on('mouseleave', '.marker', function(e) {

  });
});

function highlightTargetedText(colorClassName) {
  $('p:contains(' + highlightTxt + ')').each(function(){
    var scope = $(this).html();
    $(this).html(scope.replace(highlightTxt,'<span class="marker ' + colorClassName + '">' + highlightTxt + '</span>'));
  });
}

function geColorClassName(obj) {

  var id = $(obj).attr('id');
  if (!id) {
    return '';
  }

  if (id == 'pick-red') return 'red';
  else if (id == 'pick-blue') return 'blue';
  else if (id == 'pick-yellow') return 'yellow';
  else if (id == 'pick-green') return 'green';
  else return '';
}

function getSelectedTextAndToggleColorPicker(e) {
  var text = '';
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }

  if (text.length > 0) {
    $('.color-picker-wrp').show().css('top', e.clientY).css('left', e.clientX);
    return text;
  }

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
