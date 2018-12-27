var base_url = 'http://134.175.152.210:8084';

$("#login_submit").click(function(){
  let username = $('#username').val();
  let password = $('#password').val();
  password = hex_md5(password);
  console.log(username);
  console.log(password);
  $.ajax({
    type: 'post',
    async: false,
    url: base_url + '/login',
    datatype: 'json',
    data: {
      'name': username,
      'password': password
    },
    // beforeSend: function(xhr) {
    //   xhr.withCredentials = true;
    // },
    crossDomain:true,
    success: function(data){
      // console.log(data);
      if(data.status === 0){
        console.log(data);
        window.location = './manager/student-manage.html';
      }
    },
  });
});
