var api_group = {
    getAllTeacherGroup: function (success_call,fail_call,always_call) {
        $.ajax({
            type: 'post',
            url: base_url + '/group/getAllGroup',
            data: {},
            datatype: 'json',
        }).done(success_call).fail(fail_call).always(always_call);
    },

    getProcedByGroup: function (t_group_id, success_call,fail_call,always_call) {
        $.ajax({
            type: 'post',
            url: base_url + '/group/getProcedByGroup',
            data: { 'groupName': t_group_id },
            datatype: 'json',
        }).done(success_call).fail(fail_call).always(always_call);
    }
}