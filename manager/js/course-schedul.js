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
