var base_url = 'http://134.175.152.210:8084';

function post_query(url, query) {
    return $.ajax({
        type: 'post',
        url: base_url+url,
        dataType: 'json',
        data: query,
    })
}

function post_json(url, json_obj) {
    return $.ajax({
        type: 'post',
        url: base_url+url,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json_obj),
    });
}

function net_err(data){
    swal('出错了','网络错误','error')
}

function fetch_err(data){
    swal('请求失败',data.message,'error')
}
