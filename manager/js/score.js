window.onload = function () {
    init_data();
};

// 初始化数据
function init_data() {
    // 获取所有批次
    getAllBatch_StuList();
    // 查询教师提交成绩记录--初始化
    getScoreRecord();
    //权重模板初始化
    getAllWeightTemplate();
}

//根据批次名获取分组并填充
function getGroupByBatch(batchName, filter) {
    return api_batch.getAllSGroup(batchName).done(function (data) {
        if (data.status === 0) {
            let data_arr = data.data;
            let groupSelect = $(filter).empty().append('<option>组号</option>');
            for (let i = 0; i < data_arr.length; i++) {
                let option = $('<option></option>');
                option.text(data_arr[i]);
                groupSelect.append(option);
            }
        }
    })
}

function getProcessByBatch(batchName, filter) {
    return api_proced.getBatchProced(batchName).done(function (data) {
        if (data.status === 0) {
            let data_arr = data.data;
            let process_select = $(filter).empty().append('<option>选择工种</option>');
            for (let i = 0; i < data_arr.length; i++) {
                let option = $('<option></option>');
                option.text(data_arr[i].proid.pro_name);
                process_select.append(option);
            }
        }
    })
}

// 获取所有批次
function getAllBatch_StuList() {
    return api_batch.getAllBatch().done(function (data) {
        if (data.status === 0) {
            // console.log(data);
            let batch1 = $('#score_list_select_batch').empty().append('<option>实习批次选择</option>');
            let batch2 = $('#score_list_select_batch2').empty().append('<option>实习批次选择</option>');
            let batch3 = $('#input_score_select_batch').empty().append('<option>实习批次选择</option>');
            let batch4 = $('#score_submit_select_batch').empty().append('<option>实习批次选择</option>');
            let batch5 = $('#score_edithistory_select_batch').empty().append('<option>实习批次选择</option>');
            let batch6 = $('#entry-list-select-batch').empty().append('<option>实习批次选择</option>');
            for (let i = 0; i < data.data.length; i++) {
                let option = $('<option></option>');
                option.text(data.data[i].batch_name);
                batch1.append(option);
                batch2.append(option.clone());
                batch3.append(option.clone());
                batch4.append(option.clone());
                batch5.append(option.clone());
                batch6.append(option.clone());

            }
        }
    });
}

// ========================================================================
// 1、 成绩列表

// 根据批次名获取工序,并填充列表
function getProcedByBatchName(batch_name = '') {
    if (batch_name === '') {
        batch_name = $('#score_list_select_batch').val();
    }
    // console.log(batch_name);
    return api_proced.getBatchProced(batch_name).done(function (data) {
        if (data.status === 0) {
            processes = [];
            let data_arr = data.data;
            score_list_table_config.columns = _.cloneDeep(score_list_columns_front);

            weights = {};
            let process_select = $('#score_list_select_process').empty().append('<option>选择工种</option>');
            for (let i = 0; i < data_arr.length; i++) {
                score_list_table_config.columns.push(
                    {
                        field: data_arr[i].proid.pro_name,
                        title: data_arr[i].proid.pro_name
                    }
                );
                weights[data_arr[i].proid.pro_name] = data_arr[i].weight;
                processes.push(data_arr[i].proid.pro_name);
                let option = $('<option></option>');
                option.text(data_arr[i].proid.pro_name);
                process_select.append(option);
            }
            score_list_table_config.columns = _.concat(score_list_table_config.columns, score_list_columns_end);
            let score_list_table = $('#score_list_table');
            score_list_table.bootstrapTable('destroy').bootstrapTable(score_list_table_config);
        }

    });
}

// 根据条件查询成绩列表,并填充表格
function getScoreList(post_data = null) {
    if (post_data === null) {
        let batch_name = $('#score_list_select_batch').val();
        let process_name = $('#score_list_select_process').val();
        let group_name = $('#score_list_select_group_number').val();
        let sname = $('#score_list_stu_name').val();
        let sid = $('#score_list_stu_number').val();
        post_data = {
            batch_name: batch_name === '实习批次选择' ? 'all' : batch_name,
            s_group_id: process_name === '选择工种' ? 'all' : process_name,
            pro_name: group_name === '组号' ? 'all' : group_name,
            sId: sname ? sname : 'all',
            sName: sid ? sid : 'all'
        };
    }
    return api_score.getScore(
        post_data,
    ).done(fillTable);
}

//使用返回的数据对表格进行填充
function fillTable(data) {
    if (data.status === 0) {
        let data_arr = data.data;

        let tableData = [];

        for (let i = 0; i < data_arr.length; i++) {
            let tableRow = {
                batchAndGroup: data_arr[i].batch_name + '/' + data_arr[i].s_group_id,
                name: data_arr[i].sname,
                sid: data_arr[i].sid
            };
            for (let j = 0; j < processes.length; j++) {
                if (!_.isNil(data_arr[i][processes[j]]) && !isNaN(Number(data_arr[i][processes[j]]))) {
                    tableRow[processes[j]] = Number(data_arr[i][processes[j]]);
                } else {
                    tableRow[processes[j]] = '无';
                }
            }

            if (!_.isNil(data_arr[i].total_score) && !isNaN(Number(data_arr[i].total_score))) {
                tableRow['scoreSum'] = Number(data_arr[i].total_score);
            } else {
                tableRow['scoreSum'] = '无';
            }
            if (!_.isNil(data_arr[i].degree)) {
                tableRow['degree'] = data_arr[i].degree;
            } else {
                tableRow['degree'] = '无';
            }
            if (null !== data_arr[i].release) {
                tableRow['publishStatus'] = data_arr[i].release;
            }
            tableData.push(tableRow);
        }
        //根据对批次组进行排序
        tableData = _.sortBy(tableData, 'batchAndGroup');
        score_list_table_config.data = tableData;
        $('#score_list_table').bootstrapTable('load', tableData);
    }
}

// 核算总成绩
function executeScore() {
    let batch_name = $('#score_list_select_batch').val();
    if (batch_name === "实习批次选择") {
        swal(
            '请先选择批次',
            '请选择对应批次后核算成绩！',
            'warning'
        );
    } else {
        api_score.executeScore(
            {
                batch_name: batch_name
            }
        ).done(function (data) {
            if (data.status === 0) {
                // console.log(data);
                swal(
                    '核算成功',
                    '批次' + batch_name + '核算成绩成功！',
                    'success'
                );
                // 刷新成绩列表
                getScoreList();
            } else {
                swal(
                    '核算失败',
                    String(data.message),
                    'error'
                );
            }
        });
    }
}

// 等级评定面板内容根据设置模式改变（按照成绩总排名划分/按照成绩总分数划分）
$('#setDegreeModal').change(function () {
    let html = '';
    let modal = $('#setDegreeModal').val();
    if (modal === "按照成绩总排名划分") {
        html += '<tr><td>优秀</td><td><input type="number" name="" id="setDegreeTable_great"> %</td></tr>';
        html += '<tr><td>良好</td><td><input type="number" name="" id="setDegreeTable_good"> %</td></tr>';
        html += '<tr><td>中等</td><td><input type="number" name="" id="setDegreeTable_middle"> %</td></tr>';
        html += '<tr><td>及格</td><td><input type="number" name="" id="setDegreeTable_pass"> %</td></tr>';
        html += '<tr><td>不及格</td><td><input type="number" name="" id="setDegreeTable_notPass"> %</td></tr>';
    } else if (modal === "按照成绩总分数划分") {
        html += '<tr><td>优秀</td><td><input type="number" name="" id="setDegreeTable_great"> 分</td></tr>';
        html += '<tr><td>良好</td><td><input type="number" name="" id="setDegreeTable_good"> 分</td></tr>';
        html += '<tr><td>中等</td><td><input type="number" name="" id="setDegreeTable_middle"> 分</td></tr>';
        html += '<tr><td>及格</td><td><input type="number" name="" id="setDegreeTable_pass"> 分</td></tr>';
        html += '<tr><td>不及格</td><td><input type="number" name="" id="setDegreeTable_notPass"> 分</td></tr>';
    }
    $('#setDegreeTable').html(html);
});

// 等级设置
function setDegree() {
    let modal = $('#setDegreeModal').val();
    if (modal === "按照成绩总排名划分") {
        modal = "percent";
    } else if (modal === "按照成绩总分数划分") {
        modal = "score";
    }
    let batch_name = $('#score_list_select_batch').val();
    if (batch_name === "实习批次选择") {
        swal(
            '请先选择批次',
            '请选择对应批次后核算成绩！',
            'warning'
        );
    } else {
        let great = Number($('#setDegreeTable_great').val().trim());
        let good = Number($('#setDegreeTable_good').val().trim());
        let middle = Number($('#setDegreeTable_middle').val().trim());
        let pass = Number($('#setDegreeTable_pass').val().trim());
        let notPass = Number($('#setDegreeTable_notPass').val().trim());
        if (great < 0 || good < 0 || middle < 0 || pass < 0 || notPass < 0) {
            swal(
                '输入有误',
                '不能设置为负数',
                'warning'
            );
            return;
        }
        if (modal === 'percent') {
            let weight_sum = great + good + middle + pass + notPass;
            if (weight_sum !== 100) {
                swal(
                    '输入有误',
                    '比例和需要为100%',
                    'warning'
                );
                return;
            }
        }
        if (modal === 'score') {
            if (notPass > pass || pass > middle || middle > good || good > great) {
                swal(
                    '输入有误',
                    '等级较低的分数要求不能高于等级较高的分数要求',
                    'warning'
                );
                return;
            }
        }

        let degreeForm = {
            "batchName": batch_name,
            "good": great/100,
            "great": good/100,
            "middle": middle/100,
            "notPass": pass/100,
            "pass": notPass/100
        };
        api_score.setDegree(modal, degreeForm).done(function (data) {
            if (data.status === 0) {
                // console.log(data);
                swal(
                    '设置成功',
                    '等级设置成功！',
                    'success'
                );
                // 刷新成绩列表
                getScoreList();
            } else {
                console.log(data);
                swal(
                    '设置失败',
                    String(data.message),
                    'error'
                );
            }
        });
    }
}

// 弹出并生成修改成绩的模态框
function editOneStuScore(obj) {
    let index = $($(obj).parent().parent()[0]).data('index');
    score_row_index = index;
    let score_list_columns = score_list_table_config.columns;
    let select_data = score_list_table_config.data[index];
    let length = score_list_columns.length;
    let heard_tr = $('#edit-score-table thead tr').empty();
    for (let i = 0; i < length - 1; i++) {
        let th = $('<th></th>');
        th.text(score_list_columns[i].title);
        heard_tr.append(th);
    }
    let body_tr = $('#edit-score-table tbody tr').empty();
    for (let i = 0; i < 3; i++) {
        let td = $('<td></td>');
        td.text(select_data[score_list_columns[i].field]);
        body_tr.append(td);
    }
    for (let i = 3; i < length - 4; i++) {
        let input = $('<input type="number" class="edit-input" onchange="onEditSignalScore(this)" value="" size="3">');
        input.val(select_data[score_list_columns[i].field]);
        input.data('title', score_list_columns[i].title);
        body_tr.append($('<td></td>').append(input));
    }
    body_tr.append($('<td></td>').text(select_data[score_list_columns[length - 4].field]));
    let select = $('<select><option>自动</option><option>优</option><option>良</option><option>中</option><option>及格</option><option>不及格</option></select>').val('自动');
    body_tr.append($('<td></td>').append(select));
    body_tr.append($('<td></td>').text(select_data[score_list_columns[length - 2].field]));
    //清空原因
    $('#edit-state').val('');
}

//单项成绩改变时总成绩做出响应
function onEditSignalScore(obj) {
    obj = $(obj);
    let value = Number(obj.value);
    if (value < 0) {
        swal(
            '分数设置错误',
            '分数不能为负数',
            'warning'
        );
        obj.val('');
        return;
    }
    let score_sum = 0;
    $('#edit-score-table tbody tr td input').each(function () {
        let item = $(this);
        score_sum += Number(item.val()) * weights[item.data('title')];
    });
    let tds = $('#edit-score-table tbody tr td');
    let tds_length = tds.length;
    $(tds[tds_length - 3]).text(score_sum);
}

//修改学生成绩
function editScore() {
    let post_data = {};
    let select_data = score_list_table_config.data[score_row_index];
    let tds = $('#scorelistEditModal table tbody tr td');
    post_data['sid'] = $(tds[2]).text();
    post_data['reason'] = $('#edit-state').val();
    let score_sum = 0;
    $('#scorelistEditModal table tbody tr td input').each(function () {
        let item = $(this);
        let val = item.val();
        let number = Number(val);
        let title = item.data('title');
        //判断成绩是否发生过改变
        if (val !== '' && number !== select_data[title]) {
            post_data[title] = number;
            select_data[title] = number;
        }
        score_sum += number * weights[title];
    });
    if (score_sum !== select_data['total_score']) {
        post_data['total_score'] = score_sum;
        select_data['total_score'] = score_sum;
    }
    let degree = $('#scorelistEditModal table tbody select').val();
    if (degree !== '自动') {
        post_data['degree'] = degree;
        select_data['degree'] = degree;
    }
    api_score.updateScore(post_data).done(function (data) {
        if (data.status === 0) {
            swal(
                '成功',
                '成绩修改成功',
                'success'
            );
            $('#score_list_table').bootstrapTable('updateRow', score_row_index, select_data);
        } else {
            swal(
                '更新失败',
                data.message,
                'error'
            );
            console.log(data.message);
        }
    });
    $('#scorelistEditModal').modal('hide');
}

// 改变批次时做成响应
$('#score_list_select_batch').change(function () {
    let batch_name = $('#score_list_select_batch').val();
    if (batch_name === '实习批次选择') {
        return;
    }
    let post_data = {
        batch_name: batch_name,
        s_group_id: 'all',
        pro_name: 'all',
        sId: 'all',
        sName: 'all'
    };

    // 根据批次名获取工序后根据条件查询成绩列表
    getProcedByBatchName(batch_name).done(function () {
        getScoreList(post_data);
    });
    getGroupByBatch(batch_name, '#score_list_select_group_number')
});

//对表格进行筛选
function filterScoreTable() {
    let process = $('#score_list_select_process').val();
    let group = $('#score_list_select_group_number').val();
    let filterTableConfig = {
        columns: score_list_table_config.columns,
        data: [],
        pagination: true,
        pageList: [10, 20, 50],
        fixedColumns: process === '选择工种',
        fixedNumber: score_list_columns_front.length
    };
    if (group !== '组号') {
        let regex = new RegExp(group + '$');
        _.forEach(score_list_table_config.data, function (value) {
            if (regex.test(value.batchAndGroup)) {
                filterTableConfig.data.push(value);
            }
        });
    } else {
        filterTableConfig.data = score_list_table_config.data;
    }
    let table = $('#score_list_table');
    table.bootstrapTable('destroy').bootstrapTable(filterTableConfig);
    if (!filterTableConfig.fixedColumns) {
        _.forEach(processes, function (value) {
            if (value !== process) {
                table.bootstrapTable('hideColumn', value);
            }
        })

    }
}

//改变工种时做出响应
$('#score_list_select_process').change(filterScoreTable);

//改变分组时做出响应
$('#score_list_select_group_number').change(filterScoreTable);
//点击查询按钮时做出响应
$('#get_score_list').click(function () {
    let sId = $('#score_list_stu_number').val().trim();
    let sName = $('#score_list_stu_name').val().trim();
    if (sId === '' && sName === '') {
        swal(
            '条件错误',
            '请输入姓名或者学号进行查询',
            'warning'
        );
        return;
    }
    if (sId === '') {
        sId = 'all'
    }
    if (sName === '') {
        sName = 'all'
    }
    let post_data = {
        batch_name: 'all',
        s_group_id: 'all',
        pro_name: 'all',
        sId: sId,
        sName: sName
    };
    api_score.getScore(post_data).done(function (data) {
        let data_arr = data.data;
        let batch_name = data_arr[0].batch_name;
        getProcedByBatchName(batch_name).done(function () {
            fillTable(data);
        })
    })
});

// 发布某个批次的总成绩
function publishScore() {
    let batch_name = $('#score_list_select_batch2').val();

    api_score.release(
        {
            batch_name: batch_name
        }
    ).done(function (data) {
        if (data.status === 0) {
            swal(
                '发布成功',
                '批次' + batch_name + '发布成绩成功！',
                'success'
            );
            //如果发布批次与已选择批次相同则刷新表格
            let tableBatchName = $('#score_list_select_batch').val();
            if (tableBatchName === batch_name) {
                let tableData = score_list_table_config.data;
                let table = $('#score_list_table');
                for (let i = 0; i < tableData.length; i++) {
                    tableData[i].publishStatus = '已发布';
                    table.bootstrapTable('updateRow', i, tableData[i]);
                }
            }
        } else {
            swal(
                '发布失败',
                String(data.message),
                'error'
            );
        }
    });
}

// ========================================================================
// 2、成绩批量导入

//下载模板文件
$('#download-score-file').click(function () {
    // 创建a标签，设置属性，并触发点击下载
    var $a = $("<a>");
    $a.attr("href", base_url+'/admin/downloadScore');
    $("body").append($a);
    $a[0].click();
    $a.remove();
});

//根据批次的变化查询对应的工序

$('#input_score_select_batch').change(function () {
    let batchName = $('#input_score_select_batch').val();

    getProcessByBatch(batchName, '#input_score_select_scoreitem');

});

function importStudentsScore() {
    var form = new FormData();
    let batchName = $('#input_score_select_batch').val();
    let scoreitem = $('#input_score_select_scoreitem').val();
    form.append("batch_name", batchName);
    form.append("pro_name", scoreitem);
    form.append('file', $('#tf')[0].files[0]);
    api_score.importScore(form).done(function (data) {
        console.log('success');
        if (data.status === 0) {
            swal(
                '成功',
                '批量导入成绩成功',
                'success'
            );
            $('#tf').empty();
        } else {
            swal(
                '失败',
                '批量导入成绩失败',
                'error'
            )
        }
    });
}

//3、成绩录入记录
//=========================================================================
function fillEntryTable(data) {
    let batch_name = $('#entry-list-select-batch').val();
    if (data.status === 0) {
        let data_arr = data.data;
        let tableData = [];
        let studentAjaxArray = [];
        let teacherAjaxArray = [];
        let TableDataObj = {};
        _.forEach(data_arr, function (value) {
            tableData.push({
                sid: value.sid,
                process: value.pro_name,
                score: value.pro_score,
                entryTime: chGMT(value.time)
            });
            studentAjaxArray.push(api_student.getStudent(value.sid));
            teacherAjaxArray.push(api_teacher.getTeacher(value.tid));
        });
        let studentAjaxGroup = $.when.apply($, studentAjaxArray).done(function () {
            for (let i = 0; i < arguments.length; i++) {
                let data = arguments[i][0];
                try {
                    if (data.status === 0) {
                        tableData[i].name = data.data.sname;
                        tableData[i].batchNameAndGroup = batch_name + '/' + data.data.s_group_id;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
        let teacherAjaxGroup = $.when.apply($, teacherAjaxArray).done(function () {
            for (let i = 0; i < arguments.length; i++) {
                let data = arguments[i][0];
                try {
                    if (data.status === 0) {
                        tableData[i].entryMan = data.data.tname;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
        $.when(studentAjaxGroup, teacherAjaxGroup).always(function () {
            tableData = _.sortBy(tableData, 'batchNameAndGroup');
            entry_table_config.data = tableData;
            $('#entry-list-table').bootstrapTable('destroy').bootstrapTable(entry_table_config);
        })
    }

}

$('#entry-list-select-batch').change(function () {
    let batch_name = $('#entry-list-select-batch').val();
    if (batch_name === '实习批次选择') {
        return;
    }
    getProcessByBatch(batch_name, '#entry-list-select-process');
    getGroupByBatch(batch_name, '#entry-list-select-group');
    api_score.getInputInfo(batch_name).done(fillEntryTable)
});

function filterEntryTable() {
    let process = $('#entry-list-select-process').val();
    let group = $('#entry-list-select-group').val();
    let regex = new RegExp(group + '$');
    let tableData = entry_table_config.data;
    let filterTableConfig = {
        columns: [
            {
                title: '批次/组',
                field: 'batchNameAndGroup'
            }, {
                title: '学号',
                field: 'sid'
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
            }, {
                title: '录入人',
                field: 'entryMan'
            },
        ],
        data: [],
        pagination: true,
        pageList: [10, 20, 50],
    };
    _.forEach(tableData, function (value) {
        if ((process === '选择工种' || process === value.process) && (group === '组号' || regex.test(value.batchNameAndGroup))) {
            filterTableConfig.data.push(value);
        }
    });
    $('#entry-list-table').bootstrapTable('destroy').bootstrapTable(filterTableConfig);
}

$('#entry-list-select-process').change(filterEntryTable);
$('#entry-list-select-group').change(filterEntryTable);
$('#get_entry_list').click(function () {
    let sid = $('#entry_list_stu_number').val().trim();
    let sName = $('#entry_list_stu_name').val().trim();
    if (sid === '' && sName === '') {
        swal(
            '条件错误',
            '请输入姓名或者学号进行查询',
            'warning'
        );
        return;
    }
    if (sid === '') {
        sid = 'all';
    }
    if (sName === '') {
        sName = 'all';
    }
    api_score.getInputInfo('all', 'all', 'all', sid, sName).done(fillEntryTable)
});


// ========================================================================
// 4、成绩提交记录

$('#score_submit_select_batch').change(function () {
    let batchName = $('#score_submit_select_batch').val();
    // 根据批次获取对应的分组号--成绩提交记录
    getGroupByBatch(batchName, '#score_submit_select_groupid');
    getProcessByBatch(batchName, '#score_submit_select_process');
});


// 查询教师提交成绩记录
function getScoreRecord() {
    let batch_name = $('#score_submit_select_batch').val();
    let pro_name = $('#score_submit_select_process').val();
    let s_group_id = $('#score_submit_select_groupid').val();
    let send_data = {};
    if (batch_name !== "实习批次选择") {
        send_data.batch_name = batch_name;
    }
    if (pro_name !== "选择工种") {
        send_data.pro_name = pro_name;
    }
    if (s_group_id !== "组号") {
        send_data.s_group_id = s_group_id;
    }

    api_score.getScoreRecord(send_data).done(function (data) {
        if (data.status === 0) {
            let data_arr = data.data;
            let tableData = [];
            let submitterAjaxArray = [];
            for (let i = 0; i < data_arr.length; i++) {
                let tableRow = {
                    submitTime: chGMT(data_arr[i].submit_time),
                    batchName: data_arr[i].batch_name,
                    group: data_arr[i].s_group_id,
                    process: data_arr[i].pro_name,
                    // submitter: data_arr[i].pro_name
                };
                submitterAjaxArray.push(api_teacher.getTeacher(data_arr[i].tid));
                tableData.push(tableRow);
            }
            $.when.apply($, submitterAjaxArray).done(function () {
                for (let i = 0; i < arguments.length; i++) {
                    let data = arguments[i][0];
                    try {
                        if (data.status === 0) {
                            tableData[i].submitter = data.data.tname;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }).always(function () {
                submit_list_table_config.data = tableData;
                $('#submit_list_table').bootstrapTable('destroy').bootstrapTable(submit_list_table_config);
            })
        }
    });
}


// ========================================================================
// 4、成绩修改记录
function searchUpdateHistory() {
    let batch_name = $('#score_edithistory_select_batch').val();
    let begin = $('#score_edithistory_begin_time').val();
    let end = $('#score_edithistory_end_time').val();
    let sname = $('#score_edithistory_sname').val();
    let sid = $('#score_edithistory_sid').val();

    let send_data = {};

    if (batch_name !== "实习批次选择") {
        send_data.batch_name = batch_name;
    }
    if (begin !== '') {
        send_data.begin = begin;
    }
    if (end !== '') {
        send_data.end = end;
    }
    if (sname !== '') {
        send_data.sname = sname;
    }
    if (sid !== '') {
        send_data.sid = sid;
    }
    api_score.getScoreUpdate(send_data).done(function (data) {
        if (data.status === 0) {
            let data_arr = data.data;
            tableData = [];
            for (let i = 0; i < data_arr.length; i++) {
                data_arr[i].time=new Date(data_arr[i].update_time);
                data_arr[i].update_time = chGMT(data_arr[i].update_time);
            }
            data_arr=_.orderBy(data_arr,'time','desc');
            update_list_table_config.data = data_arr;
            $('#update_list_table').bootstrapTable('destroy').bootstrapTable(update_list_table_config);
        }
    });
}

$('#score_edithistory_seach').click(function () {
    // 查询成绩修改记录
    searchUpdateHistory();
});

// ========================================================================
// 5、特殊学生成绩列表

//获取所有的权重模板
function getAllWeightTemplate() {
    return api_proced.findAllTemplate().done(function (data) {
        if(data.status===0){
            let data_arr=data.data;
            let weights=$('#weight-template-list').empty().append('<option>请选权重模板</option>');
            for (let i = 0; i < data_arr.length; i++) {
                let option=$('<option></option>');
                option.text(data_arr[i]);
                weights.append(option);
            }
        }
    });
}
//设置特殊成绩列表
function setSpScoreTable(processes){
    special_score_list_table_config.columns = _.cloneDeep(special_score_list_columns_front);
    _.forEach(processes,function (value) {
        special_score_list_table_config.columns.push({
            field:value,
            title:value
        });
    });
    special_score_list_table_config.columns = _.concat(special_score_list_table_config.columns, special_score_list_columns_end);
    special_score_list_table_config.data=[];
    $('#special_score_list_table').bootstrapTable('destroy').bootstrapTable(special_score_list_table_config);
}

//根据权重模板获取特殊学生成绩列表
$('#weight-template-list').change(function () {
    let templateName=$(this).val();
    if(templateName==='请选权重模板'){
        return;
    }
    let post_data={
        name:templateName
    };
    return api_proced.findTemplateItemByName(post_data).done(function (data) {
        if(data.status===0){
            special_processes=[];
            _.forEach(data.data,function (value) {
                special_processes.push(value.pro_name);
            });
            setSpScoreTable(special_processes);
            api_score.getSpScore(templateName).done(getSpScoreSuccess);
        }
    });
});

// 根据学号查询该学生需要做的工序
function getSpProName() {
    let sid=$('#spStu_sname').val();
    return api_student.getSpProName(sid).done(function (data) {
        if (data.status === 0) {
            special_processes = data.data;
            setSpScoreTable(special_processes);
        }
    });
}

//获取特殊学生成绩列表成功回调函数
function getSpScoreSuccess(data) {
    if(data.status===0){
        let data_arr=data.data;
        let tableRow={
            name: data_arr[0]['姓名'],
            sid: data_arr[0]['学号'],

        };
        _.forEach(special_processes,function (value) {
            if(!_.isNil(data_arr[0][value])&& !isNaN(Number(data_arr[0][value]))){
                tableRow[value]=Number(data_arr[0][value]);
            }else {
                tableRow[value]='无';
            }
        });
        if(!_.isNil(data_arr[0]['总成绩']) && !isNaN(Number(data_arr[0]['总成绩']))){
            tableRow['scoreSum']=Number(data_arr[0]['总成绩']);
        }else {
            tableRow['scoreSum']='无';
        }
        if(!_.isNil(data_arr[0]['等级'])){
            tableRow['degree']=data_arr[0]['等级'];
        }else {
            tableRow['degree']='无';
        }
        if(!_.isNil(data_arr[0]['发布情况'])){
            tableRow['publishStatus']=data_arr[0]['发布情况'];
        }
        special_score_list_table_config.data=[tableRow];
        $('#special_score_list_table').bootstrapTable('load',special_score_list_table_config.data);
        $('#special_score_list_table button').click(function () {
            updateSpScore();
        })
    }
}

$('#get_special_score_list').click(function () {
    getSpProName().done(function () {
        let sid=$('#spStu_sname').val();
        api_score.getSpScore('',sid).done(getSpScoreSuccess);
    });
});

function updateSpScore() {
    let columns=special_score_list_table_config.columns;
    let tableHead=$('#edit_special_score_table thead tr').empty();
    for (let i = 1; i < columns.length - 1; i++) {
        let  th=$('<th></th>');
        th.text(columns[i].title);
        tableHead.append(th);
    }
    let tableBody=$('#edit_special_score_table tbody tr').empty();
    let selectData=special_score_list_table_config.data[0];
    for (let i = 1; i < 3; i++) {
        let td=$('<td></td>');
        td.text(selectData[columns[i].field]);
        tableBody.append(td);
    }
    for (let i = 3; i < columns.length-4; i++) {
        let input=$('<input type="number" class="edit-input" value="">');
        input.val(selectData[columns[i].field]);
        input.data('field',columns[i].field);
        tableBody.append($('<td></td>').append(input));
    }
    tableBody.append($('<td></td>').text(selectData[columns[columns.length-4].field]));
    let select = $('<select><option>自动</option><option>优</option><option>良</option><option>中</option><option>及格</option><option>不及格</option></select>').val('自动');
    tableBody.append($('<td></td>').append(select));
    tableBody.append($('<td></td>').text(selectData[columns[columns.length-2].field]));
    console.log(selectData);
    //清空备注
    $('#special-edit-state').val('');
}

$('#submit-special-student-score').click(function () {
    let selectData=special_score_list_table_config.data[0];
    let tds=$('#edit_special_score_table tbody tr td');
    let sid=$(tds[1]).text();
    let post_data={};
    $('#edit_special_score_table tbody input').each(function () {
        let item = $(this);
        let val = item.val();
        let number = Number(val);
        let field = item.data('field');
        //判断成绩是否发生过改变
        if (val !== '' && number !== selectData[field]) {
            post_data[field] = number;
            selectData[field] = number;
        }
        let degree = $('#scorelistEditModal table tbody select').val();
        if (degree !== '自动') {
            post_data['等级'] = degree;
            selectData['degree'] = degree;
        }
        post_data['reason']=$('#special-edit-state').val();
    });
    return api_score.updateSpScore(sid,post_data).done(function (data) {
        if(data.status===0){
            swal(
                '成功',
                '修改成绩成功',
                'success'
            );
            $('#special_score_list_table').bootstrapTable('updateRow',0,selectData);
        }else {
            swal(
                '更新失败',
                data.message,
                'error'
            );
        }
    });
});

// 发布特殊学生成绩
$('#publish-special-score').click(function () {
    let specialScoreListTable=$('#special_score_list_table');
    let selections=specialScoreListTable.bootstrapTable('getSelections');
    if(selections.length<1){
        return;
    }
    let sids='';
    for (let i = 0; i < selections.length - 1; i++) {
        sids+=selections[i].sid+',';
    }
    sids+=selections[selections.length-1].sid;
    api_score.releaseSpScore(sids).done(function (data) {
        if(data.status===0){
            swal(
                '成功',
                '发布成绩成功',
                'success'
            );
        }
    });
});


// ========================================================================
// 6、其他函数

// 格林威治时间的转换
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

// 获取标准时间格式
function chGMT(gmtDate) {
    var mydate = new Date(gmtDate);
    return mydate.format("yyyy-MM-dd hh:mm");
}
