window.onload = function(){
  init_data();
};

var base_url = 'http://134.175.152.210:8084';

function init_data(){
  // 获取所有模版
  getAllTemplates();
  // 查询所有批次
  getAllBatch();
  // 获取所有工种
  getAllProced();
  // 根据批次获取对应的分组号
  getAllSGroupByBatch();
}


// 1、课时分配

// 获取所有模版
function getAllTemplates(){
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getAllTemplate',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>排课模版选择</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>';
        }
        $('#course_divide1_select_temp').html(html);
      }
    }
  });
}

// 查询所有批次
function getAllBatch(){
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllBatch',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>实习批次选择</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i].batch_name+'</option>';
        }
        // 课时分配
        $('#course_divide1_select_batch').html(html);
        $('#course_divide1_select_batch2').html(html);

        //  批次、工序排课查询
        $('#seach_clazzes_select_batch1').html(html);
        $('#seach_clazzes_select_batch2').html(html);

        //  学生分组
        $('#student_divide_select_batch1').html(html);
        $('#student_divide_select_batch2').html(html);
      }
    }
  });
}

// 绑定模板(或者再次绑定)
function bundleTemplate(){
  let template_id = $('#course_divide1_select_temp').val();
  let batch_name = $('#course_divide1_select_batch').val();
  console.log(template_id);
  if(template_id === "排课模版选择" || batch_name === "实习批次选择"){
    console.log(template_id);
    swal(
      '请先选择批次和模版',
      '请选择批次和模版后再进行绑定操作！',
      'warning'
    );
  }
  else{
    $.ajax({
      type: 'post',
      url: base_url + '/experiment/bundleTemplate',
      datatype: 'json',
      data: {
        'batch_name': batch_name,
        'template_id': template_id
      },
      success: function(data){
        if(data.status === 0){
          // console.log(data);
          swal(
            '绑定成功',
            String(data.message),
            'success'
          );
        }
        else{
          console.log(data);
          swal(
            '绑定失败',
            String(data.message),
            'error'
          );
        }
      }
    });
  }
}


// 2、批次、工序排课查询

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
        $('#seach_clazzes_select_process').html(html);
      }
    }
  });
}

// 根据实习批次查询课表【数据返回格式需要修改】

// 根据工种和实习批次查询课表【数据返回格式需要修改】


// 3、学生分组

// 学生分组
function groupStudent(){
  let batch_name =   $('#student_divide_select_batch1').val();
  if(batch_name !== "实习批次选择"){
    $.ajax({
      type: 'post',
      url: base_url + '/studentGroup/groupStudent',
      datatype: 'json',
      data: {
        'batch_name': batch_name
      },
      success: function(data){
        if(data.status === 0){
          // console.log(data);
          swal(
            '分组成功',
            String(data.message),
            'success'
          );
        }
        else{
          console.log(data);
          swal(
            '分组失败',
            String(data.message),
            'error'
          );
        }
      }
    });
  }
  else{
    swal(
      '请先选择批次',
      '请选择批次后再进行分组操作！',
      'warning'
    );
  }
}

// 根据批次获取对应的分组号
function getAllSGroupByBatch(){
  let batch_name = $('#student_divide_select_batch2').val();
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllSGroup',
    datatype: 'json',
    data: {
      'batch_name': batch_name
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        let data_arr = data.data;
        let html = '<option>组号</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>'
        }
        $('#student_divide_select_group').html(html);
      }
    }
  });
}
// 改变批次时做成响应
$('#student_divide_select_batch2').change(function(){
  // 根据条件查询成绩列表
  getStudent();
  // 根据批次获取对应的分组号
  getAllSGroupByBatch();
})

// 根据条件查询成绩列表
function getStudent(){
  let batch_name = $('#student_divide_select_batch2').val();
  let s_group_id = $('#student_divide_select_group').val();
}

// 4、学生课表查询
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
