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
    }
};