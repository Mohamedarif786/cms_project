//toDo move to CDN structure / minify

/**
 * Page script to manage CURD 
 * @author  Roshan Chettri
 */
$(document).ready(function () {

  /**
  * autocomplete data helper
  */
  let _resourceNameAutocomplete = -1;

  /**
   * autocomplete for users resource
  */
  /*
  $("#resourceName").autocomplete({
    source: function (request, response) {
      $.ajax({
        method: "GET",
        url: _apiBase + '/users', //ednpoint with search term required
        data: { term: request.term }
      })
        .done(function (data) {
          $('.ui-autocomplete').css({ 'z-index': 100000 })
          if (!data.length) {
            _resourceNameAutocomplete = -1;
            var result = [{ label: "no results", value: -1 }];
            response(result);
          }
          else {
            response(data);
          }
        })
    },
    minLength: 2,
    select: function (event, ui) {
      _resourceNameAutocomplete = ui.item  // use this to validate check add method
    }
  });
  */

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

  /**
  * Page forms
  */
  var _addForm = document.getElementById('addForm');
  var _editForm = document.getElementById('editForm');

  /**
  * Opens add popup  
  */
  $('#add-resource').on('click', function () {
    $('#addModal').modal('show');
  })

  /**
  * Add method
  */
  $('#add-confirm').on('click', function () {
    $('#loader').show();
    $('#add-confirm').prop('disabled', true);
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      $('#loader').hide();
      $('#add-confirm').prop('disabled', false);
      return;
    }
      let _data = {
      "name": $('#moduleName').val(),
      "acceptPayment": $('#modulePayment').is(":checked") ? true : false,
      "type": $('#moduleType').val(),
    }
    $.post(_apiBase + "/add", _data, function (res) {
      $('#addModal').modal('hide');
      if (res && !res.errors) {
        notify("Record Added", "success");
        let _res = res.data.addModule.result;
        let ele = $("#main-table");
        $.get("/templates/managemodule_item.html", function (template) {
          $.tmpl(template, _res).prependTo(ele);
          _CMSpagination.reset();
        })
      } else {
        notify(res.errors[0].message, "error");
      }
      $('#add-confirm').prop('disabled', false);
      _addForm.reset();
      $('#loader').hide();
    })

  })
  /**
  * Opens confirmation popup for delete 
  */
  $(document).on('click', '.delete-resource', function () {
    //$('#deleteModal').modal('show');
    //$('#delete-confirm').data('id', $(this).data('id')); // referene for delete/unassign use

    let id = $(this).data('id');
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data('name')}</li>`);
    $("#deleteDialog .modal-title").html("Delete Module");
    $.post("/supplierList", {  }, function(result) {
      if (result?.errors) {
        for(let error of result?.errors)
        {
            notify(`${error?.message}`, 'error')
        }
        $('#loader').hide();
      }else{
          if(result.length){
          let isSupplierExist =result.filter((val)=>{
            return val.moduleid ==parseInt(id)
          })
          if(isSupplierExist &&isSupplierExist.length){
            $("#deleteCheckDialog .modal-title").html("Modules is used on supplier");
            $("#dc-message").html("<p>Delete following on supplier </p>");
            $("#deleteCheckDialog").modal("show");
              var html_text = '';
              isSupplierExist.forEach(function(item) {
              html_text += "<li>"+item?.name+"</li>";
            });
              $("#dc-list").html(html_text);
          }else{        
            $("#deleteDialog #bdelete").off("click");
            $("#deleteDialog #bdelete").click(() => {
              $("#deleteDialog #bdelete").prop("disabled", true);
              singleDelete(id);
            });
            $("#deleteDialog").modal("show");
          }
        }
      }      
  });
  })

  /**
* Delete all method 
*/
  $("#deleteAll").click(() => {
    let cbs = $('.delete-check:checkbox:checked');
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
      $("#deleteDialog .modal-title").html("Delete Menu(s)");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#deleteDialog #bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Modules(s) not selected", "warning");
    }
  });


  /**
  * Delete method helper
  */
  async function removeRow(id, callback) {
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
        $.post(_apiBase + "/delete/" + id, {}, function (res) {
          if (res && !res.errors) {
            $('#row' + id).remove();
            _CMSpagination.reset();
            notify('Record Deleted', "success");
            _getPageData()
          } else {
            notify(res.errors[0]?.message, "error");
          }
          callback();
        })
        break;
    }
  }

  /**
   * Deletes single record
   */
  async function singleDelete(id) {
    $('#loader').show();
    removeRow(id, () => {
      $('#loader').hide();
      $("#deleteDialog").modal("hide");
      $("#deleteDialog #bdelete").prop("disabled", false);
    })
  }

  /**
  * Deletes multiple records
  */
  async function bulkDelete() {
    $("#loader").show();
    let cbs = $('.delete-check:checkbox:checked');//$.find("#roleList tr input[name='cbRow']");
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
          return await removeRow(id, 'all');
        })
      );
      //filters failed response
      dids = dids.filter(function (element) {
        return element !== undefined;
      });

      if (ids.length - dids.length === 0) {
        notify("Module(s) deleted successfully", "success");
        _getPageData()
      } else {
        notify("Unable to delete Module(s)", "warning");
      }
      $("#loader").hide();
    }
    $("#deleteDialog #bdelete").prop("disabled", false);
    $("#deleteDialog").modal("hide");
  }

  /**
  * Delete method helper
  */
  /*function removeRow(id, processed) {
    $.post(_apiBase + "/delete/" + id, {}, function (res) {
      if (res && !res.errors) {
        $('#row' + id).remove();
        _CMSpagination.reset();
        notify("Record Deleted", "success");
      } else {
        notify(res.errors[0].message, "error");
      }
      processed();
    })
  }*/

  /**
  * Delete method 
  */
  $('#delete-confirm').on('click', function () {
    let id = $(this).data('id');
    if (id != "all") {
      $('#loader').show();
      $('#delete-confirm').prop('disabled', true);
      removeRow(id, () => {
        $('#deleteModal').modal('hide');
        $('#delete-confirm').prop('disabled', false);
        $('#loader').hide();
      })
    } else {
      $('#deleteModal').modal('hide');
      if ($('.delete-check:checkbox:checked').length > 0) {
        $.each($('.delete-check:checkbox:checked'), function (index, item) {
          let id = $(item).data('id');
          $('#loader').show();
          removeRow(id, () => {
            $('#loader').hide();
          });
        })
      }
    }
  })

  /**
  * initial page loader method
  */
  function _getPageData() {
    $('#loader').show();
    let ele = $("#main-table");
    $.get(_apiBase + "/list", {}, function (result) {
      if (result.length) {
        $.get("/templates/managemodule_item.html", function (template) {
          $.each(result, function (index, item) {
            let _resource = [];
            if (item?.resources != null) {
              _dataResource.forEach(function (_res) {
                let _d = item?.resources.includes(_res.id) == true ? _res.name : '';
                if (_d != '') _resource.push(_d);
              });
            }
            item?.resources = _resource.join(', ');
            $.tmpl(template, item).appendTo(ele);
          })
          //pagination 
          _CMSpagination = new Pager({
            divId: 'fPage',
            tableId: 'main-table',
            noContentMsg: 'No Content found',
            filter: true,
            deleteAll: function (e) {
              if ($('.delete-check:checkbox:checked').length > 0) {
                $('#deleteModal').modal('show');
                $('#delete-confirm').data('id', 'all'); // id referene for delete use
              } else {
                notify("No record selected for delete", "warning");
              }
            }
          });
        });
      } else {
        ele.html('<p>No content found</p>');
      }
      $('#loader').hide();
    });
  }
  _getPageData();

});