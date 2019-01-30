$(function(){
  init_data();
})

var base_url = 'http://134.175.152.210:8084';

// 初始化数据
function init_data(){
  // 获取所有批次
  getAllBatch_StuList();
  // 获取所有工种
  getAllProced();
}


// 获取所有批次
function getAllBatch_StuList(){
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllBatch',
    datatype: 'json',
    data: {},
    beforeSend: function(xhr) {
      xhr.withCredentials = true;
    },
    crossDomain:true,
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        html = "<option>实习批次选择</option>";
        for(let i=0; i<data.data.length; i++){
          html += '<option>'+data.data[i].batch_name+'</option>';
        }
        // console.log(html);
        $('#score_list_select_batch').html(html);
        $('#score_list_select_batch2').html(html);
        $('#input_score_select_batch').html(html);
        $('#score_submit_select_batch').html(html);
        $('#score_edithistory_select_batch').html(html);
      }
    }
  });
}
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
        $('#score_list_select_process').html(html);
        $('#input_score_select_scoreitem').html(html);
        $('#score_submit_select_process').html(html);
      }
    }
  });
}
// 根据批次获取对应的分组号--成绩列表
function getAllSGroupByBatch(){
  let batch_name = $('#score_list_select_batch').val();
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
        $('#score_list_select_group_number').html(html);
      }
    }
  });
}
// 改变批次时做成响应
$('#score_list_select_batch').change(function(){
  // 根据条件查询成绩列表
  getScoreList();
  // 根据批次名获取工序
  getBatchProced();
  // 根据批次获取对应的分组号--成绩列表部分
  getAllSGroupByBatch();
})
