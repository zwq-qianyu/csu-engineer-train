window.onload = function(){
  init_data();
}

var base_url = 'https://www.easy-mock.com/mock/5bfe54081179673e793f3a64/gxxt';

// 初始化页面数据
function init_data(){
  // 初始化教师组管理模块
  getAllTeacherGroup();
  // 学生列表初始化批次 + 初始化学生列表
  // getAllBatch_StuList();
}


// 1、教师组管理部分

// 查询所有教师组及每个教师组对应的工序---完成教师组与工序的初始化工作
function getAllTeacherGroup(){
  $('.allTeacherGroupManage').empty();   //初始化清空
  $.ajax({
    type: 'post',
    url: base_url + '/group/getAllGroup',
    data: {},
    datatype: 'json',
    success: function(data){
      if(data.status === 0){
        teacher_group_obj = data.data;
        // console.log(teacher_group_obj);
        for(let i=0; i<teacher_group_obj.length; i++){
          let html = '';
          // 教师组名 button
          html += '<p><button class="btn btn-outline-primary" data-toggle="collapse" href="#'+teacher_group_obj[i].tgroupId+'" type="button" aria-expanded="false" aria-controls="'+teacher_group_obj[i].tgroupId+'">'+teacher_group_obj[i].tgroupId+'</button>';

          // 添加新工序图标
          html += '<i class="btn btn-sm btn-default" onclick="addTeacherGroupProcess_init(this)" name="'+teacher_group_obj[i].tgroupId+'" data-toggle="modal" data-target="#add_teacher_group_processModal"><img class="add-icon" src="./img/add.svg"></i>';

          // 编辑教师组图标
          html += '<i class="btn btn-sm btn-default" onclick="editTeacherGroup_init(this)" name="'+teacher_group_obj[i].tgroupId+'" data-toggle="modal" data-target="#editTeacherGroupModal"><img class="edit-icon" src="./img/edit.svg"></i>';

          // 删除教师组图标
          html += '<i class="btn btn-sm btn-default" onclick="delTeacherGroup(this)" name="'+teacher_group_obj[i].tgroupId+'"><img class="del-icon" src="./img/delete-x.svg"></i>';
          html += '</p>';

          // 根据教师组名查询工序
          $.ajax({
            type: 'post',
            url: base_url + '/group/getProcedByGroup',
            data: {'semester_name': teacher_group_obj[i].tgroupId},
            datatype: 'json',
            success: function(data){
              if(data.status === 0){
                let process = data.data;
                // console.log(batchs);
                html += '<div class="collapse" id="'+teacher_group_obj[i].tgroupId+'"><div class="card card-body"><ul>';
                for(let j=0; j<process.length; j++){
                  // 修改工序图标
                  html += '<li>'+process[j]+'<i class="btn btn-sm btn-default" teacher_group_name="'+teacher_group_obj[i].tgroupId+'" process_name="'+process[j]+'"   onclick="editOneProcess_init(this)" data-toggle="modal" data-target="#editOneProcessModal"><img class="inner-edit-icon" src="./img/edit-inner.svg"></i>';

                  // 删除工序图标
                  html += '<i class="btn btn-sm btn-default" teacher_group_name="'+teacher_group_obj[i].tgroupId+'" process_name="'+process[j]+'" onclick="delOneProcess(this)"><img class="inner-del-icon" src="./img/delete.svg"></i></li>';
                }
                html += '</ul></div></div>';
                // console.log(html);
                $('.allTeacherGroupManage').append(html);
              }
            }
          });
        }
        // $('.allTeacherGroupManage').html(html);
      }
    }
  });
}

// 添加新教师组
function addNewTeacherGroup(){
  let new_teacher_group_name = $('#new_semester').val();
  console.log(new_semester);
  $.ajax({
    type: 'post',
    url: base_url + '/group/addGroup',
    datatype: 'json',
    data: {
      'tgroupId': new_teacher_group_name
    },
    success: function(data){
      if(data.status === 0){
        console.log(data);
        swal(
          '添加成功',
          '添加新教师组成功',
          'success'
        );
        getAllTeacherGroup();
      }
    }
  });
}

// 修改教师组初始化
function editTeacherGroup_init(obj){
  let teacher_group_name = obj.getAttribute('name');
  // console.log(semester_name);
  $('#editTeacherGroupName_old').val(teacher_group_name);
}
// 修改教师组
function editTeacherGroupName(){
  let old_teacher_group_name = $('#editTeacherGroupName_old').val();
  let new_teacher_group_name = $('#editTeacherGroupName_new').val();
  // console.log(semester);
  $.ajax({
    type: 'post',
    url: base_url + '/group/updateGroup',
    datatype: 'json',
    data: {
      'old': old_teacher_group_name,
      'newName': new_teacher_group_name
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '修改成功',
          '修改教师组名成功，你的新教师组名为：'+new_teacher_group_name,
          'success'
        );
        getAllTeacherGroup();
      }
    }
  });
}

// 删除某个教师组
function delTeacherGroup(obj){
  let teacher_group_name = obj.getAttribute('name');
  swal({
	  title: '确定删除吗？',
	  text: '确定删除教师组"' + teacher_group_name + '"吗？你将无法恢复它！',
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
        url: base_url + '/group/delete',
        datatype: 'json',
        data: {
          'groupName': teacher_group_name
        },
        success: function(data){
          if(data.status === 0){
            // console.log(data);
            swal(
        			'删除！',
        			'教师组"' + teacher_group_name + '"已经被删除。',
        			'success'
      			);
            // 刷新实习批次信息
            getAllTeacherGroup();
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

// 添加新工序初始化
function addTeacherGroupProcess_init(obj){
  let teacher_group_name = obj.getAttribute('name');
  // console.log(semester_name);
  $('#addProcedToGroup_TeacherGroup').val(teacher_group_name);
}
// 添加新工序
function addNewProcedToGroup(){
  let groupName = $('#addProcedToGroup_TeacherGroup').val();
  let proName = $('#addProcedToGroup_Process').val();
  // console.log(semester);
  $.ajax({
    type: 'post',
    url: base_url + '/proced/addProcedToGroup',
    datatype: 'json',
    data: {
      'groupName': groupName,
      'proName': proName
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '添加成功',
          '添加新工序成功',
          'success'
        );
        getAllTeacherGroup();
      }
    }
  });
}

// 编辑某个工序--初始化
function editOneProcess_init(obj){
  let teacherGroupName = obj.getAttribute('teacher_group_name');
  let processName = obj.getAttribute('process_name');
  // console.log(processName);
  $('#editOneProcessOldName').val(processName);
  $('#editOneProcessTeacherGroupName').val(teacherGroupName);
}
// 编辑某个工序名
function editOneProcess(){
  let teacherGroupName = $('#editOneProcessTeacherGroupName').val();
  let new_processName = $('#editOneProcessName').val();
  let old_processName = $('#editOneProcessOldName').val();
  $.ajax({
    type: 'post',
    url: base_url + '/proced/updateProcedFromGroup',
    datatype: 'json',
    data: {
      'groupName': teacherGroupName,
      'newName': new_processName,
      'old': old_processName
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '修改成功',
          '修改工序名成功',
          'success'
        );
        getAllTeacherGroup();
      }
    }
  });
}

// 删除某个工序
function delOneProcess(obj){
  let process_name = obj.getAttribute('process_name');
  let teacher_group_name = obj.getAttribute('teacher_group_name');
  swal({
	  title: '确定删除吗？',
	  text: '确定删除工序"' + process_name + '"吗？你将无法恢复它！',
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
        url: base_url + '/proced/deleteProcedFromGroup',
        datatype: 'json',
        data: {
          'groupName': teacher_group_name,
          'pro_name': process_name
        },
        success: function(data){
          if(data.status === 0){
            // console.log(data);
            swal(
        			'删除！',
        			'工序"' + process_name + '"已经被删除。',
        			'success'
      			);
            // 刷新实习批次信息
            getAllTeacherGroup();
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



// 2、教师列表部分

// 获取所有教师组、教师角色 + 根据批次名获取学生列表
function getAllBatch_StuList(){
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllBatch',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        html = "";
        for(let i=0; i<data.data.length; i++){
          html += '<option>'+data.data[i].batch_name+'</option>';
        }
        // console.log(html);
        $('#stu_list_batch_name').html(html);
        // 根据批次名获取学生列表
        getStudentByBatchName();
      }
    }
  });
}

// 根据批次名获取学生列表
function getStudentByBatchName(){
  let batch_name = $('#stu_list_batch_name').val();
  let stu_list_tbody = document.getElementById('stu_list_tbody');
  // console.log(batch_name);
  $.ajax({
    type: 'post',
    url: base_url + '/student/getStudentByBatchName',
    datatype: 'json',
    data: {
      'batchName': batch_name
    },
    success: function(data){
      if(data.status === 0){
        data_arr = data.data;
        // console.log(data_arr);
        let html = "";
        for(let i=0; i<data_arr.length; i++){
          html += '<tr>';
          html += '<td><input type="checkbox" name="" sid='+data_arr[i].sid+'></td>';
          html += '<td>'+data_arr[i].sid+'</td><td>'+data_arr[i].sname+'</td><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].batch_name+'</td>';
          html += '<td><input type="button" class="btn btn-danger btn-sm" value="删除" sid='+data_arr[i].sid+' />&emsp;<input type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#studentManage-button-editModal" value="编辑" sid='+data_arr[i].sid+' /></td></tr>';
        }
        stu_list_tbody.innerHTML = html;
      }
    }
  });
}

// 删除一个学生

// 批量删除学生

// 添加一个学生

// 修改一个学生
