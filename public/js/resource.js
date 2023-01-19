
$(document).ready(function () {
  /**
  * pagination Object
  */
  let _CMSpagination;

  $.get("/menu/list", {}, (result) => {
    if (result.errors) {
      for (let error of result.errors) {
        notify(`${error.message}`, "error");
      }
      $("#loader").hide();
    } else {
      let html = "<option value=''>Select Menu</option>";
      if (result.data) {
        $.each(result.data, (i, res) => {
          html += `<option value=${res.id}>${res.name}</option>`;
        });
      }
      $("#resourceMenu").html(html);
      $("#loader").hide();
    }
  });

  /**
  * Opens add popup  
  */
  $('#add-resource').on('click', function () {
    clear_form("#addForm");
    $("#addForm")[0].classList.remove("was-validated");
    $("#addModal .modal-title").text("Add Resource");
    $("#addModal").modal("show");
  })

  /**
  * Add method
  */
  $('#add-confirm').on('click', function () {

    let flag = isValid("#addForm");
    if (flag === false) {
      $("#addForm")[0].checkValidity();
      $("#addForm")[0].classList.add("was-validated");
      return;
    }
    $("#add-confirm").prop("disabled", true);
    $("#loader").show();

    let _data = getData("#addForm");

    $.post(_apiBase, _data, function (res) {
      $('#addModal').modal('hide');
      if (res && !res.errors) {
        if (res.data.addResource.success) {
          notify('Record Added', "success");
          let ele = $("#main-table");
          let _res = res.data.addResource.result;
          $.get("/templates/resource_item.html", function (template) {
            $.tmpl(template, _res).prependTo(ele);
            _CMSpagination.reset();
          })
        } else {
          notify(res.data.addResource.message, "error");
        }
      } else {
        notify(res.errors[0].message, "error");
      }
      $('#add-confirm').prop('disabled', false);
      $('#loader').hide();
    })
  })

  /**
  * Opens confirmation popup for delete 
  */
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
          } else {
            notify(res.errors[0].message, "error");
          }
          callback();
        })
        break;
    }
  }

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
  * Delete all method 
  */
  $("#deleteAll").click(() => {
    let cbs = $('.delete-check:checkbox:checked');//$.find("#roleList tr input[name='cbRow']");
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
      $("#deleteDialog .modal-title").html("Delete Resource(s)");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Resource(s) not selected", "warning");
    }
  });

  /**
  * initial page loader method
  */
  function _getPageData() {
    $('#loader').show();
    let ele = $("#main-table");
    $.get(_apiBase + "/list", {}, function (result) {
      // console.log(result)
      //   let resourceMenu = $("#resourceMenu");
      //   resourceMenu.empty();
      //   resourceMenu.append($("<option></option>")
      //     .attr({ value: "" }).text('--Select--'));
      // if (result.menu != null) {
      //   result.menu.sort(function (a, b) {
      //     var textA = a.name ? a.name.toUpperCase() : null
      //     var textB = b.name ? b.name.toUpperCase() : null
      //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      //   });
      //   $.each(result.menu, function (key, value) {
      //     resourceMenu.append($("<option></option>")
      //       .attr({ value: value.id }).text(value.name));
      //   });
      // }
      result.data = result ? result : [];
      // console.log(result) 
      if (result.data && result.data.length) {
        result.data.sort((a, b) => a.name.localeCompare(b.name))
        $.get("/templates/resource_item.html", function (template) {
          $.each(result.data, function (index, item) {
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
                notify("Resource(s) not selected", "warning");
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

  /**
  * Deletes single record
  */
  async function singleDelete(id) {
    $('#loader').show();
    removeRow(id, () => {
      $('#loader').hide();
      $("#deleteDialog").modal("hide");
      $("#bdelete").prop("disabled", false);
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
        notify("Resource(s) deleted successfully", "success");
      } else {
        notify("Unable to delete Resource(s)", "warning");
      }
      $("#loader").hide();
    }
    $("#deleteDialog").modal("hide");
    $("#bdelete").prop("disabled", false);
  }

  /**
  * Rsource type helper
  */
  $('#resourceType').on('change', function () {
    $('#resourceMenu, #resourceMethod').removeAttr('required');
    $('#resourceMenuSection, #resourceMethodSection').hide();
    if ($(this).val() == 'MENU') {
      $('#resourceMenuSection').show()
      $('#resourceMenu').attr('required', 'required')
    }
    if ($(this).val() == 'API') {
      $('#resourceMethodSection').show()
      $('#resourceMethod').attr('required', 'required')
    }
  })

});