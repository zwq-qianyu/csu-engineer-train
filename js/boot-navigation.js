// function load(jqueryObj, url) {
//     console.log(url)
//     jqueryObj.load(url, function (result) {
//         var $result = $(result);
//         $result.find("script").appendTo(jqueryObj);
//     });
// }

$.ajaxSetup({
    cache: false,
    crossDomain: true
});

$(function () {
    var navi = $('#navigation');
    navi.on('click', 'a', function (event) {
        event.preventDefault();
        var a = $(this)
        $('#working-space').load(a.attr('href'), function (data, status) {
            if (status !== 'success') return;
            $('.active', navi).removeClass('active')
            a.addClass('active')
            var part = a.text();
            var category = a.parents('.category').find('.category-name').text();
            // console.log(part, category);
            $('#category', navi).text(category);
            $('#part', navi).text(part)
        });
    })

});