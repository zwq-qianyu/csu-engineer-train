var api_group = {
    getAllTeacherGroup: function () {
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/group/getAllGroup',
        //     data: {},
        //     datatype: 'json',
        // }).done(success_call).fail(fail_call).always(always_call);
        return post_query(
            base_url + '/group/getAllGroup',
            {}
        )
    },

    getProcedByGroup: function (t_group_id) {
        // $.ajax({
        //     type: 'post',
        //     url: base_url + '/group/getProcedByGroup',
        //     data: { 'groupName': t_group_id },
        //     datatype: 'json',
        // }).done(success_call).fail(fail_call).always(always_call);
        return post_query(
            base_url + '/group/getProcedByGroup',
            { 'groupName': t_group_id }
        )
    }
}