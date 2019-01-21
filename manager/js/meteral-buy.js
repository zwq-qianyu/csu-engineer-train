window.onload = function(){
  init_data();
}


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
  getAllApplyFPchse();

    // $('.nav-tabs li').click(function(){
    //     $(this).addClass('active').siblings().removeClass('active');
    //     var _id = $(this).attr('data-id');
    //     $('#tabContent').find('#'+_id).addClass('active').removeClass('fade').siblings().removeClass('active');
    //     console.log($('#tabContent').find('#'+_id))
    //     switch(_id){
    //         case "Section1":
    //             getAllMaterial();
    //             break;
    //         case "Section2":
    //             getApplyer();
    //             getPurchaser();
    //             break;
    //         case "Section3":
    //             getApplyer();
    //             getPurchaser();
    //             break;
    //         case "Section4":
    //             getStorer();
    //             break;
    //         default:
    //             getAllMaterial();
    //             break;
    //     }
    // });
}



// 库存页*********************************
// 获取所有物料
function getAllMaterial(){
  var material_class = new Array;
  $('#new_semester').val("");
  api_material.getAllMaterial()
    .done(function (data) {
        var data_arr = data.data;
        var html = '';

        for(var i=0; i<data_arr.length; i++){
            html += '<tr><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].num+'</td>';
            html += '<td><button class="btn btn-danger btn-sm" id="'+data_arr[i].clazz+'" onclick="devareOneMateral(this)">删除</button></td></tr>';
            material_class.push(data_arr[i].clazz);
        }
        $('#kadminTbody').html(html);
        // console.log(material_class);
        // 导入所有物料种类
        var html2 = '<option>物料种类</option>';
        for(var j=0; j<material_class.length; j++){
            html2 += '<option>'+material_class[j]+'</option>';
        }
        // $('#kelect_meterial').html(html2);
        for(var k=0;k<6;k++)
            $('#'+string_array[k]+'material').html(html2);
        $("#add_apply_material").html(html2);

        // 分页初始化
        goPage("k",1,5);
    });
}

// 删除一种物料
function devareOneMateral(obj){
    var clazz = obj.getAttribute('id');
    console.log(clazz);
    api_material.deletePurchase(clazz)
        .done(function (data) {
            if(data.status === 0){
                swal(
                    '删除成功',
                    '删除物料成功',
                    'success'
                );
                getAllMaterial();
            }
            else{
                swal(
                    '删除失败',
                    '删除物料失败，请重试！',
                    'error'
                );
            }
        })
}

// 添加一种新的物料
function addOneMateral(){
    var clazz = $('#new_semester').val();
    if(clazz==""){
        swal(
            '物料种类为空',
            '请先输入物料名称',
            'info'
        );
    }
    else{
        api_material.addPurchase("0",clazz)
            .done(function (data) {
                if(data.status === 0){
                    console.log(data);
                    swal(
                        '添加成功',
                        '添加新物料成功',
                        'success'
                    );
                    getAllMaterial();
                }
                else{
                    console.log(data);
                    swal(
                        '添加失败',
                        '添加新物料失败，请重试！',
                        'error'
                    );
                }
            })
    }
}


// 其他记录页******************************
// 获取所有申购人信息
function getApplyer(){
  api_material_purchase.getAllNameByAuthType(1)
      .done(function (data) {
          var data_arr = data.data;
          var html = '<option>申购人</option>';
          for(var i=0; i<data_arr.length; i++){
              html += '<option>'+data_arr[i]+'</option>';
          }

          $('#'+string_array[0]+'apply_person').html(html);
      })
}

// 获取所有采购人信息
function getPurchaser() {
    api_material_purchase.getAllNameByAuthType(2)
    .done(function (data) {
        var data_arr = data.data;
        var html = '<option>采购人</option>';
        for(var i=0; i<data_arr.length; i++){
            html += '<option>'+data_arr[i]+'</option>';
        }
        // console.log(html);
        for(var i=0;i<4;i++){
            $('#'+string_array[i]+'purchase_person').html(html);
        }
    })
}

// 获取所有入库人信息
function getStorer() {
    api_material_purchase.getAllNameByAuthType(3)
        .done(function (data) {
            var data_arr = data.data;
            var html = '<option>入库人</option>';
            for(var i=0; i<data_arr.length; i++){
                html += '<option>'+data_arr[i]+'</option>';
            }
            // console.log(html);
            $('#'+string_array[5]+'store_person').html(html);
        })
}

// 获取所有申购记录
function getAllApplyFPchse() {
    api_material_purchase.getAllApplyFPchse()
        .done(function (data) {
            if(data.status==0){
                var data_arr = data.data;
                var html = '';
                // for(var i=0; i<data_arr.length; i++){
                //     html += '<tr>' +
                //                 '<td class="fixed-column w52" style="border-bottom-width: 0;"><input type="checkbox"></td>' +
                //                 '<td class="fixed-column w120" style="border-bottom-width: 0;">'+data_arr[i].purchase_id+'</td>' +
                //                 '<td>'+data_arr[i].apply_time+'</td>' +
                //                 '<td>'+data_arr[i].apply_tname+'</td>' +
                //                 '<td>'+data_arr[i].clazz+'</td>' +
                //                 '<td>'+data_arr[i].apply_num+'</td>' +
                //                 '<td>'+data_arr[i].apply_remark+'</td>' +
                //                 '<td>'+data_arr[i].apply_vertify+'</td>' +
                //                 '<td>'+data_arr[i].apply_vert_tname+'</td>' +
                //                 '<td>'+data_arr[i].apply_remark+'</td>' +
                //                 '<td>'+data_arr[i].apply_remark+'</td>' +
                //                 '<td>'+data_arr[i].apply_remark+'</td>' +
                //                 '<td>'+data_arr[i].apply_remark+'</td></tr>';
                // }
                $('#jadminTbody').html(html);
                // 分页初始化
                goPage("j",1,10);
            }
        })
}

// 根据条件显示物料申购记录
function getSelectedPurchase(){
  var clazz = $('#jmaterial').val();
  var tname = $('#japply_person').val();
  var startTime = $('#jstart_time').val();
  var endTime = $('#jend_time').val();
  if(tname === "申购人"){
    tname = "";
  }
  if(clazz === "选择物料种类"){
    clazz = "";
  }
  if(startTime==''){
    if(endTime==''){

    }
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
        var data_arr = data.data;
        var html = '';
        for(var i=0; i<data_arr.length; i++){
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
  var query = {};
  query.startTime = $('#'+kind+'start_time').val();
  query.endTime = $('#'+kind+'end_time').val();
  query.material = $('#'+kind+'material').val();
  var applyPerson;
  var purchasePerson;
  var storePerson;
  var purchaseAuditStatus;
  var reimburseAuditStatus;
  var purchaseNumber;

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


// 新增申购记录
function addOneApply(){
  var newApply = {};
  newApply.material = $("#add_apply_material").val();
  newApply.number = $("#add_apply_number").val();
  newApply.note = $("#add_apply_note").val();
  console.log(newApply)
}

// 新增采购记录
function addOnePurchase() {
  var newPurchase = {};
  newPurchase.num = $("#add_purchase_num").val();
  newPurchase.date = $("#add_purchase_date").val();
  newPurchase.number = $("#add_purchase_number").val();
  newPurchase.note = $("#add_purchase_note").val();
  console.log(newPurchase)
}

// 新增报账记录
function addOneReimburse() {
  var newReimburse = {};
  newReimburse.num = $("#add_reimburse_num").val();
  newReimburse.number = $("#add_reimburse_number").val();
  newReimburse.note = $("#add_reimburse_note").val();
  console.log(newReimburse)
}

// 新增入库记录
function addOneStore() {
  var newStore = {};
  newStore.num = $("#add_store_num").val();
  newStore.date = $("#add_store_date").val();
  newStore.number = $("#add_store_number").val();
  newStore.note = $("#add_store_note").val();
  console.log(newStore)
}