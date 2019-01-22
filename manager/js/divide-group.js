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
  fillProcedOptions();
  // 根据批次获取对   api_proced.getAllProced应的分组号
  getAllSGroupByBatch();
}



// 填充模板选项
function fillTemplateSelectorOptions() {
  api_experiment.getAllTemplates()
    .done(function (data) {
      if (data.status === 0) {
        var data_arr = data.data;
        var $templateSelector = $('#course_divide1_select_temp')
        $('<option>').text('排课模版选择').appendTo($templateSelector)
        for (var i = 0; i < data_arr.length; i++) {
          $('<option>').text(data_arr[i]).appendTo($templateSelector)
        }
      }
    });
}

// 填充批次
function fillBatchSelectorOptions() {
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

      for (var i = 0; i < data_arr.length; i++) {
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
  var template_id = $('#course_divide1_select_temp').val();
  var batch_name = $('#course_divide1_select_batch').val();
  // console.log(template_id);
  if (template_id === "排课模版选择" || batch_name === "实习批次选择") {
    // console.log(template_id);
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
          // console.log(data);
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

function fillWeekSelectorOptions() {
  var $weekselect = $('#course_divide1_select_week');
  _.each(weekRange, function (val, i) {
    $('<option>').text('第' + val + '周').attr('week', val).appendTo($weekselect);
  })
}

var $course_divide1_select_batch2 = $('#course_divide1_select_batch2')
$course_divide1_select_batch2.change(function () {
  // console.log("$course_divide1_select_batch2.change")
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
  // console.log(data_group_by_ctime)
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
    var $td = $('<td>').text(class_time).attr('class_time', class_time)
    if (group.time_quant)
      $td.addClass('distributed')
    $td.appendTo($tr);
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
  // console.log('drawDistributionTable week' + week)
  var classInWeek = getGroupInWeek(week)
  // console.log(classInWeek)
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
          $td.attr('conquer', 1);
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
  // console.log("$('#edit-template-name').click")
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
  // console.log("$class_time_container.on('click', 'td')")
  var newClicktime = new Date();
  var elapse = newClicktime - clicktime;
  // console.log('elapse', elapse)
  var $this = $(this)
  $class_time_selected = null;
  $('.selected', $class_time_container).removeClass('selected');
  if ($this.hasClass('distributed')) { // 
    if (elapse < 200) { // 双击取消分配
      if (t) {
        // console.log(t)
        clearTimeout(t);
        t = null;
      }
      $this.removeClass('distributed')
      var class_time = parseInt($this.attr('class_time'))
      if (!class_time) return;
      var ct_group = data_group_by_ctime[class_time]
      if (ct_group.dom) {
        ct_group.dom.text('');
        ct_group.dom.attr('conquer', '')
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

//　
var $course_divide1_select_week = $('#course_divide1_select_week');
$course_divide1_select_week.change(function () {
  drawDistributionTable()
})

// 单击已分配课时的跳转
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

// 课时表项点击处理
var $distribution_table = $('#distribution-table');
$distribution_table.on('click', 'td', function () {
  // console.log("$distribution_table.on('click', 'td')");
  if (!distributeEditMode) return;
  if (!$class_time_selected) return;
  var $this = $(this);
  var conquer = $this.attr('conquer');
  if (conquer) return;
  var week = $('option:selected', $course_divide1_select_week).attr('week');
  week = '0' + week;
  var day = $this.attr('day');
  var time = $this.attr('time');
  var class_time = parseInt($class_time_selected.attr('class_time'));
  if (!day || !time || !class_time) return;
  $class_time_selected.removeClass('selected').addClass('distributed');
  $class_time_selected = null;
  var wl = week.length;
  var time_quant = week.slice(wl - 2, wl) + day + time;
  data_group_by_ctime[class_time].time_quant = time_quant;
  data_group_by_ctime[class_time].dom = $this
  $this.text(class_time);
  $this.attr('conquer', 1);
});


// 课时分配表保存
$('#save-distribution').click(function () { // 获取数据保存
  // console.log("$('#save-distribution').click")
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
          _.each(data_group_by_ctime, function (group, ctime) {
            var time_quant = group.time_quant || '';
            _.each(group, function (elem) {
              elem.time_quant = time_quant;
              data.push(elem);
            })
          });
          // console.log(data);
          api_experiment.updateExperiment(data)
            .done(function (data) {
              // console.log(data);
              if (data.status === 0) {
                swal('修改成功了', '大概……', 'success');
              } else {
                swal('服务器验证失败', '请与管理员联系', 'error')
              }
            }).fail(function (data) {
              swal('其他原因', '网络是否正常？', 'error')
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
function fillProcedOptions() {
  api_proced.getAllProced()
    .done(function (data) {
      if (data.status === 0) {
        var data_arr = data.data;
        var $temp = $('<p>')
        $('<option>选择工种</option>').appendTo($temp)
        _.each(data_arr, function (val) {
          $('<option>').text(val).appendTo($temp)
        })
        $('#seach_clazzes_select_process').html($temp.html());
      }
    })
}

// 根据实习批次查询课表【数据返回格式需要修改】

$('#query-by-batch-button').click(function () {
  var batch_name = $('#seach_clazzes_select_batch1').val()
  if (batch_name && batch_name !== '实习批次选择') {
    api_experiment.getExperimentByBatch(batch_name)
      .done(function (data) {
        if (data.status === 0) {
          displayResultByBatch(data.data)
        } else {
          swal('获取数据出错', '', '')
        }
      })
  }
});

function parse_time_quant(time_quant_string) {
  var s = time_quant_string;
  if (typeof s != 'string')
    throw 'time_quant error'
  var week = s.slice(0, 2);
  if (week[0] === '0') week = week[1]
  var day = s.slice(2, 3);
  var time = s.slice(3, 4);
  var time_quant_arr = [week, day, time];
  return time_quant_arr;
}

function displayResultByBatch(data) {
  var grouped_data = _.groupBy(data, 'class_time') // 使用class_time分组的数据
  // var class_times = _.keys(grouped_data) // 如果有出现排序问题就把这个keys排序，然后用来索引
  var s_groups = _.keys(_.groupBy(data, 's_group_id'))
  var s_group_to_i = {}
  _.each(s_groups, function (sg, i) {
    s_group_to_i[sg] = i;
  })

  var $table_head = $('thead', '#query-by-batch-result').empty();

  var $tr = $('<tr>').html('<th>课时\\组号</th>')
  _.each(s_groups, function (sg, i) {
    $('<th>').text(sg).appendTo($tr)
  });
  $tr.appendTo($table_head)

  var $table_body = $('tbody', '#query-by-batch-result').empty();
  _.each(grouped_data, function (group_data, class_time) {
    $tr = $('<tr>') // 需要计算出课时对应的时间
    var time_quant = group_data[0].time_quant;
    var time_quant_arr = parse_time_quant(time_quant);
    var week = time_quant_arr[0]
    var day = time_quant_arr[1]
    var time = time_quant_arr[2]
    $('<td>').text('' + class_time + "->" + '第' + week + '周' + dayRange[day] + _.range(time * timeRangeStep + 1, time * timeRangeStep + timeRangeStep + 1) + '节').appendTo($tr)
    var td_datas = []
    td_datas.length = s_groups.length;
    _.each(group_data, function (data, i) {
      td_datas[s_group_to_i[data.s_group_id]] = data.pro_name;
    });
    _.each(td_datas, function (data, i) {
      $('<td>').text(data || '').appendTo($tr);
    })
    $tr.appendTo($table_body);
  });
}


// 根据工种和实习批次查询课表 
$('#query-by-batch-and-proced-button').click(function () {
  // console.log("$('#query-by-batch-and-proced-button').click")
  var batch_name = $('#seach_clazzes_select_batch2').val();
  var pro_name = $('#seach_clazzes_select_process').val();
  if (batch_name && batch_name !== '实习批次选择') {
    var handle = null;
    if (pro_name && pro_name !== '选择工种') {
      handle = api_experiment.getExperimentByBatchAndProced(batch_name, pro_name);
    } else {
      handle = api_experiment.getExperimentByBatch(batch_name);
    }
    handle.done(function (data) {
      if (data.status === 0) {
        displayResultByBatchAndProced(data.data)
      } else {
        fetch_err(data)
      }
    }).fail(net_err);
  }
});

function displayResultByBatchAndProced(data) {
  var $table_body = $('#query-by-batch-and-proced-result').empty();

  var $table_head = $('#query-by-batch-and-proced-head').empty();
  var $tr = $('<tr>');
  $('<th>课时\\工种</th>').appendTo($tr);
  var proceds = _.keys(_.groupBy(data, 'pro_name')); // 按拿出所有的工序
  _.each(proceds, function (val, i) {
    $('<th>').text(val).appendTo($tr);
  });
  $tr.appendTo($table_head);

  data = _.groupBy(data, 'class_time') // 按课时分组
  console.log(data)
  _.each(data, function (class_group, class_time) {
    var time_quant = class_group[0].time_quant;
    var time_quant_arr = parse_time_quant(time_quant);
    var week = time_quant_arr[0];
    var day = time_quant_arr[1];
    var time = time_quant_arr[2];
    $tr = $('<tr>');
    $('<td>').text('' + class_time + "->" + '第' + week + '周' + dayRange[day] + _.range(time * timeRangeStep + 1, time * timeRangeStep + timeRangeStep + 1) + '节').appendTo($tr);

    var proced_groups = _.groupBy(class_group, 'pro_name');
    console.log(proced_groups);
    _.each(proceds, function (proced, i) {
      var s_groups = proced_groups[proced];
      var $td = $('<td>');
      if (s_groups) {
        var groups = _.map(s_groups, 's_group_id')
        $td.text(groups.join(','));
      }
      $td.appendTo($tr);
    });
    $tr.appendTo($table_body);
  });
}

// 3、学生分组

// 学生分组
$('#group-student-button').click(groupStudent)
function groupStudent() {
  var batch_name = $('#student_divide_select_batch1').val();
  if (batch_name !== "实习批次选择") {
    api_studentGroup.groupStudent(batch_name)
      .done(function (data) {
        if (data.status === 0) {
          // console.log(data);
          swal(
            '分组成功',
            String(data.message),
            'success'
          );
        }
        else {
          // console.log(data);
          swal(
            '分组失败',
            String(data.message),
            'error'
          );
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
  var batch_name = $('#student_divide_select_batch2').val();
  var $selector = $('#student_divide_select_group').empty()
  $('<option></option>').text('组号').appendTo($selector)
  if (batch_name !== "实习批次选择") {

    api_batch.getAllSGroup(batch_name)
      .done(function (data) {
        if (data.status === 0) {
          // console.log(data);
          var data_arr = data.data;

          _.each(data_arr, function (val, i) {
            $('<option></option>').text(val).appendTo($selector)
          });
        }
      });
  }
}

$('#student_divide_select_batch2').change(getAllSGroupByBatch);



$('#get-student-list-by-batch-and-group').click(function () {
  var sgroup = $('#student_divide_select_group').val();
  var batch_name = $('#student_divide_select_batch2').val();
  if (batch_name && batch_name !== '实习批次选择' && sgroup && sgroup !== '组号') {
    post_query(
      '/student/getStudent',
      {
        batch_name: batch_name,
        s_group_id: sgroup
      }
    ).done(function (data) {
      if (data.status === 0) {
        displayGroupStudentResult(data.data)
      }
    })
  }
})


var student_group_data = []
function displayGroupStudentResult(data) {
  // console.log('displayGroupStudentResult')
  var $table_body = $('#student-group-result').empty();
  data = _.sortBy(data, 'sid');
  var $student_select_group = $('#student_divide_select_group')
  var selectedindex = $student_select_group.get(0).selectedIndex - 1

  _.each(data, function (student, i) {
    var $tr = $('<tr>');
    $('<td>').text(student.sid).addClass('sid').appendTo($tr)
    $('<td>').text(student.sname).appendTo($tr)
    $('<td>').text(student.clazz).appendTo($tr)
    $('<td>').text(student.batch_name).appendTo($tr)
    var grouptd = $('<td>');
    var groupSelector = $('<select>').addClass('select-group-id');
    groupSelector.html($student_select_group.html());
    $(':first', groupSelector).remove()
    groupSelector.appendTo(grouptd);
    grouptd.appendTo($tr)
    var btn_td = $('<td>');
    var savebutton = $('<button>').text('保存').addClass('btn btn-sm btn-info').appendTo(btn_td);
    btn_td.appendTo($tr);
    $tr.appendTo($table_body);
  })
  $('.select-group-id', $table_body).each(function (index) {
    var raw_selector = $(this).get(0);
    raw_selector.selectedIndex = selectedindex;
  })
}

$('#student-group-result').on('click', 'button', function () {
  var $this = $(this);
  // console.log($this);
  var $ptr = $this.parent().parent()
  var sid = $('.sid', $ptr).text();
  var s_group_id = $('select', $ptr).val();
  // console.log(s_group_id)
  api_student.updateGroup(sid, s_group_id)
    .done(function (data) {
      if (data.status === 0) {
        swal(
          String(data.message), '',
          'success'
        );
        $ptr.remove()
      }
    })
})


// 4、学生课表查询
// 根据学生学号查询课表
function getStuClassTableByNum() {
  var sid = $('#search_stu_by_number').val();
  if (sid) {
    api_experiment.getClass(sid)
      .done(function (data) {
        if (data.status === 0) {
          // console.log(data);
          var data_arr = data.data;
          var $table_body = $('#search_stu_tbody')
          data_arr = _.sortBy(data_arr, 'class_time');
          _.each(data_arr, function (val, i) {
            var $tr = $('<tr>');
            var time_quant_arr = parse_time_quant(val.time_quant);
            var week = time_quant_arr[0];
            var day = time_quant_arr[1];
            var time = time_quant_arr[2];
            $('<td>').text(val.class_time + "->" + "第" + week + '周' + dayRange[day] + _.range(time * timeRangeStep + 1, time * timeRangeStep + timeRangeStep + 1) + '节').appendTo($tr);
            $('<td>').text(val.pro_name).appendTo($tr);
            $('<td>').text(val.batch_name).appendTo($tr);
            $('<td>').text(val.s_group_id).appendTo($tr);
            $tr.appendTo($table_body);
          })
        }
      });
  }
}
