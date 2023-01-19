//toDo move to CDN structure / minify


/**
 * Page script to manage CURD 
 * @author  Roshan Chettri
 */
$(document).ready(function () {

    /**
    * Form helper, it extends form validation and allows custom messages
    */
    $('input, textarea, select').each(function (i, o) {
        if ($(o).attr('custom_validation')) {
            o.addEventListener('invalid', function (event) {
                if (event.target.validity.valueMissing && $(event.target).attr('custom_validation')) {
                    event.target.setCustomValidity($(event.target).attr('custom_validation_msg'));
                }
            })
            o.addEventListener('change', function (event) {
                event.target.setCustomValidity('');
            })
        }
    });
    $(".select2").each(function () {
        $(this)
            .wrap('<div class="position-relative"></div>')
            .select2({
                dropdownParent: $(this).parent(),
            });
    });

    /**
    * Page forms
    */
    var _addPageForm = document.getElementById('addPageForm');

    let languageList;
    $.post("/languageList", {}, (result) => {
        let html = ``;
        html = `<option value="">Choose Languages</option>`;
        if (result.length != 0) {
            languageList = result;
            $.each(result, (i, res) => {
                html += `<option value=${res.code}>${res.name}</option>`;
            });
            $("#addLanguage").html(html);
            $("#editLanguage").html(html);

        }
    });

    /**
    * Opens add popup  
    */
    $('#add-page').on('click', function () {
        clear_form("#addModal #addPageForm");
        pageUpdateId = 0;
        $('#addModal .modal-title').html('New Language');
        $('#addModal').modal('show');
    })


    /**
    * reff to current page id
    */
    var _pageId;

    /**
    * side nav toggle method
    */
    $('.sidebar-toggle').on('click', function () {
        $('#sidebar').toggleClass('collapsed')
    })

    /**
    * reff to current club id
    */
    let _clubId = null;
    let _clubData;
    /**
    * clubs filter  
    */
    $('#clubs').on('change', function () {
        $('.pageContent, #fPageRow').hide();
        _clubId = $(this).val();
        renderPages(_clubId);
    });


    /**
     * select render helper
    */
    function renderSelect() {
        let tiers = $("#addTier, #editTier");
        tiers.empty();
        tiers.append($("<option></option>")
            .attr({ value: "" }).text('Choose Tier'));
        if (_clubData.tiers != null) {
            _clubData.tiers.sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            $.each(_clubData.tiers, function (key, value) {
                tiers.append($("<option></option>")
                    .attr({ value: value.id }).text(value.name));
            });
        }
        if (_clubData.languages != null) {
            _clubData.languages.sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
        // let languages = $("#addLanguage, #editLanguage");
        // languages.empty();
        // languages.append($("<option></option>")
        // .attr({ value: "" }).text('Choose Language'));
        // $.each(_clubData.languages, function (key, value) {
        //     languages.append($("<option></option>")
        //         .attr({ value: value.code }).text(value.name));
        // });

    }

    /**
     * pages render helper
    */
    function renderPages(_clubId) {

        let ele = $("#main-table");
        $(ele).find('tbody tr').remove();
        $('#loader').show();
        $('.pageDataNoContent').remove();
        $.get(_apiBase + "/list" + "/" + _clubId, {}, function (result) {
            $(ele).find('thead').show();
            _clubData = result;
            try {
                if (result.data) {
                    $('.pageDataNoContent').remove();
                    $('#fPageRow').hide();
                    $.get("/templates/clubLanguage.html", function (template) {
                        $.each(result.data, function (index, item) {
                            $.tmpl(template, item).appendTo(ele);
                        })
                        //pagination 
                        _CMSpagination = new Pager({
                            divId: 'fPage',
                            tableId: 'main-table',
                            noContentMsg: 'No Content found',
                            filter: true,
                            //perPage: 'all',
                            deleteAll: function (e) {
                                if ($('.delete-check:checkbox:checked').length > 0) {
                                    $('#deleteModal').modal('show');
                                    $('#delete-confirm').data('id', 'all'); // id referene for delete use
                                } else {
                                    notify("Resource(s) not selected", "warning");
                                }
                            }
                        });

                    });
                    $('#fPageRow').show();
                } else {
                    $(ele).find('thead').hide();
                    $(ele).find('tbody tr').remove();
                    ele.append('<tr colspan=2 class="pageDataNoContent"><td>No content found</td>');
                }

            } catch (error) {
                console.log(error)
                $(ele).find('thead').hide();
                $(ele).find('tbody tr').remove();
                ele.append('<tr colspan=2 class="pageDataNoContent"><td>No content found</td>');
            }
            renderSelect();
            $('#loader').hide();
            $('#pageContent').show();
        });
    }

    /**
    * Opens delete for a page 
    */
    $(document).on('click', '.delete-page', function () {
        let id = $(this).data('id');
        $("#list").empty();
        $("#list").append(`<li data-id="${id}">${$(this).data('name')}</li>`);
        $("#deleteDialog .modal-title").html("Delete Language");
        $("#deleteDialog #bdelete").off("click");
        $("#deleteDialog #bdelete").click(() => {
            singleDelete(id, 'page');
        });
        $("#deleteDialog").modal("show");
    })

    /**
    * Deletes single record
    */
    async function singleDelete(id, type) {
        $('#loader').show();
        removeRow(id, type, () => {
            $('#loader').hide();
            $("#deleteDialog").modal("hide");
            type == 'page' ? renderPages(_clubId) : renderSection(_pageId);
        })
    }

    /**
    * Delete method helper
    */
    async function removeRow(id, type, callback) {
        switch (callback) {
            case 'all':
                const response = await fetch(_apiBase + "/delete/" + id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id,
                    }),
                });
                let result = await response.json();
                if (result && !result.errors) {
                    $('#row' + id).remove();
                    _CMSpagination.reset();
                    return id;
                }
                break;
            default:
                $.post(_apiBase + "/delete/" + type + '/' + id, {}, function (res) {
                    if (res && !res.errors) {
                        $('#row' + id).remove();
                        notify('Record Deleted', "success");
                    } else {
                        notify(res.errors[0].message, "error");
                    }
                    callback();
                })
                break;
        }
    }

    /**
    * Opens edit popup 
    */
    $(document).on('click', '.edit-page', function () {
        _addPageForm.reset();
        $('#addModal .modal-title').html('Update Language');
        $('#loader').show();
        let id = $(this).data('id');
        $.get(_apiBase + "/" + id, {}, function (res) {
            if (res && !res.errors) {
                let _res = res.data.language.result;
                setTimeout(() => {
                    $('#addTier').val(_res.tierid).trigger("change");
                    $('#addName').val(_res.name);
                    $('#addLanguage').val(_res.code).trigger("change");
                    pageUpdateId = _res.id;
                    $('#addModal').modal('show');
                    $('#loader').hide();
                });
            }
        })
    })

    /**
    * Opens add popup  
    */
    $('#add-page-confirm').on('click', function () {
        renderPageForm();
    })




    /**
    * clone data popup
    */
    $('#cloneData').on('click', function () {
        $('#cloneModal .modal-title').html('Clone Language');
        $('#cloneModal').modal('show');
    })

    /**
    * clone data popup
    */
    $('#cloneConfirm').on('click', function () {
        $('#loader').show();
        $('#cloneModal').modal('hide');
        let _data = [];
        languageList.forEach(element => {
            _data.push({
                "name": element.name,
                "code": element.code,
                "clubid": _clubId
            })
        });

        $.post(_apiBase + '/bulk', { data: JSON.stringify(_data) }, function (res) {
            if (res && !res.errors) {
                notify("Record Cloned", "success");
                renderPages(_clubId);
            } else {
                notify(res.errors[0].message, "error");
            }
            $('#loader').hide();
        })

    })


    /**
    * Page update reff id
    */
    let pageUpdateId = 0;
    /**
    * Page element change helper
    */
    function renderPageForm() {
        $('#loader').show();
        let _data = {
            "name": $('#addName').val(),
            "tierid": $('#addTier').val(),
            "code": $('#addLanguage').val(),
        }
        _data.clubid = _clubId;
        if (!_addPageForm.reportValidity()) {
            _addPageForm.reportValidity();
            $('#loader').hide();
            return;
        }
        if (pageUpdateId > 0) {
            _data.id = pageUpdateId;
        }
        $.post(_apiBase, _data, function (res) {
            $('#loader').hide();
            if (res && !res.errors) {
                if (pageUpdateId == 0) {
                    if (res.data.addLanguage.success == true) {
                        notify("Record Added", "success");
                        pageUpdateId = res.data.addLanguage.result.id
                        $('#add-page-title').html('Update Page');
                        oldProp = [];
                        addFormUpdate = true;
                        $('#addModal').modal('hide');
                        renderPages(_clubId);
                    }
                    else {
                        notify(res.data.addLanguage.message, "error");
                    }
                }
                else {
                    if (pageUpdateId > 0 && res.data.updateLanguage.success == true) {
                        $('#add-page-title').html('Update Page');
                        notify("Record Updated", "success");
                        addFormUpdate = true;
                        oldProp = [];
                        $('#addModal').modal('hide');
                        renderPages(_clubId);
                    } else {
                        notify(res.data.updateLanguage.message, "error");
                    }
                }
            } else {
                notify(res.errors[0].message, "error");
            }

        })
    }

})
