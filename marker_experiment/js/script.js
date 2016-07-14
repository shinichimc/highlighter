var pickerHTML = '<div class="color-picker-wrp"><table><tbody><tr><td id="pick-red"></td><td id="pick-blue"></td></tr><tr><td id="pick-yellow"></td><td id="pick-green"></td></tr></tbody></table></div>';

$(document).ready(function(){
  $('body').append(pickerHTML);
  $('body').mouseup(function(){
    toggleColorPicker();
    var text = getSelectedText();
    // var mytext = selectHTML();

    if (text.length > 0 && confirm("do you want to mark the text?")) {
      var t = highlightTargetedText(text);
    }

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

function highlightTargetedText(targetText) {
  var targetedText = targetText;
  $('p:contains(' + targetedText + ')').each(function(){
    var scope = $(this).html();
    $(this).html(scope.replace(targetedText,'<span class="marker">' + targetedText + '</span>'));
  });
}

function selectHTML() {
    try {
        if (window.ActiveXObject) {
            var c = document.selection.createRange();
            return c.htmlText;
        }

        var nNd = document.createElement("span");
        var w = getSelection().getRangeAt(0);
        w.surroundContents(nNd);
        return nNd.innerHTML;
    } catch (e) {
        if (window.ActiveXObject) {
            return document.selection.createRange();
        } else {
            return getSelection();
        }
    }
}

function toggleColorPicker() {
  $('.color-picker-wrp').toggle();
}
