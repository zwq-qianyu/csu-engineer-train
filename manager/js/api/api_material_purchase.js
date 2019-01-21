var api_material_purchase = {
    // 按条件查询各类权限的所有老师名字
    getAllNameByAuthType: function (auth) {
        return post_query(
            '/applyFPchse/getAllNameByAuthType',
            {'type':auth}
        )
    },
    // 获取所有申购记录
    getAllApplyFPchse:function () {
        return post_query(
            '/applyFPchse/getAllApplyFPchse',
            {}
        )
    }
}