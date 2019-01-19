var api_experiment = {
    addTemplate: function (data, success_call,fail_call,always_call) {
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/addTemplate',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
        }).done(success_call).fail(fail_call).always(always_call);
    },
    modifyTemplate: function(data, success_call,fail_call,always_call) {
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/modifyTemplate',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
        }).done(success_call).fail(fail_call).always(always_call);
    },
    // 获取所有模版名
    getAllTemplates: function (success_call,fail_call,always_call) {
        // console.log('getAllTemplates')
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/getAllTemplate',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: {},
        }).done(success_call).fail(fail_call).always(always_call);
    },
    // 获取模板数据
    getTemplate: function (temp_id, success_call,fail_call,always_call) {
        // console.log('getTemplate')
        var data = { template_id: temp_id };
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/getTemplate',
            dataType: 'json',
            data: data,
        }).done(success_call).fail(fail_call).always(always_call);
    },
    deleteTemplate:function(template_id,success_call,fail_call,always_call){
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/deleteTemplate',
            datatype: 'json',
            data: {
              'template_id': template_id
            },
           }).done(success_call).fail(fail_call).always(always_call);
    }
}