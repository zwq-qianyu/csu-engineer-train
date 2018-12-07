window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

// 初始化页面数据
function init_data(){
  getAllMaterial();
}

// 刷新库存列表
function getAllMaterial(){
  let material_class = new Array;
  $.ajax({
    type: 'post',
    url: base_url + '/material/getAllMaterial',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].num+'</td></tr>';
          material_class.push(data_arr[i].clazz);
        }
        $('#materal_record_list').html(html);
        // console.log(material_class);
        // 导入所有物料种类
        let html2 = '';
        for(let j=0; j<material_class.length; j++){
          html2 += '<option>'+material_class[j]+'</option>';
        }
        $('#select_meterial').html(html2);
        $('#record_history_selset_meterail').html(html2);
      }
    }
  });
}

// 派出物料
function decrMaterialNum(){
  let num = $('#distribute_num').val();
  let clazz = $('#select_meterial').val();
  let sid = $('#distribute_stu_id').val();
  let sname = $('#distribute_stu_name').val();

  $.ajax({
    type: 'post',
    url: base_url + '/material/decrMaterialNum',
    datatype: 'json',
    data: {
      'num': num,
      'clazz': clazz,
      'sid': sid,
      'sname': sname
    },
    success: function(data){
      if(data.status === 0){
        console.log(data);
        swal(
          '派出成功',
          '派出物料记录成功',
          'success'
        );
        init_data();
      }
      else{
        console.log(data);
        swal(
          '派出失败',
          '物料数量不足',
          'error'
        );
      }
    }
  });
}

// 根据条件显示物料申购记录【接口有问题！！！】
function getSelectedPurchase(){
  $.ajax({
    type: 'post',
    url: base_url + '/material/getApplys',
    datatype: 'json',
    data: {

    },
    success: function(data){
      if(data.status === 0){
        console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td>'+data_arr[i].pur_time+'</td><td>'+data_arr[i].tname+'</td><td>学号</td><td>铝棒(根x2m)</td><td>200</td><td>力宏</td></tr>';
        }
        $('#record_history_body').html(html);
        // console.log(material_class);
      }
    }
  });
}
