
function languageList(name, code, status) {
    $("#languageList").html('');
    $('#loader').show();

    $.post("/languageList", { name: name, code: code, status: status }, (result) => {
        if (result && result?.errors) {
            for(let error of result?.errors)
            {
                notify(`${error?.message}`, 'error')
            }
            var rec = ` `;
            rec += `<td colspan="4" align="center">No Records found</td>`
            $('#norecords').html(rec)
            $('#loader').hide();
        } else {
            _getPageData(result)
            $('#loader').hide();
        }
    });

    
}

function _getPageData(memberList) {
    let ele = $("#languageList");
    ele.find("tr").remove()
    if (memberList && memberList.length) {
        $.get("/templates/language.html", function (template) {
            $.each(memberList, function (index, item) {
                let _resource = [];
                if (item.resources != null) {
                _dataResource.forEach(function (_res) {
                    let _d = item.resources.includes(_res.id) == true ? _res.name : '';
                    if (_d != '') _resource.push(_d);
                });
                }
                item.resources = _resource.join(', ');
                $.tmpl(template, item).appendTo("#languageList");
            })
            //pagination 
            _CMSpagination = new Pager({
                divId: 'fPage',
                tableId: 'tablerecords',
                noContentMsg: 'No Content found',
                filter: false,  
                perPage: 10,
                deleteAll: function (e) {
                    if ($('.delete-check:checkbox:checked').length > 0) {
                        $('#deleteModal').modal('show');
                        $('#delete-confirm').data('id', 'all'); // id referene for delete use
                    } else {
                        setMsg('No record selected for delete');
                    }
                }
            });
        });
    } else {
        ele.html('<tr><td colspan=3>No Language found</th></tr>');
    }
}

$(document).ready(function() {

    languageList();

    $("#tablerecords #ByName").change(function () {
        languageList($(this).val());
    });

    $("#tablerecords #ByCode").change(function () {
        languageList(undefined, $(this).val());
    });

    $("#tablerecords #ByStatus").change(function () {
        languageList(undefined, undefined, $(this).val());
    });
})