var base_url = 'http://134.175.152.210:8084';

function logout(){
  console.log("dfg");
  $.ajax({
    type: 'post',
    // async: false,
    url: base_url + '/logout',
    datatype: 'json',
    data: {},
    // beforeSend: function(xhr) {
    //   xhr.withCredentials = true;
    // },
    // crossDomain:true,
    success: function(data){
      // console.log(data);
      if(data.status === 0){
        console.log(data);
        window.location.href = './login.html';
      }
      else{
        console.log(data);
        swal(
          '退出失败',
          String(data.message),
          'error'
        );
      }
    },
  });
}
