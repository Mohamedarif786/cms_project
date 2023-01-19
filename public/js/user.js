let countryList = "";
let roleList = "";
let clubsList = "";
let userClubId = getUserClubId();
let _addForm = $("#newUserForm")[0];
function uncheck(id) {
  $(`#Listusers #${id}`).click(function () {
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
    $("#deleteDialog #bdelete").prop("disabled", true);
    singleDelete(id);
  });
  $("#deleteDialog").modal("show");
}
function singleDelete(id) {
  $("#loader").show();

  $.post(
    "/user/delete",
    {
      id: id,
    },
    function (result) {
      $("#loader").hide();
      if (
        result.data &&
        result.data.deleteUser &&
        result.data.deleteUser.success
      ) {
        notify(result.data.deleteUser.message, "success");
      } else {
        notify(result.data.deleteUser.message, "error");
      }
      userList();
    }
  );
  $("#loader").hide();
  $("#deleteDialog").modal("hide");
  $("#deleteDialog #bdelete").prop("disabled", false);
}
$(document).ready(function () {
  /* $(".select2")
    .wrap('<div class="position-relative"></div>')
    .select2({
      dropdownParent: $(this).parent(),
    }); */
  fill_club_list("#clubid");
  fill_dialling_code_list("#callingcode");
  $.get("/country/list", function (result) {
    $("#country").empty();
    $("#country").append(new Option("Choole Country", ""));
    if (result && result.length > 0) {
      $(result).each(function () {
        $("#country").append(new Option(this.name, this.alpha2));
      });
    }
  });
  userList();

  $("#addNewUser").click(() => {
    clear_form("#addModal #form");

    $("#addModal .modal-title").text("New User");
    $("#addModal #form")[0].classList.remove("was-validated");
    $("#addModal").modal("show");
  });

  $(document).on("click", ".editRow", function () {
    $("#loader").show();
    let id = $(this).data("id");
    $("#addModal #id").val(id);
    $("#addModal .modal-title").text("Update User");
    $.get("user/" + id, function (result) {
      $("#loader").hide();
      if (result) {
        fillData("#addModal #form", result);
        let country_list = JSON.parse(localStorage.getItem("country_list"));
        let country = country_list.find((c) => c.name === result.country);
        $("#country").val(country.alpha2);
        $("#addModal").modal("show");
      }
    });
  });

  //add
  $("#save").click(() => {
    $("#save").prop("disabled", true);
    let flag = isValid("#addModal #form");
    if (flag === false) {
      $("#addModal #form")[0].checkValidity();
      $("#addModal #form")[0].classList.add("was-validated");
      $("#loader").hide();
      $("#save").prop("disabled", false);
      return;
    }
    let input = getData("#addModal #form");
    console.log(input);
    let url = "/user/add";
    if (input.id !== "") {
      url = "/user/update";
    }

    $("#loader").show();
    $.post(url, input, function (result) {
      $("#loader").hide();
      $("#addModal").modal("hide");
      $("#save").prop("disabled", false);
      userList();
      if (result.data) {
        if (result.data.addUser) {
          if (result.data.addUser.success) {
            notify(result.data.addUser.message, "success");
          } else {
            notify(result.data.addUser.message, "error");
          }
        } else if (result.data.updateUser) {
          if (result.data.updateUser.success) {
            notify(result.data.updateUser.message, "success");
          } else {
            notify(result.data.updateUser.message, "error");
          }
        }
      } else {
        notify("Unable to perform operation", "error");
      }
    });
  });

  $("#deleteAll").click(() => {
    let cbs = $.find("#Listusers tr input[name='cbRow']");
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
      $("#deleteDialog .modal-title").html("Delete Users");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("User(s) not selected", "warning");
    }
  });

  //delete
  $("#delete").click(() => {
    let input = {
      id: parseInt($("#hiddenuserid").val()),
    };
    $("#loader").show();
    $.post("/deleteUser", input, function (result) {
      if (result.data) {
        $("#confirmModal").modal("hide");

        userList();
        $("#loader").hide();
        notify("User Deleted successfully", "success");
        $("#loader").hide();
        $("#confirmModal").modal("hide");
      } else {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
      }
      $("#loader").hide();
    });
  });

  //Active / Inactive
  $("#ActiveUser").click(function () {
    let cbs = $.find("#Listusers tr input[name='cbRow']");
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
      $("#activeDialog .modal-title").html("Active Users");
      $("#activeDialog #bactive").off("click");
      $("#activeDialog #bactive").click(() => {
        $("#bactive").prop("disabled", true);
        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Users(s) not selected", "warning");
    }
  });

  $("#InactiveUser").click(function () {
    let cbs = $.find("#Listusers tr input[name='cbRow']");
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
      $("#inactiveDialog .modal-title").html("Inactive Users");
      $("#inactiveDialog #binactive").off("click");
      $("#inactiveDialog #binactive").click(() => {
        $("#binactive").prop("disabled", true);
        bulkInactive();
      });
      $("#inactiveDialog").modal("show");
    } else {
      notify("Users(s) not selected", "warning");
    }
  });

  $.post("/rolesList", {}, (result) => {
    $("#roleid").empty();
    $("#roleid").append(new Option("Choose Role", 0));
    if (result.length != 0) {
      $(result).each((idx, item) => {
        $("#roleid").append(new Option(item.name, item.id));
      });
    }
  });

  $("#tablerecords #ByFName").change(function () {
    userList($(this).val());
  });

  $("#tablerecords #ByLName").change(function () {
    userList(undefined, $(this).val());
  });

  $("#tablerecords #ByEmail").change(function () {
    userList(undefined, undefined, $(this).val());
  });

  $("#tablerecords #ByStatus").change(function () {
    userList(undefined, undefined, undefined, $(this).val());
  });
});

async function bulkActive() {
  $("#loader").show();
  let cbs = $.find("#Listusers tr input[name='cbRow']");
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
        const response = await fetch("/activeUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.activeUser.success) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Users activated successfully", "success");
      userList();
    } else {
      notify("Unable to activate user(s)", "error");
    }
    $("#loader").hide();
  }
  $("#activeDialog").modal("hide");
  $("#bactive").prop("disabled", false);
}

async function bulkInactive() {
  $("#loader").show();
  let cbs = $.find("#Listusers tr input[name='cbRow']");
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
        const response = await fetch("/inactiveUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.inactiveUser.success) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("User deactivated successfully", "success");
      userList();
    } else {
      notify("Unable to deactivate user(s)", "error");
    }
    $("#loader").hide();
  }
  $("#inactiveDialog").modal("hide");
  $("#binactive").prop("disabled", false);
}

function userList(fname, lname, email, status) {
  $("#Listusers").html("");
  $("#loader").show();

  $.post(
    "/userList",
    { fname: fname, lname: lname, email: email, status: status },
    function (result) {
      if (result && result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
        var rec = ` `;
        rec += `<td colspan="4" align="center">No Records found</td>`;
        $("#norecords").html(rec);
        $("#loader").hide();
      } else {
        _getPageData(result);
        $("#loader").hide();
      }
    }
  );
}

function deletePromt(userid, email) {
  document.querySelector("#deleteUserForm").reset();
  $("#hiddenuserid").val(userid);
  $("#hiddenuseremail").val(email);
}

$("#checkAll").click(function () {
  $("input:checkbox")
    .not("#flexSwitchCheckDefault")
    .prop("checked", this.checked);
});

async function bulkDelete() {
  $("#loader").show();
  let cbs = $.find("#Listusers tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = parseInt($(this).data("id"));
      ids.push(id);
    }
  });
  if (ids.length) {
    let deletedID = 0;
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/user/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data.deleteUser.success) {
          deletedID++;
          // notify(result.data.deleteUser.message, 'success')
        } else {
          // notify(result.data.deleteUser.message, 'error')
        }
      })
    );
    if (ids.length == deletedID) {
      notify("User deleted successfully", "success");
    } else {
      notify("Unable to delete User(s)", "error");
    }
    $("#loader").hide();
    userList();
  }
  $("#deleteDialog").modal("hide");
  $("#deleteDialog #bdelete").prop("disabled", true);
}

function closeModal(modalname) {
  document.getElementById(modalname).reset();
}

function _getPageData(list) {
  let ele = $("#Listusers");
  ele.find("tr").remove();
  if (list && list.length) {
    list.sort((a, b) => a.firstname.localeCompare(b.firstname));
    $.get("/templates/user_item.html", function (template) {
      $.each(list, function (index, item) {
        if (userClubId > 0 && item.clubid != userClubId) {
          delete item;
        } else {
          $.tmpl(template, item).appendTo("#Listusers");
        }
      });
      //pagination
      _CMSpagination = new Pager({
        divId: "fPage",
        tableId: "tablerecords",
        noContentMsg: "No Content found",
        perPage: 10,
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
    ele.html(
      '<tr><td colspan="15"><center>No records found</center></td></tr>'
    );
  }
}
function addImgChange(element) {
  $("#photo").val("");
  const file = element.files[0];
  const reader = new FileReader();
  reader.onloadend = function () {
    $("#photo").val(reader.result);
  };
  reader.readAsDataURL(file);
}
