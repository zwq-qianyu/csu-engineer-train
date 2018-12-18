window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

function init_data(){
  // 获取所有工种
  getAllProced();
  // 展示值班信息初始化
  getTeacherOverworkFromStudent();
}

// 获取所有工种
function getAllProced(){
  $.ajax({
    type: 'post',
    url: base_url + '/proced/getAllProced',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>选择工种</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>';
        }
        $('#request_select_process').html(html);
      }
    }
  });
}

// 新增加班申请【接口有问题，需要登录后测试】
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

// 展示值班信息
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
          html += '<li><p><a href="#">'+chGMT(data_arr[i].overwork_time)+'&emsp;&emsp;'+data_arr[i].pro_name+'&emsp;&emsp;'+data_arr[i].tname+'</a></p></li>'
        }
        $('#zhiban_info ul').html(html);   //有数据了再打开这一行
      }
    }
  });
}

// 获取“我的申请”记录【接口有问题，需要登录后测试】
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
          html += '<tr><td>'+chGMT(data_arr[i].overwork_time)+'</td><td>'+data_arr[i].pro_name+'</td><td>'+data_arr[i].reason+'</td></tr>';
        }
        $('#request_history_tbody').html(html);   //有数据了再打开这一行
      }
    }
  });
}

// 格林威治时间的转换
Date.prototype.format = function(format){
	var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        }
    if(/(y+)/.test(format))
    format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
    if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
// 获取标准时间格式
function chGMT(gmtDate){
	var mydate = new Date(gmtDate);
	mydate.setHours(mydate.getHours() + 8);
	// return mydate.format("yyyy-MM-dd hh:mm:ss");
  return mydate.format("yyyy-MM-dd hh:mm");
}
// 获取小时
function getGMThour(gmtDate){
  var mydate = new Date(gmtDate);
	mydate.setHours(mydate.getHours() + 8);
	// return mydate.format("yyyy-MM-dd hh:mm:ss");
  return Number(mydate.format("hh"));
}