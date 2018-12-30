var base_url = 'http://134.175.152.210:8084';

function changePassword(){
  let old_password =  $('#old_password').val();
  old_password = hex_md5(old_password);
  let new_password = $('#new_password').val();
  new_password = hex_md5(new_password);
  $.ajax({
    type: 'post',
    async: false,
    url: base_url + '/user/changePwd2',
    datatype: 'json',
    data: {
      'old': old_password,
      'pwd': new_password
    },
    success: function(){
      if(data.status === 0){
        console.log(data);
        swal(
          '修改成功',
          '修改密码成功！',
          'error'
        );
      }else{
        swal(
          '修改失败',
          String(data.message),
          'error'
        );
      }
    }
  });
}
