$(function(){
  init_data();
})

var base_url = 'http://134.175.152.210:8084';

// 初始化页面数据
function init_data(){
  // 判断物料申购权限
  judge_matera_buy_power();
  // 刷新库存列表
  getAllMaterial();
  // 获取所有有购权限的人的信息
  getPurchaser();
  // 初始时显示物料申购记录
  getSelectedPurchase_init();
}

// 判断物料申购权限
function judge_matera_buy_power(){
  $.ajax({
    type: 'post',
    url: base_url + '/user/getInfo',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        if(data_arr['物料权限'] !== "2"){
          $('#purchase_material').hide();
        }
      }
    },
  });
}

// 刷新库存列表
function getAllMaterial(){
  let material_class = new Array;
  $('#new_semester').val("");
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
          html += '<tr><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].num+'</td>';
          html += '<td><button class="btn btn-danger btn-sm" id="'+data_arr[i].clazz+'" onclick="deleteOneMateral(this)">删除</button></td></tr>';
          material_class.push(data_arr[i].clazz);
        }
        $('#materal_buy_list').html(html);
        // console.log(material_class);
        // 导入所有物料种类
        let html2 = '';
        for(let j=0; j<material_class.length; j++){
          html2 += '<option>'+material_class[j]+'</option>';
        }
        $('#select_meterial').html(html2);
        $('#buy_history_selset_meterail').html(html2);
      }
      // 分页初始化
      kgoPage(1,5);
    },
  });
}

// 获取所有申购人信息
function getPurchaser(){
  $.ajax({
    type: 'post',
    url: base_url + '/purchase/getPurchaser',
    datatype: 'json',
    data: {},
    success: function(data){
      // console.log(data);
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>申购人</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>';
        }
        // console.log(html);
        $('#buy_history_selset_person').html(html);
      }
    }
  });
}

// 申购物料
function addPurchase(){
  let num = $('#meteral_buy_num').val();
  let clazz = $('#select_meterial').val();

  $.ajax({
    type: 'post',
    url: base_url + '/purchase/addPurchase',
    datatype: 'json',
    // contentType: 'application/json;charset=UTF-8',
    data: {
      'num': num,
      'clazz': clazz,
    },
    beforeSend: function(xhr) {
      xhr.withCredentials = true;
    },
    crossDomain:true,
    success: function(data){
      console.log(data);
      if(data.status === 0){
        console.log(data);
        swal(
          '申购成功',
          '申购物料记录成功',
          'success'
        );
        init_data();
      }
      else{
        console.log(data);
        swal(
          '申购失败',
          '申购物料失败，请重试！',
          'error'
        );
      }
    },
    error: function(data){
      console.log(data);
    }
  });
}

// 初始时显示物料申购记录
function getSelectedPurchase_init(){
  $.ajax({
    type: 'post',
    url: base_url + '/purchase/getSelectedPurchase',
    datatype: 'json',
    data: {},
    beforeSend: function(xhr) {
      xhr.withCredentials = true;
    },
    crossDomain:true,
    success: function(data){
      console.log(data);
      if(data.status === 0){
        console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td>'+data_arr[i].pur_time+'</td><td>'+data_arr[i].tname+'</td><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].pur_num+'</td>';
        }
        $('#adminTbody').html(html);
        // console.log(material_class);
      }
      // 分页初始化
      goPage(1,10);
    }
  });
}
// 根据条件显示物料申购记录
function getSelectedPurchase(){
  let clazz = $('#buy_history_selset_meterail').val();
  let tname = $('#buy_history_selset_person').val();
  let startTime = $('#star_time').val();
  let endTime = $('#end_time').val();
  if(tname === "申购人"){
    tname = "";
  }
  $.ajax({
    type: 'post',
    url: base_url + '/purchase/getSelectedPurchase',
    datatype: 'json',
    data: {
      'clazz': clazz,
      'tname': tname,
      'startTime': startTime,
      'endTime': endTime
    },
    beforeSend: function(xhr) {
      xhr.withCredentials = true;
    },
    crossDomain:true,
    success: function(data){
      console.log(data);
      if(data.status === 0){
        console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td>'+data_arr[i].pur_time+'</td><td>'+data_arr[i].tname+'</td><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].pur_num+'</td>';
        }
        $('#adminTbody').html(html);
        // console.log(material_class);
      }
      // 分页初始化
      goPage(1,10);
    }
  });
}

// 删除一种物料
function deleteOneMateral(obj){
  let clazz = obj.getAttribute('id');
  console.log(clazz);
  $.ajax({
    type: 'post',
    url: base_url + '/material/deleteMaterial',
    datatype: 'json',
    data: {
      'clazz': clazz
    },
    success: function(data){
      if(data.status === 0){
        console.log(data);
        swal(
          '删除成功',
          '删除物料成功',
          'success'
        );
        init_data();
      }
      else{
        console.log(data);
        swal(
          '删除失败',
          '删除物料失败，请重试！',
          'error'
        );
      }
    },
    error: function(data){
      console.log(data);
      swal(
        '删除失败',
        String(data.message),
        'error'
      );
    }
  });
}

// 添加一种新的物料
function addOneMateral(){
  let new_material = $('#new_semester').val();
  $.ajax({
    type: 'post',
    url: base_url + '/purchase/addPurchase',
    datatype: 'json',
    // contentType: 'application/json;charset=UTF-8',
    data: {
      'num': "0",
      'clazz': new_material,
    },
    beforeSend: function(xhr) {
      xhr.withCredentials = true;
    },
    crossDomain:true,
    success: function(data){
      console.log(data);
      if(data.status === 0){
        console.log(data);
        swal(
          '添加成功',
          '添加新物料成功',
          'success'
        );
        init_data();
      }
      else{
        console.log(data);
        swal(
          '添加失败',
          '添加新物料失败，请重试！',
          'error'
        );
      }
    },
    error: function(data){
      console.log(data);
    }
  });
}
