var api_student = {
    updateGroup: function (sid, s_group_id) {
        return post_query(
             '/student/updateSGroup',
            {
                sid: sid, 
                s_group_id: s_group_id
            }
        )
    },
    getStudent:function (student_id){
        return post_query('/student/getStudent/'+student_id,{});
    },
    addSpStudent:function(student_id,template_name){
        return post_query('/student/addSpStudent',
        {
            sid:student_id,
            template_name:template_name
        });
    }
}