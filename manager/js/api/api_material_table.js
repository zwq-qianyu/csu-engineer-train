var api_material_table = {
    // 生成物料申购表
    setApplyTable:function (kind) {
        var data = post_query('',{});
        $table = $('#jadminTbody').bootstrapTable({
            url:"http://134.175.152.210:8084/applyFPchse/getAllApplyFPchse",
            dataField:"data",
            pagination:true,
            pageSize:5,
            sidePagination: "client",//服务端分页
            contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
            dataType: "json",//期待返回数据类型
            method: "post",//请求方式
            // searchAlign: "left",//查询框对齐方式
            // queryParamsType: "limit",//查询参数组织方式
            // queryParams: function getParams(params) {
            //     //params obj
            //     params.other = "otherInfo";
            //     return params;
            // },
            searchOnEnterKey: false,//回车搜索
            showRefresh: true,//刷新按钮
            showColumns: true,//列选择按钮
            buttonsAlign: "left",//按钮对齐方式
            toolbar: "#toolbar",//指定工具栏
            toolbarAlign: "right",//工具栏对齐方式
            columns: [
                {
                    title: "全选",
                    field: "select",
                    checkbox: true,
                    width: 20,//宽度
                    align: "center",//水平
                    valign: "middle"//垂直
                },
                {
                    title: "申购编号",//标题
                    field: "purchase_id",//键名
                    sortable: true,//是否可排序
                    order: "desc"//默认排序方式
                },
                {
                    title: "申购日期",
                    field: "apply_time",
                    sortable: true,
                    titleTooltip: "this is name"
                },
                {
                    field: "申购人",
                    title: "apply_tname",
                    sortable: true,
                },
                {
                    title: "物料种类",
                    field: "clazz",
                    sortable: true,
                    titleTooltip: "this is name"
                },
                {
                    field: "申购数量",
                    title: "apply_num",
                    sortable: true,
                },
                {
                    title: "申购备注",
                    field: "apply_remark",
                    sortable: true,
                    titleTooltip: "this is name"
                },
                {
                    field: "审核状态",
                    title: "apply_vertify",
                    sortable: true,
                },
                {
                    title: "审核人",
                    field: "apply_vertify",
                    sortable: true,
                    titleTooltip: "this is name"
                },
                {
                    field: "采购总数",
                    title: "apply_vertify",
                    sortable: true,
                },
                {
                    title: "报账总数",
                    field: "apply_vertify",
                    sortable: true,
                    titleTooltip: "this is name"
                },
                {
                    field: "报账人",
                    title: "apply_vertify",
                    sortable: true,
                },
                {
                    field: "入库总数",
                    title: "apply_vertify",
                    sortable: true,
                }]
        })
    }
}