window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

function init_data(){
  // 展示值班信息初始化
  getTeacherOverworkFromStudent();
}

// 新增加班申请【接口有问题】
function addOverworkApply(){
  let begin = $('#request_start_time').val();
  let pro_name = $('#request_select_process').val();
  let duration = $('#request_extra_last_time').val();
  let reason = $('#request_extra_reason').val();

  $.ajax({
    type: 'post',
    url: base_url + '/overwork/addOverworkApply',
    datatype: 'json',
    data: {
      'begin': begin,
      'pro_name': pro_name,
      'duration': duration,
      'reason': reason
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '新增成功',
          '新增加班申请成功',
          'success'
        );
      }
      else{
        console.log(data);
        swal(
          '新增失败',
          '新增加班申请失败',
          'error'
        );
      }
    }
  });
}

// 展示值班信息【接口有问题】
function getTeacherOverworkFromStudent(){
  $.ajax({
    type: 'post',
    url: base_url + '/overwork/getTeacherOverworkFromStudent',
    datatype: 'json',
    data: {

    },
    success: function(data){
      console.log(data);
      if(data.status === 0){
        let data_arr = data.data;
        html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<li><p><a href="#">'+data_arr[i].overwork_time+'&emsp;&emsp;'+data_arr[i].pro_name+'&emsp;&emsp;'+data_arr[i].tname+'</a></p></li>'
        }
        // $('#zhiban_info ul').html(html);   //有数据了再打开这一行
      }
    }
  });
}

// 获取“我的申请”记录【接口有问题】
function getMyOverworkApply(){
  $.ajax({
    type: 'post',
    url: base_url + '/overwork/getMyOverworkApply',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        html = '';
        for(let i=0; i<data_arr; i++){
          html += '<tr><td>'+data_arr[i].overwork_time+'</td><td>'+data_arr[i].pro_name+'</td><td>'+data_arr[i].reason+'</td></tr>';
        }
        // $('#request_history_tbody').html(html);   //有数据了再打开这一行
      }
    }
  });
}
