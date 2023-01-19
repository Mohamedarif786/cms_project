let clubList = "";
function uncheck(id) {
  $(`#Listsuppliers #${id}`).click(function () {
    if (!$(this).checked) {
      $("#checkAll").attr("checked", false);
    }
  });
}
function smtp_list() {
  var name = $("#ByName").val();
  var email = $("#ByEmail").val();
  var status = $("#ByStatus").val();
  let input = { name: name, email: email, status: status };
  $("#loader").show();
  $.post("/smtp/list", input, (result) => {
    if (result) {
      _getPageData(result);
      $("#loader").hide();
    }
  });
}
$(document).ready(function () {
  smtp_list();

  $(".select2").each(function () {
    $(this)
      .wrap('<div class="position-relative"></div>')
      .select2({
        dropdownParent: $(this).parent(),
      });
  });

  $("#addNewSmtp").click(function () {
    clear_form("#newDialog #form");
    $("#club").val("0").trigger("change");
    $("#form")[0].classList.remove("was-validated");
    $("#newDialog .modal-title").text("New Smtp");
    $("#newDialog").modal("show");
  });

  // $.get("/club/list", (result) => {
  //   $("#club").html();
  //   $("#loader").show();
  //   let html = ``;
  //   html = `<option value="">Choose Club</option>`;
  //   if (result.errors) {
  //     notify(result.errors[0].message, "error");
  //   } else {
  //     clubList = result;
  //     $.each(result, (i, res) => {
  //       html += `<option value=${res.id}>${res.name}</option>`;
  //     });
  //     $("#club").html(html);
  //     $("#update_club").html(html);
      
  //   }
  //   $("#loader").hide();
  // });
  
  fill_club_list("#club")
  fill_club_list("#update_club")
  $("#checkAll").click(function () {
    $("input:checkbox")
      .not("#flexSwitchCheckDefault")
      .prop("checked", this.checked);
  });
  $("#type").change(function () {
    if ($(this).val() == "LOYALTY" || $(this).val() == "")
      $(".tier").addClass("d-none");
    else if ($(this).val() == "REFERRAL") $(".tier").removeClass("d-none");
  });

  $("#addSmtp").click(() => {
    let flag = isValid("#form");

    if (flag === false) {
      $("#form")[0].checkValidity();
      $("#form")[0].classList.add("was-validated");
      return;
    }

    $("#addSmtp").prop("disabled", true);
    $("#loader").show();

    let input = getData("#form");
    if (input.id !== "") {
      $.post("/smtp/update", input, function (result) {
        console.log(result);
        $("#loader").hide();
        $("#addSmtp").prop("disabled", false);
        if (result.data && result.data.updateSmtp.success) {
          smtp_list();
          notify(result.data.updateSmtp.message, "success");
        } else {
          notify(result.data.updateSmtp.message, "error");
        }
      });
    } else {
      $.post("/smtp/add", input, function (result) {
        console.log(result);
        $("#loader").hide();
        if (result.data && result.data.addSmtp.success) {
          smtp_list();
          notify(result.data.addSmtp.message, "success");
        } else {
          notify(result.data.addSmtp.message, "error");
          $("#addSmtp").prop("disabled", false);
        }
      });
    }
  });

  //Active / Inactive
  $("#ActiveSmtp").click(function () {
    let cbs = $.find("#smtpList tr input[name='cbRow']");
    $("#activeDialog #list").empty();
    let idx = 0;
    $(cbs).each(function () {
      if (this.checked) {
        idx++;
        $("#activeDialog #list").append(
          `<li data-id="${$(this).data("id")}">${$(this).data("email")}</li>`
        );
      }
    });
    if (idx > 0) {
      $("#activeDialog .modal-title").html("Active Smtp");
      $("#activeDialog #bactive").off("click");
      $("#activeDialog #bactive").click(() => {
        $("#bactive").prop("disabled", true);
        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Smtp(s) not selected", "warning");
    }
  });

  $("#InactiveSmtp").click(function () {
    let cbs = $.find("#smtpList tr input[name='cbRow']");
    $("#inactiveDialog #list").empty();
    let idx = 0;
    $(cbs).each(function () {
      if (this.checked) {
        idx++;
        $("#inactiveDialog #list").append(
          `<li data-id="${$(this).data("id")}">${$(this).data("email")}</li>`
        );
      }
    });
    if (idx > 0) {
      $("#inactiveDialog .modal-title").html("Inactive Smtp");
      $("#inactiveDialog").modal("show");
    } else {
      notify("Smtp(s) not selected", "warning");
    }
  });
  $("#inactiveDialog #binactive").click(() => {
    $("#inactiveDialog #binactive").prop("disabled", true);
    bulkInactive();
  });
  $("#deleteAll").click(() => {
    let cbs = $.find("#smtpList tr input[name='cbRow']");
    $("#list").empty();
    let idx = 0;
    $(cbs).each(function () {
      if (this.checked) {
        idx++;
        $("#list").append(
          `<li data-id="${$(this).data("id")}">${$(this).data("email")}</li>`
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
      notify("Smtp(s) not selected", "warning");
    }
  });

  $("#Yes").click(() => {
    let namematch =
      $("#hiddensmtpemail").val().trim().toLowerCase() ==
      $("#prompt").val().trim().toLowerCase();
    if (namematch) {
      $("#deleteUserModal").modal("hide");
      $("#confirmModal").modal("show");
      let input = {
        id: $("#hiddensmtpid").val(),
        email: $("#hiddensmtpemail").val(),
      };
      var html1 = ``;
      html1 += `<h4 style="margin-top: 10px;">${input.email}</h4>`;
      $("#confrmdelete").html(html1);
    } else {
      $("#deleteUserModal").modal("hide");
      notify("SMTP is mismatch", "error");
    }
  });

  //delete
  $("#delete").click(() => {
    let input = {
      id: $("#hiddensmtpid").val(),
    };
    $("#loader").show();
    $.post("/smtp/remove", input, function (result) {
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
      } else {
        $("#confirmModal").modal("hide");
        // $('.modal-backdrop').remove()
        smtp_list();
        notify("Smtp Deleted successfully", "success");
      }
      $("#loader").hide();
    });
  });

  $("#ByName").change(function () {
    smtp_list();
  });
  $("#ByEmail").change(function () {
    smtp_list();
  });
  $("#ByStatus").change(function () {
    smtp_list();
  });

  $("#port").keydown(function (e) {
    const invalidChars = ["-", "+", "e"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  });
});

function singleDelete(id) {
  $("#loader").show();

  $.post(
    "/smtp/delete",
    {
      id: id,
    },
    function (result) {
      $("#loader").hide();
      $("#deleteDialog").modal("hide");
      if (result.data && result.data.removeTier) {
        notify(result.data.removeTier.message, "success");
      } else {
        notify(result.errors[0].message, "error");
      }
      smtp_list();
    }
  );
}

$("#checkAll").click(function () {
  $("input:checkbox")
    .not("#flexSwitchCheckDefault")
    .prop("checked", this.checked);
});

$(document).on("click", ".editRow", function () {
  $("#form #id").val($(this).data("id"));
  let id = $(this).data("id");
  $("#loader").show();
  $.get(`/smtp/get/${id}`, function (result) {
    $("#loader").hide();
    if (result.data && result.data.smtp.success) {
      fillData("#newDialog #form", result.data.smtp.result);
    }
  });
  $("#newDialog .modal-title").text("Update Smtp");
  $("#newDialog").modal("show");
});

$(document).on("click", ".deleteRow", function () {
  let id = $(this).data("id");
  $("#list").empty();
  $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
  $("#deleteDialog .modal-title").html("Delete Resource(s)");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    $("#bdelete").prop("disabled", true);
    singleDelete(id);
  });
  $("#deleteDialog").modal("show");
});

async function bulkActive() {
  $("#loader").show();
  let cbs = $.find("#smtpList tr input[name='cbRow']");
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
        const response = await fetch("/smtp/active", {
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
      notify("Smtp activated successfully", "success");
      smtp_list();
    } else {
      notify("Unable to activate smtp(s)", "error");
    }
    $("#loader").hide();
  }
  $("#activeDialog").modal("hide");
  $("#bactive").prop("disabled", false);
  // $('.modal-backdrop').remove()
}

async function bulkInactive() {
  $("#loader").show();
  let cbs = $.find("#smtpList tr input[name='cbRow']");
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
        const response = await fetch("/smtp/inactive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.inactiveSmtp) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Smtp deactivated successfully", "success");
      smtp_list();
    } else {
      notify("Unable to deactivate smtp(s)", "error");
    }
    $("#loader").hide();
  }
  $("#inactiveDialog").modal("hide");
  $("#inactiveDialog #binactive").prop("disabled", false);
  // $('.modal-backdrop').remove()
}

async function bulkDelete() {
  $("#loader").show();
  let cbs = $.find("#smtpList tr input[name='cbRow']");
  let ids = [];

  $(cbs).each(function () {
    if (this.checked) ids.push(parseInt($(this).data("id")));
  });

  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (req) => {
        const response = await fetch("/smtp/delete", {
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
      notify("Smtp deleted successfully", "success");
      smtp_list();
    } else {
      notify("Unable to delete smtp(s)", "error");
    }
    $("#loader").hide();
  }
  $("#bdelete").prop("disabled", false);
  $("#deleteDialog").modal("hide");
}


function _getPageData(list) {
  let ele = $("#smtpList");
  ele.find("tr").remove();
  if (list.length) {
    $.get("/templates/smtp_item.html", function (template) {
      $.each(list, function (index, item) {
        $.tmpl(template, item).appendTo("#smtpList");
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

function emailValidate(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if (!emailReg.test(email)) {
    notify("Invalid Email Format", "error");
    return false;
  } else {
    return true;
  }
}
