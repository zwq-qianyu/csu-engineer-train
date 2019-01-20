var api_batch = {
     // 查询所有批次
     getAllBatch: function () {
    //     $.ajax({
    //         type: 'post',
    //         url: base_url + '/batch/getAllBatch',
    //         datatype: 'json',
    //         data: {},
    //     }).done(success_call).fail(fail_call).always(always_call);
        return post_query(
            base_url + '/batch/getAllBatch',
            {}
        )
    }
}