//批次对应的工序列表
var processes = [];
//成绩列表表格前段固定列
var score_list_columns_front=[
    {
        field: 'batchAndGroup',
        title: '批次/组',
        sortable: true
    },
    {
        field: 'name',
        title: '姓名'
    },
    {
        field: 'sid',
        title: '学号'
    }
];
//成绩列表后段固定列
var score_list_columns_end=[
    {
        field: 'scoreSum',
        title: '总成绩'
    },
    {
        field: 'degree',
        title: '等级'
    },
    {
        field: 'publishStatus',
        title: '发布情况'
    },
    {
        field: 'operate',
        title: '操作',
        formatter: function (value, row, index) {
            return [
                '<button class="btn btn-sm btn-primary edit_score" data-toggle="modal" data-target="#scorelistEditModal" onclick="editOneStuScore(this)">修改</button>',
            ]
        }
    }
];
//成绩列表 bootstrap table 配置信息
var score_list_table_config={
    columns: [],
    data:[],
    pagination: true,
    pageList: [10, 20, 50],
    fixedColumns:true,
    fixedNumber:score_list_columns_front.length
};
//权重模板信息
var weights = {};
//修改时选择的row的index
var score_row_index=null;
//成绩录入记录表格设置
var entry_table_config = {
    columns: [
        {
            title: '批次/组号',
            field: 'batchAndGroup'
        }, {
            title: '学号',
            field: 'sId'
        }, {
            title: '姓名',
            field: 'name'
        }, {
            title: '打分项',
            field: 'process'
        }, {
            title: '分数',
            field: 'score'
        }, {
            title: '录入时间',
            field: 'entryTime'
        },{
            title: '录入人',
            field: 'entryMan'
        },
    ],
    pagination: true,
    pageList: [10, 20, 50],
};