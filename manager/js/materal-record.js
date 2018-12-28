window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

// 初始化页面数据
function init_data(){
  // 刷新库存列表
  getAllMaterial();
  // 根据条件显示物料登记记录
  getSelectedPurchase();
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
        html2 = '<option>选择物料种类</option>' + html2;
        $('#record_history_selset_meterail').html(html2);
      }
      // 分页初始化
      kgoPage(1,5);
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
        // console.log(data);
        swal(
          '派出成功',
          '派出物料记录成功',
          'success'
        );
        // 清空派出物料时填的内容
        $('#distribute_num').val("");
        $('#select_meterial').val("");
        $('#distribute_stu_id').val("");
        $('#distribute_stu_name').val("");
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

// 根据条件显示物料登记记录【接口有问题！！！】
function getSelectedPurchase(){
  let start_time = $('#start_time').val();
  let end_time = $('#end_time').val();
  let clazz = $('#record_history_selset_meterail').val();
  let sid = $('#stu_id').val();
  let sname = $('#stu_name').val();

  if(clazz === "选择物料种类"){
    clazz = "";
  }
  $.ajax({
    type: 'post',
    url: base_url + '/material/getApplys',
    datatype: 'json',
    data: {
      'clazz': clazz,
      'sid': sid,
      'sname': sname,
      'startTime': start_time,
      'endTime': end_time
    },
    success: function(data){
      if(data.status === 0){
        console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td>'+chGMT(data_arr[i].apply_time)+'</td><td>'+data_arr[i].sname+'</td><td>'+data_arr[i].sid+'</td><td>'+data_arr[i].clazz+'</td><td>'+data_arr[i].num+'</td><td>'+data_arr[i].tid+'</td></tr>';
        }
        $('#adminTbody').html(html);
        // console.log(material_class);
      }
      // 分页初始化
      goPage(1,10);
    }
  });
}


// ========================================================================
// 6、其他函数

// 格林威治时间的转换
Date.prototype.format = function(format){
	var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        }
    if(/(y+)/.test(format))
    format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
    if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
// 获取标准时间格式
function chGMT(gmtDate){
	var mydate = new Date(gmtDate);
	mydate.setHours(mydate.getHours() + 8);
	// return mydate.format("yyyy-MM-dd hh:mm:ss");
  return mydate.format("yyyy-MM-dd hh:mm");
}
