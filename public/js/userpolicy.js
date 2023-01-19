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
  var _addForm = $('#addForm')[0];
  var _editForm = $('#editForm')[0];

  /**
  * pagination Object
  */
  let _CMSpagination;

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

    /*
    enable for autocomplete
    if (_resourceNameAutocomplete == -1) {
      $('#resourceName').val('');
      _addForm.reportValidity();
      $('#loader').hide();
      $('#add-confirm').prop('disabled', false);
      return;
    }
    */

    let _data = {
      "userId": $('#resourceName').val(),
      "policyId": $('#policyResource').val(),
    }

    $.post(_apiBase, _data, function (res) {
      console.log('res', res)
      $('#addModal').modal('hide');
      if (res && !res.errors) {
        notify("Record Added", "success");
        let _res = res.data.assignuserpolicy.result;
        let ele = $("#main-table");
        $.get("/templates/userpolicy_item.html", function (template) {
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
    let userId = $(this).data('user');
    let policyId = $(this).data('policy');
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data('name')}</li>`);
    $("#deleteDialog .modal-title").html("Delete User Policy(s)");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      singleDelete(userId, policyId);
    });
    $("#deleteDialog").modal("show");
    //$('#deleteModal').modal('show');
    //$('#delete-confirm').data('user', $(this).data('user')); // referene for delete/unassign use
    //$('#delete-confirm').data('policy', $(this).data('policy')); // referene for delete/unassign use
  })


  /**
  * Delete method helper
  */
  /*function removeRow(userId, policyId, processed) {
    $.post(_apiBase + "/delete/" + userId + '/' + policyId, {}, function (res) {
      if (res && !res.errors) {
        $('#row' + userId + '' + policyId).remove();
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
    let userId = $(this).data('user');
    if (userId != "all") {
      let policyId = $(this).data('policy');
      $('#loader').show();
      $('#delete-confirm').prop('disabled', true);
      removeRow(userId, policyId, () => {
        $('#deleteModal').modal('hide');
        $('#delete-confirm').prop('disabled', false);
        $('#loader').hide();
      })
    } else {
      $('#deleteModal').modal('hide');
      if ($('.delete-check:checkbox:checked').length > 0) {
        $.each($('.delete-check:checkbox:checked'), function (index, item) {
          let userId = $(item).data('user');
          let policyId = $(item).data('policy');
          $('#loader').show();
          removeRow(userId, policyId, () => {
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
        $.get("/templates/userpolicy_item.html", function (template) {
          $.each(result, function (index, item) {
            let _resource = [];
            if (item.resources != null) {
              _dataResource.forEach(function (_res) {
                let _d = item.resources.includes(_res.id) == true ? _res.name : '';
                if (_d != '') _resource.push(_d);
              });
            }
            item.resources = _resource.join(', ');
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
                $('#delete-confirm').data('user', 'all'); // id referene for delete use
              } else {
                notify("No record selected for delete", "warning");
              }
            }
          });
          $('#loader').hide();
        });
      } else {
        ele.html('<p>No content found</p>');
      }
    });
  }
  _getPageData();



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
          `<li data-id>${$(this).data("name")}</li>`
        );
      }
    });
    if (idx > 0) {
      $("#deleteDialog .modal-title").html("Delete User Policy(s)");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("User Policy(s) not selected", "warning");
    }
  });



  /**
  * Delete method helper
  */
  async function removeRow(userId, policyId, callback) {
    switch (callback) {
      case 'all':
        const response = await fetch(_apiBase + "/delete/" + userId + '/' + policyId, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            //id: id,
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
        $.post(_apiBase + "/delete/" + userId + '/' + policyId, {}, function (res) {
          if (res && !res.errors) {
            $('#row' + id).remove();
            _CMSpagination.reset();
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
   * Deletes single record
   */
  async function singleDelete(userId, policyId) {
    $('#loader').show();
    removeRow(userId, policyId, () => {
      $('#loader').hide();
      $("#deleteDialog").modal("hide");
    })
  }

  /**
  * Deletes multiple records
  */
  async function bulkDelete() {
    $("#loader").show();
    let cbs = $('.delete-check:checkbox:checked');
    let ids = [];
    $(cbs).each(function () {
      if (this.checked) {
        let userId = parseInt($(this).data("user"));
        let policyId = parseInt($(this).data("policy"));
        ids.push({ userId, policyId });
      }
    });
    if (ids.length) {
      let dids = await Promise.all(
        ids.map(async (id) => {
          return await removeRow(id.userId, id.policyId, 'all');
        })
      );
      //filters failed response
      dids = dids.filter(function (element) {
        return element !== undefined;
      });

      if (ids.length - dids.length === 0) {
        notify("User Policy(s) deleted successfully", "success");
      } else {
        notify("Unable to delete User Policy(s)", "warning");
      }
      $("#loader").hide();
    }
    $("#deleteDialog").modal("hide");
  }

});