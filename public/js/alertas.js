function MostrarAlerta(tag, texto, exito, callback) {

  if (exito) {
    $('<div class="alert alert-success">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '&times;</button>' + `${texto}` + '</div>').hide()
      .appendTo(tag).fadeIn(1000).delay(1000).fadeOut(
        "normal",
        function () {
          $(this).remove();
          callback();
        });

  } else {
    $('<div class="alert  alert-danger">' +
    '<button type="button" class="close" data-dismiss="alert">' +
    '&times;</button>' + `${texto}` + '</div>').hide()
    .appendTo(tag).fadeIn(1000).delay(1000).fadeOut(
      "normal",
      function () {
        $(this).remove();
        //callback();
      });
  }


}