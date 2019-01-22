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
    },
    // 新增一条物料申购
    addApplyFPchse:function (clazz,num,remark) {
        return post_query(
            '/applyFPchse/addApplyFPchse',
            {
                'clazz':clazz,
                'num':''+num+''
            }
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
    applyVerify:function (purchase_id,purchase_tname,apply_num) {
        return post_query(
            '/applyFPchse/ApplyVertify',
            {
                'purchase_id':purchase_id,
                'purchase_tname':purchase_tname,
                'apply_num':apply_num
            }
        )
    },
    // 根据时间段查询物料申购记录
    getApplyFPchseByTime:function (startTime,endTime) {
        return post_query(
            '/applyFPchse/getApplyFPchseByTime',
            {
                'startTime':startTime,
                'endTime':endTime
            }
        )
    },
    // 根据条件查询申购记录
    getSelectedPurchase:function (postdata) {
        return post_query(
            '/applyFPchse/getSelectedPurchase',
            postdata
        )
    },

    // 查询采购记录
    getPurchase:function (purchase_id,clazz,pur_tname,begin,end) {
        return post_query(
            '/purchase/getPurchase',
            {
               'purchase_id':purchase_id,
                'clazz':clazz,
                'pur_tname':pur_tname,
                'begin':begin,
                'end':end
            }
        )
    },

    // 新增一条采购记录 400 Wrong
    addPurchase:function (postdata) {
        console.log(233)
        return post_query(
            '/purchase/add',
            postdata
        )
    },

}