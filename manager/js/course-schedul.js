window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

// 初始化页面数据
function init_data(){

  // 获取所有模版并渲染
  getAllTemplates();
  // 查询指定模板的所有学生分组
  getSGroupByTemplate();
}

// 添加新模版弹窗上动态生成 table
$("#schedule-add").click(function(){
  $("#schedule-add-panel").empty();   // 关闭“添加新模版弹窗”时清除弹窗上添加的元素
  var number = $("#schedule-group-numbers").val();
  // console.log(number);
  $("#schedule-group-numbers").val("");   //  置空组数
  $("#schedul-addLine-div").show();
  var html = "<table class='table' style='padding-right: 50px;'><thead id='thead-number' num="+number+"><tr><th>课时\\组名</th>";
  for(var i=0; i<number; i++){
    html += "<th><input type='text' class='form-control' placeholder='输入组名' id=''></th>"
  }
  html += "</tr></thead><tbody id='schedule-add-tbody'></tbody>";
  // console.log(html);
  $("#schedule-add-panel").append(html);
});

// 添加新模版弹窗上添加一行（一个课时）
$("#schedul-addLine").click(function(){
  var line_html = "<tr class='schedule-add-tbody-tr'>";
  var n = $(".schedule-add-tbody-tr").length + 1;
  console.log(n);
  line_html += "<td>"+ n +"</td>";
  var number = $("#thead-number").attr("num");
  for(var i=0; i<number; i++){
    line_html += "<td>"+i+"</td>";
  }
  line_html += "</tr>";
  $("#schedule-add-tbody").append(line_html);
});

// 关闭“”添加新模版弹窗”时清除弹窗上添加的元素
$("#addNewPlan-close").click(function(){
  $("#schedule-add-panel").empty();
});
$("#addNewPlan-close").click(function(){
  $("#schedule-add-panel").empty();
});

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
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>';
        }
        $('#allTemplates').html(html);
      }
    }
  });
}

// 删除一个模版
function deleteTemplate(){
  let template = $('#allTemplates').val();
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
        url: base_url + '/experiment/deleteTemplate',
        datatype: 'json',
        data: {
          'template_id': template
        },
        success: function(data){
          if(data.status === 0){
            // console.log(data);
            swal(
              '删除成功',
              '删除模版成功',
              'success'
            );
            // 刷新教师值班记录
            getOverworkByTimeOrProName();
          }
          else{
            console.log(data);
            swal(
              '删除失败',
              String(data.message),
              'error'
            );
          }
        },
        error: function(data){
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
	    // handle dismiss, result.dismiss can be 'cancel', 'overlay', 'close', and 'timer'
	    console.log(result.dismiss)
	  }
  })
}

// 查询指定模板的所有学生分组
function getSGroupByTemplate(){
  let temp = $('#allTemplates').val();
  $.ajax({
    type: 'post',
    url: base_url + '/experiment/getSGroupByTemplate',
    datatype: 'json',
    data: {
      'template_id': temp
    },
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<tr><th>课时</th>';
        for(let i=0; i<data_arr.length; i++){
          html += '<td>'+data_arr[i]+'</td>';
        }
        html += '</td>';
        $('#courseSchedul_thead').html(html);
      }
    }
  });
}

// 切换模版时
$('#allTemplates').change(function(){
  getSGroupByTemplate();
})

// 获取tbody中的排课方案数据


// 添加新方案


// 修改模版
