//toDo move to CDN structure / minify
document.addEventListener("focusin", (e) => {
  if (
    e.target.closest(
      ".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root"
    ) !== null
  ) {
    e.stopImmediatePropagation();
  }
});
/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
$(document).ready(function () {
  
  $("#addNewTemplate").click(function () {
    clear_form("#addModal #addForm");
    $("#id").val("");
    $("#addModal .modal-title").text("New Template");
    $("#addModal").modal("show");
  });

  $(document).on("click", ".editRow", function () {
    let id = $(this).data("id");
    $("#loader").show();
    $("#id").val(id);

    $.post("/template/get", { id: id }, (result) => {
      if (result.data.template.success) {
        let template = result.data.template.result;
        $("#subject").val(template.subject);
        $("#clubid").val(template.clubid);
        $("#language").val(template.language);
        $("#type").val(template.type);
        $("#subtype").val(template.subtype);
        tinymce.get("mail_content").setContent(window.atob(template.content));
        $("#loader").hide();
        load_module_list(template.clubid, template.moduleid);
        $("#addModal .modal-title").text("Update Template");
        $("#addModal").modal("show");
      } else {
        notify(result.data.template.success.message, "error");
        $("#loader").hide();
      }
    });
  });

  $(document).on("click", ".deleteRow", function () {
    let id = $(this).data("id");
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("subject")}</li>`);
    $("#deleteDialog .modal-title").html("Delete Module");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      $("#deleteDialog #bdelete").prop("disabled", true);
      singleDelete(id);
    });
    $("#deleteDialog").modal("show");
  });
  /**
   * Opens add modal
   */
  

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

  tinymce.init({
    //paste_as_text: true,
    selector: "#mail_content",
    plugins: ["code"],
    height: "50vh",
  });

  function load_module_list(clubId, moduleId) {
    $("#loader").show();
    $.post(_apiBase + "/modules", { clubid: clubId }, function (result) {
      if (result.data && result.data.modules) {
        let list = result.data.modules.result;
        $("#moduleid").empty();
        $("#moduleid").append(new Option("Choose Module", 0, false));
        $(list).each((idx, item) => {
          $("#moduleid").append(new Option(item.name, item.id, false));
        });
        $("#moduleid").val(moduleId);
      }
      $("#loader").hide();
    });
  }
  /**
   * Opens add popup
   */
  $("#clubid").on("change", function () {
    let clubId = $(this).val();
    load_module_list(clubId);
  });

  /**
   * Add method
   */
  $("#add-confirm").on("click", function () {
    $("#loader").show();
    $("#add-confirm").prop("disabled", true);
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      $("#loader").hide();
      $("#add-confirm").prop("disabled", false);
      return;
    }

    let _data = {
      subject: $("#subject").val(),
      type: $("#type").val(),
      subtype: $("#subtype").val(),
      language: $("#language").val(),
      content: tinymce.get("mail_content").getContent(),
    };
    if ($("#clubid").val().trim().length > 0) {
      _data["clubid"] = parseInt($("#clubid").val());
    }
    if ($("#moduleid").val().trim().length > 0) {
      _data["moduleid"] = parseInt($("#moduleid").val());
    }
    if ($("#id").val() == "") {
      $.post(_apiBase + "/add", _data, function (res) {
        $("#addModal").modal("hide");
        // console.log('res', res);
        if (res.data.addTemplate.success) {
          notify(res.data.addTemplate.message, "success");
          _getPageData();
        } else {
          notify(res.data.addTemplate.message, "error");
        }
        $("#add-confirm").prop("disabled", false);
        _addForm.reset();
        $("#loader").hide();
      });
    } else {
      _data.id = parseInt($("#id").val());
      $.post(_apiBase + "/update", _data, function (res) {
        $("#addModal").modal("hide");
        console.log(res);
        // console.log('res', res);
        if (res.data && res.data.updateTemplate) {
          notify(res.data.updateTemplate.message, "success");
          if (res.data.updateTemplate.success) {
            _getPageData();
          }
        } else {
          notify(res.data.updateTemplate.message, "error");
        }
        $("#add-confirm").prop("disabled", false);
        _addForm.reset();
        $("#loader").hide();
      });
    }
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
          `<li data-id="${$(this).data("id")}">${$(this).data("subject")}</li>`
        );
      }
    });
    if (idx > 0) {
      $("#deleteDialog .modal-title").html("Delete Template(s)");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#deleteDialog #bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Template(s) not selected", "warning");
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
        notify("Template(s) deleted successfully", "success");
      } else {
        notify("Unable to delete Template(s)", "warning");
      }
      $("#loader").hide();
    }
    $("#deleteDialog").modal("hide");
    $("#deleteDialog #bdelete").prop("disabled", false);
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

  /**
   * initial page loader method
   */

  _getPageData();
});

function _getPageData() {
  $("#loader").show();
  $("#table-body").empty();
  $.get(_apiBase + "/list", {}, function (result) {
    // console.log(result, result.length)
    if (result != null) {
      if (result.length !== undefined) {
        $.get("/templates/template_item.html", function (template) {
          $.each(result, function (index, item) {
            $.tmpl(template, item).appendTo("#table-body");
          });
          //pagination
          _CMSpagination = new Pager({
            divId: "fPage",
            tableId: "main-table",
            noContentMsg: "No Content found",
            filter: true,
            deleteAll: function (e) {
              if ($(".delete-check:checkbox:checked").length > 0) {
                $("#deleteModal").modal("show");
                $("#delete-confirm").data("id", "all"); // id referene for delete use
              } else {
                notify("No record selected for delete", "warning");
              }
            },
          });
        });
      } else {
        $("#table-body").html('<tr><th colspan="6">No data found</th></tr>');
      }
    } else {
      $("#table-body").html('<tr><th colspan="6">No data found</th></tr>');
    }
    $("#loader").hide();
  });
}
