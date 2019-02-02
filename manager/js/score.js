window.onload = function () {
    init_data();
};

// 初始化数据
function init_data() {
    // 获取所有批次
    getAllBatch_StuList();
    // 获取所有工种
    getAllProced();
    // // 根据条件查询成绩列表
    // getScoreList();
    // 查询教师提交成绩记录--初始化
    getScoreRecord();
    // 特殊学生成绩查询
    getSpScore();
}

// 获取所有工种
function getAllProced() {
    return api_common.getAllProced().done(function (data) {
        if (data.status === 0) {
            let data_arr = data.data;
            let score_list1 = $('#input_score_select_scoreitem').empty().append('<option>选择工种</option>');
            let score_list2 = $('#score_submit_select_process').empty().append('<option>选择工种</option>');
            for (let i = 0; i < data_arr.length; i++) {
                let option = $('<option></option>');
                option.text(data_arr[i]);
                score_list1.append(option.clone());
                score_list2.append(option.clone());
            }
        }
    });
}

//根据批次名获取分组并填充
function getGroupByBatch(batchName, filter) {
    return api_common.getAllSGroup({
        batch_name: batchName
    }).done(function (data) {
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
    return api_common.getBatchProced(batchName).done(function (data) {
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
    return api_common.getAllBatch().done(function (data) {
        if (data.status === 0) {
            // console.log(data);
            let batch1 = $('#score_list_select_batch').empty().append('<option>实习批次选择</option>');
            let batch2 = $('#score_list_select_batch2').empty().append('<option>实习批次选择</option>');
            let batch3 = $('#input_score_select_batch').empty().append('<option>实习批次选择</option>');
            let batch4 = $('#score_submit_select_batch').empty().append('<option>实习批次选择</option>');
            let batch5 = $('#score_edithistory_select_batch').empty().append('<option>实习批次选择</option>');
            for (let i = 0; i < data.data.length; i++) {
                let option = $('<option></option>');
                option.text(data.data[i].batch_name);
                batch1.append(option);
                batch2.append(option.clone());
                batch3.append(option.clone());
                batch4.append(option.clone());
                batch5.append(option.clone());

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
    return api_common.getBatchProced(batch_name).done(function (data) {
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
function getScoreList(post_data) {
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
            "good": great,
            "great": good,
            "middle": middle,
            "notPass": pass,
            "pass": notPass
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
        let input = $('<input type="number" onchange="onEditSignalScore(this)" value="" size="3">');
        input.val(select_data[score_list_columns[i].field]);
        input.data('title', score_list_columns[i].title);
        body_tr.append($('<td></td>').append(input));
    }
    body_tr.append($('<td></td>').text(select_data[score_list_columns[length - 4].field]));
    let select = $('<select><option>自动</option><option>优</option><option>良</option><option>中</option><option>及格</option><option>不及格</option></select>').val('自动');
    body_tr.append($('<td></td>').append(select));
    body_tr.append($('<td></td>').text(select_data[score_list_columns[length - 2].field]));
    //清空原因
    $('#edit-state').empty();
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

//改变工种时做出响应
$('#score_list_select_process').change(function () {
    let batch_name = $('#score_list_select_batch').val();
    let pro_name = $('#score_list_select_process').val();
    if (batch_name === '实习批次选择') {
        swal(
            '请先选择批次',
            '请选择对应批次后查询成绩！',
            'warning'
        );
        return;
    }
    if (pro_name === '选择工种') {
        score_list_table_config.fixedColumns = true;
        $('#score_list_table').bootstrapTable('destroy').bootstrapTable(score_list_table_config);
    } else {
        let score_list_table = $('#score_list_table');
        if (score_list_table_config.fixedColumns) {
            score_list_table_config.fixedColumns = false;
            score_list_table.bootstrapTable('destroy').bootstrapTable(score_list_table_config);
        }
        score_list_table.bootstrapTable('showColumn', pro_name);
        //隐藏除选择以外的所有工种
        _.forEach(processes, function (value) {
            if (value !== pro_name) {
                score_list_table.bootstrapTable('hideColumn', value);
            }
        })
    }
});

//改变分组时做出响应
$('#score_list_select_group_number').change(function () {
    let s_group_id = $('#score_list_select_group_number').val();

    let table = $('#score_list_table');
    let tableData = score_list_table_config.data;
    //显示所有行
    if (s_group_id === '组号') {
        for (let i = 0; i < tableData.length; i++) {
            table.bootstrapTable('showRow', i);
        }
    } else {
        let regex = new RegExp(s_group_id + '$');
        for (let i = 0; i < tableData.length; i++) {
            if (!regex.test(tableData[i].batchAndGroup)) {
                table.bootstrapTable('hideRow', i);
            } else {
                table.bootstrapTable('showRow', i);
            }
        }
    }
});
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


// ========================================================================
// 4、成绩提交记录

// 根据批次获取对应的分组号--成绩提交记录
// function getAllSGroupByBatch() {
//     let batch_name = $('#score_submit_select_batch').val();
//     $.ajax({
//         type: 'post',
//         url: base_url + '/batch/getAllSGroup',
//         datatype: 'json',
//         data: {
//             'batch_name': batch_name
//         },
//         success: function (data) {
//             if (data.status === 0) {
//                 console.log(data);
//                 let data_arr = data.data;
//                 let html = '<option>组号</option>';
//                 for (let i = 0; i < data_arr.length; i++) {
//                     html += '<option>' + data_arr[i] + '</option>'
//                 }
//                 $('#score_submit_select_groupid').html(html);
//             }
//         }
//     });
// }


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
    } else {
        send_data.batch_name = '';
    }
    if (pro_name !== "选择工种") {
        send_data.pro_name = pro_name;
    } else {
        send_data.pro_name = '';
    }
    if (s_group_id !== "组号") {
        send_data.s_group_id = s_group_id;
    } else {
        send_data.s_group_id = '';
    }

    api_score.getScoreRecord(send_data).done(function (data) {
        if (data.status === 0) {
            let data_arr = data.data;
            let tableData = [];
            for (let i = 0; i < data_arr.length; i++) {
                let tableRow = {
                    submitTime: chGMT(data_arr[i].submit_time),
                    batchName: data_arr[i].batch_name,
                    group: data_arr[i].s_group_id,
                    submitter: data_arr[i].pro_name
                };
                tableData.push(tableRow);
            }
            submit_list_table_config.data = tableData;
            $('#submit_list_table').bootstrapTable('destroy').bootstrapTable(submit_list_table_config);
        }
    });
    // console.log(send_data);
    // $.ajax({
    //     type: 'post',
    //     url: base_url + '/score/getScoreRecord',
    //     datatype: 'json',
    //     data: send_data,
    //     success: function (data) {
    //         if (data.status === 0) {
    //             // console.log(data);
    //             let data_arr = data.data;
    //             let html = '';
    //             for (let i = 0; i < data_arr.length; i++) {
    //                 html +=  '</td><td>' + data_arr[i].pro_name + '</td><td>' + data_arr[i].tid + '</td></tr>';
    //             }
    //             $('#score_submit_list').html(html);
    //         }
    //     }
    // });
}


// ========================================================================
// 4、成绩修改记录
function searchUpdateHistory() {
    let batch_name = $('#score_edithistory_select_batch').val();
    let begin = $('#score_edithistory_begin_time').val();
    let end = $('#score_edithistory_end_time').val();
    let sname = $('#score_edithistory_sname').val();
    let sid = $('#score_edithistory_sid').val();

    let send_data = {
        begin: begin,
        end: end,
        sname: sname,
        sid: sid
    };
    if (batch_name !== "实习批次选择") {
        send_data.batch_name = batch_name;
    }else {
        send_data.batch_name='';
    }
    api_score.getScoreUpdate(send_data).done(function (data) {
        if(data.status===0){
            let data_arr=data.data;
            tableData=[];
            for (let i = 0; i < data_arr.length; i++) {
                data_arr[i].update_time=chGMT(data_arr[i].update_time);
            }
            update_list_table_config.data=data_arr;
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

// 根据学号查询该学生需要做的工序
function getSpProName() {
    let send_data = {
        "sid": $('#spStu_sname').val()
    }
    $.ajax({
        type: 'post',
        url: base_url + '/student/getSpProName',
        datatype: 'json',
        contentType: 'application/json',
        data: JSON.stringify(send_data),
        success: function (data) {
            // console.log(data);
            let head_html = '<tr><th scope="col">选择</th><th scope="col">姓名</th>';
            for (var i = 0; i < data.data.length; i++) {
                head_html += '<th scope="col">' + data.data[i] + '</th>';
            }
            head_html += '<th scope="col">总成绩</th><th scope="col">等级</th><th scope="col">发布情况</th><th scope="col">操作</th></tr>';
            $('#sp_stu_score_list_thead').html(head_html);
        }
    });
}

// 特殊学生成绩查询【接口有问题】
function getSpScore() {
    let sid = $('#spStu_sid').val();
    let sname = $('#spStu_sname').val();
    send_data = {};
    if (sid !== null) {
        send_data.sid = sid;
    }
    if (sname !== null) {
        send_data.sname = sname;
    }
    // console.log(send_data);
    $.ajax({
        type: 'post',
        url: base_url + '/score/getSpScore',
        datatype: 'json',
        data: send_data,
        success: function (data) {
            if (data.status === 0) {
                // console.log(data);
                let data_arr = data.data;
                let html = '';
                for (let i = 0; i < data_arr.length; i++) {
                    html += '<tr><td scope="col">选择</td>';
                    html += '<td><input type="checkbox" name=""></td>';
                    html += '<td>2018A01/A</td><td>王琳</td><td>90</td><td>90</td><td>90</td><td>-2</td><td>90</td><td>90</td><td>90</td><td>90</td><td>80</td><td>已发布</td><td>良</td><td>';
                    html += '<button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#specialListEditModal">修改</button></td></tr>';
                }
                $('#spStu_list_tbody').html(html);
            }
        }
    });
}

// 特殊学生成绩修改【需要等查询特殊学生数据对接完成后才能做了】
function updateSpScore() {

}

// 发布特殊学生成绩【需要等查询特殊学生数据对接完成后才能做了】
function releaseSpScore() {

}


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
    mydate.setHours(mydate.getHours() + 8);
    // return mydate.format("yyyy-MM-dd hh:mm:ss");
    return mydate.format("yyyy-MM-dd hh:mm");
}
