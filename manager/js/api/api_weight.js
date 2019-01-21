var api_weight={
    //获取所有权重模板名
    getAllTemplate:function () {
        return post_query('/proced/findAllTemplate');
    },
    //根据权重模板名获取内容
    getTemplateItemByName:function (post_data) {
        return post_query('/proced/findTemplateItemByName',post_data);
    },
    //添加或修改权重模板
    setTemplate:function (path,post_data) {
        return post_json('/proced/addTemplate?templateName='+path,post_data);
    },
    //绑定权重模板与批次
    bindTemplateAndBatch:function (post_data) {
        return post_query('/proced/band',post_data);
    },
    //删除权重模板
    deleteTemplate:function (post_data) {
        return post_query('/proced/deleteTemplate',post_data);
    }
};