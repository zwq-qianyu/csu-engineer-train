var api_batch = {
    // 查询所有批次
    getAllBatch: function () {
        return post_query(
            base_url + '/batch/getAllBatch',
            {}
        )
    },
    getAllSGroup: function (batch_name) {
        return post_query(
            base_url + '/batch/getAllSGroup',
            { 'batch_name': batch_name }
        )
    }
}