const S_CargarServer = (url, method, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      url: url,
      crossOrigin: true,
      data: data,
      //dataType: dataType,
      dataType: "json",
      success: resolve,
      error: reject,
    });
  });
};

const S_CargarServerAuth = (url, method, data) => {
  const token = dGetToken();
  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      url: url,
      crossOrigin: true,
      data: data,
      //dataType: dataType,
      dataType: "json",
      success: resolve,
      error: reject,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });
};
