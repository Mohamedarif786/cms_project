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
        placeholder: "Choose " + $(this).data("name"),
        dropdownParent: $(this).parent(),
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
   * Page forms
   */
  var _addForm = $("#addForm")[0];
  var _editForm = $("#editForm")[0];

  /**
   * pagination Object
   */
  let _CMSpagination;

  /**
   * Opens add popup
   */
  $("#add-resource").on("click", function () {
    $("#addModal").modal("show");
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
      policyid: $("#policyid").val(),
      type: $("#type").val(),
      roleid: $("#roleid").val(),
      userid: $("#userid").val(),
    };

    $.post(_apiBase, _data, function (res) {
      $("#addModal").modal("hide");
      if (res && !res.errors) {
        if (res.data.grant.success == true) {
          notify("Record Added", "success");
          _getPageData();
        } else {
          notify(res.data.grant.message, "error");
        }
      } else {
        notify(res.errors[0].message, "error");
      }
      $("#add-confirm").prop("disabled", false);
      _addForm.reset();
      $("#loader").hide();
    });
  });

  /**
   * Opens confirmation popup for delete
   */
  $(document).on("click", ".delete-resource", function () {
    let id = $(this).data("id");
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#deleteDialog .modal-title").html("Revoke Policy Access");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      singleDelete(id);
    });
    $("#deleteDialog").modal("show");
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
   * Opens edit popup
   */
  $(document).on("click", ".edit-resource", function () {
    _editForm.reset();
    $("#loader").show();
    let id = $(this).data("id");
    $.get(_apiBase + "/" + id, {}, function (res) {
      $("#loader").hide();
      if (res && !res.errors) {
        let _res = res.data.policy;
        $("#resourceNameEdit").val(_res.name);
        //$('#resourceStatusEdit').prop('checked', _res.status == 'ACTIVE' ? true : false);
        if (_res.resources != null) {
          $("#policyResourceEdit").val(_res.resources);
        }
        $("#editModal").modal("show");
        $("#edit-confirm").data("id", _res.id); // referene for edit use
      }
    });
  });

  /**
   * Edit method
   */
  $("#edit-confirm").on("click", function () {
    $("#loader").show();
    $("#edit-confirm").prop("disabled", true);
    if (!_editForm.reportValidity()) {
      _editForm.reportValidity();
      $("#loader").hide();
      $("#edit-confirm").prop("disabled", false);
      return;
    }
    let id = $(this).data("id");
    let _data = {
      policyid: id,
      name: $("#resourceNameEdit").val(),
      //"status": $('#resourceStatusEdit').is(":checked") ? "ACTIVE" : 'INACTIVE',
      resources: $("#policyResourceEdit").val(),
    };

    $.post(_apiBase + "/update", _data, function (res) {
      $("#editModal").modal("hide");
      if (res && !res.errors) {
        notify("Record Updated", "success");
        let _res = res.data.updatepolicy.result;
        let _resource = [];
        if (_res.resources != null) {
          _dataResource.forEach(function (res) {
            let _d = _res.resources.includes(res.id) == true ? res.name : "";
            if (_d != "") _resource.push(_d);
          });
        }
        _res.resources = _resource.join(", ");
        let ele = $("#main-table");
        $.get("/templates/policy_item.html", function (template) {
          $("#row" + id).remove();
          $.tmpl(template, _res).prependTo(ele);
          _CMSpagination.reset();
        });
      } else {
        notify(res?.errors[0]?.message, "error");
      }
      $("#edit-confirm").prop("disabled", false);
      _editForm.reset();
      $("#loader").hide();
    });
  });

  /**
   * add type
   */
  $("#type").change(function () {
    console.log("type: ", $(this).val());
    $("#roleid, #userid").removeAttr("required");
    $("#useridarea, #roleidarea").hide();
    if ($(this).val() == "USER") {
      $("#useridarea").show();
      $("#userid").attr("required", "required");
    }
    if ($(this).val() == "ROLE") {
      $("#roleidarea").show();
      $("#roleid").attr("required", "required");
    }
  });
  $("#typeResource").on("click", function () {});

  /**
   * Status change method
   */
  $(document).on("click", ".status-resource", function (e) {
    e.preventDefault();
    let ele = this;
    let id = $(this).data("id");
    let state = $(this).is(":checked")
      ? {
          element: "activeDialog",
          button: "bactive",
          status: "ACTIVE",
          title: "Active Policy(s)",
          checked: true,
        }
      : {
          element: "inactiveDialog",
          button: "binactive",
          status: "INACTIVE",
          title: "InActive Policy(s)",
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
        //"status": $(this).is(":checked") ? "ACTIVE" : 'INACTIVE',
      };
      $.post(_apiBase + "/status", _data, function (res) {
        if (res && !res.errors) {
          let msg =
            state.status == "ACTIVE"
              ? "Policy activated successfully"
              : "Policy deactivated successfully";
          notify(msg, "success");
          $(ele).prop("checked", state.checked);
        } else {
          notify(res.errors[0].message, "error");
        }
        $("#" + state.element).modal("hide");
        $("#loader").hide();
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
        bulkInactive();
      });
      $("#inactiveDialog").modal("show");
    } else {
      notify("Policy(s) not selected", "warning");
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
          `<li data-id="${$(this).data("id")}">${$(this).data("name")}</li>`
        );
      }
    });
    if (idx > 0) {
      $("#deleteDialog .modal-title").html("Revoke Policy Access");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").html("Revoke");
      $("#deleteDialog #bdelete").click(() => {
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Policy(s) not selected", "warning");
    }
  });

  /**
   * initial page loader method
   */
  function _getPageData() {
    $("#loader").show();
    let ele = $("#main-table");
    $(ele).find("tbody tr").remove();
    $.get(_apiBase + "/list", {}, function (result) {
      //console.log(result);

      let policyResource = $("#policyid");
      policyResource.empty();
      policyResource.append(
        $("<option></option>").attr({ value: "" }).text("Choose Policy")
      );
      if (result.dataMasterPolicy != null) {
        result.dataMasterPolicy.sort(function (a, b) {
          var textA = a.name ? a.name.toUpperCase() : null;
          var textB = b.name ? b.name.toUpperCase() : null;
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        $.each(result.dataMasterPolicy, function (key, value) {
          policyResource.append(
            $("<option></option>").attr({ value: value.id }).text(value.name)
          );
        });
      }

      $("#roleid").empty();
      $("#roleid").append(
        $("<option></option>").attr({ value: "" }).text("Choose Role")
      );
      if (result.dataMasterRole != null) {
        result.dataMasterRole.sort(function (a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        $.each(result.dataMasterRole, function (key, value) {
          $("#roleid").append(
            $("<option></option>").attr({ value: value.id }).text(value.name)
          );
        });
      }

      $("#userid").empty();
      $("#userid").append(
        $("<option></option>").attr({ value: "" }).text("Choose User")
      );
      if (result.dataUsers != null) {
        result.dataUsers.sort(function (a, b) {
          var textA = a.email.toUpperCase();
          var textB = b.email.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        $.each(result.dataUsers, function (key, value) {
          $("#userid").append(
            $("<option></option>").attr({ value: value.id }).text(value.email)
          );
        });
      }

      if (result.data) {
        $.get("/templates/policyowners_item.html", function (template) {
          $.each(result.data, function (index, item) {
            result.dataMasterPolicy.forEach(function (_res) {
              if (item.policyid == _res.id) {
                item.policyname = _res.name;
              }
            });
            result.dataUsers.forEach(function (_res) {
              if (item.userid == _res.id) {
                item.email = _res.email;
              }
            });
            $.tmpl(template, item).appendTo(ele);
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
                notify("Policy(s) not selected", "warning");
              }
            },
          });
        });
      } else {
        ele.html("<p>No content found</p>");
      }
      $("#loader").hide();
    });
  }
  _getPageData();

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
        notify("Policy access revoked", "success");
      } else {
        notify("Unable to revok Policy", "warning");
      }
      $("#loader").hide();
    }
    $("#deleteDialog").modal("hide");
  }

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
        notify("Policy(s) activated successfully", "success");
      } else {
        notify("Unable to activate policy(s)", "error");
      }
      $("#loader").hide();
    } else {
      // when no action is required
      $("#loader").hide();
      notify("Policy(s) activated successfully", "success");
    }
    $("#activeDialog").modal("hide");
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
        notify("Policy(s) deactivated successfully", "success");
      } else {
        notify("Unable to deactivate policy(s)", "error");
      }
      $("#loader").hide();
    } else {
      // when no action is required
      $("#loader").hide();
      notify("Policy(s) deactivated successfully", "success");
    }
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
