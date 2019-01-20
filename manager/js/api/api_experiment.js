var api_experiment = {
    //添加模板
    addTemplate: function (data) {
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/experiment/addTemplate',
        //     dataType: 'json',
        //     data: JSON.stringify(data),
        //     contentType: "application/json; charset=utf-8",
        // }).done(success_call).fail(fail_call).always(always_call);
        return post_json(
            base_url + '/experiment/addTemplate',
            data
        )
    },
    // 修改模板
    modifyTemplate: function (data) {
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/experiment/modifyTemplate',
        //     dataType: 'json',
        //     data: JSON.stringify(data),
        //     contentType: "application/json; charset=utf-8",
        // }).done(success_call).fail(fail_call).always(always_call);
        return post_json(
            base_url + '/experiment/modifyTemplate',
            data
        )
    },

    // 获取所有模版名
    getAllTemplates: function () {
        // console.log('getAllTemplates')
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/experiment/getAllTemplate',
        //     dataType: 'json',
        //     contentType: "application/json; charset=utf-8",
        //     data: {},
        // }).done(success_call).fail(fail_call).always(always_call);
        return post_query(
            base_url + '/experiment/getAllTemplate',
            {}
        )
    },
    // 获取模板数据
    getTemplate: function (template_id) {
        // console.log('getTemplate')
        var data = { template_id: template_id };
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/experiment/getTemplate',
        //     dataType: 'json',
        //     data: data,
        // }).done(success_call).fail(fail_call).always(always_call);
        return post_query(
            base_url + '/experiment/getTemplate',
            data
        )
    },
    // 删除模板
    deleteTemplate: function (template_id) {
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/experiment/deleteTemplate',
        //     datatype: 'json',
        //     data: {
        //         'template_id': template_id
        //     },
        // }).done(success_call).fail(fail_call).always(always_call);
        var data = { template_id: template_id }
        return post_query(
            base_url + '/experiment/deleteTemplate',
            data
        )
    },
    //绑定模板
    bundleTemplateRequest: function (batch_name, template_id) {
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/experiment/bundleTemplate',
        //     datatype: 'json',
        //     data: {
        //         'batch_name': batch_name,
        //         'template_id': template_id
        //     },
        // }).done(success_call).fail(fail_call).always(always_call);
        var data = {
            'batch_name': batch_name,
            'template_id': template_id
        }
        return post_query(
            base_url + '/experiment/bundleTemplate',
            data
        )
    },
    // 通过批次获取
    getExperimentByBatch: function (batch_name) {
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/experiment/getExperimentByBatch',
        //     datatype: 'json',
        //     data: { batch_name: batch_name },
        // }).done(success_call).fail(fail_call).always(always_call);
        return post_query(
            base_url + '/experiment/getExperimentByBatch',
            { batch_name: batch_name }
        )
    },
    updateExperiment:function(data){
        return post_json(
            base_url + '/experiment/updateExperiment',
            data
        )
    }
}