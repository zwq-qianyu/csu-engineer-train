var base_url = 'http://134.175.152.210:8084';
var basicInfo = {};

$.ajaxSetup({
    cache:false,
    crossDomain:true
})


function post_query(url, query) {
    return $.ajax({
        type: 'post',
        url: base_url+url,
        dataType: 'json',
        data: query,
        crossDomain:true,
    })
}

function post_json(url, json_obj) {
    return $.ajax({
        type: 'post',
        url: base_url+url,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json_obj),
        crossDomain:true,
    });
}

function post_file(url, data) {
    return $.ajax({
        type:'post',
        url:base_url+url,
        data:data,
        processData:false,
        contentType: false
    })
}

function downloads(url,json_obj) {
    $.ajax({
        type: 'post',
        url: base_url + url,
        datatype: 'json',
        data: json_obj,
        crossDomain:true,
        success: function (result) {
            // 创建a标签，设置属性，并触发点击下载
            var $a = $("<a>");
            $a.attr("href", result.data.file);
            $a.attr("download", result.data.filename);
            $("body").append($a);
            $a[0].click();
            $a.remove();
        }
    });
}

function net_err(data){
    swal('出错了','网络错误','error')
    console.log(data)
}

function fetch_err(data){
    swal('请求失败',data.message,'error')
    console.log(data)
}   
