/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
$(document).ready(function () {
  // Initialize
  let pager;

  $(".select2").each(function () {
    $(this)
      .wrap('<div class="position-relative"></div>')
      .select2({
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
          event?.target?.validity?.valueMissing &&
          $(event?.target).attr("custom_validation")
        ) {
          event?.target?.setCustomValidity(
            $(event?.target).attr("custom_validation_msg")
          );
        }
      });
      o.addEventListener("change", function (event) {
        event.target.setCustomValidity("");
      });
    }
  });

  let country_list = JSON.parse(localStorage.getItem("country_list"));
  $("#country").append("<option value='' selected>Choose Country</option>");
  $(country_list).each(function () {
    $("#country").append();
    $("#country").append(
      `<option value='${this.id}|${this.name}'>${this.name}</option>`
    );
  });

  $("#country").change(function () {
    let id = $("#addModal #id").val();
    if (id === "") {
      stateList($(this).val());
    }
  });

  $("#state").change(function () {
    let id = $("#addModal #id").val();
    if (id === "") {
      cityList($(this).val());
    }
  });

  /**
   * Opens add popup
   */
  $("#addNewClub").on("click", function () {
    clear_form("#addModal #form");
    $("#addModal #form")[0].classList.remove("was-validated");
    $("#addModal #id").val("");
    $("#city").trigger("change");
    $("#state").trigger("change");
    $("#country").trigger("change");
    $("#addModal").modal("show");
  });

  /**
   * Add method
   */
  $("#add-confirm").on("click", function () {
    $("#loader").show();
    $("#add-confirm").prop("disabled", true);
    let flag = isValid("#addModal #form");
    if (flag === false) {
      $("#addModal #form")[0].checkValidity();
      $("#addModal #form")[0].classList.add("was-validated");
      $("#loader").hide();
      $("#add-confirm").prop("disabled", false);
      return;
    }
    let id = $("#addModal #id").val();
    let url = `${_apiBase}/add`;
    let input = getData("#addModal #form");
    if (id !== "") {
      input.id = id;
      url = `${_apiBase}/update`;
    }
    input.code = input?.code.toUpperCase();
    input.shortform = input?.shortform.toUpperCase();
    if (input.country !== "") {
      input.country = input.country.split("|")[1];
    }
    if (input?.state !== "") {
      input.state = input.state.split("|")[1];
    }
 
    $.post(url, input, function (result) {
      $("#loader").hide();
      $("#addModal").modal("hide");
      $("#add-confirm").prop("disabled", false);
      if (result?.data) {
        if (result?.data?.addClub) {
          if (result?.data?.addClub?.success) {
            _getPageData();
            notify(result?.data?.addClub?.message, "success");
          } else {
            notify(result?.data?.addClub?.message, "error");
          }
        } else if (result?.data?.updateClub) {
          if (result?.data?.updateClub?.success) {
            _getPageData();
            notify(result?.data?.updateClub?.message, "success");
          } else {
            notify(result?.data?.updateClub?.message, "error");
          }
        }
      } else {
        notify("Unable to perform operation", "error");
      }
    });
  });

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
        if (result && !result?.errors) {
          $("#row" + id).remove();
          _CMSpagination.reset();
          return id;
        }
        break;
      default:
        $.post(_apiBase + "/delete/" + id, {}, function (res) {
          if (res && !res?.errors) {
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
   * Opens confirmation popup for delete
   */
  $(document).on("click", ".delete-resource", function () {
    let id = $(this).data("id");
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#deleteDialog .modal-title").html("Delete Club");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      singleDelete(id);
    });
    $("#deleteDialog").modal("show");
  });

  /**
   * Delete method helper
   */
  function removeRow(id, processed) {
    $.post(_apiBase + "/delete/" + id, {}, function (res) {
      if (res && !res.errors) {
        $("#row" + id).remove();
        pager.reset();
        notify("Record Deleted", "success");
      } else {
        notify(res?.errors[0]?.message, "error");
      }
      processed();
    });
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

  /**
   * Opens edit popup
   */
  $(document).on("click", ".editRow", function () {
    $("#loader").show();
    let id = $(this).data("id");
    $("#addModal #id").val(id);
    $("#addModal .modal-title").text("Update Club");
    $.get(_apiBase + "/" + id, {}, function (result) {
      $("#loader").hide();
      if (result) {
        fillData("#addModal #form", result);

        $("#country").empty();
        $("#country").append(
          "<option value='' selected>Choose Country</option>"
        );
        $(country_list).each(function () {
          if (this.name === result?.country) {
            $("#country").append(
              `<option value=${this.id}|${this.name} selected>${this.name}</option>`
            );
            stateList(`${this.id}|${this.name}`, result?.state, result?.city);
          } else {
            $("#country").append(
              `<option value=${this.id}|${this.name}>${this.name}</option>`
            );
          }
        });
        $("#addModal").modal("show");
      }
    });
  });

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
        title: "Active Club(s)",
        checked: true,
      }
      : {
        element: "inactiveDialog",
        button: "binactive",
        status: "INACTIVE",
        title: "InActive Club(s)",
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
              ? "Club(s) activated successfully"
              : "Club(s) deactivated successfully";
          notify(msg, "success");
          $(ele).prop("checked", state?.checked);
        } else {
          notify(res?.errors[0]?.message, "error");
        }
        $("#" + state.element).modal("hide");
        $("#loader").hide();
        _getPageData();
      });
    });
    $("#" + state?.element).modal("show");
  });

  /**
   * initial page loader method
   */
  function _getPageData() {
    $("#loader").show();
    let ele = $("#main-table");
    $("#tableBody").empty();
    $.get(_apiBase + "/list", {}, function (result) {
      if (result.length) {
        $.get("/templates/club_item.html", function (template) {
          $.each(result, function (index, item) {
            //if (item.id == 5466) {
            $.tmpl(template, item).appendTo("#tableBody");
            //}
          });
          //pagination
          pager = new Pager({
            divId: "fPage",
            tableId: "main-table",
            noContentMsg: "No Content found",
            filter: true,
          });

          console.log(JSON.parse(localStorage.getItem("club_list")), JSON.parse(localStorage.getItem("club_list")).length)
          if (JSON.parse(localStorage.getItem("club_list")).length > 1) {
            $('.delete-resource').show();
          }
        });
      } else {
        ele.html("<p>No content found</p>");
      }
      $("#loader").hide();
    });
  }
  _getPageData();
});

function stateList(country, state, city) {
  $("#loader").show();
  let id = country.split("|")[0];
  let html = ``;
  $("#state").empty();
  $("#state").append("<option value=''>Choose State</option>");
  $.post("/states", { countryid: id }, (result) => {
    $("#loader").hide();
    if (result?.data && result?.data?.state?.success) {
      let list = result?.data?.state?.result;
      $.each(list, (i, item) => {
        if (state && item?.name === state) {
          $("#state").append(
            `<option value='${item?.id}|${item?.name}' selected>${item?.name}</option>`
          );
          cityList(`${item?.id}|${item?.name}`, city);
        } else {
          $("#state").append(
            `<option value='${item?.id}|${item?.name}'>${item?.name}</option>`
          );
        }
      });
    }
  });
}

function cityList(state, name) {
  $("#loader").show();
  let id = state.split("|")[0];
  $("#city").empty();
  $("#city").append("<option value=''>Choose City</option>");
  $.post("/cities", { stateid: id }, (result) => {
    $("#loader").hide();
    if (result?.data && result?.data?.city?.success) {
      let list = result.data.city.result;
      $.each(list, (i, item) => {
        if (state && item?.name === name) {
          $("#city").append(
            `<option value=${item?.name} selected>${item?.name}</option>`
          );
        } else {
          $("#city").append(`<option value=${item?.name}>${item?.name}</option>`);
        }
      });
    }
  });
}
