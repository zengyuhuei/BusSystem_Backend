function upload_file() { 
    $("#upload").click(function () { 
    var formData = new FormData($('#customFile')[0]); 
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3000/upload_file",
        data:formData,
        cache:false,
        processData:false,
        contentType:false,
          error: function (xhr) { },      // 錯誤後執行的函數
          success: function (response) {
            console.log(response);
        }// 成功後要執行的函數
      });
})
} 