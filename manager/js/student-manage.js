window.onload = function(){
  init_data();
}

var base_url = 'https://www.easy-mock.com/mock/5bfe54081179673e793f3a64/gxxt';

// 初始化页面数据
function init_data(){

  // 初始化实习批次管理模块
  getAllSemesterName();
  // 学生列表初始化批次 + 初始化学生列表
  getAllBatch_StuList();
}


// 1、实习批次管理部分

// 查询所有学期及每个学期对应的批次---完成学期与批次的初始化工作
function getAllSemesterName(){
  $('.allBatchManage').empty();   //初始化清空
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllSemesterName',
    data: {},
    datatype: 'json',
    success: function(data){
      if(data.status === 0){
        semesters_obj = data.data;
        // console.log(semesters_obj);
        for(let i=0; i<semesters_obj.length; i++){
          let html = '';
          // 学期名 button
          html += '<p><button class="btn btn-outline-primary" data-toggle="collapse" href="#'+semesters_obj[i].semester_name+'" type="button" aria-expanded="false" aria-controls="'+semesters_obj[i].semester_name+'">'+semesters_obj[i].semester_name+'学期</button>';

          // 添加新批次图标
          html += '<i class="btn btn-sm btn-default" onclick="add_semester_batch(this)" name="'+semesters_obj[i].semester_name+'" data-toggle="modal" data-target="#add_semester_batchModal"><img class="add-icon" src="./img/add.svg"></i>';

          // 编辑学期名图标
          html += '<i class="btn btn-sm btn-default" onclick="editSemesterName_init(this)" name="'+semesters_obj[i].semester_name+'" data-toggle="modal" data-target="#edit_semester_nameModal"><img class="edit-icon" src="./img/edit.svg"></i>';

          // 删除学期图标
          html += '<i class="btn btn-sm btn-default" onclick="delSemester(this)" name="'+semesters_obj[i].semester_name+'" data-toggle="modal" data-target="#del_semesterModal"><img class="del-icon" src="./img/delete-x.svg"></i>';
          html += '</p>';

          // 根据学期名查询批次
          $.ajax({
            type: 'post',
            url: base_url + '/batch/getBatchBySemesterName',
            data: {'semester_name': semesters_obj[i].semester_name},
            datatype: 'json',
            success: function(data){
              if(data.status === 0){
                let batchs = data.data;
                // console.log(batchs);
                html += '<div class="collapse" id="'+semesters_obj[i].semester_name+'"><div class="card card-body"><ul>';
                for(let j=0; j<batchs.length; j++){
                  // 修改批次图标
                  html += '<li>'+batchs[j].batch_name+'<i class="btn btn-sm btn-default" semester_name="'+batchs[j].semester_name+'" batch_name="'+batchs[j].batch_name+'" credit="'+batchs[j].credit+'"  onclick="editOneBatch_init(this)" data-toggle="modal" data-target="#editOneBatchModal"><img class="inner-edit-icon" src="./img/edit-inner.svg"></i>';

                  // 删除批次图标
                  html += '<i class="btn btn-sm btn-default" batch_name="'+batchs[j].batch_name+'" onclick="delOneBatch(this)"><img class="inner-del-icon" src="./img/delete.svg"></i></li>';
                }
                html += '</ul></div></div>';
                // console.log(html);
                $('.allBatchManage').append(html);
              }
            }
          });
        }
        // $('.allBatchManage').html(html);
      }
    }
  });
}

// 添加新学期  或  添加新批次
function addNewSemester(){
  let new_semester = $('#new_semester').val();
  let new_semester_batch = $('#new_semester_batch').val();
  let new_semester_credit = $('#new_semester_credit').val();
  console.log(new_semester);
  $.ajax({
    type: 'post',
    url: base_url + '/batch/addBatch',
    datatype: 'json',
    data: {
      'batch_name': new_semester_batch,
      'credit': new_semester_credit,
      'semester_name': new_semester
    },
    success: function(data){
      if(data.status === 0){
        console.log(data);
        swal(
          '添加成功',
          '添加新学期成功',
          'success'
        );
        getAllSemesterName();
      }
    }
  });
}

// 修改学期名初始化
function editSemesterName_init(obj){
  let semester_name = obj.getAttribute('name');
  // console.log(semester_name);
  $('#editSemesterName_old').val(semester_name);
}
// 修改学期名
function editSemesterName(){
  let old_semester_name = $('#editSemesterName_old').val();
  let new_semester_name = $('#editSemesterName_new').val();
  // console.log(semester);
  $.ajax({
    type: 'post',
    url: base_url + '/batch/updateSemesterName',
    datatype: 'json',
    data: {
      'old': old_semester_name,
      'semesterName': new_semester_name
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '修改成功',
          '修改学期名成功，你的新学期名为：'+new_semester_name,
          'success'
        );
        getAllSemesterName();
      }
    }
  });
}

// 删除某个学期
function delSemester(obj){
  let semester_name = obj.getAttribute('name');
  swal({
	  title: '确定删除吗？',
	  text: '确定删除"' + semester_name + '学期"吗？你将无法恢复它！',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#d33',
	  cancelButtonColor: '#3085d6',
	  confirmButtonText: '确定删除！',
	}).then(result => {
	  if (result.value) {
      $.ajax({
        type: 'post',
        url: base_url + '/batch/deleteSemester',
        datatype: 'json',
        data: {
          'semesterName': semester_name
        },
        success: function(data){
          if(data.status === 0){
            // console.log(data);
            // 刷新实习批次信息
            getAllSemesterName();
          }
        }
      });
	    swal(
			'删除！',
			'"' + semester_name + '学期"已经被删除。',
			'success'
			);
	    console.log(result.value)
	  } else {
	    // handle dismiss, result.dismiss can be 'cancel', 'overlay', 'close', and 'timer'
	    console.log(result.dismiss)
	  }
  })
}

// 添加新批次初始化
function add_semester_batch(obj){
  let semester_name = obj.getAttribute('name');
  // console.log(semester_name);
  $('#addNewBatch_semester').val(semester_name);
}
// 添加新批次
function addNewBatch(){
  let semester = $('#addNewBatch_semester').val();
  let new_semester_batch = $('#addNewBatch_batch').val();
  let new_semester_credit = $('#addNewBatch_credit').val();
  // console.log(semester);
  $.ajax({
    type: 'post',
    url: base_url + '/batch/addBatch',
    datatype: 'json',
    data: {
      'batch_name': new_semester_batch,
      'credit': new_semester_credit,
      'semester_name': semester
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '添加成功',
          '添加新批次成功',
          'success'
        );
        getAllSemesterName();
      }
    }
  });
}

// 编辑某个批次--初始化
function editOneBatch_init(obj){
  let semester_name = obj.getAttribute('semester_name');
  let batch_name = obj.getAttribute('batch_name');
  let credit = obj.getAttribute('credit');
  let bat_describe = obj.getAttribute('bat_describe');
  // console.log(batch_name);
  $('#editOneBatchSemesterName').val(semester_name);
  $('#editOneBatchName').val(batch_name);
  $('#editOneBatchCredit').val(credit);
}
// 编辑某个批次
function editOneBatch(){
  let semester_name = $('#editOneBatchSemesterName').val();
  let batch_name = $('#editOneBatchName').val();
  let credit = $('#editOneBatchCredit').val();
  let bat_describe = "";
  $.ajax({
    type: 'post',
    url: base_url + '/batch/updateBatch',
    datatype: 'json',
    data: {
      'emester_name': semester_name,
      'batch_name': batch_name,
      'credit': credit,
      'bat_describe': bat_describe
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        swal(
          '修改成功',
          '修改批次信息成功',
          'success'
        );
        getAllSemesterName();
      }
    }
  });
}

// 删除某个批次
function delOneBatch(obj){
  let batch_name = obj.getAttribute('name');
  swal({
	  title: '确定删除吗？',
	  text: '确定删除"' + semester_name + '学期"吗？你将无法恢复它！',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#d33',
	  cancelButtonColor: '#3085d6',
	  confirmButtonText: '确定删除！',
	}).then(result => {
	  if (result.value) {
      $.ajax({
        type: 'post',
        url: base_url + '/batch/deleteSemester',
        datatype: 'json',
        data: {
          'semesterName': semester_name
        },
        success: function(data){
          if(data.status === 0){
            // console.log(data);
            // 刷新实习批次信息
            getAllSemesterName();
          }
        }
      });
	    swal(
			'删除！',
			'"' + semester_name + '学期"已经被删除。',
			'success'
			);
	    console.log(result.value)
	  } else {
	    // handle dismiss, result.dismiss can be 'cancel', 'overlay', 'close', and 'timer'
	    console.log(result.dismiss)
	  }
  })
}


// 2、学生信息导入部分

// 下载标准模版

// 上传文件导入学生信息



// 3、学生列表部分

// 获取所有批次 + 根据批次名获取学生列表
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
