var api_teacher={
    getTeacher:function (teacher_id) {
        return post_query('/teacher/getTeacher/'+teacher_id);
    }
};