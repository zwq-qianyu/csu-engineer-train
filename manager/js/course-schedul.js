// window.onload = function(){
//   init_data();
// };
$(document).ready(function () {
  init_data()
})


var base_url = 'http://134.175.152.210:8084';

// 初始化页面数据
function init_data() {
  // 获取所有模版并渲染
  console.log('init')
  updateTemplateSelector()
}

function addTemplates(data, callback) {
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/addTemplate',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      if (data.status === 0) {
        callback(data)
      }
    }
  });
}

function updateTemplateSelector() {
  console.log('updateTemplateSelector')
  getAllTemplates(function (data) {
    var $alltemplates = $('#template-selector').empty()
    _.forEach(data, function (d) {
      $("<option></option>").text(d).appendTo($alltemplates)
    })
    fetchAndUpdateTemplateTable()
  })
}

// 获取所有模版名
function getAllTemplates(callback) {
  console.log('getAllTemplates')
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getAllTemplate',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    success: function (data) {
      if (data.status === 0) {
        callback(data.data)
      }
    }
  });
}

// 获取模板数据
function getTemplate(callback) {
  console.log('getTemplate')
  var temp_id = $('#template-selector').val()
  if (temp_id === null) return
  // console.log(temp_id)
  var data = { template_id: temp_id };
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getTemplate',
    dataType: 'json',
    data: data,
    success: function (data) {
      if (data.status === 0) {
        // console.log(data)
        callback(data.data)
      }
    }
  });
}


function fetchAndUpdateTemplateTable() {
  console.log('updateTemplateTable')
  getTemplate(function (data) {
    fillCurrentTemplate(data)
    updateTemplateTable(data)
  })
}

// 切换模版时
$('#template-selector').change(function () {
  console.log('allTemplates change')
  fetchAndUpdateTemplateTable()
})

var currentTemplate = {}

function fillCurrentTemplate(data) {
  currentTemplate = {}
  for (var i = 0; i < data.length; i++) {
    var d = data[i]
    if (d.s_group_id === null) continue;
    if (currentTemplate[d.s_group_id] === undefined)
      currentTemplate[d.s_group_id] = []
    currentTemplate[d.s_group_id][d.class_time] = d
  }
}

function set_template_head(group) {
  var $head = $("#template-thead").empty();
  var content = []
  var $tr = $('<tr></tr>')
  $("<th></th>").appendTo($tr)
  for (var g of group) {
    $("<th></th>").text(g).appendTo($tr)
  }
  $tr.appendTo($head)
}

function toMatrix(currentTemplate, group) {
  var _groupMap = {}
  var _data = []

  group.forEach(function (elem, ind) {
    _groupMap[elem] = ind + 1
  })
  for (var g in currentTemplate) {
    var a = currentTemplate[g]
    var gi = _groupMap[g]
    a.forEach(function (val, ind) {
      if (_data[ind] === undefined) _data[ind] = []
      _data[ind][gi] = val
    })
  }
  return _data
}

function set_template_tbody(data) {
  var $tbody = $("#template-tbody").empty();
  if (data.length == 0) return;
  var cols = _.maxBy(data, _.length).length

  for (var i = 1; i < data.length; i++) {
    var row = data[i]
    var $tr = $('<tr></tr>')
    $('<td></td>').text(i).appendTo($tr)
    for (var j = 1; j < cols; j++) {
      var $td = $('<td></td>')
      if (row[j] !== undefined)
        $td.text(row[j].pro_name)
      $td.appendTo($tr)
    }
    $tr.appendTo($tbody)
  }
}

function sortSGroup() {
  var groups = []
  // console.log(currentTemplate)
  for (var g in currentTemplate) {
    if (g === null) { }
    else
      groups.push(g)
  }
  groups.sort()
  return groups
}

var modelData;

function updateTemplateTable() {
  groups = sortSGroup()
  set_template_head(groups)
  modelData = toMatrix(currentTemplate, groups)
  set_template_tbody(modelData)
}

// 新建模板
$('#new-template').click(function () {
  swal({
    content: {
      element: "input",
      attributes: {
        placeholder: "输入新模板名",
      },
    },
    buttons: true
  }).then(function (name) {
    // console.log(w)
    if (name) {
      // console.log(name)
      name = name.trim();
      if(name){
        var data = [{ "template_id": name }]
        addTemplates(data,function(data){
          // console.log(data)
          swal('消息','添加模板成功,请在下方编辑模板','success')
          fetchAndUpdateTemplateTable()
        })
      }
    } else
      console.log('cancel')
  });
})

$('#edit-template').click(function () {
  update_selectors() // todo 点击表格项，对数据模型进行修改
  $('#edit-tool').show()
})

var teacher_groups = []
var teacher_groups_proced = {}

$('#teacher-selector').change(teacher_groups_change_handler)
function teacher_groups_change_handler() {
  var $procedSelector = $('#proced-selector').empty();
  var $teacher_group = $('#teacher-selector').val()
  if (!$teacher_group)
    return;
  if (!teacher_groups_proced[$teacher_group])
    setTimeout(teacher_groups_change_handler, 100)
  _.forEach(teacher_groups_proced[$teacher_group], function (val) {
    $('<option></option>').text(val).appendTo($procedSelector)
  })
}

function update_selectors() {
  teacher_groups = []
  teacher_groups_proced = {}
  var $teacherGroupSelector = $('#teacher-selector').empty();
  $('#teacher-selector').empty();
  getAllTeacherGroup(function (datas) {
    // console.log(datas)
    _.forEach(datas, function (data) {
      $('<option></option>').text(data.t_group_id).appendTo($teacherGroupSelector)
      getProcedByGroup(data.t_group_id, function (datas) {
        teacher_groups_proced[data.t_group_id] = datas
      })
    });
    teacher_groups_change_handler();
  });
}

function getAllTeacherGroup(callback) {
  $.ajax({
    type: 'post',
    url: base_url + '/group/getAllGroup',
    data: {},
    datatype: 'json',
    success: function (data) {
      if (data.status === 0) {
        // console.log(data.data)
        teacher_groups = data.data || [];
        callback(teacher_groups)
      }
    }
  });
}

function getProcedByGroup(t_group_id, callback) {
  $.ajax({
    type: 'post',
    url: base_url + '/group/getProcedByGroup',
    data: { 'groupName': t_group_id },
    datatype: 'json',
    success: function (data) {
      if (data.status === 0) {
        // console.log(data)
        callback(data.data);
      }
    }
  });
}

$('#add-student-group').click(function () { // todo
  // currentTemplate.push
})

$('#add-class-time').click(function () {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      console.log(willDelete)
    });
  // modelData.
})

$('#save-template').click(saveTemplate)

function saveTemplate() { // todo 将数据模型打包给 addTemplate
  // addTemplate()
  $('#edit-tool').hide()
}

$('#delete-template').click(deleteTemplate)

// 删除一个模版
function deleteTemplate() {
  let template = $('#template-selector').val();
  swal({
    title: '确定删除吗？',
    text: '确定删除吗？你将无法恢复它！',
    icon: 'warning',
    buttons:true,
    dangerMode:true
  }).then(ifTrue => {
    if (ifTrue) {
      console.log(ifTrue)
      $.ajax({
        type: 'post',
        url: base_url + '/experiment/deleteTemplate',
        datatype: 'json',
        data: {
          'template_id': template
        },
        success: function (data) {
          if (data.status === 0) {
            // console.log(data);
            swal(
              '删除成功',
              '删除模版成功',
              'success'
            );
            updateTemplateSelector()
            // 刷新教师值班记录
            // getOverworkByTimeOrProName(); // todo 这是什么东西
          }
          else {
            console.log(data);
            swal(
              '删除失败',
              String(data.message),
              'error'
            );
          }
        },
        error: function (data) {
          console.log(data);
          swal(
            '删除失败',
            '删除失败, 404 Not Found',
            'error'
          );
        }
      });
      console.log(result.value)
    } else {
      console.log(result.dismiss)
    }
  })
}