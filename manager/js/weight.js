window.onload = function(){
  // 初始化
  init_data();
}

// 初始化数据
function init_data(){
  // 初始化所有权重模版名
  findAllTemplate();
}

var base_url = 'http://134.175.152.210:8084';

//  获取所有权重模版名
function findAllTemplate(){
  $.ajax({
    type: 'post',
    url: base_url + '/proced/findAllTemplate',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>权重模版选择</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>'
        }
        $('#weight_select_templates').html(html);
      }
    }
  });
}

$('#weight_select_templates').change(function(){
  let new_template = $('#weight_select_templates').val();
  console.log(new_template);
  if(new_template !== "权重模版选择"){
    $.ajax({
      type: 'post',
      url: base_url + '/proced/findTemplateItemByName',
      datatype: 'json',
      data: {
        'name': new_template
      },
      success: function(data){
        if(data.status === 0){
          let data_arr = data.data;
          let html = '';
          for(let i=0; i<data_arr.length; i++){
            html += '<tr><td>'+data_arr[i].pro_name+'</td><td><input type="text" name="" value="'+100*data_arr[i].weight+'"> %</td></tr>'
          }
          $('#weight_edit_list').html(html);
        }
      }
    });
  }
})
