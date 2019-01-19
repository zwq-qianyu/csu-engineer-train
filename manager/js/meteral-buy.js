var string_array = ["j","s","c","b","h","r"]; //定义各功能模块名称字母代表
window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

// 初始化页面数据
function init_data(){
  // 刷新库存列表
  getAllMaterial();
  // 获取所有申购权限的人的信息
  getApplyer();
  // 获取所有采购权限的人的信息
  getPurchaser();
  // 获取所有入库权限的人的信息
  getStorer();
  // 获取所有物料申购记录
  getSelectedPurchase();
}

// 获取所有物料
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
        $('#kadminTbody').html(html);
        // console.log(material_class);
        // 导入所有物料种类
        let html2 = '<option>物料种类</option>';
        for(let j=0; j<material_class.length; j++){
          html2 += '<option>'+material_class[j]+'</option>';
        }
        // $('#kelect_meterial').html(html2);
        for(let k=0;k<6;k++)
          $('#'+string_array[k]+'material').html(html2);
        $("#add_apply_material").html(html2);
      }
      // 分页初始化
      goPage("k",1,5);
    },
  });
}

// 获取所有申购人信息
function getApplyer(){
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

        $('#'+string_array[0]+'apply_person').html(html);

      }
    }
  });
}

// 获取所有采购人信息
function getPurchaser() {
    $.ajax({
        type: 'post',
        url: base_url + '/purchase/getPurchaser',
        datatype: 'json',
        data: {},
        success: function(data){
            // console.log(data);
            if(data.status === 0){
                let data_arr = data.data;
                let html = '<option>采购人</option>';
                for(let i=0; i<data_arr.length; i++){
                    html += '<option>'+data_arr[i]+'</option>';
                }
                // console.log(html);
                for(let i=0;i<4;i++){
                  $('#'+string_array[i]+'purchase_person').html(html);
                }

            }
        }
    });
}

// 获取所有入库人信息
function getStorer() {
    $.ajax({
        type: 'post',
        url: base_url + '/purchase/getPurchaser',
        datatype: 'json',
        data: {},
        success: function(data){
            // console.log(data);
            if(data.status === 0){
                let data_arr = data.data;
                let html = '<option>入库人</option>';
                for(let i=0; i<data_arr.length; i++){
                    html += '<option>'+data_arr[i]+'</option>';
                }
                // console.log(html);
                $('#'+string_array[5]+'store_person').html(html);

            }
        }
    });
}

// 申购物料
function addPurchase(){
  let num = $('#meteral_buy_num').val();
  let clazz = $('#select_meterial').val();
  if(clazz === "选择物料种类" | num === ""){
    swal(
      '无物料种类或数量',
      '请先选择物料种类，并填写申购数量！',
      'info'
    );
  }
  else{
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
  if(clazz === "选择物料种类"){
    clazz = "";
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
      // console.log(data);
      if(data.status === 0){
        console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td>'+data_arr[i].pur_time+'</td><td>'+data_arr[i].tname+'</td><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].pur_num+'</td>';
        }
        $('#jadminTbody').html(html);
        // console.log(material_class);
      }
      // 分页初始化
      goPage("j",1,10);
    }
  });
}

// 根据条件显示各个部分的记录
function getSelectedRecords(kind){
  let query = {};
  query.startTime = $('#'+kind+'start_time').val();
  query.endTime = $('#'+kind+'end_time').val();
  query.material = $('#'+kind+'material').val();
  let applyPerson;
  let purchasePerson;
  let storePerson;
  let purchaseAuditStatus;
  let reimburseAuditStatus;
  let purchaseNumber;

  if(query.material == '物料种类'){
    query.material = '';
  }
  if($('#'+kind+'apply_person').val()!=undefined){
    query.applyPerson = $('#'+kind+'apply_person').val();
  }
  if($('#'+kind+'purchase_person').val()!=undefined){
    query.purchasePerson = $('#'+kind+'purchase_person').val();
  }
  if($('#'+kind+'store_person').val()!=undefined){
    query.storePerson = $('#'+kind+'store_person').val();
  }
  if($('#'+kind+'purchase_audit_status').val()!=undefined){
    if($('#'+kind+'purchase_audit_status').val()=='审核状态')
      query.purchaseAuditStatus = '';
    else
      query.purchaseAuditStatus = $('#'+kind+'purchase_audit_status').val();
  }
  if($('#'+kind+'reimburse_audit_status').val()!=undefined){
    if($('#'+kind+'reimburse_audit_status').val()=='审核状态')
      query.reimburseAuditStatus = '';
    else
      query.reimburseAuditStatus = $('#'+kind+'reimburse_audit_status').val();
  }

  console.log(query)



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

// 新增申购记录
function addOneApply(){
  let newApply = {};
  newApply.material = $("#add_apply_material").val();
  newApply.number = $("#add_apply_number").val();
  newApply.note = $("#add_apply_note").val();
  console.log(newApply)
}

// 新增采购记录
function addOnePurchase() {
  let newPurchase = {};
  newPurchase.num = $("#add_purchase_num").val();
  newPurchase.date = $("#add_purchase_date").val();
  newPurchase.number = $("#add_purchase_number").val();
  newPurchase.note = $("#add_purchase_note").val();
  console.log(newPurchase)
}

// 新增报账记录
function addOneReimburse() {
  let newReimburse = {};
  newReimburse.num = $("#add_reimburse_num").val();
  newReimburse.number = $("#add_reimburse_number").val();
  newReimburse.note = $("#add_reimburse_note").val();
  console.log(newReimburse)
}

// 新增入库记录
function addOneStore() {
  let newStore = {};
  newStore.num = $("#add_store_num").val();
  newStore.date = $("#add_store_date").val();
  newStore.number = $("#add_store_number").val();
  newStore.note = $("#add_store_note").val();
  console.log(newStore)
}