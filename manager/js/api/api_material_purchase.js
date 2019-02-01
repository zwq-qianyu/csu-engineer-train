var api_material_purchase = {
    // 按条件查询各类权限的所有老师名字
    getAllNameByAuthType: function (auth) {
        return post_query(
            '/applyFPchse/getAllNameByAuthType',
            {'type':auth}
        )
    },
    // 申购***************************************
    // 获取所有申购记录
    getAllApplyFPchse:function () {
        return post_query(
            '/applyFPchse/getAllApplyFPchse',
            {}
        )
    },
    // 根据条件查询申购记录
    getSelectedPurchase:function (postdata) {
        return post_query(
            '/applyFPchse/getSelectedPurchase',
            postdata
        )
    },
    // 生成申购单
    downloadApply:function (postdata) {
        downloads('/applyFPchse/ExcelDownloads',postdata)
    },
    // 新增一条物料申购
    addApplyFPchse:function (post_data) {
        return post_query(
            '/applyFPchse/addApplyFPchse',
            post_data
        )
    },
    // 删除物料申购记录
    deleteApplyFPchse:function (purchase_id) {
        return post_query(
            '/applyFPchse/deleteApplyFPchse',
            {
                'purchase_id':purchase_id
            }
        )
    },
    // 物料申购审核
    applyVerify:function (postdata) {
        return post_query(
            '/applyFPchse/ApplyVertify',
            postdata
        )
    },

    // 采购***************************************
    // 查询采购记录
    getPurchase:function (postdata) {
        return post_query(
            '/purchase/getPurchase',
            postdata
        )
    },
    // 新增一条采购记录
    addPurchase:function (postdata) {
        return post_query(
            '/purchase/add',
            postdata
        )
    },

    // 采购报账************************************
    // 查询采购报账记录
    getRemi:function (postdata) {
        return post_json(
            '/reim/getReim',
            postdata
        )
    },
    // 新增报账记录
    addRemi:function (postdata) {
        return post_query(
            '/reim/add',
            postdata
        )
    },
    // 删除报账 还没有这个接口*********************************
    deleteRemi:function(id) {
        return post_query(
            '/reim/delete',
            {id:id}
        )
    },
    // 修改报账 接口还有问题**********************************
    remiVerify:function (postdata) {
        return post_query(
            '/reim/verify',
            postdata
        )
    },
    // 入库***************************************
    // 获取入库记录
    getSaveBy5:function (postdata) {
        return post_json(
            '/save/getSaveBy5',
            postdata
        )
    },
    // 增加入库记录
    addSave:function (postdata) {
        return post_query(
            '/save/add',
            postdata
        )
    }

}