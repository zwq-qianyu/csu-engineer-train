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
    downloadApply:function(data) { // data 是 二维的字符串数组
        var xhr = new XMLHttpRequest();
        xhr.open('POST', base_url + '/applyFPchse/ExcelDownloads', true);        // 也可以使用POST方式，根据接口
        xhr.responseType = "blob";    // 返回类型blob
        xhr.setRequestHeader("Content-type", "application/json");
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
            // 请求完成
            if (this.status === 200) {
                // 返回200
                var blob = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                    // 转换完成，创建一个a标签用于下载
                    var a = document.createElement('a');
                    a.download = '申购单.xls';
                    a.href = e.target.result;
                    $("body").append(a);    // 修复firefox中无法触发click
                    a.click();
                    $(a).remove();
                }
            }
        };
        // 发送ajax请求
        xhr.send(JSON.stringify(data.purchase_ids))
    },
    // 导出excel
    downloadApplyExcel:function (data) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', base_url + '/applyFPchse/ExcelDownloads01', true);        // 也可以使用POST方式，根据接口
        xhr.responseType = "blob";    // 返回类型blob
        xhr.setRequestHeader("Content-type", "application/json");
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
            // 请求完成
            if (this.status === 200) {
                // 返回200
                var blob = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                    // 转换完成，创建一个a标签用于下载
                    var a = document.createElement('a');
                    a.download = '申购记录.xls';
                    a.href = e.target.result;
                    $("body").append(a);    // 修复firefox中无法触发click
                    a.click();
                    $(a).remove();
                }
            }
        };
        // 发送ajax请求
        xhr.send(JSON.stringify(data.purchase_ids))
    },
    // 新增一条物料申购
    addApplyFPchse:function (post_data) {
        return post_json(
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
    // 采购导出excel
    downloadPurchase:function (postdata) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', base_url + '/purchase/downloadPurchase', true);        // 也可以使用POST方式，根据接口
        xhr.responseType = "blob";    // 返回类型blob
        xhr.setRequestHeader("Content-type", "application/json");
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
            // 请求完成
            if (this.status === 200) {
                // 返回200
                var blob = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                    // 转换完成，创建一个a标签用于下载
                    var a = document.createElement('a');
                    a.download = '采购单.xls';
                    a.href = e.target.result;
                    $("body").append(a);    // 修复firefox中无法触发click
                    a.click();
                    $(a).remove();
                }
            }
        };
        // 发送ajax请求
        xhr.send(JSON.stringify(postdata.purchase_ids))
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
        return post_json(
            '/reim/add',
            postdata
        )
    },
    // 报账单
    downloadReims:function (postdata) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', base_url + '/reim/downloadReim', true);        // 也可以使用POST方式，根据接口
        xhr.responseType = "blob";    // 返回类型blob
        xhr.setRequestHeader("Content-type", "application/json");
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
            // 请求完成
            if (this.status === 200) {
                // 返回200
                var blob = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                    // 转换完成，创建一个a标签用于下载
                    var a = document.createElement('a');
                    a.download = '报账单.xls';
                    a.href = e.target.result;
                    $("body").append(a);    // 修复firefox中无法触发click
                    a.click();
                    $(a).remove();
                }
            }
        };
        // 发送ajax请求
        xhr.send(JSON.stringify(postdata.reimIds))
    },
    // 报账导出excel
    reimExportExcel:function (postdata) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', base_url + '/reim/exportExcel', true);        // 也可以使用POST方式，根据接口
        xhr.responseType = "blob";    // 返回类型blob
        xhr.setRequestHeader("Content-type", "application/json");
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
            // 请求完成
            if (this.status === 200) {
                // 返回200
                var blob = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                    // 转换完成，创建一个a标签用于下载
                    var a = document.createElement('a');
                    a.download = '报账记录Excel.xls';
                    a.href = e.target.result;
                    $("body").append(a);    // 修复firefox中无法触发click
                    a.click();
                    $(a).remove();
                }
            }
        };
        // 发送ajax请求
        xhr.send(JSON.stringify(postdata.reimIds))
    },
    // 删除报账 还没有这个接口*********************************
    deleteRemi:function(id) {
        return post_query(
            'reim/delete',
            JSON.stringify([id])
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
        console.log("233")
        return post_json(
            '/save/add',
            postdata
        )
    }

}