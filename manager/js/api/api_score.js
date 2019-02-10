var api_score = {
    // 根据条件查询成绩
    getScore: function (post_data) {
        return post_query('/score/getScore', post_data);
    },
    //核算某个批次的总成绩
    executeScore: function (post_data) {
        return post_query('/score/executeScore', post_data);
    },
    //为某个批次设定等级评定规则
    setDegree: function (path, post_data) {
        return post_json('/score/setDegree?way=' + path, post_data);
    },
    //发布某个批次的总成绩
    release: function (post_data) {
        return post_query('/score/release',post_data);
    },
    //更新成绩接口
    updateScore:function (post_data) {
        return post_json('/score/updateScore',post_data);
    },
    //批量导入学生成绩
    importScore:function (post_data) {
        return post_file('/score/importScore',post_data);
    },
    //查询提交记录
    getScoreRecord:function (post_data) {
        let query=$.param(post_data);
        return post_query('/score/getScoreRecord?'+query,{});
    },
    //查询成绩修改记录
    getScoreUpdate:function (post_data) {
        let query=$.param(post_data);
        return post_query('/score/getScoreUpdate?'+query,{});
    },
    //查询成绩录入记录
    getInputInfo:function (batchName='all',proName='all',sgroup='all',sid='all',sname='all') {
        let post_data={
            batchName:batchName,
            proName:proName,
            sgroup:sgroup,
            sid:sid,
            sname:sname
        };
        return post_json('/score/getInputInfo',post_data);
    },
    getSpScore:function (templateName,sid='', sname='') {
        let post_data={
            sid:sid,
            sname:sname,
            templateName:templateName
        };
        return post_query('/score/getSpScore',post_data);
    },
    updateSpScore:function (sid, new_score_map) {
        return post_json('/score/updateSpScore?sid='+sid,new_score_map);
    },
    releaseSpScore:function (sids) {
        return post_json('/score/releaseSpScore',{
            sid:sids
        });
    }
};