//toDo move to CDN structure / minify

/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
$(document).ready(function () {
  let _addForm = $("#addForm")[0];
  let _editForm = $("#editForm")[0];
  let _CMSpagination;
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
   * Opens add popup
   */
  $("#addNewPolicy").on("click", function () {
    clear_form("#addModal #addForm");
    let children = $("#addModal .add_area").find(":input");
    $(children).each(function () {
      $(this).prop("checked", false);
    });
    $("#addModal #addForm .invalid-feedback").hide();
    $("#addModal").modal("show");
  });

  /**
   * Add method
   */
  $("#add-confirm").on("click", function () {
    $("#add-confirm").prop("disabled", true);
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      $("#loader").hide();

      return;
    }
    let resources = [];
    let children = $("#addModal .add_area").find(":input");
    $(children).each(function () {
      if ($(this).prop("checked")) {
        resources.push($(this).data("id"));
      }
    });

    $("#addModal #addForm .invalid-feedback").hide();
    if (resources.length <= 0) {
      $("#addModal #addForm .invalid-feedback").show();
      $("#add-confirm").prop("disabled", false);
      return;
    }
    let _data = {
      name: $("#name").val(),
      resource: resources,
    };

    $.post(_apiBase + "/add", _data, function (res) {
      $("#addModal").modal("hide");
      if (res && !res.errors) {
        if (res.data.addPolicy.success == true) {
          notify("Record Added", "success");
          let _res = res.data.addPolicy.result;
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
            $.tmpl(template, _res).prependTo(ele);
            _CMSpagination.reset();
          });
        } else {
          notify(res.data.addPolicy.message, "error");
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
  $(document).on("click", ".deleteRow", function () {
    let id = $(this).data("id");
    let del_name = $(this).data("name");

    $('#loader').show();
    $.get("/policy-owners/list", {}, function (result) {

      $('#loader').hide();
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, 'error')
        }
      } else {

        let can_delete = 1;
        // console.log(result.dataMasterPolicy);
        if (result?.dataMasterPolicy?.length) {
          let isPolicyExist = result.dataMasterPolicy.filter((val) => {
            return val.id == parseInt(id)
          })
          if (isPolicyExist && isPolicyExist.length) {
            can_delete = 0;
          }
        }
        if (can_delete != 0) {
          $("#list").empty();
          $("#list").append(`<li data-id="${id}">${del_name}</li>`);
          $("#deleteDialog .modal-title").html("Delete Policy");
          $("#deleteDialog #bdelete").off("click");
          $("#deleteDialog #bdelete").click(() => {
            singleDelete(id);
          });
          $("#deleteDialog").modal("show");
        } else {
          $("#deleteCheckDialog .modal-title").html("Policies is used on Policy Owners");
          $("#dc-message").html("<p>Delete following on Policy Owners</p>");
          $("#deleteCheckDialog").modal("show");

          var html_text = '';
          isSupplierExist.forEach(function (item) {
            html_text += "<li>" + item.name + "</li>";
          });

          $("#dc-list").html(html_text);
        }
      }
    });
  });

  /**
   * Opens edit popup
   */
  $(document).on("click", ".editRow", function () {
    _editForm.reset();
    $("#loader").show();
    let id = $(this).data("id");
    $.get(_apiBase + "/get/" + id, {}, function (result) {
      $("#loader").hide();
      if (result.data && result.data.policy) {
        if (result.data.policy.success) {
          let policy = result.data.policy.result;
          $("#editName").val(policy.name);
          if (policy.resources != null) {
            let children = $("#editModal .edit_area").find(":input");
            $(children).each(function () {
              id = $(this).data("id");
              if (policy.resources.includes(id)) {
                $(this).prop("checked", true);
              }
            });
          }
          $("#editModal .invalid-feedback").hide();
          $("#editModal").modal("show");
          $("#edit-confirm").prop("disabled", false);
          $("#policyId").val(policy.id); // referene for edit use
        }
      }
    });
  });

  /**
   * Edit method
   */
  $("#edit-confirm").on("click", function () {
    $("#edit-confirm").prop("disabled", true);
    if (!_editForm.reportValidity()) {
      _editForm.reportValidity();
      $("#loader").hide();
      $("#edit-confirm").prop("disabled", false);
      return;
    }
    let id = $(this).data("id");
    let resources = [];
    let children = $("#editModal .edit_area").find(":input");
    $(children).each(function () {
      if ($(this).prop("checked")) {
        resources.push($(this).data("id"));
      }
    });

    $("#editModal .invalid-feedback").hide();

    if (resources.length <= 0) {
      $("#editModal .invalid-feedback").show();
      $("#edit-confirm").prop("disabled", false);
      return;
    }
    let _data = {
      id: parseInt($("#editModal #policyId").val()),
      name: $("#editModal #editName").val(),
      resources: resources,
    };

    $("#loader").show();
    $.post(_apiBase + "/update", _data, function (result) {
      $("#editModal").modal("hide");
      $("#loader").hide();
      if (result?.data && result?.data?.updatePolicy?.success) {
        notify("Record Updated", "success");
      } else {
        notify(result?.data?.updatePolicy?.message, "error");
      }
      _editForm.reset();
      _getPageData();
    });
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
        $("#loader").hide();
        _getPageData();
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
      $("#activeDialog #bactive").off("click");
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
      $("#inactiveDialog #binactive").off("click");
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
      $("#deleteDialog .modal-title").html("Delete Policy(s)");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#deleteDialog #bdelete").prop("disabled", true);
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
    let ele = $("#main-table #tableBody");
    ele.empty();
    $.get(_apiBase + "/list", {}, function (result) {
      console.log(result)
      if (result.length) {
        $.get("/templates/policy_item.html", function (template) {
          $.each(result, function (index, item) {
            let _resource = [];
            try {
              if (item.resources != null) {
                _dataResource.forEach(function (_res) {
                  let _d =
                    item.resources.includes(_res.id) == true ? _res.name : "";
                  if (_d != "") _resource.push(_d);
                });
              }

            } catch (error) {

            }
            item.resources = _resource.join(", ");
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
            notify(res.errors[0]?.message, "error");
          }
          callback();
        });
        break;
    }
  }

  /**
   * Deletes single record
   */
  function singleDelete(id) {
    $("#loader").show();

    $.post(_apiBase + "/delete/" + id, {}, function (res) {
      $("#loader").hide();
      $("#deleteDialog").modal("hide");
      if (res && !res.errors) {
        $("#row" + id).remove();
        _CMSpagination.reset();
        notify("Record Deleted", "success");
      } else {
        notify(res.errors[0]?.message, "error");
      }
      _getPageData();
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
    $.post(_apiBase + "/delete-all", { ids: ids }, function (result) {
      $("#loader").hide();
      $("#deleteDialog").modal("hide");
      $("#deleteDialog #bdelete").prop("disabled", false);
      if (result) {
        notify("Policies deleted", "success");
      } else {
        notify("Unable to delete", "error");
      }
      _getPageData();
    });
  }

  /**
   * Bulk Activation method helper
   */
  async function bulkActive() {
    $("#loader").show();
    let cbs = $(".delete-check:checkbox:checked");
    let ids = [];
    $(cbs).each(function () {
      if (this.checked) {
        let id = parseInt($(this).data("id"));
        ids.push(id);
      }
    });
    $.post(_apiBase + "/active-all", { ids: ids }, function (result) {
      $("#loader").hide();
      $("#activeDialog").modal("hide");
      $("#activeDialog #bactive").prop("disabled", false);
      if (result) {
        notify(result.message, "success");
      } else {
        notify("Unable to delete", "error");
      }
      _getPageData();
    });
  }

  /**
   * Bulk In activation method helper
   */
  async function bulkInactive() {
    $("#loader").show();
    let cbs = $(".delete-check:checkbox:checked");
    let ids = [];
    $(cbs).each(function () {
      if (this.checked) {
        let id = parseInt($(this).data("id"));
        ids.push(id);
      }
    });
    $.post(_apiBase + "/inactive-all", { ids: ids }, function (result) {
      $("#loader").hide();
      $("#inactiveDialog").modal("hide");
      $("#inactiveDialog #binactive").prop("disabled", false);
      if (result) {
        notify(result.message, "success");
      } else {
        notify("Unable to delete", "error");
      }
      _getPageData();
    });

  }

  /**
   * status method helper for activation and deactivation of status
   */
  async function statusRow(id, status, ele) {
    const response = await fetch(_apiBase + "/status", {
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
