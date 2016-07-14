$(document).ready(function(){
  $('body').mouseup(function(){
    // var text = getSelectedText();
    var mytext = selectHTML();

    if (mytext.length > 0) {
      highlightTargetedText(mytext);
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
    var txt = $(this).text();
    $(this).html(
      txt.replace(targetedText,'<span class="marker">' + targetedText + '</span>')
    );
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
