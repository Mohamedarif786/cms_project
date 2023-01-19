let countryList, categoryList = ""
function uncheck(id) {
    $(`#benefitsList #${id}`).click(function () {
        if (!$(this).checked) {
            $("#checkAll").attr("checked", false);
        }
    });
}
$(document).ready(function () {
    $(".select2").each(function () {
        $(this)
            .wrap("<div class=\"position-relative\"></div>")
            .select2({
                placeholder: "Select value",
                dropdownParent: $(this).parent()
            });
    })
    benefitsList()
    fill_country_list("#countries")
    fill_country_list("#update_countries")
    $.post("/categoryList", {}, (result) => {
        let html = ``;
        html = `<option value="">Choose Category</option>`
        if (result?.errors) {
            for (let error of result?.errors) {
                notify(`${error?.message}`, 'error')
            }
        } else {
            $.each(result, (i, res) => {
                html += `<option value=${res?.id}>${res?.name}</option>`
            })
            categoryList = result
            $("#category").html(html)
            $("#update_category").html(html)
        }
    })
    let _addForm =$('#newUserForm')[0];
    let _editForm =$('#updateUserForm')[0];
    //add
    $("#addBenefits").click(() => {
        if (!_addForm.reportValidity()) {
            _addForm.reportValidity();
            return;
        }
        $("#addBenefits").prop("disabled", true);
        $('#loader').show();
        let countries = $("#countries").val();
        let input = {
            "name": $("#name").val(),
            "category": $("#category").val(),
            "description": $("#description").val(),
            "countries": countries
        }
        existName($("#name").val().trim().toLowerCase(), 2, null).then((res) => {
            if (res == -1) {
                $.post("/benefits", input, function (rolresult) {
                    if (rolresult.errors) {
                        notify(rolresult.errors[0].message, "error");
                        $('#loader').hide();
                    } else {
                        $("#newUserModal").modal('hide')
                        $('#loader').hide();
                        benefitsList()
                        notify('Benefit created successfully', "success");
                        $("#addBenefits").prop("disabled", false);
                    }
                })
            } else {
                notify('Benefit name already exists', "error");
                $('#loader').hide();
                $("#addBenefits").prop("disabled", false);
            }
        });
    });
    //update 
    $("#updateBenefits").click(() => {
        if (!_editForm.reportValidity()) {
            _editForm.reportValidity();
            return;
        }
        $("#updateBenefits").prop("disabled", true);
        $('#loader').show();
        let countries = $("#update_countries").val();
        let input = {
            "id": parseInt($("#benefitsid").val()),
            "name": $("#update_name").val(),
            "category": $("#update_category").val(),
            "description": $("#update_description").val(),
            "countries": countries,
        }
        if ($("#update_name").val().trim().toLowerCase() == $("#hidden_name").val().trim().toLowerCase()) {
            existName($("#update_name").val().trim(), 1)
                .then(res => {
                    if (res == -1)
                        updateBenefits(input)
                    else {
                        notify('Email Already Exist', 'danger')
                    }
                    $('#loader').hide();
                    $("#updateUserModal").hide()
                    $("#updateBenefits").prop("disabled", false);
                })
        } else {
            existName($("#update_name").val().trim().toLowerCase(), null)
                .then(res => {
                    if (res == -1)
                        updateBenefits(input)
                    else {
                        notify('Email Already Exist', 'danger')
                    }
                    $('#loader').hide();
                    $("#updateUserModal").hide()
                    $("#updateBenefits").prop("disabled", false);
                })
        }
        $('#loader').hide();
    });
    $("#deleteAll").click(() => {
        let cbs = $.find("#benefitsList tr input[name='cbRow']");
        $("#list").empty();
        let idx = 0;
        $(cbs).each(function () {
            if (this.checked) {
                idx++;
                $("#list").append(
                    `<li data-id="${$(this).data("id")}">${$(this).data("name")}</li>`
                );
            }
        });
        if (idx > 0) {
            $("#deleteDialog .modal-title").html("Delete Benefit");
            $("#deleteDialog #bdelete").off("click");
            $("#deleteDialog #bdelete").click(() => {
                $("#bdelete").prop("disabled",true);
                bulkDelete();
            });
            $("#deleteDialog").modal("show");
        } else {
            notify("Benefit(s) not selected", "warning");
        }
    });
    $('#Not').click(() => {
        $("#deleteAllUserModal").modal('hide')
    })
    $('#No').click(() => {
        $("#deleteUserModal").modal('hide')
    })
    $('#Yes').click(() => {
        let namematch = $("#hiddenbenefitname").val().trim().toString().toLowerCase() == $('#prompt').val().trim().toString().toLowerCase();
        if (namematch) {
            $("#deleteUserModal").modal('hide');
            $("#confirmModal").modal('show')
            let input = {
                "benefitId": parseInt($("#hiddenbenefitid").val()),
                "benefitname": $("#hiddenbenefitname").val()
            }
            var html1 = ``;
            html1 += `<h4 style="margin-top: 10px;">${input.benefitname}</h4>`
            $('#confrmdelete').html(html1);
        } else {
            $("#deleteUserModal").modal('hide');
            notify('Rolename is mismatch', 'error')
            $("confirmModal").modal('hide');
        }
    })
     //delete
    $("#delete").click(() => {
        let input = {
            "id": parseInt($("#hiddenbenefitid").val()),
        }
        $('#loader').show();
        $.post("/removeBenefits", input, function (result) {
            if (result?.data) {
                $("#confirmModal").modal('hide')
                benefitsList()
                notify('Benefit Deleted successfully', 'success')
                $("#confirmModal").modal('hide');
            } else {
                for (let error of result?.errors) {
                    notify(`${error?.message}`, 'error')
                }
            }
            $('#loader').hide()
        })
    });
    $("#tablerecords #ByName").change(function () {
        benefitsList($(this).val());
    });
    $("#tablerecords #ByCategory").change(function () {
        benefitsList(undefined, $(this).val());
    });
    $("#tablerecords #ByDescription").change(function () {
        benefitsList(undefined, undefined, $(this).val());
    });
    $("#tablerecords #ByCountry").change(function () {
        benefitsList(undefined, undefined, undefined, $(this).val());
    });
    $("#tablerecords #ByStatus").change(function () {
        benefitsList(undefined, undefined, undefined, undefined, $(this).val());
    });
    //Active / Inactive 
})
function updateBenefits(input) {
    $.post("/updateBenefits", input, function (result) {
        if (!result?.errors) {
            $("#updateUserModal").modal('hide')
            notify('Benefits updated successfully', "success");
            benefitsList()
            $('#loader').hide()
        } else {
            $("#updateUserModal").modal('hide')
            notify(result?.errors[0]?.message, "error");
            $('#loader').hide();
        }
    });
}
function benefitsList(name, category, description, country, status) {
    $("#benefitsList").html('');
    $('#loader').show();
    let arrList;
    $.post("/benefitsList", { name: name, category: category, description: description, country: country, status: status }, function (result) {
        if (result.errors) {
            $('#loader').hide();
            for (let error of result?.errors) {
                notify(`${error?.message}`, 'error')
            }
        } else {
            arrList = result;
            _getPageData(arrList)
            $('#loader').hide()
        }
    });

    if (!arrList) {
        var rec = ` `;
        rec += `<td colspan="4" align="center">No Records found</td>`
        $('#norecords').html(rec)
    }
    if (arrList != null) {
        $.get("/templates/manage_benefits.html", function (template) {
            $.each(arrList, function (index, item) {
                $.tmpl(template, item).appendTo("#benefitsList");
            })
        });
    }
}

async function bulkDelete() {
    $("#loader").show();
    let cbs = $.find("#benefitsList tr input[name='cbRow']");
    let ids = [];
    console.log(cbs)
    $(cbs).each(function () {
        if (this.checked)
            ids.push(parseInt($(this).data("id")))
    });
    if (ids.length) {
        let dids = await Promise.all(
            ids.map(async (req) => {
                const response = await fetch("/removeBenefits", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: req
                    }), // body data type must match "Content-Type" header
                });
                let result = await response.json();
                if (result?.data && result?.data?.removemember) {
                    return id;
                }
            })
        );
        if (ids.length - dids.length === 0) {
            notify("Benifits deleted successfully", "success");
            benefitsList();
        } else {
            notify("Unable to delete benifit(s)", "error");
        }
        $("#loader").hide();
    }
    $("#bdelete").prop("disabled",false);
    $("#deleteDialog").modal("hide");
}
$(document).on('click', '.delete-resource', function () {
    let id = $(this).data('id');
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data('name')}</li>`);
    $("#deleteDialog .modal-title").html("Delete Resource(s)");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
        $("#bdelete").prop("disabled", true);
        singleDelete(id);
    });
    $("#deleteDialog").modal("show");
})
async function singleDelete(id) {
    $('#loader').show();
    const response = await fetch('/removeBenefits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }), // body data type must match "Content-Type" header
    })
    $('#loader').hide();
    $("#deleteDialog").modal("hide");
    $("#bdelete").prop("disabled", false);
    benefitsList();
}
function updateBenefitPromt(benefitid) {
    $('#loader').show();
    let country, category = ``;
    // $('#update_countries').html('')
    document.querySelector('#updateUserForm').reset();
    $("#benefitsid").val(benefitid)
    let update = existName('', parseInt($("#benefitsid").val()), 1)

    if (update != -1) {
        $.post("/getBenefit", { id: benefitid }, (result) => {
            if (result.errors) {
                for (let error of result?.errors) {
                    notify(`${error?.message}`, 'error')
                }
                $('#loader').hide();
            } else {
                $("#benefitid").val(parseInt(result?.id))
                $("#update_name").val(result?.name)
                $("#hidden_name").val(result?.name)
                $("#update_description").val(result?.description)
                $("#update_video").val(result?.video)
                $("#update_video_caption").val(result?.video_caption)
                $("#update_video_tooltip").val(result?.video_tooltip) 
                let country_list = JSON.parse(localStorage.getItem("country_list"));
                $.each(country_list, (i, res) => {
                    if(result?.countries){
                        if (result?.countries.includes(res.alpha2))
                            country += `<option value=${res.alpha2} selected>${res.name}</option>`
                        else
                            country += `<option value=${res.alpha2}>${res.name}</option>`
                    }else{
                        country += `<option value=${res.alpha2}>${res.name}</option>`
                    }
                })
                $('#update_countries').html(country);
                $.each(categoryList, (i, res) => {
                    if (res?.name == result?.category)
                        category += `<option value=${res?.id} selected>${res?.name}</option>`
                    else
                        category += `<option value=${res?.id}>${res?.name}</option>`
                })
                $('#update_category').html(category);
                $('#loader').hide();
                $("#updateUserModal").modal("show");
            }
        })
    }
}
function deletePromt(benefitid, benefitname) {
    document.querySelector('#deleteUserForm').reset();
    $("#hiddenbenefitid").val(benefitid);
    $("#hiddenbenefitname").val(benefitname);
}
$("#checkAll").click(function () {
    $('input:checkbox').not('#flexSwitchCheckDefault').prop('checked', this.checked);
});
function existName(name, no = null) {
    return new Promise((resolve, reject) => {
        $.post("/benefitsList", {}, (res) => {
            let result = res;
            if (result.length) {
                if (no != null)
                    result.splice(result.findIndex(res => res?.name == name), 1);
                let emailExist = result.findIndex(res => res?.name.toLowerCase() == name)
                resolve(emailExist);
            } else {
                reject(undefined)
            }
        });
    })
}
function closeModal(modalname) {
    document.getElementById(modalname).reset();
    $("#countries").trigger("change");
    $("#category").trigger("change");
}
function _getPageData(memberList) {
    let ele = $("#benefitsList");
    ele.find("tr").remove()
    if (memberList.length) {
        $.get("/templates/manage_benefits.html", function (template) {
            $.each(memberList, function (index, item) {
                let _resource = [];
                if (item.resources != null) {
                    _dataResource.forEach(function (_res) {
                        let _d = item.resources.includes(_res?.id) == true ? _res?.name : '';
                        if (_d != '') _resource.push(_d);
                    });
                }
                item.resources = _resource.join(', ');
                $.tmpl(template, item).appendTo("#benefitsList");
            })
            //pagination 
            _CMSpagination = new Pager({
                divId: 'fPage',
                tableId: 'tablerecords',
                noContentMsg: 'No Content found',
                filter: false,
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
        ele.html('<p>No content found</p>');
    }
}