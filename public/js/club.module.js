//toDo move to CDN structure / minify

/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
$(document).ready(function () {
  $(".select2").each(function () {
    $(this)
      .wrap('<div class="position-relative"></div>')
      .select2({
        dropdownParent: $(this).parent(),
      });
  });
  fill_club_list("#clubs");
  $(document).on("click", ".editRow", function () {
    let id = $(this).data("id");
    $("#loader").show();
    $.get("/club/module/" + id, function (result) {
      // console.log(result);
      $("#addModal #id").val(result.id);
      $("#addModal #type").val(result.moduleid);
      $("#addModal #language").val(result.language).trigger("change");;
      $("#addModal #tier").val(result.tierid);
      $("#addModal #name").val(result.name);
      $("#addModal #booking_mode").val(result.booking_mode);
      $("#addModal #inventory_mode").val(result.inventory_mode);
      $("#addModal #payment").val(result.payment);
      $("#loader").hide();
    });

    $("#addModal .modal-title").text("Update Module");
    $("#addModal").modal("show");
  });
  /**
   * Form helper, it extends form validation and allows custom messages
   */
  $("input, textarea, select").each(function (i, o) {
    if ($(o).attr("custom_validation")) {
      o.addEventListener("invalid", function (event) {
        if (
          event.target.validity.valueMissing &&
          $(event.target).attr("custom_validation")
        ) {
          event.target.setCustomValidity(
            $(event.target).attr("custom_validation_msg")
          );
        }
      });
      o.addEventListener("change", function (event) {
        event.target.setCustomValidity("");
      });
    }
  });

  /**
   * Page forms
   */
  var _addForm = document.getElementById("addForm");

  /**
   * Opens add popup
   */
  $("#add-resource").on("click", function () {
    _addForm.reset();
    clear_form("#addModal #addForm");
    $("#addModal .modal-title").text("New Module");
    $("#addModal #id").val("");
    $("#addModal").modal("show");
  });

  /**
   * Add method
   */
  $("#add-confirm").on("click", function () {
   
    let id = $("#addModal #id").val();
    // console.log(id);
    let input = {
      clubid: _clubId,
      tierid: $("#tier").val(),
      moduleid: $("#type").val(),
      name: $("#name").val(),
      type: $("#type option:selected").text(),
      language: $("#language").val(),
      booking_mode: $("#booking_mode").val(),
      inventory_mode: $("#inventory_mode").val(),
      payment: $("#payment").val(),
    };
    let url = "/club/module/add";
    if (id.trim().length > 0) {
      input.id = id;
      url = "/club/module/update";
      $("#add-confirm").prop("disabled", true);
      if (!_addForm.reportValidity()) {
        _addForm.reportValidity();
        $("#loader").hide();
        $("#add-confirm").prop("disabled", false);
        return;
      }
    }
    //return;
    $("#loader").show();
    $.post(url, input, function (result) {
      // console.log(result);
      $("#loader").hide();
      if (result.data !== undefined) {
        if (result.data.addModule !== undefined) {
          if (result.data.addModule.success) {
            notify(result.data.addModule.message, "success");
          } else {
            notify(result.data.addModule.message, "error");
          }
        } else if (result.data.updateModule !== undefined) {
          if (result.data.updateModule.success) {
            notify(result.data.updateModule.message, "success");
          } else {
            notify(result.data.updateModule.message, "error");
          }
        }
      }
      $("#addModal").modal("hide");
      $("#add-confirm").prop("disabled", false);
      renderPages(_clubId);
      _addForm.reset();
     
    });
  });

  /**
   * Opens confirmation popup for delete
   */
  $(document).on("click", ".delete-resource", function () {
    let id = $(this).data("id");
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#deleteDialog .modal-title").html("Delete Module");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      $("#deleteDialog #bdelete").prop("disabled", true);
      singleDelete(id);
    });
    $("#deleteDialog").modal("show");
  });

  /**
   * Delete all method
   */
  $("#deleteAll").click(() => {
    let cbs = $(".delete-check:checkbox:checked");
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
      case "all":
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
          $("#row" + id).remove();
          _CMSpagination.reset();
          return id;
        }
        break;
      default:
        $.post(_apiBase + "/delete/" + id, {}, function (res) {
          if (res && !res.errors) {
            $("#row" + id).remove();
            _CMSpagination.reset();
            notify("Record Deleted", "success");
          } else {
            notify(res.errors[0].message, "error");
          }
          callback();
        });
        break;
    }
  }

  /**
   * Deletes single record
   */
  async function singleDelete(id) {
    $("#loader").show();
    removeRow(id, () => {
      $("#loader").hide();
      $("#deleteDialog").modal("hide");
      $("#deleteDialog #bdelete").prop("disabled", false);
    });
  }

  /**
   * Deletes multiple records
   */
  async function bulkDelete() {
    $("#loader").show();
    let cbs = $(".delete-check:checkbox:checked"); //$.find("#roleList tr input[name='cbRow']");
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
          return await removeRow(id, "all");
        })
      );
      //filters failed response
      dids = dids.filter(function (element) {
        return element !== undefined;
      });

      if (ids.length - dids.length === 0) {
        notify("Module(s) deleted successfully", "success");
      } else {
        notify("Unable to delete Module(s)", "warning");
      }
      $("#loader").hide();      
      $("#deleteDialog #bdelete").prop("disabled", false);
    }
    $("#deleteDialog").modal("hide");
  }

  /**
   * Delete method
   */
  $("#delete-confirm").on("click", function () {
    let id = $(this).data("id");
    if (id != "all") {
      $("#loader").show();
      $("#delete-confirm").prop("disabled", true);
      removeRow(id, () => {
        $("#deleteModal").modal("hide");
        $("#delete-confirm").prop("disabled", false);
        $("#loader").hide();
      });
    } else {
      $("#deleteModal").modal("hide");
      if ($(".delete-check:checkbox:checked").length > 0) {
        $.each($(".delete-check:checkbox:checked"), function (index, item) {
          let id = $(item).data("id");
          $("#loader").show();
          removeRow(id, () => {
            $("#loader").hide();
          });
        });
      }
    }
  });

  let _clubId;
  /**
   * clubs filter
   */
  $("#clubs").on("change", function () {
    _clubId = $(this).val();
    renderPages(_clubId);
  });

  /**
   * clubs filter
   */
  $("#moduleType").on("change", function () {
    if ($(this).val() != "") {
      let data = $("#moduleType option:selected").text();
      $("#moduleName").focus().val(data);
    }
  });

  /**
   * pages render helper
   */
  function renderPages(_clubId) {
    let ele = $("#main-table");
    $(ele).find("tbody tr").remove();
    $("#loader").show();
    $.get(_apiBase + "/list" + "/" + _clubId, {}, function (result) {
      // console.log(result);
      $("#type").empty();
      $("#type").append(
        $("<option></option>").attr({ value: "" }).text("Choose Type")
      );
      $.each(result.modules, function (key, value) {
        $("#type").append(
          $("<option></option>").attr({ value: value.id }).text(value.name)
        );
      });

      $("#language").empty();
      $("#language").append(
        $("<option></option>").attr({ value: "" }).text("Choose Language")
      );
      $.each(result.languages, function (key, value) {
        $("#language").append(
          $("<option></option>").attr({ value: value.code }).text(value.name)
        );
      });

      $("#tier").empty();
      $("#tier").append(
        $("<option></option>").attr({ value: "" }).text("Choose Tier")
      );
      $.each(result.tiers, function (key, value) {
        $("#tier").append(
          $("<option></option>").attr({ value: value.id }).text(value.name)
        );
      });

      $(".pageDataNoContent").remove();
      $(ele).find("thead").show();
      try {
        if (result.data != null) {
          $.get("/templates/club_module_item.html", function (template) {
            $.each(result.data, function (index, item) {
              $.tmpl(template, item).appendTo(ele);
            });
            //pagination
            _CMSpagination = new Pager({
              divId: "fPage",
              tableId: "main-table",
              noContentMsg: "No Content found",
              filter: true,
              //perPage: 'all',
              deleteAll: function (e) {
                if ($(".delete-check:checkbox:checked").length > 0) {
                  $("#deleteModal").modal("show");
                  $("#delete-confirm").data("id", "all"); // id referene for delete use
                } else {
                  notify("Resource(s) not selected", "warning");
                }
              },
            });
          });
        } else {
          $(ele).find("thead").hide();
          $(ele).find("tbody tr").remove();
          ele.append(
            '<tr colspan=2 class="pageDataNoContent"><td>No content found</td>'
          );
          $("#fPageStats").hide();
        }
      } catch (error) {}
      $("#moduleRows").show();
      $("#loader").hide();
    });
  }
});
