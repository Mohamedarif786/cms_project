//toDo move to CDN structure / minify

/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
$(document).ready(function () {
  fill_club_list("#clubid");

  $("#addNewMenu").click(function () {
    clear_form("#newDialog #form");
    $("#newDialog #id").val("");
    $("#newDialog").modal("show");
  });

  $("#confirm").on("click", function () {
    try {
      let flag = isValid("#form");
      if (flag === false) {
        $("#form")[0].checkValidity();
        $("#form")[0].classList.add("was-validated");
        return;
      }

      $("#confirm").prop("disabled", true);
      $("#loader").show();
      let id = $("#newDialog #id").val();
      let input = getData("#newDialog #form");
      console.log(input);
      let url = `${_apiBase}/add`;
      if (id !== "") {
        url = `${_apiBase}/update`;
        input.id = id;
      } else {
        delete input["id"];
      }
      console.log("url:", url);
      $.post(url, input, function (result) {
        $("#loader").hide();
        $("#newDialog").modal("hide");

        if (result.data) {
          if (result.data.addMenu) {
            if (result.data.addMenu.success) {
              notify(result.data.addMenu.message, "success");
              _getPageData();
            } else {
              notify(res.data.addMenu.message, "error");
            }
          } else if (result.data.updateMenu) {
            if (result.data.updateMenu.success) {
              notify(result.data.updateMenu.message, "success");
              _getPageData();
            } else {
              notify(res.data.updateMenu.message, "error");
            }
          }
        } else {
          notify("Unable to perform operation", "error");
        }

        $("#confirm").prop("disabled", false);
      });
    } catch (e) {
      console.log(e);
    }
  });

  $(document).on("click", ".deleteRow", function () {
    let id = $(this).data("id");
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#deleteDialog .modal-title").html("Delete Menu");
    $("#deleteDialog #bdelete").off("click");
    $.get("resource/list", {}, function (result) {
      $('#loader').show();
        if (result.data && result.data.length) {
     const isResourceExist = result.data.filter((val)=>{
            return val.id ===parseInt(id)
         })
         if(isResourceExist.length){
          $("#deleteCheckDialog .modal-title").html("Menu is used on Resource");
          $("#dc-message").html("<p>Delete following on Languages </p>");
          $("#deleteCheckDialog").modal("show");

          var html_text = '';
          isResourceExist.forEach(function(item) {
            html_text += "<li>"+item.name+"</li>";
          });

          $("#dc-list").html(html_text);
         }
        } else{
          $("#deleteDialog #bdelete").click(() => {
            $("#deleteDialog #bdelete").prop("disable");
            singleDelete(id);
          });
          $("#deleteDialog").modal("show");
        }
        $('#loader').hide();
      });
  

  });

  $(document).on("click", ".editRow", function () {
    $("#loader").show();
    let id = $(this).data("id");
    $("#newDialog #id").val(id);
    $.get(_apiBase + "/get/" + id, {}, function (result) {
      if (result.data && result.data.menu.success) {
        let menu = result.data.menu.result;
        fillData("#newDialog #form", menu);
      }
      $("#loader").hide();
      $("#newDialog").modal("show");
    });
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
   * pagination Object
   */
  let _CMSpagination;

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
            notify(res?.errors[0]?.message, "error");
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
    });
    $("#deleteDialog #bdelete").prop("disable", false);
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
        notify("Menu(s) deleted successfully", "success");
      } else {
        notify("Unable to delete menu(s)", "warning");
      }
      $("#loader").hide();
    }
    $("#deleteDialog").modal("hide");
    $("#deleteDialog #bdelete").prop("disable", false);
  }

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
        $("#deleteDialog #bdelete").prop("disable", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Menu(s) not selected", "warning");
    }
  });

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
   * Status change method
   */
  $(document).on("click", ".statusRow", function (e) {
    e.preventDefault();
    let ele = this;
    let id = $(this).data("id");
    let state = $(this).is(":checked")
      ? {
          element: "activeDialog",
          button: "bactive",
          status: "ACTIVE",
          title: "Active Menu(s)",
          checked: true,
        }
      : {
          element: "inactiveDialog",
          button: "binactive",
          status: "INACTIVE",
          title: "InActive Menu(s)",
          checked: false,
        };
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#" + state.element + " #list").empty();
    $("#" + state.element + " #list").append(
      `<li data-id="${$(this).data("id")}">${$(this).data("name")}</li>`
    );
    $("#" + state.element + " .modal-title").html(state.title);
    $("#" + state.button).off("click");
    $("#" + state.button).click(() => {
      $("#loader").show();
      let _data = {
        id: id,
        status: state.status,
      };
      $.post(_apiBase + "/status", _data, function (res) {
        if (res && !res.errors) {
          let msg =
            state.status == "ACTIVE"
              ? "Menu activated successfully"
              : "Menu deactivated successfully";
          notify(msg, "success");
          $(ele).prop("checked", state.checked);
        } else {
          notify(res?.errors[0]?.message, "error");
        }
        $("#" + state.element).modal("hide");
        $("#loader").hide();
        _getPageData();
      });
    });
    $("#" + state.element).modal("show");
  });

  /**
   * Bulk Active method
   */
  $("#ActiveRole").click(function () {
    let cbs = $(".delete-check:checkbox:checked"); //$.find("#roleList tr input[name='cbRow']");
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
      $("#activeDialog .modal-title").html("Active Policy(s)");
      $("#activeDialog #bactive").click(() => {
        $("#activeDialog #bactive").prop("disabled", true);
        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Policy(s) not selected", "warning");
    }
  });

  /**
   * Bulk InActive method
   */
  $("#InactiveRole").click(function () {
    let cbs = $(".delete-check:checkbox:checked"); //$.find("#roleList tr input[name='cbRow']");
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
      $("#inactiveDialog .modal-title").html("Inactive Policy(s)");
      $("#inactiveDialog #binactive").click(() => {
        $("#inactiveDialog #binactive").prop("disabled", true);
        bulkInactive();
      });
      $("#inactiveDialog").modal("show");
    } else {
      notify("Policy(s) not selected", "warning");
    }
  });

  /**
   * initial page loader method
   */
  function _getPageData() {
    let ele = $("#main-table");
    $("#loader").show();
    $.get(_apiBase + "/list", {}, function (result) {
      $("#loader").hide();
      result.dataClubs.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      $("#tableBody").empty();
      if (result.data != null && result.data.length) {
        $.get("/templates/menu_item.html", function (template) {
          $.each(result.data, function (index, item) {
            $.tmpl(template, item).appendTo("#tableBody");
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
        ele.html("<p>No content found</p>");
      }
    });
  }
  _getPageData();

  /**
   * Bulk Activation method helper
   */
  async function bulkActive() {
    $("#loader").show();
    let cbs = $(".delete-check:checkbox:checked");
    let ids = [];
    $(cbs).each(function () {
      if (
        this.checked &&
        !$($(this).parent().parent().find(".status-resource")).is(":checked")
      ) {
        let id = parseInt($(this).data("id"));
        ids.push({
          id: id,
          ele: $($(this).parent().parent().find(".status-resource")),
        });
      }
    });
    if (ids.length) {
      let dids = await Promise.all(
        ids.map(async (id) => {
          return await statusRow(id.id, "ACTIVE", id.ele);
        })
      );
      //filters failed response
      dids = dids.filter(function (element) {
        return element !== undefined;
      });
      if (ids.length - dids.length === 0) {
        notify("Menu(s) activated successfully", "success");
      } else {
        notify("Unable to activate Menu(s)", "error");
      }
      $("#loader").hide();
    } else {
      // when no action is required
      $("#loader").hide();
      notify("Menu(s) activated successfully", "success");
    }
    $("#activeDialog").modal("hide");
    $("#activeDialog #bactive").prop("disabled", false);
  }

  /**
   * Bulk In activation method helper
   */
  async function bulkInactive() {
    $("#loader").show();
    let cbs = $(".delete-check:checkbox:checked");
    let ids = [];
    $(cbs).each(function () {
      if (
        this.checked &&
        $($(this).parent().parent().find(".status-resource")).is(":checked")
      ) {
        let id = parseInt($(this).data("id"));
        ids.push({
          id: id,
          ele: $($(this).parent().parent().find(".status-resource")),
        });
      }
    });
    if (ids.length) {
      let dids = await Promise.all(
        ids.map(async (id) => {
          return await statusRow(id.id, "INACTIVE", id.ele);
        })
      );
      //filters failed response
      dids = dids.filter(function (element) {
        return element !== undefined;
      });
      if (ids.length - dids.length === 0) {
        notify("Menu(s) deactivated successfully", "success");
      } else {
        notify("Unable to deactivate Menu(s)", "error");
      }
      $("#loader").hide();
    } else {
      // when no action is required
      $("#loader").hide();
      notify("Menu(s) deactivated successfully", "success");
    }
    $("#inactiveDialog #binactive").prop("disabled", false);
    $("#inactiveDialog").modal("hide");
  }

  /**
   * status method helper for activation and deactivation of status
   */
  async function statusRow(id, status, ele) {
    const response = await fetch(_apiBase + "/status/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        status: status,
      }),
    });
    let result = await response.json();
    if (result && !result.errors) {
      $(ele).prop("checked", status == "INACTIVE" ? false : true);
      return id;
    }
  }
});
