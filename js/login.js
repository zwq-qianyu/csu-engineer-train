var base_url = 'https://www.easy-mock.com/mock/5bfe54081179673e793f3a64/gxxt';

$("#login_submit").click(function(){
  let username = $('#username').val();
  let password = $('#password').val();
  $.ajax({
    type: 'post',
    url: base_url + '/login',
    datatype: 'json',
    data: {
      'name': username,
      'password': password
    },
    success: function(data){
      if(data.status === 0){
        console.log(data);
      }
    }
  });
});
