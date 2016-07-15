var highlightTxt = '';

$(document).ready(function() {

  // mouseup時のアクション
  $('body').mouseup(function() {

    // カラーピッカーを表示/非表示させる。
    toggleColorPicker();

    // ハイライトするテキストをセット
    highlightTxt = getSelectedText();

　　　
  });

  $('.pkiepick').click(function() {

    // 付与するクラス名を取得する
    var colorClassName = geColorClassName(this);
    alert(highlightTxt);

    // if (highlightText.length > 0)) {
    //   // ターゲット文字列をハイライトする
    //   highlightTargetedText(highlightText, colorClassName);
    // }

  });
});

function getSelectedText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

function highlightTargetedText(targetText, colorClassName) {
  $('p:contains(' + targetText + ')').each(function(){
    var scope = $(this).html();
    $(this).html(scope.replace(targetText,'<span class="' + colorClassName + '">' + targetText + '</span>'));
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

function toggleColorPicker() {
  $('.color-picker-wrp').toggle();
}
