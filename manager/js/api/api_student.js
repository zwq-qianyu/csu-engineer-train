var api_student = {
    updateGroup: function (sid, s_group_id) {
        return post_query(
            base_url + '/student/updateSGroup',
            {
                sid: sid, 
                s_group_id: s_group_id
            }
        )
    },


}