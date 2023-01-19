function uncheck(id){
    $(`#Listsuppliers #${id}`).click(function () {
      if (!$(this).checked) {
        $("#checkAll").attr("checked", false);
      }
    });
  }
$(document).ready(function() {
  let _addForm =$('#newUserForm')[0];
  let _editForm =$('#updateUserForm')[0];
  $(".select2").each(function() {
    $(this)
        .wrap("<div class=\"position-relative\"></div>")
        .select2({
            placeholder: "Choose Module",
            dropdownParent: $(this).parent()
        });
  })
    supplierList()
    $.get('/manage-module/list', (result) => {
      let html = ``;
      html = `<option value="">Choose Module</option>`
      if(result) {
        $.each(result, (i, res) => {
          html += `<option value=${res.id}>${res.name}</option>`
        })
        $("#moduleid").html(html)
        $("#editModuleid").html(html)
      }
    })
        //add
    $("#addSupplier").click(() => {
        if (!_addForm.reportValidity()) {
          _addForm.reportValidity();
          return;
        }
        $("#addSupplier").prop("disable", true);
        $('#loader').show();
          let input = {
              "name": $("#name").val().toLowerCase(),
              "moduleid": $('#moduleid').val(),
              "shortform": $('#shortform').val(),
              "mor": $('#mor').val(),
          };
          existName('', $("#name").val(), 1).then((res) => {
              if (res == -1) {
                  addSupplier(input)
              } else {
                  notify('Supplier name already exists', "error");
                  $('#loader').hide();
              }
          })
          $('#loader').hide();
          $("#addSupplier").prop("disable", false);
    });

    function addSupplier(inputdata) {
        $.post("/supplier", inputdata, function(rolresult) {
            if (!rolresult.errors) {
              if(rolresult.data.addSupplier.success)
              {
                $("#AddNewSupplier").modal('hide')
                $('#loader').hide();
                supplierList();
                notify('Supplier created successfully', "success");
              }else{
                notify(rolresult.data.addSupplier.message, 'error')
                $('#loader').hide();
              }
            } else {
              console.log(rolresult.errors)
                 for (let error of rolresult.errors) {
                    notify(`${error.message}`, 'error')
                }
                $("#AddNewSupplier").modal('hide')
                $('#loader').hide();
            }
        })
    }
    //update 
    $("#updateSupplier").click(() => {
        if (!_editForm.reportValidity()) {
          _editForm.reportValidity();
          return;
        }
        $("#updateSupplier").prop("disable", true);
        $('#loader').show();
        let input = {
            "name": $("#update_name").val().toLowerCase().trim(),
            "shortform": $("#update_shortform").val(),
            "moduleid": $("#editModuleid").val(),
            "mor": $("#update_mor").val(),
            "id": $("#supplierid").val()
        };

        if(input.name.toLowerCase() == $("#hidden_name").val().toLowerCase().trim()) {
          existName($("#supplierid").val(), input.name, 2)
              .then(res => {
                  if(res == -1) 
                      updatesupplier(input)
                  else {
                    notify('Supplier name already exists', "error");
                    $("#updateUserModal").modal('hide')
                    $('#loader').hide();
                    $("#updateSupplier").prop("disable", false);
                  }
              })
      } else {
          existName('', input.name, 1)
              .then(res => {
                  if(res == -1) 
                      updatesupplier(input)
                  else {
                    notify('Supplier name already exists', "error");
                    $("#updateUserModal").modal('hide')
                    $('#loader').hide();
                    $("#updateSupplier").prop("disable", false);
                  }
              })
      }
    });

    $("#deleteAll").click(() => {
        let cbs = $.find("#Listsuppliers tr input[name='cbRow']");
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
          $("#deleteDialog .modal-title").html("Delete Suppliers");
          $("#deleteDialog #bdelete").off("click");
          $("#deleteDialog #bdelete").click(() => {
            $("#bdelete").prop("disabled",true);
            bulkDelete();
          });
          $("#deleteDialog").modal("show");
        } else {
          notify("Supplier(s) not selected", "warning");
        }
      });

    $('#Not').click(() => {
        $("#deleteAllUserModal").modal('hide')
    })

    $('#No').click(() => {
        $("#deleteUserModal").modal('hide')
    })

    $('#Yes').click(() => {
        console.log($("#hiddensuppliername").val().trim().toLowerCase())
        let namematch = $("#hiddensuppliername").val().trim().toLowerCase() == $('#prompt').val().trim().toLowerCase();
        if (namematch) {
            $("#deleteUserModal").modal('hide');
            $("#confirmModal").modal('show')
            let input = {
                "supplierid": parseInt($("#hiddensupplierid").val()),
                "suppliername": $("#hiddensuppliername").val()
            }
            var html1 = ``;
            html1 += `<h4 style="margin-top: 10px;">${input.suppliername}</h4>`
            $('#confrmdelete').html(html1);
        } else {
            notify('Rolename is mismatch', 'error')
        }
    })

    // $('#notConfirm').click(() => {
    //     $("#confirmModal").modal('hide')
    // })

    //delete
    $("#delete").click(() => {
        let input = {
            "supplierid": parseInt($("#hiddensupplierid").val()),
        }
        $('#loader').show();
        $.post("/removeSupplier", input, function(result) {
            if (result.data) {
                $("#confirmModal").modal('hide')                
                supplierList()
                $('#loader').hide()
                notify('Supplier Deleted successfully', 'success')
                $('#loader').hide();
            } else {

                for(let error of result.errors)
                {
                    notify(`${error.message}`, 'error')
                }
            }
            $('#loader').hide()
          
        })
    });

    //Active / Inactive 
    $("#ActiveSupplier").click(function () {
        let cbs = $.find("#Listsuppliers tr input[name='cbRow']");
        $("#activeDialog #list").empty();
        let idx = 0;
        $(cbs).each(function () {
          if (this.checked) {
            idx++;
            $("#activeDialog #list").append(
              `<li data-id="${$(this).data("id")}">${$(this).data("name")}</li>`
            );
          }
        });
        if (idx > 0) {
          $("#activeDialog .modal-title").html("Active Suppliers");
          $("#activeDialog #bactive").off("click");
          $("#activeDialog #bactive").click(() => {
            $("#bactive").prop("disabled",true);
            bulkActive();
          });
          $("#activeDialog").modal("show");
        } else {
          notify("Suppliers(s) not selected", "warning");
        }
      });
    
      $("#InactiveSupplier").click(function () {
        let cbs = $.find("#Listsuppliers tr input[name='cbRow']");
        $("#inactiveDialog #list").empty();
        let idx = 0;
        $(cbs).each(function () {
          if (this.checked) {
            idx++;
            $("#inactiveDialog #list").append(
              `<li data-id="${$(this).data("id")}">${$(this).data("name")}</li>`
            );
          }
        });
        if (idx > 0) {
          $("#inactiveDialog .modal-title").html("Inactive Suppliers");
          $("#inactiveDialog #binactive").off("click");
          $("#inactiveDialog #binactive").click(() => {
            $("#binactive").prop("disabled",true);
            bulkInactive();
          });
          $("#inactiveDialog").modal("show");
        } else {
          notify("Suppliers(s) not selected", "warning");
        }
      });

      $("#tablerecords #ByName").change(function () {
        supplierList($(this).val());
      });
    
      $("#tablerecords #ByModule").change(function () {
        supplierList(undefined, $(this).val());
      });

      $("#tablerecords #BySName").change(function () {
        supplierList(undefined, undefined, $(this).val());
      });
    
      $("#tablerecords #ByStatus").change(function () {
        supplierList(undefined, undefined, undefined, $(this).val());
      });
})

async function updatesupplier(input) {
  $.post("/updateSupplier", input, function(result) {
    if (result) {
        $("#updateUserModal").modal('hide')
        notify('Supplier updated successfully', "success");
        
        supplierList()
        $('#loader').hide()
    } else {
        $("#updateUserModal").modal('hide')
        notify(result.errors[0].message, "error");
        $('#loader').hide();
    }
});
}
async function bulkActive() {
    $("#loader").show();
    let cbs = $.find("#Listsuppliers tr input[name='cbRow']");
    let ids = [];
    $(cbs).each(function () {
      if (this.checked) {
        let id = parseInt($(this).data("id"));
        ids.push(id);
      }
    });
    if (ids.length) {
      let dids = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch("/activeSupplier", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
            }), // body data type must match "Content-Type" header
          });
          let result = await response.json();
          if (result.errors) {
            for (let error of result.errors) {
                notify(`${error.message}`, 'error')
              }
          } else {
            return id
          }
        })
      );
      if (ids.length - dids.length === 0) {
        notify("Suppliers activated successfully", "success");
        supplierList();
      } else {
        notify("Unable to activate supplier(s)", "error");
      }
      $("#loader").hide();
    }
    $("#activeDialog").modal("hide");
    $("#bactive").prop("disabled",false);
}
  
async function bulkInactive() {
    $("#loader").show();
    let cbs = $.find("#Listsuppliers tr input[name='cbRow']");
    let ids = [];
    $(cbs).each(function () {
        if (this.checked) {
        let id = parseInt($(this).data("id"));
        ids.push(id);
        }
    });
    let success_count =0;
    if (ids.length) {
        let dids = await Promise.all(
        ids.map(async (id) => {
            const response = await fetch("/inactiveSupplier", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
            }), // body data type must match "Content-Type" header
            });
            let result = await response.json();
            if (result.data && result.data.inactiveSupplier) {
              if(result.data.inactiveSupplier.success)
              {
                success_count++;
              }
            return id;
            }
        })
        );
        if (ids.length === success_count) {
        notify("Supplier deactivated successfully", "success");
        supplierList();
        } else {
        notify("Unable to deactivate supplier(s)", "error");
        }
        $("#loader").hide();
    }
    $("#inactiveDialog").modal("hide");    
    $("#binactive").prop("disabled",false);
}

function existName(id = null, name, type) {
  console.log(id)
    return new Promise((resolve, reject) => {
        $.post("/supplierList", {}, function(result) {
            if (result.length) {
                if(type == 2)
                    result.splice(result.findIndex(res => res.id == parseInt(id)), 1);
                
                let emailExist = result.findIndex(res => {
                  if(res.name)
                    return res.name.toLowerCase() == name.toLowerCase()
                })
                resolve(emailExist);
            } else {
                reject(undefined)
            }
        });
    })
        
}
function getSupplier(id) {
    $.post("/getSupplier", { supplierId: id }, function(result) {
        if(result.length)
            return result
        else
            return {}
    });
}
function  supplierList(name, module, shortname, status) {
    $("#Listsuppliers").html('');
    $('#loader').show();

    $.post("/supplierList", { name: name, module: module, shortname: shortname, status: status }, function(result) {
        if (result.errors) {
          for(let error of result.errors)
          {
              notify(`${error.message}`, 'error')
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

function updatesupplierPromt(supplierid, suppliername, suppliershortname, mor, moduleid) {
    
    document.querySelector('#updateUserForm').reset();
    $("#supplierid").val(supplierid)
    $("#update_name").val(suppliername)
    $("#hidden_name").val(suppliername)
    $("#update_shortform").val(suppliershortname)
    $("#editModuleid").val(moduleid).trigger("change");
    if(mor = 'CTS') 
      var cts = "selected";
    else
      var supplier = "selected"
    let html = ``;
    html += `<option value="">Choose Mor</option>
            <option value="CTS" ${cts}>CTS</option>
            <option value="SUPPLIER" ${supplier}>SUPPLIER</option>`
    $("#update_mor").html(html)

    
}

function deletePromt(supplierid, suppliername) {
    document.querySelector('#deleteUserForm').reset();
    $("#hiddensupplierid").val(supplierid);
    $("#hiddensuppliername").val(suppliername);
}

$("#checkAll").click(function() {
    $('input:checkbox').not('#flexSwitchCheckDefault').prop('checked', this.checked);
});

async function bulkDelete() {
  $("#loader").show();
  let cbs = $.find("#Listsuppliers tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = parseInt($(this).data("id"));
      ids.push(id);
    }
  });
  var success_count = 0;
  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/removeSupplier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplierid: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.removeSupplier) {
          if(result.data.removeSupplier.success) {
            success_count++;
          }
          return id;
        }
      })
    );
    if (ids.length === success_count) {
      notify("Suppliers deleted successfully", "success");
    } else {
      notify("Unable to delete supplier(s)", "error");
    }
    supplierList();
    $("#loader").hide();
  }
  $("#deleteDialog").modal("hide");
  $("#bdelete").prop("disabled",false);

}

function closeModal(modalname) {
    document.getElementById(modalname).reset();
    clear_form("#newUserForm");
}


function _getPageData(list) {
  let ele = $("#Listsuppliers");
  ele.find("tr").remove()
  if (list.length) {
      $.get("/templates/supplier_item.html", function (template) {
          $.each(list, function (index, item) {
              let _resource = [];
              if (item.resources != null) {
              _dataResource.forEach(function (_res) {
                  let _d = item.resources.includes(_res.id) == true ? _res.name : '';
                  if (_d != '') _resource.push(_d);
              });
              }
              item.resources = _resource.join(', ');
              $.tmpl(template, item).appendTo("#Listsuppliers");
          })
          //pagination 
          _CMSpagination = new Pager({
              divId: 'fPage',
              tableId: 'tablerecords',
              noContentMsg: 'No Content found',
              perPage: 10,
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
$(document).on('click', '.delete-resource', function () {
  let id = $(this).data('id');
  $("#list").empty();
  $("#list").append(`<li data-id="${id}">${$(this).data('name')}</li>`);
  $("#deleteDialog .modal-title").html("Delete Resource(s)");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    singleDelete(id);
  });
  $("#deleteDialog").modal("show");
})
async function singleDelete(id) {
  $('#loader').show();
  const response = await fetch('/removeSupplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      supplierid: id,
    }), // body data type must match "Content-Type" header
  })
  $('#loader').hide();
  $("#deleteDialog").modal("hide");
  supplierList();
}