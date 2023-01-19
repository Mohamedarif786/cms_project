function uncheck(id) {
  $(`#roleList #${id}`).click(function () {
    if (!$(this).checked) {
      $("#checkAll").attr("checked", false);
    }
  });
}
$(document).ready(function () {
  roleList();
  $("#AddNewRole").click(function () {
    clear_form("#roleModal #form");
    $("#form")[0].classList.remove("was-validated");
    $("#roleModal .modal-title").html("New Role");
    $("#roleModal").modal("show");
  });

  $("#ActiveRole").click(function () {
    let cbs = $.find("#roleList tr input[name='cbRow']");
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
      $("#activeDialog .modal-title").html("Active Roles");
      $("#activeDialog #bactive").off("click");
      $("#activeDialog #bactive").click(() => {
        $("#activeDialog #bactive").prop("disabled", true);

        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Role(s) not selected", "warning");
    }
  });

  $("#InactiveRole").click(function () {
    let cbs = $.find("#roleList tr input[name='cbRow']");
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
      $("#inactiveDialog .modal-title").html("Inactive Roles");
      $("#inactiveDialog #binactive").off("click");
      $("#inactiveDialog #binactive").click(() => {
        $("#inactiveDialog #binactive").prop("disabled", true);
        bulkInactive();
      });
      $("#inactiveDialog").modal("show");
    } else {
      notify("Role(s) not selected", "warning");
    }
  });
  $("#Save").click(function () {
    let flag = isValid("#form");

    if (flag === false) {
      $("#form")[0].checkValidity();
      $("#form")[0].classList.add("was-validated");
      return;
    }

    $("#Save").prop("disabled", true);
    $("#loader").show();
    let input = getData("#form");
    if (input.id !== "") {
      $.post("/updateRole", input, function (result) {
        if (result.data) {
          if (result.data.updateRole.success) {
            notify(result.data.updateRole.message, "success");
          } else {
            notify(result.data.updateRole.message, "error");
          }
        } else {
          notify(result.errors[0].message, "error");
        }
        $("#Save").prop("disabled", false);
        $("#loader").hide();
        $("#roleModal").modal("hide");
        roleList();
      });
    } else {
      $.post("/addrole", input, function (result) {
        if (result.data) {
          if (result.data.addRole.success) {
            notify(result.data.addRole.message, "success");
          } else {
            notify(result.data.addRole.message, "error");
          }
        } else {
          notify(result.errors[0].message, "error");
        }
        $("#Save").prop("disabled", false);
        $("#loader").hide();
        $("#roleModal").modal("hide");
        roleList();
      });
    }
  });

  $(".closeAll").click(function () {
    $("#name").val("");
    $("#newRoleForm")[0].classList.remove("was-validated");
  });

  $("#deleteAll").click(() => {
    let cbs = $.find("#roleList tr input[name='cbRow']");
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
      $("#deleteDialog .modal-title").html("Delete Roles");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#deleteDialog #bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Role(s) not selected", "warning");
    }
  });

  $("#tablerecords #ByName").change(function () {
    roleList();
  });

  $("#tablerecords #ByDescription").change(function () {
    roleList();
  });

  $("#tablerecords #ByStatus").change(function () {
    roleList();
  });
});

function roleList() {
  $("#roleList").empty();
  const name = $("#ByName").val();
  const description = $("#ByDescription").val();
  const status = $("#ByStatus").val();
  $("#loader").show();
  $.post(
    "/rolesList",
    {
      name: name,
      description: description,
      status: status === "" ? undefined : status,
    },
    function (result) {
      if (result.length) {
        result.sort((a, b) => a.name.localeCompare(b.name));
        $("#roleList").empty();
        $.get("/templates/role_item.html", function (template) {
          $.each(result, function (index, item) {
            $.tmpl(template, item).appendTo("#roleList");
          });
          let _CMSpagination = new Pager({
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
        $("#loader").hide();
      } else {
        var rec = `<td colspan="4" align="center">No Records found</td>`;
        $("#norecords").html(rec);
        $("#loader").hide();
      }
    }
  );
}

$("#checkAll").click(function () {
  $("input:checkbox")
    .not("#flexSwitchCheckDefault")
    .prop("checked", this.checked);
});

async function bulkDelete() {
  $("#loader").show();
  let cbs = $.find("#roleList tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = parseInt($(this).data("id"));
      ids.push(id);
    }
  });
  if (ids?.length) {
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/removeRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roleid: id,
          }),
        });
        let result = await response.json();
        if (result?.data && result?.data?.removerole) {
          return id;
        }
      })
    );
    if (ids?.length - dids?.length === 0) {
      notify("Roles deleted successfully", "success");
      roleList();
    } else {
      notify("Unable to delete role(s)", "error");
    }
    $("#loader").hide();
  }
  $("#deleteDialog").modal("hide");
  $("#deleteDialog #bdelete").prop("disabled", false);
}

async function bulkActive() {
  $("#loader").show();
  let cbs = $.find("#roleList tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = parseInt($(this).data("id"));
      ids.push(id);
    }
  });
  if (ids?.length) {
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/activeRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result?.data && result?.data?.activeRole) {
          return id;
        }
      })
    );
    if (ids?.length - dids?.length === 0) {
      notify("Roles activated successfully", "success");
      roleList();
    } else {
      notify("Unable to activate role(s)", "error");
    }
    $("#loader").hide();
  }
  $("#activeDialog").modal("hide");
  $("#activeDialog #bactive").prop("disabled", false);
}

async function bulkInactive() {
  $("#loader").show();
  let cbs = $.find("#roleList tr input[name='cbRow']");
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
        const response = await fetch("/inactiveRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result?.data && result?.data?.inactiveRole) {
          return id;
        }
      })
    );
    if (ids?.length - dids?.length === 0) {
      notify("Roles deactivated successfully", "success");

      roleList();
    } else {
      notify("Unable to deactivate role(s)", "error");
    }
    $("#loader").hide();
  }
  $("#inactiveDialog").modal("hide");
  $("#inactiveDialog #binactive").prop("disabled", false);
}

function singleDelete(id) {
  $("#loader").show();
  $.post(
    "/removeRole",
    {
      roleid: id,
    },
    function (result) {
      $("#loader").hide();
      if (result?.data && result?.data?.deleteRole) {
        notify(result.data.deleteRole.message, "success");
        roleList();
      } else {
        notify(result?.errors[0]?.message, "error");
      }
    }
  );
  $("#loader").hide();
  $("#deleteDialog").modal("hide");
  $("#deleteDialog #bdelete").prop("disabled", false);
}

function updateRow(id, name, description, bypass) {
  $("#form")[0].classList.remove("was-validated");
  $("#roleModal .modal-title").html("Update Role");
  $("#roleModal #id").val(id);
  $("#roleModal #name").val(name);
  $("#roleModal #description").val(description);
  $("#bypass").attr("checked", bypass);
  $("#roleModal").modal("show");
}
function deleteRow(id, name) {
  $("#list").empty();
  $("#list").append(`<li data-id="${id}">${name}</li>`);
  $("#deleteDialog .modal-title").html("Delete Role");
  $("#deleteDialog #bdelete").off("click");
  $.post(
    "/userList",
    {  },
    function (result) {
      if (result.length) {
        const userList  =result
        let isRoleExist;
          isRoleExist = userList.filter((val)=>{
                return val.roleid ==parseInt(id) && val.status ==='ACTIVE'
          })
          if(isRoleExist &&isRoleExist.length){
            $("#deleteCheckDialog .modal-title").html("Role is used on user");
            $("#dc-message").html("<p>Delete following on user </p>");
            $("#deleteCheckDialog").modal("show");
  
            var html_text = '';
            isRoleExist.forEach(function(item) {
              html_text += "<li>"+item.firstname+" "+item.lastname+"</li>";
            });
  
            $("#dc-list").html(html_text);
            return
          }else{
            $("#deleteDialog #bdelete").click(() => {
              $("#deleteDialog #bdelete").prop("disabled", true);
              singleDelete(id);
            });
            $("#deleteDialog").modal("show");
          }
          
        // for (let error of result.errors) {
        //   notify(`${error.message}`, "error");
        // }
        $("#loader").hide();
      } else {
        $("#loader").hide();  
      }
    }
  );

}
