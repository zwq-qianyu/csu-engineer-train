window.onload = function () {
  init_data();
};


function init_data() {

  fillWeekSelectorOptions();
  // drawDistributionTable()();
  // 获取所有模版
  fillTemplateSelectorOptions();
  // 查询所有批次
  fillBatchSelectorOptions();
  // 获取所有工种
  getAllProced();
  // 根据批次获取对应的分组号
  getAllSGroupByBatch();
}



// 填充模板选项
function fillTemplateSelectorOptions($select) {
  api_experiment.getAllTemplates()
    .done(function (data) {
      if (data.status === 0) {
        var data_arr = data.data;
        var $templateSelector = $('#course_divide1_select_temp')
        $('<option>').text('排课模版选择').appendTo($templateSelector)
        for (let i = 0; i < data_arr.length; i++) {
          $('<option>').text(data_arr[i]).appendTo($templateSelector)
        }
      }
    });
}

// 填充批次
function fillBatchSelectorOptions($select) {
  api_batch.getAllBatch()
    .done(function (data) {
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
    api_experiment.bundleTemplateRequest(batch_name, template_id)
      .done(function success(data) {
        if (data.status === 0) {
          swal(
            '绑定成功',
            String(data.message),
            'success'
          );
        } else {
          console.log(data);
          swal(
            '绑定失败',
            String(data.message),
            'error'
          );
        }
      },
      )
  }
}

// console.log(weekRange)

function fillWeekSelectorOptions() {
  var $weekselect = $('#course_divide1_select_week');
  _.each(weekRange, function (val, i) {
    $('<option>').text('第' + val + '周').attr('week', val).appendTo($weekselect);
  })
}


var batch_name = ''
var $course_divide1_select_batch2 = $('#course_divide1_select_batch2')
$course_divide1_select_batch2.change(function () {
  console.log("$course_divide1_select_batch2.change")
  batch_name = $course_divide1_select_batch2.val()
  if (batch_name && batch_name !== '实习批次选择') {
    api_experiment.getExperimentByBatch(batch_name)
      .done(function success(data) {
        if (data.status === 0) {
          ProcessNewDistributionData(data.data)
          initDistributionTable()
        }
      })
  }
});

// time_quant 格式 '[01-20][1-7][1-9]' 
var data_group_by_ctime = {}; // 分配数据 
function ProcessNewDistributionData(data) {
  data_group_by_ctime = _.groupBy(data, 'class_time')
  _.each(data_group_by_ctime, function (group, k, data_group_by_ctime) {
    var time = group[0].time_quant
    var res = _.every(group, function (v, j) {
      return time && time == v.time_quant;
    });

    if (res) {
      data_group_by_ctime[k].distributed = true;
      data_group_by_ctime[k].time_quant = time;
    }
    else {
      data_group_by_ctime[k].distributed = false;
      data_group_by_ctime[k].time_quant = '';
    }
  });
  console.log(data_group_by_ctime)
}

function initDistributionTable() {
  drawClassTimeContainer()
  drawDistributionTable()
}

function drawClassTimeContainer() {
  var $class_time_container = $('#class-time-container').empty()
  var $tr = $('<tr>');
  var cnt = 0;
  _.each(data_group_by_ctime, function (group, class_time) {
    if (!$tr) $tr = $('<tr>')
    $('<td>').text(class_time).attr('class_time', class_time).appendTo($tr);
    cnt++;
    if (cnt % class_time_container_line_size == 0) {
      $tr.appendTo($class_time_container);
      $tr = null;
    }
  });
  if ($tr)
    $tr.appendTo($class_time_container);
}


function getGroupInWeek(week) {
  week = '0' + week;
  week = week.slice(week.len)
  var res = {}
  _.each(data_group_by_ctime, function (group, ctime) {
    if (group.time_quant && group.time_quant.slice(0, 2) === week) {
      var day = group.time_quant.slice(2, 3)
      var time = group.time_quant.slice(3, 4)
      if (!res[day])
        res[day] = {}
      res[day][time] = ctime;
    }
  })
  return res
}

function drawDistributionTable() { // 画出指定周的课表
  var week = $('#course_divide1_select_week option:selected').attr('week');
  console.log('drawDistributionTable week' + week)
  var classInWeek = getGroupInWeek(week)
  console.log(classInWeek)
  var $distribution_table_head = $('#distribution-table-head').empty()
  var $tr = $('<tr>');
  _.each(dayRange, function (val, i) {
    val = val || ''
    $('<th>').attr('day', i).text(val).appendTo($tr);
  });
  $tr.appendTo($distribution_table_head)

  var $distribution_table_body = $('#distribution-table-body').empty()
  _.each(timeRange, function (tval, ti) {
    var $tr = $('<tr>');
    $('<th>').attr('time', ti).text('' + _.range(tval, tval + timeRangeStep)).appendTo($tr)
    _.each(dayRange, function (dval, di) {
      if (dval) {
        var $td = $('<td>').attr('day', di).attr('time', ti)
        if (classInWeek[di] && classInWeek[di][ti]) {
          $td.text(classInWeek[di][ti]);
          data_group_by_ctime[classInWeek[di][ti]].dom = $td;
        }
        $td.appendTo($tr);
      }
    });
    $tr.appendTo($distribution_table_body)
  })
}


// 编辑排课表
var distributeEditMode = false;
var $edit_distribution = $('#edit-distribution').click(function () {
  console.log("$('#edit-template-name').click")
  if (distributeEditMode) {
    $class_time_container.hide();
    distributeEditMode = false;
    $edit_distribution.val('编辑off')
  } else {
    $class_time_container.show();
    distributeEditMode = true;
    $edit_distribution.val('编辑on')
  }
});

var $class_time_container = $('#class-time-container').hide();
var $class_time_selected = null;
var clicktime = new Date();
var t_id = null;
$class_time_container.on('click', 'td', function () {
  console.log("$class_time_container.on('click', 'td')")
  var newClicktime = new Date();
  var elapse = newClicktime - clicktime;
  console.log('elapse', elapse)
  var $this = $(this)
  $class_time_selected = null;
  $('.selected', $class_time_container).removeClass('selected');
  if ($this.hasClass('distributed')) { // 
    if (elapse < 200) { // 双击取消分配
      if (t) {
        console.log(t)
        clearTimeout(t);
        t = null;
      }
      $this.removeClass('distributed')
      var class_time = parseInt($this.attr('class_time'))
      if (!class_time) return;
      var ct_group = data_group_by_ctime[class_time]
      if (ct_group.dom) {
        ct_group.dom.text('');
        ct_group.dom = null;
        ct_group.time_quant = '';
      }
    } else { // 跳转
      t = setTimeout(() => {
        var class_time = parseInt($this.attr('class_time'));
        jumpToDistributionTableWithClasstime(class_time)
      }, 250);
    }
  } else if ($this.hasClass('selected')) { // 已选择，无动作
  } else {
    $this.addClass('selected');
    $class_time_selected = $this;
  }
  clicktime = newClicktime;
})


var $course_divide1_select_week = $('#course_divide1_select_week');
$course_divide1_select_week.change(function () {
  drawDistributionTable()
})

function jumpToDistributionTableWithClasstime(class_time) {
  var data_group = data_group_by_ctime[class_time]
  if (!data_group) return;
  var time_quant = data_group.time_quant
  if (!time_quant) return;
  var week = parseInt(time_quant.slice(0, 2));
  var raw_select = $course_divide1_select_week.get(0)
  raw_select.selectedIndex = week - 1;
  $course_divide1_select_week.change()
}

var $distribution_table = $('#distribution-table')
$distribution_table.on('click', 'td', function () {
  console.log("$distribution_table.on('click', 'td')")
  if(!distributeEditMode)return;
  if (!$class_time_selected) return;
  var $this = $(this);
  var week = $('option:selected', $course_divide1_select_week).attr('week');
  week = '0' + week;
  var day = $this.attr('day');
  var time = $this.attr('time');
  var class_time = parseInt($class_time_selected.attr('class_time'));
  if (!day || !time || !class_time) return;
  $class_time_selected.removeClass('selected').addClass('distributed')
  $class_time_selected = null;
  var wl = week.length
  var time_quant = week.slice(wl - 2, wl) + day + time;
  data_group_by_ctime[class_time].time_quant = time_quant;
  data_group_by_ctime[class_time].dom = $this
  $this.text(class_time);
})

$('#save-distribution').click(function () { // 获取数据保存
  console.log("$('#save-distribution').click")
  if (distributeEditMode) { // 编辑模式
    swal({
      title: 'Are you sure?',
      text: '真的要保存了哦……',
      icon: 'info',
      buttons: true,
      dangerMode: true
    })
      .then(function (ok) {
        if (ok) {
          // todo 把 data_group_by_ctime 打包发回去
          var data = []
          _.each(data_group_by_ctime,function(group,ctime){
            _.each(group,function(){
              
            })
          })
          $edit_distribution.click() // 触发编辑按钮的点击，关闭编辑模式
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
        var $selector = $('#student_divide_select_group')
        $('<option></option>').text('组号').appendTo($selector)
        _.each(data_arr, function (val, i) {
          $('<option></option>').text(val).appendTo($selector)
        });
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
