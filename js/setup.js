var base_url = 'http://134.175.152.210:8084';

function changePassword(){
  let old_password =  $('#old_password').val();
  let new_password = $('#new_password').val();
  $.ajax(){
    type: 'post',
    async: false,
    url: base_url + '/login',
    datatype: 'json',
    data: {
      'name': username,
      'password': password
    },
    
  }
}
