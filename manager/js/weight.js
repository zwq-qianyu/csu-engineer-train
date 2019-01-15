window.onload = function () {
    // 初始化
    init_data();
}

// 初始化数据
function init_data() {
    //  初始化所有权重模版名
    findAllTemplate();
    //  获取所有批次
    getAllBatch();
}

var base_url = 'http://134.175.152.210:8084';


// 获取所有批次
function getAllBatch() {
    $.ajax({
        type: 'post',
        url: base_url + '/batch/getAllBatch',
        data: {},
        datatype: 'json',
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
        },
        crossDomain: true,
        success: function (data) {
            if (data.status === 0) {
                let data_arr = data.data;
                html = '<option>批次选择</option>';
                for (let i = 0; i < data_arr.length; i++) {
                    html += '<option>' + data_arr[i].batch_name + '</option>';
                }
                // console.log(html);
                $('#weight_select_batch1').html(html);
                $('#weight_select_batch2').html(html);
            }
        }
    });
}

//  获取所有权重模版名
function findAllTemplate() {
    $.ajax({
        type: 'post',
        url: base_url + '/proced/findAllTemplate',
        datatype: 'json',
        data: {},
        success: function (data) {
            if (data.status === 0) {
                let data_arr = data.data;
                let html = '<option>权重模版选择</option>';
                for (let i = 0; i < data_arr.length; i++) {
                    html += '<option>' + data_arr[i] + '</option>'
                }
                $('#weight_select_templates1').html(html);
                $('#weight_select_templates2').html(html);
            }
        }
    });
}

// 权重模版选择内容变动时更新权重设置列表的内容
$('#weight_select_templates1').change(function () {
    let new_template = $('#weight_select_templates1').val();
    console.log(new_template);
    if (new_template !== "权重模版选择") {
        $.ajax({
            type: 'post',
            url: base_url + '/proced/findTemplateItemByName',
            datatype: 'json',
            data: {
                'name': new_template
            },
            success: function (data) {
                if (data.status === 0) {
                    let data_arr = data.data;
                    let html = '';
                    for (let i = 0; i < data_arr.length; i++) {
                        html += '<tr><td class="edit_weight_list_name" value="' + data_arr[i].pro_name + '">' + data_arr[i].pro_name + '</td><td><input type="text" disabled class="edit_weight_list" value="' + parseInt(100 * data_arr[i].weight) + '"> %</td></tr>'
                    }
                    $('#weight_edit_list').html(html);
                }
            }
        });
    }
})

// 点击编辑对权重设置表进行编辑
function editWeight() {

    $('input[class="edit_weight_list"]').each(function () {
        this.removeAttribute("disabled");
    })
}

//点击确认创建新的权重模板

function createNewWeightTemp() {
    let name = $('#new_weight_temp_name').val();

    let weights = [];
    let names = [];
    let row_names = $('#new_weight_list_tbody tr').each(function () {
        names.push($(this).find('td:first').text());
    });

    $('#new_weight_list_tbody tr td input').each(function () {
        weights.push(this.value);
    });

    let postData = {};

    for (let i = 0; i < names.length; i++) {
        postData[names[i]] = weights[i];
    }

    // console.log(postData);


    $.ajax({
        type: 'post',
        url: base_url + '/proced/addTemplate?templateName=' + name,
        datatype: 'json',
        data: JSON.stringify(postData),
        contentType: 'application/json',
        success: function (data) {
            if (data.status === 0) {
                swal(
                    '创建成功',
                    '创建权重模板成功',
                    'success'
                )
            } else {
                swal(
                    '创建失败',
                    '创建排课模版权重失败，请重试！',
                    'error'
                );
            }
        }
    }).always(function () {
        $('#weight-plan-add').modal('hide');
    })
}

// 点击保存提交修改后的权重，并禁止修改
function submitWeight() {
    $('input[class="edit_weight_list"]').each(function () {
        this.setAttribute("disabled", "disabled");
    });
    let names = [];
    let weights = [];
    // 获取所有打分项
    let edit_weight_list_name = document.getElementsByClassName('edit_weight_list_name');
    for (let i = 0; i < edit_weight_list_name.length; i++) {
        // console.log(edit_weight_list_name[i].getAttribute("value"));
        names.push(edit_weight_list_name[i].getAttribute("value"));
    }
    // 获取所有权重值
    $('input[class="edit_weight_list"]').each(function () {
        // console.log(this.value);
        weights.push(this.value);
    });
    // console.log(names);
    // console.log(weights);
    let template_name = $('#weight_select_templates1').val(); // 排课模版名
    var form_arr = {};
    for (let i = 0; i < names.length; i++) {
        form_arr[names[i]] = Number(weights[i]) / 100;
    }
    console.log(form_arr);
    $.ajax({
        type: 'post',
        url: base_url + '/proced/addTemplate?templateName=' + template_name,
        datatype: 'json',
        data: JSON.stringify(form_arr),
        contentType: "application/json",              //发送至服务器的类型
        success: function (data) {
            if (data.status === 0) {
                // console.log(data);
                swal(
                    '修改成功',
                    '修改排课模版权重成功',
                    'success'
                );
            } else {
                swal(
                    '修改失败',
                    '修改排课模版权重失败，请重试！',
                    'error'
                );
            }
        }
    });
}

// 绑定权重模版
function band() {
    let batch_name = $('#weight_select_batch1').val();
    let template_name = $('#weight_select_templates2').val();
    if (batch_name === "批次选择" || template_name === "权重模版选择") {
        swal(
            '请选择',
            '请选择批次和权重模版！',
            'warning'
        );
    } else {
        $.ajax({
            type: 'post',
            url: base_url + '/proced/band',
            datatype: 'json',
            data: {
                'batch_name': batch_name,
                'template_name': template_name
            },
            success: function (data) {
                if (data.status === 0) {
                    // console.log(data);
                    swal(
                        '绑定成功',
                        '绑定批次与排课模版成功！',
                        'success'
                    );
                } else {
                    console.log(data);
                    swal(
                        '绑定失败',
                        '绑定批次与排课模版失败！',
                        'error'
                    );
                }
            }
        });
    }
}

// 删除某一个权重方案
function deleteTemplate() {
    let name = $('#weight_select_templates1').val(); // 排课模版名
    if (name === "权重模版选择") {
        swal(
            '选择方案',
            '请先选择权重方案',
            'warning'
        );
    } else {
        swal({
            title: '确定删除吗？',
            text: '确定删除吗？你将无法恢复它！',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '确定删除！',
            cancelButtonText: '取消',
        }).then(result => {
            if (result.value) {
                $.ajax({
                    type: 'post',
                    url: base_url + '/proced/deleteTemplate',
                    datatype: 'json',
                    data: {
                        'name': name
                    },
                    success: function (data) {
                        if (data.status === 0) {
                            console.log(data);
                            swal(
                                '删除成功',
                                '删除排课模版成功',
                                'success'
                            );
                            init_data();
                        } else {
                            swal(
                                '删除失败',
                                '删除排课模版失败，请重试！',
                                'error'
                            );
                        }
                    }
                });
                console.log(result.value)
            } else {
                // handle dismiss, result.dismiss can be 'cancel', 'overlay', 'close', and 'timer'
                console.log(result.dismiss)
            }
        })
    }
}

// 根据批次获取成绩权重列表并展示
function getBatchProced() {
    let batch_name = $('#weight_select_batch2').val();
    $.ajax({
        type: 'post',
        url: base_url + '/proced/getBatchProced/' + batch_name,
        datatype: 'json',
        data: {},
        success: function (data) {
            if (data.status === 0) {
                // console.log(data);
                let data_arr = data.data;
                let html = '';
                for (let i = 0; i < data_arr.length; i++) {
                    html += '<tr><td>' + data_arr[i].proid.pro_name + '</td><td>' + parseInt(100 * data_arr[i].weight) + '%</td></tr>';
                }
                $('#show_weight_list_tbody').html(html);
            }
            weight_select_templates1
        }
    });
}

// 第二部分批次选择变动时更新权重展示列表的内容
$('#weight_select_batch2').change(function () {
    let batch_name = $('#weight_select_batch2').val();
    // console.log(batch_name);
    if (batch_name !== "批次选择") {
        $.ajax({
            type: 'post',
            url: base_url + '/proced/getBatchProced/' + batch_name,
            datatype: 'json',
            data: {},
            success: function (data) {
                if (data.status === 0) {
                    // console.log(data);
                    let data_arr = data.data;
                    let html = '';
                    for (let i = 0; i < data_arr.length; i++) {
                        html += '<tr><td>' + data_arr[i].proid.pro_name + '</td><td>' + parseInt(100 * data_arr[i].weight) + '%</td></tr>';
                    }
                    $('#show_weight_list_tbody').html(html);
                }
            }
        });
    }
})


// 添加新权重方法
function addTemplate() {
//获取所有打分项
    $.ajax({
        type: 'post',
        url: base_url + '/proced/getAllProced',
        data: {},
        datatype: 'json',
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
        },
        crossDomain: true,
        success: function (data) {
            if (data.status === 0) {
                let proces = data.data;
                let body_html = '';
                for (let i = 0; i < proces.length; i++) {
                    body_html += '<tr><td>' + proces[i] + '</td><td><input type="text" name=""> %</td></tr>';
                }
                $('#new_weight_list_tbody').html(body_html);
            } else {
                swal(
                    '获取打分项失败！',
                    '请重试',
                    'error'
                )
            }
        }
    })
}
