var api_common={
    //获取所有批次
    getAllBatch:function () {
        return post_query('/batch/getAllBatch');
    },
    //根据批次名获取批次信息
    getBatchByname:function (path) {
        return post_json('/proced/getBatchProced/' + path);
    },
    //获取所有的工序名
    getAllProced:function () {
        return post_query('/proced/getAllProced');
    }
};