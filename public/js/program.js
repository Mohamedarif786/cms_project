function uncheck(id) {
  $(`#Listsuppliers #${id}`).click(function () {
    if (!$(this).checked) {
      $("#checkAll").attr("checked", false);
    }
  });
}
function deleteRow(id, name) {
  $("#list").empty();
  $("#list").append(`<li data-id="${id}">${name}</li>`);
  $("#deleteDialog .modal-title").html("Delete Program");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    singleDelete(id);
  });
  $("#deleteDialog").modal("show");
}
function singleDelete(id) {
  $("#loader").show();

  $.post(
    "/deleteProgram",
    {
      id: id,
    },
    function (result) {
      $("#loader").hide();
      if (result.data && result.data.delete && result.data.delete.success) {
        notify(result.data.delete.message, "success");
      } else {
        notify(result.data.delete.message, "error");
      }
      programs();
    }
  );
  $("#loader").hide();
  $("#deleteDialog").modal("hide");
}
function programs(name, club, status) {
  $("#loader").show();
  $.post("/programs", { name: name, club: club, status: status }, (result) => {
    if (result) {
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
        $("#loader").hide();
      } else {
        _getPageData(result);
        $("#loader").hide();
      }
    }
    else {
      $("#loader").hide();
    }
  });
}
$(document).ready(function () {
  $(".select2").each(function () {
    $(this)
      .wrap("<div class=\"position-relative\"></div>")
      .select2({
        placeholder: "Choose Module",
        dropdownParent: $(this).parent()
      });
  })
  $("#defineProgram").click(function () {
    clear_form("#addModal #newForm");
    fill_club_list("#addModal #clubid");
    $("#addModal").modal("show");
    $("#type").val("LOYALTY");
  })
  programs();
  $("#tablerecords #ByName").change(function () {
    programs($(this).val());
  });

  $("#tablerecords #ByClub").change(function () {
    programs(undefined, $(this).val());
  });
  $("#tablerecords #ByStatus").change(function () {
    programs(undefined, undefined, $(this).val());
  });
  $("#checkAll").click(function () {
    $("input:checkbox")
      .not("#flexSwitchCheckDefault")
      .prop("checked", this.checked);
  });
  $("#type").change(function () {
    let type = $(this).val();
    switch (type) {
      case "LOYALTY":
        $("#LoyaltyArea").show();
        break;
      case "REFERRAL":
        $("#LoyaltyArea").hide();
        break;
    }

    if ($(this).val() == "LOYALTY" || $(this).val() == "") {
      $("#tierArea").hide();
      $("#LoyaltyArea").show();
      $("#tierid").removeAttr("required");
      $("#unit").prop("required", true);
      $("#value").prop("required", true);
    } else if ($(this).val() == "REFERRAL") {
      $("#tierArea").show();
      $("#LoyaltyArea").hide();
      $("#tierid").prop("required", true);
      $("#unit").removeAttr("required");
      $("#value").removeAttr("required");
    }
  });

  $("#edit_type").change(function () {
    let type = $(this).val();
    switch (type) {
      case "LOYALTY":
        $("#editLoyaltyArea").show();
        break;
      case "REFERRAL":
        $("#editLoyaltyArea").hide();
        break;
    }

    if ($(this).val() == "LOYALTY" || $(this).val() == "") {
      $("#editTierArea").hide();
      $("#editLoyaltyArea").show();
      $("#edit_tierid").removeAttr("required");
      $("#edit_unit").prop("required", true);
      $("#edit_value").prop("required", true);
      $("#edit_charge").prop("required", true);
    } else if ($(this).val() == "REFERRAL") {
      $("#editTierArea").show();
      $("#editLoyaltyArea").hide();
      $("#edit_tierid").prop("required", true);
      $("#edit_unit").removeAttr("required");
      $("#edit_value").removeAttr("required");
      $("#edit_charge").removeAttr("required");
    }
  });

  /* let club_list = JSON.parse(localStorage.getItem("club_list"));
  
    let html = ``;
    html = `<option value="">Choose Club</option>`;
    if (result) {
      $.each(club_list, (i, item) => {
        html += `<option value=${item.id}>${item.name}</option>`;
      });

      $("#clubid").html(html);
    } */


  $.post("/tierList", {}, (result) => {
    let html = ``;
    html = `<option value="">Choose Tier</option>`;
    if (result) {
      $.each(result, (i, res) => {
        html += `<option value=${res.id}>${res.name}</option>`;
      });

      $("#tierid").html(html);
      $("#edit_tierid").html(html);
    }
  });

  $("#addProgram").click(() => {
    var form = document.querySelectorAll(".needs-validation");
    let flag = $("#newForm")[0].checkValidity();
    if (flag) {
      let unit = $("#unit").val().replaceAll(".", "");
      if (Number(unit) % 0.5 !== 0) {
        $("#unit")
          .css("border-color", "#ff0000")
          .next()
          .css("display", "block")
          .html("only valid e.g 1.5,2,2,5");
        return false;
      } else {
        $("#unit")
          .css("border-color", "#4bbf73")
          .next()
          .css("display", "none")
          .html("");
      }
      let input = {};
      input.clubid = $("#clubid").val();
      input.name = $("#name").val();
      input.type = $("#type").val();
      input.payment = $("#payment").val();
      if ($("#tierid").val()) {
        input.tier = $("#tierid").val();
      }
      if ($("#unit").val()) {
        input.unit = $("#unit").val();
      }
      if ($("#value").val()) {
        input.value = $("#value").val();
      }
      if ($("#charge").val()) {
        input.charge = $("#charge").val();
      }
      $("#loader").show();

      $.post("/program/add", input, function (result) {
        if (result && result.data) {
          if (result.data.define.success) {
            notify(result.data.define.message, "success");
          } else {
            notify(result.data.define.message, "error");
          }
        }
        $("#loader").hide();
        $("#addModal").modal("hide");
      });
    }
    $("#newForm")[0].classList.add("was-validated");

    //$("#loader").hide();
    return flag;
  });
  //update

  $("#updateForm").click(() => {
    $("#loader").show();
    var form = document.querySelectorAll(".needs-validation");
    let flag = $("#editForm")[0].checkValidity();

    if (flag) {
      let input = {};
      input.id = $("#id").val();
      input.clubid = $("#edit_clubid").val();
      input.name = $("#edit_name").val();
      input.type = $("#edit_type").val();
      if ($("#edit_type").val() == "REFERRAL") {
        input.tier = $("#edit_tierid").val();
      }
      input.unit = $("#edit_unit").val();
      input.value = $("#edit_value").val();
      input.charge = $("#edit_charge").val();
      input.payment = $("#edit_payment").val();
      updateprogram(input);
    }
    $("#editForm")[0].classList.add("was-validated");
    $("#loader").hide();
    $("#editModal").modal("hide");
    return flag;
  });

  //Active / Inactive
  $("#ActiveProgram").click(function () {
    let cbs = $.find("#programList tr input[name='cbRow']");
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
      $("#activeDialog .modal-title").html("Active Program");
      $("#activeDialog #bactive").click(() => {
        $("#bactive").prop("disabled", true);
        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Program(s) not selected", "warning");
    }
  });

  $("#InactiveProgram").click(function () {
    let cbs = $.find("#programList tr input[name='cbRow']");
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
      $("#inactiveDialog .modal-title").html("Inactive Program");
      $("#inactiveDialog #binactive").click(() => {
        $("#binactive").prop("disabled", true);
        bulkInactive();
      });
      $("#inactiveDialog").modal("show");
    } else {
      notify("Program(s) not selected", "warning");
    }
  });

  $("#deleteAll").click(() => {
    let cbs = $.find("#programList tr input[name='cbRow']");
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
      $("#deleteDialog .modal-title").html("Delete Program");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Program(s) not selected", "warning");
    }
  });



  //delete
  $("#delete").click(() => {
    let input = {
      id: $("#hiddenprogramid").val(),
    };
    $("#loader").show();
    $.post("/program", input, function (result) {
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
      } else {
        $("#confirmModal").modal("hide");
        $(".modal-backdrop").remove();
        memberList();
        notify("Member Deleted successfully", "success");
      }
      $("#loader").hide();
    });
  });
});
$("#editModal #edit_clubid").change(function () {
  $.post("/tierList", { clubid: $(this).val() }, (result) => {
    let html = ``;
    html = `<option value="">Choose Tier</option>`;
    if (result) {
      $.each(result, (i, res) => {
        html += `<option value=${res.id}>${res.name}</option>`;
      });
      $("#edit_tierid").html(html);
    }
  });
})
function editRow(id) {
  $("#loader").show();
  fill_club_list("#editModal #edit_clubid");
  document.querySelector("#editForm").reset();
  $("#id").val(id);

  $.post("/program/get", { id: id }, (result) => {
    console.log(result);
    if (result.errors) {
      for (let error of result.errors) {
        notify(`${error.message}`, "error");
      }
      $("#loader").hide();
    } else {
      let loyal = "";
      let referral = "";
      let res = result.data.program.result;
      $("#edit_name").val(res.name);
      if (res.type == "LOYALTY") {
        loyal = "selected";
        $("#editLoyaltyArea").removeClass("d-none");
        $("#editTierArea").addClass("d-none");
      }
      else {
        referral = "selected";
        $("#editLoyaltyArea").addClass("d-none");
        $("#editTierArea").removeClass("d-none");
      }

      $("#edit_type").val(res.type);
      $("#edit_clubid").val(res.clubid).trigger("change");
      $("#edit_unit").val(res.unit);
      $("#edit_value").val(res.value);
      $("#edit_charge").val(res.charge);
      $("#edit_tierid").val(res.tierid).trigger("change");
      $("#edit_payment").val(res.payment);

      $("#loader").hide();
      $("#editModal").modal("show");
    }
  });
}

function updateprogram(input) {
  $.post("/program/update", input, function (result) {
    if (!result.errors) {
      $("#updateUserModal").modal("hide");
      notify("Member updated successfully", "success");
      programs();
      $("#loader").hide();
      $(".modal-backdrop").remove();
    } else {
      $("#updateUserModal").modal("hide");
      notify(result.errors[0].message, "error");
      $("#loader").hide();
      $(".modal-backdrop").remove();
    }
  });
}
async function existName(name, type) {
  return new Promise((resolve, reject) => {
    $.post("/programs", {}, (result) => {
      if (result.length) {
        if (type == 1)
          result.splice(
            result.findIndex((res) => res.name == name),
            1
          );

        let emailExist = result.findIndex((res) => res.name == name);
        resolve(emailExist);
      } else {
        reject(undefined);
      }
    });
  });
}
function deletePromt(id, email) {
  document.querySelector("#deleteUserForm").reset();
  $("#hiddenmemberid").val(id);
  $("#hiddenmemberemail").val(email);
}

$("#checkAll").click(function () {
  $("input:checkbox")
    .not("#flexSwitchCheckDefault")
    .prop("checked", this.checked);
});

async function bulkActive() {
  $("#loader").show();
  let cbs = $.find("#programList tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = $(this).data("id");
      ids.push(id);
    }
  });
  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/activeProgram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.activerole) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Program activated successfully", "success");
      programs();
    } else {
      notify("Unable to activate supplier(s)", "error");
    }
    $("#loader").hide();
  }
  $("#activeDialog").modal("hide");
  $(".modal-backdrop").remove();
  $("#bactive").prop("disabled", false);
}

async function bulkInactive() {
  $("#loader").show();
  let cbs = $.find("#programList tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = $(this).data("id");
      ids.push(id);
    }
  });
  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/inactiveProgram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.inactiverole) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Program deactivated successfully", "success");
      programs();
    } else {
      notify("Unable to deactivate program(s)", "error");
    }
    $("#loader").hide();
  }
  $("#inactiveDialog").modal("hide");
  $(".modal-backdrop").remove();
  $("#binactive").prop("disabled", false);
}

async function bulkDelete() {
  $("#loader").show();
  let cbs = $.find("#programList tr input[name='cbRow']");
  let ids = [];

  $(cbs).each(function () {
    if (this.checked) ids.push(parseInt($(this).data("id")));
  });

  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (req) => {
        const response = await fetch("/deleteProgram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: req,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.removemember) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Programs deleted successfully", "success");
      programs();
    } else {
      notify("Unable to delete program(s)", "error");
    }
    $("#loader").hide();
  }
  $("#deleteDialog").modal("hide");
  $(".modal-backdrop").remove();
  $("#bdelete").prop("disabled", false);
}

function closeModal(modalname) {
  $("#" + modalname).modal("hide");
  document.getElementById(modalname).reset();
}

function deletePromt(id, name) {
  document.querySelector("#deleteUserForm").reset();
  $("#hiddenprogramid").val(id);
  $("#hiddenprogramname").val(name);
}

function _getPageData(list) {
  let ele = $("#programList");
  ele.find("tr").remove();
  if (list.length) {
    $.get("/templates/program.html", function (template) {
      $.each(list, function (index, item) {
        let _resource = [];
        if (item.resources != null) {
          _dataResource.forEach(function (_res) {
            let _d = item.resources.includes(_res.id) == true ? _res.name : "";
            if (_d != "") _resource.push(_d);
          });
        }
        item.resources = _resource.join(", ");
        $.tmpl(template, item).appendTo("#programList");
      });
      //pagination
      _CMSpagination = new Pager({
        divId: "fPage",
        tableId: "tablerecords",
        noContentMsg: "No Content found",
        filter: false,
        deleteAll: function (e) {
          if ($(".delete-check:checkbox:checked").length > 0) {
            $("#deleteModal").modal("show");
            $("#delete-confirm").data("id", "all"); // id referene for delete use
          } else {
            setMsg("No record selected for delete");
          }
        },
      });
    });
  } else {
    ele.html('<tr><td colspan="9"><center>No content found</center></td></tr>');
  }
}
