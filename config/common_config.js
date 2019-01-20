var base_url = 'http://134.175.152.210:8084';


function post_query(url, query) {
    return $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        data: query,
    })
}

function post_json(url, json_obj) {
    return $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json_obj),
    });
}

