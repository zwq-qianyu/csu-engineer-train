var api_experiment = {
    //添加模板
    addTemplate: function (data) {
        return post_json(
             '/experiment/addTemplate',
            data
        )
    },
    // 修改模板
    modifyTemplate: function (data) {
        return post_json(
             '/experiment/modifyTemplate',
            data
        )
    },
    // 获取所有模版名
    getAllTemplates: function () {
        return post_query(
             '/experiment/getAllTemplate',
            {}
        )
    },
    // 获取模板数据
    getTemplate: function (template_id) {
        var data = { template_id: template_id };
        return post_query(
             '/experiment/getTemplate',
            data
        )
    },
    // 删除模板
    deleteTemplate: function (template_id) {
        var data = { template_id: template_id }
        return post_query(
             '/experiment/deleteTemplate',
            data
        )
    },
    //绑定模板
    bundleTemplateRequest: function (batch_name, template_id) {
        var data = {
            'batch_name': batch_name,
            'template_id': template_id
        }
        return post_query(
             '/experiment/bundleTemplate',
            data
        )
    },
    // 通过批次获取
    getExperimentByBatch: function (batch_name) {
        return post_query(
             '/experiment/getExperimentByBatch',
            { batch_name: batch_name }
        )
    },
    getExperimentByBatchAndProced: function (batch_name, pro_name) {
        return post_query(
             '/experiment/getExperimentByProAndBatch',
            {
                batch_name: batch_name,
                pro_name: pro_name
            }
        )
    },
    updateExperiment: function (data) {
        return post_json(
             '/experiment/updateExperiment',
            data
        )
    },
    getClass: function (sid) {
        return post_query(
             '/experiment/getClass',
            { sid: sid }
        )
    }
}