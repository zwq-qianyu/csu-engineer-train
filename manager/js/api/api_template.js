var api_template = {

    addTemplate: function (data, callback) {
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/addTemplate',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.status === 0) {
                    callback(data)
                }
            }
        });
    },

    modifyTemplate: function (data, callback) {
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/modifyTemplate',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.status === 0) {
                    callback(data)
                }
            }
        });
    },


    // 获取所有模版名
    getAllTemplates: function (callback) {
        // console.log('getAllTemplates')
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/getAllTemplate',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: {},
            success: function (data) {
                if (data.status === 0) {
                    callback(data.data)
                }
            }
        });
    },

    // 获取模板数据
    getTemplate: function (temp_id, callback) {
        // console.log('getTemplate')
        var data = { template_id: temp_id };
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/getTemplate',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.status === 0) {
                    callback(data)
                }
            }
        });
    },

    deleteTemplate:function(template_id,success,fail){
        $.ajax({
            type: 'post',
            url: base_url + '/experiment/deleteTemplate',
            datatype: 'json',
            data: {
              'template_id': template_id
            },
            success: function (data) {
              if (data.status === 0) {
                success(data)
              }
              else {
                fail(data)
              }
            },
            error: function (data) {
            //   console.log(data);
            }
          });
    }
}