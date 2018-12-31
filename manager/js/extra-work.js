window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

// 初始化数据
function init_data(){
  // 获取所有工种
  getAllProced();
  // 获取所有教师组
  getAllGroup();
  // 学生加班申请查询
  getOverworkApplyByTime();
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
        $('#stu_extra_select_process').html(html);
        // $('#teacher_overwork_select_process').html(html);
        // $('#history_select_process').html(html);
      }
    }
  });
}

// 获取所有教师组
function getAllGroup(){
  $.ajax({
    type: 'post',
    url: base_url + '/group/getAllGroup',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>选择教师组</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i].t_group_id+'</option>';
        }
        $('#teacher_overwork_select_process').html(html);
        $('#history_select_process').html(html);
        // 获取所有可以有加班管理权限的老师
        findOverworkPrivilegeTeachers();
        // 查询教师值班记录
        getOverworkByTimeOrProName();
      }
    }
  });
}

// 根据教师组获取管理权限
$('#teacher_overwork_select_process').change(function(){
  findOverworkPrivilegeTeachers();
})

// 根据教师组获取所有可以有加班管理权限的老师
function findOverworkPrivilegeTeachers(){
  let teacherGroup = $('#teacher_overwork_select_process').val();
  if(teacherGroup === "选择教师组"){
    teacherGroup = "all";
  }
  $.ajax({
    type: 'post',
    url: base_url + '/admin/findTeachers',
    datatype: 'json',
    data: {
      'tClass': teacherGroup,
      'role': 'all',
      'material_privilege': 'all',
      'overwork_privilege': '加班管理'
    },
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>选择教师</option>';
        let process = $('#teacher_overwork_select_process').val();
        for(let i=0; i<data_arr.length; i++){
          // if(data_arr[i].)
          html += '<option>'+data_arr[i].tname+'</option>';
        }
        $('#teacher_overwork_select_teacher').html(html);
      }
    }
  });
}

// 学生加班申请查询
function getOverworkApplyByTime(){
  let submit_time = $('#stu_submit_time').val();
  let start_time = $('#stu_extra_work_start_time').val();
  let end_time = $('#stu_extra_work_end_time').val();
  let process = $('#stu_extra_select_process').val();
  if(start_time === ""){
    start_time = "1999";
  }
  if(end_time === ""){
    end_time = "2999";
  }
  if(process === "选择工种"){
    process = "%";
  }
  $.ajax({
    type: 'post',
    url: base_url + '/overwork/getOverworkApplyByTime',
    datatype: 'json',
    data: {
      'begin': start_time,
      'end': end_time,
      'pro_name': process
    },
    success: function(data) {
      if(data.status === 0){
        let data_arr = data.data;
        html = '';
        for(let i=0; i<data_arr.length; i++){
          html +=  '<tr><td>'+chGMT(data_arr[i].apply_time)+'</td><td>'+data_arr[i].sname+'</td><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].pro_name+'</td><td>'+chGMT(data_arr[i].overwork_time)+'</td><td>'+(getGMThour(data_arr[i].overwork_time_end) - getGMThour(data_arr[i].overwork_time))+'h</td><td>'+data_arr[i].reason+'</td>';
          html += '</tr>';
        }
        $('#stu_extra_work_tbody').html(html);
      };
      // 分页初始化
      kgoPage(1,10);
    }
  });
}

// 新增教师值班
function addTeacherOverwork(){
  let start_time = $('#teacher_overwork_start_time').val();
  let process = $('#teacher_overwork_select_process').val();
  let tname = $('#teacher_overwork_select_teacher').val();
  let last_time = $('#teacher_overwork_last_time').val();
  let reason = $('#extraWork-reason').val();
  start_time += ':00';
  $.ajax({
    type: 'post',
    url: base_url + '/overwork/addTeacherOverwork',
    datatype: 'json',
    data: {
      'begin': start_time,
      'duration': last_time,
      'pro_name': process,
      't_name': tname,
      'reason': reason
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '新增成功',
          '新增教师加班成功',
          'success'
        );
        // 刷新教师值班记录
        getOverworkByTimeOrProName();
        // 去除新增教师值班框中的内容
        $('#teacher_overwork_start_time').val("");
        $('#teacher_overwork_last_time').val("");
        $('#extraWork-reason').val("");
      }
      else{
        console.log(data);
        swal(
          '新增失败',
          String(data.message),
          'error'
        );
      }
    }
  });
}

// 查询教师值班记录
function getOverworkByTimeOrProName(){
  let start_time = $('#history_start_time').val();
  let end_time = $('#history_end_time').val();
  let process = $('#history_select_process').val();
  if(start_time === ""){
    start_time = "1999";
  }
  if(end_time === ""){
    end_time = "2999";
  }
  if(process === "选择教师组"){
    process = "%";
  }
  $.ajax({
    type: 'post',
    url: base_url + '/overwork/getOverworkByTimeOrProName',
    datatype: 'json',
    data: {
      'begin': start_time,
      'end': end_time,
      'pro_name': process
    },
    success: function(data) {
      if(data.status === 0){
        let data_arr = data.data;
        html = '';
        for(let i=0; i<data_arr.length; i++){
          html +=  '<tr><td>'+chGMT(data_arr[i].overwork_time)+'</td><td>'+data_arr[i].tname+'</td><td>'+data_arr[i].pro_name+'</td><td>2h</td><td>'+data_arr[i].reason+'</td>';
          // 编辑按钮
          html += '<td><button class="btn btn-primary btn-sm" id="'+data_arr[i].overwork_id+'" tname='+data_arr[i].tname+' reason='+data_arr[i].reason+' begin='+data_arr[i].overwork_time+' pro_name='+data_arr[i].pro_name+' data-toggle="modal" data-target="#editTeacherHistoryModal" onclick="updateTeacherOverwork_init(this)">编辑</button>&emsp;';
          // 删除按钮
          html += '<button class="btn btn-danger btn-sm" id="'+data_arr[i].overwork_id+'" onclick="deleteOverwork(this)">删除</button></td></tr>';
        }
        $('#adminTbody').html(html);
      };
      // 教师值班记录分页初始化
      goPage(1,10);
    }
  });
}

// 修改教师值班记录初始化
function updateTeacherOverwork_init(obj){
  let overworkId = obj.getAttribute('id');
  let begin = obj.getAttribute('begin');
  let tname = obj.getAttribute('tname');
  let reason = obj.getAttribute('reason');
  let pro_name = obj.getAttribute('pro_name');

  $('#edit_history_overworkId').val(overworkId);
  $('#edit_history_start_time').val(begin);
  $('#edit_history_select_process').val(pro_name);
  $('#edit_history_select_teacher').val(tname);
  $('#edit_history_last_time').val();
  $('#edit_history_extraWork_reason').val(reason);
}
// 修改教师值班记录
function updateTeacherOverwork(){
  let overworkId = $('#edit_history_overworkId').val();
  let begin = $('#edit_history_start_time').val();
  let pro_name = $('#edit_history_select_process').val();
  let tname = $('#edit_history_select_teacher').val();
  let duration = $('#edit_history_last_time').val();
  let reason = $('#edit_history_extraWork_reason').val();
  console.log(reason);
  $.ajax({
    type: 'post',
    url: base_url + '/overwork/updateTeacherOverwork',
    datatype: 'json',
    data: {
      'tname': tname,
      'reason': reason,
      'begin': begin,
      'overworkId': overworkId,
      'end': "",
      'pro_name': pro_name
    },
    success: function(data){
      console.log(data);
      if(data.status === 0){
        // console.log(data);
        swal(
          '修改成功',
          '修改教师加班记录成功',
          'success'
        );
        // 刷新教师值班记录
        getOverworkByTimeOrProName();
      }
      else{
        console.log(data);
        swal(
          '修改失败',
          '修改教师加班记录失败',
          'error'
        );
      }
    }
  });
}

// 删除教师值班记录
function deleteOverwork(obj){
  let id = obj.getAttribute('id');
  // console.log(id);
  swal({
	  title: '确定删除吗？',
	  text: '确定删除吗？你将无法恢复它！',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#d33',
	  cancelButtonColor: '#3085d6',
	  confirmButtonText: '确定删除！',
    cancelButtonText: '取消',
	}).then(result => {
	  if (result.value) {
      $.ajax({
        type: 'post',
        url: base_url + '/overwork/deleteOverwork',
        datatype: 'json',
        data: {
          'id': id
        },
        success: function(data){
          if(data.status === 0){
            // console.log(data);
            swal(
              '删除成功',
              '删除加班记录成功',
              'success'
            );
            // 刷新教师值班记录
            getOverworkByTimeOrProName();
          }
          else{
            console.log(data);
            swal(
              '删除失败',
              '删除加班记录失败',
              'error'
            );
          }
        }
      });
	    console.log(result.value)
	  } else {
	    // handle dismiss, result.dismiss can be 'cancel', 'overlay', 'close', and 'timer'
	    console.log(result.dismiss)
	  }
  })

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
