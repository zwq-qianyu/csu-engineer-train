var api_teacher = {
    getAllTeacherGroup: function (callback) {
        $.ajax({
            type: 'post',
            url: base_url + '/group/getAllGroup',
            data: {},
            datatype: 'json',
            success: function (data) {
                if (data.status === 0) {
                    // console.log(data.data)
                    callback(data)
                }
            }
        });
    },

    getProcedByGroup: function (t_group_id, callback) {
        $.ajax({
            type: 'post',
            url: base_url + '/group/getProcedByGroup',
            data: { 'groupName': t_group_id },
            datatype: 'json',
            success: function (data) {
                if (data.status === 0) {
                    // console.log(data)
                    callback(data);
                }
            }
        });
    }
}