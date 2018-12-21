window.onload = function(){
  init_data();
};

var base_url = 'http://134.175.152.210:8084';

function init_data(){

}

$("#edit-template-name").click(function(){
  var old_name = $("#select_template").val();
  $("#template-old-name").attr("placeholder", old_name);
});

// 根据学生学号查询课表
function getStuClassByNum(){
  let sid = $('#search_stu_by_number').val();
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getClass',
    datatype:'json',
    data: {
      'sid': sid
    },
    success: function(data){
      console.log(data);
      let data_arr = data.data;
      let html = '';
      for(let i=0; i<data_arr.length; i++){
        html += '<tr><td>'+(i+1)+'--'+data_arr[i].time_quant+'</td><td>'+data_arr[i].pro_name+'</td><td>'+data_arr[i].batch_name+'</td><td>'+data_arr[i].s_group_id+'</td></tr>';
      }
      $('#search_stu_tbody').html(html);
    }
  });
}
