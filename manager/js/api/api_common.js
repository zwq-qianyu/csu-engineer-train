var api_common={
    //获取所有批次
    getAllBatch:function () {
        return post_query('/batch/getAllBatch');
    },
    //根据批次名获取工序信息
    getBatchProced:function (path) {
        return post_json('/proced/getBatchProced/' + path);
    },
    //获取所有的工序名
    getAllProced:function () {
        return post_query('/proced/getAllProced');
    },
    //根据批次获取对应的分组号
    getAllSGroup(post_data){
        return post_query('/batch/getAllSGroup',post_data);
    }
};