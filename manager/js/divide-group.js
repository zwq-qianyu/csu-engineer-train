window.onload = function () {
  init_data();
};

var base_url = 'http://134.175.152.210:8084';

function init_data() {
  
  fillWeekSelectorOptions();
  drawEmptyClassTable();
  // 获取所有模版
  fillTemplateSelectorOptions();
  // 查询所有批次
  fillBatchSelectorOptions();
  // 获取所有工种
  getAllProced();
  // 根据批次获取对应的分组号
  getAllSGroupByBatch();
}


// 1、课时分配

// 获取所有模版
function getAllTemplates(callback) {
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getAllTemplate',
    datatype: 'json',
    data: {},
    success: function (data) {
      if (data.status === 0) {
        callback(data)
      }
    }
  });
}

function bundleTemplateRequest(batch_name, template_id, success_callback, fail_callback) {
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/bundleTemplate',
    datatype: 'json',
    data: {
      'batch_name': batch_name,
      'template_id': template_id
    },
    success: function (data) {
      if (data.status === 0) {
        success_callback(data)
      } else {
        fail_callback(data)
      }
    }
  });
}


// 查询所有批次
function getAllBatch(callback) {
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllBatch',
    datatype: 'json',
    data: {},
    success: function (data) {
      if (data.status === 0) {
        callback(data)
      }
    }
  });
}

function getExperimentByBatch(batch_name, success_callback) {
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getExperimentByBatch',
    datatype: 'json',
    data: { batch_nam: batch_name },
    success: function (data) {
      console.log(data)
      if (data.status === 0) {
        success_callback(data)
      }
    },
    fail: function (data) {
      console.log(data)
    }
  });
}

// 填充模板选项
function fillTemplateSelectorOptions($select) {
  getAllTemplates(function (data) {
    var data_arr = data.data;
    var $templateSelector = $('#course_divide1_select_temp')
    $('<option>').text('排课模版选择').appendTo($templateSelector)
    for (let i = 0; i < data_arr.length; i++) {
      $('<option>').text(data_arr[i]).appendTo($templateSelector)
    }
  });
}

// 填充批次
function fillBatchSelectorOptions($select) {
  getAllBatch(function (data) {
    var data_arr = data.data;
    // 课时分配
    var cdsb1 = $('#course_divide1_select_batch')
    var cdsb2 = $('#course_divide1_select_batch2')

    //  批次、工序排课查询
    var scsb1 = $('#seach_clazzes_select_batch1')
    var scsb2 = $('#seach_clazzes_select_batch2')

    //  学生分组
    var sdsb1 = $('#student_divide_select_batch1')
    var sdsb2 = $('#student_divide_select_batch2')

    var temp = $('<span><option>实习批次选择</option></span>')

    for (let i = 0; i < data_arr.length; i++) {
      $('<option>').text(data_arr[i].batch_name).appendTo(temp)
    }
    cdsb1.html(temp.html())
    cdsb2.html(temp.html())
    scsb1.html(temp.html())
    scsb2.html(temp.html())
    sdsb1.html(temp.html())
    sdsb2.html(temp.html())
  });
}

// 绑定模板(或者再次绑定)
function bundleTemplate() {
  let template_id = $('#course_divide1_select_temp').val();
  let batch_name = $('#course_divide1_select_batch').val();
  console.log(template_id);
  if (template_id === "排课模版选择" || batch_name === "实习批次选择") {
    console.log(template_id);
    swal(
      '请先选择批次和模版',
      '请选择批次和模版后再进行绑定操作！',
      'warning'
    );
  }
  else {
    bundleTemplateRequest(batch_name, template_id,
      function success(data) {
        swal(
          '绑定成功',
          String(data.message),
          'success'
        );
      },
      function fail(data) {
        console.log(data);
        swal(
          '绑定失败',
          String(data.message),
          'error'
        );
      })
  }
}

function printExperimentsByBatch(batch_name) {
  getExperimentByBatch(batch_name, function () {
    console.log(arguments)
  });
}



$('#course_divide1_select_batch2').change(function () {
  console.log(this.length)
});


// config/config-divide-group.js
var weekRange = _.range(1, 21, 1);
var dayRange = [null, '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
var timeRangeStep = 2;
var timeRange = _.range(1, 10, 2);

// console.log(weekRange)

function fillWeekSelectorOptions() {
  var $weekselect = $('#course_divide1_select_week');
  _.each(weekRange, function (val, i) {
    $('<option>').text('第' + val + '周').attr('week', val).appendTo($weekselect);
  })
}



function drawEmptyClassTable() {
  var $distribution_table_head = $('#distribution-table-head')
  var $tr = $('<tr>');
  _.each(dayRange, function (val, i) {
    val = val || ''
    $('<th>').attr('day', i).text(val).appendTo($tr);
  });
  $tr.appendTo($distribution_table_head)

  var $distribution_table_body = $('#distribution-table-body')
  _.each(timeRange, function (tval, ti) {
    var $tr = $('<tr>');
    $('<th>').attr('time', ti).text('' + _.range(tval, tval + timeRangeStep)).appendTo($tr)
    _.each(dayRange, function (dval, di) {
      if (dval)
        $('<td>').attr('day', di).attr('time', ti).appendTo($tr);
    });
    $tr.appendTo($distribution_table_body)
  })
}



// 编辑排课表
var distributeEditMode = false;
var $edit_distribution = $('#edit-distribution').click(function () {
  console.log("$('#edit-template-name').click")
  if (distributeEditMode) {
    distributeEditMode = false;
    $edit_distribution.val('编辑off')
  } else {
    distributeEditMode = true;
    $edit_distribution.val('编辑on')
  }
});

$('#save-distribution').click(function () { // 获取数据保存
  console.log("$('#save-distribution').click")
  if (distributeEditMode) {
    swal({
      title: 'Are you sure?',
      text: '真的要保存了哦……',
      icon: 'info',
      buttons: true,
      dangerMode: true
    })
      .then(function (ok) {
        if (ok) {

          $edit_distribution.click()
        } else {

        }
      })
  } else {
    swal('这样可不行！', '请在编辑模式下保存！', 'warning')
  }
});







// 2、批次工序排课查询

// 获取所有工种
function getAllProced() {
  $.ajax({
    type: 'post',
    url: base_url + '/proced/getAllProced',
    datatype: 'json',
    data: {},
    success: function (data) {
      if (data.status === 0) {
        let data_arr = data.data;
        let html = '<option>选择工种</option>';
        for (let i = 0; i < data_arr.length; i++) {
          html += '<option>' + data_arr[i] + '</option>';
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
function groupStudent() {
  let batch_name = $('#student_divide_select_batch1').val();
  if (batch_name !== "实习批次选择") {
    $.ajax({
      type: 'post',
      url: base_url + '/studentGroup/groupStudent',
      datatype: 'json',
      data: {
        'batch_name': batch_name
      },
      success: function (data) {
        if (data.status === 0) {
          // console.log(data);
          swal(
            '分组成功',
            String(data.message),
            'success'
          );
        }
        else {
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
  else {
    swal(
      '请先选择批次',
      '请选择批次后再进行分组操作！',
      'warning'
    );
  }
}

// 根据批次获取对应的分组号
function getAllSGroupByBatch() {
  let batch_name = $('#student_divide_select_batch2').val();
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllSGroup',
    datatype: 'json',
    data: {
      'batch_name': batch_name
    },
    success: function (data) {
      if (data.status === 0) {
        // console.log(data);
        let data_arr = data.data;
        let html = '<option>组号</option>';
        for (let i = 0; i < data_arr.length; i++) {
          html += '<option>' + data_arr[i] + '</option>'
        }
        $('#student_divide_select_group').html(html);
      }
    }
  });
}
// 改变批次时做成响应
$('#student_divide_select_batch2').change(function () {
  // 根据条件查询成绩列表
  getStudent();
  // 根据批次获取对应的分组号
  getAllSGroupByBatch();
})

// 根据条件查询成绩列表
function getStudent() {
  let batch_name = $('#student_divide_select_batch2').val();
  let s_group_id = $('#student_divide_select_group').val();
}

// 4、学生课表查询
// 根据学生学号查询课表
function getStuClassByNum() {
  let sid = $('#search_stu_by_number').val();
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getClass',
    datatype: 'json',
    data: {
      'sid': sid
    },
    success: function (data) {
      console.log(data);
      let data_arr = data.data;
      let html = '';
      for (let i = 0; i < data_arr.length; i++) {
        html += '<tr><td>' + (i + 1) + '--' + data_arr[i].time_quant + '</td><td>' + data_arr[i].pro_name + '</td><td>' + data_arr[i].batch_name + '</td><td>' + data_arr[i].s_group_id + '</td></tr>';
      }
      $('#search_stu_tbody').html(html);
    }
  });
}
