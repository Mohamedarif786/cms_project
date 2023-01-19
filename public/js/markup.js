let markup_list = [];
let selected_Module = 0;
let selected_Tier = 0;
let selected_Supplier = 0;
$(document).ready(function () {
  $(".select2").each(function () {
    $(this)
      .wrap('<div class="position-relative"></div>')
      .select2({
        dropdownParent: $(this).parent(),
      });
  });
  // $.get("/club/list", {}, (result) => {
  //     let html = ``;
  //     html = `<option value="">Choose Club</option>`
  //     if (result.length != 0) {
  //         $.each(result, (i, res) => {
  //             html += `<option value=${res.id}>${res.name}</option>`
  //         })
  //         $("#markupClubId").html(html)
  //         $("#UpdateMarkupClubId").html(html)
  //     }
  // })
  fill_club_list("#markupClubId");

  markupList();
  let _addForm = $("#markupForm")[0];
  //add
  $("#addMarkup").click(function () {
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      return;
    }
    $("#loader").show();
    let input = $("#markupForm").serialize();

    const markupid = $("#markupid").val();
    const method = $("#method").val();
    const dependon = $("#dependon").val();
    if (markupid == "") {
      addMarkup(input);
    } else {
      input = input + "&markupid=" + markupid;
      // input = input + "&method=" + method;
     
      updateMarkup(input);
    }
  });

  function updateMarkup(input) {
    $.post("/updateMarkup", input, function (result) {
      if (!result.errors) {
        $("#newUserModal").modal("hide");
        notify("Markup updated successfully", "success");
        markupList();
        $("#loader").hide();
      } else {
        $("#newUserModal").modal("hide");
        notify(result.errors[0].message, "error");
        $("#loader").hide();
      }
    });
  }

  function addMarkup(inputdata) {
    $.post("/markup", inputdata, function (markupResult) {
      // console.log(inputdata.unserialize())
      if (markupResult?.errors) {
        notify(markupResult?.errors[0]?.message, "error");
        $("#loader").hide();
      } else {
        if (markupResult?.data?.addMarkup?.success) {
          notify("Markup created successfully", "success");
          $("#newUserModal").modal("hide");
          markupList();
        } else {
          notify(markupResult?.data?.addMarkup?.message, "error");
        }
        $("#loader").hide();
      }
    });
  }
  //update

  $("#Not").click(() => {
    $("#deleteAllUserModal").modal("hide");
  });

  $("#No").click(() => {
    $("#deleteUserModal").modal("hide");
  });

  $("#Yes").click(() => {
    $("#deleteUserModal").modal("hide");
    $("#confirmModal").modal("show");
    let input = {
      supplierid: parseInt($("#hiddensupplierid").val()),
      suppliername: $("#hiddensuppliername").val(),
    };
    var html1 = ``;
    html1 += `<h4 style="margin-top: 10px;">${input?.suppliername}</h4>`;
    $("#confrmdelete").html(html1);
  });
  $("#deleteAll").click(() => {
    let cbs = $.find("#markupList tr input[name='cbRow']");
    // console.log(cbs);
    $("#list").empty();
    let idx = 0;
    $(cbs).each(function () {
      if (this.checked) {
        idx++;
        // $('#list').append(
        //   `<li data-id="${$(this).data('id')}">${$(this).data('email')}</li>`,
        // )
      }
    });
    if (idx > 0) {
      $("#deleteDialog .modal-title").html("Delete Markup");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Markup(s) not selected", "warning");
    }
  });

  // $('#notConfirm').click(() => {
  //     $("#confirmModal").modal('hide')
  // })

  //delete
  $("#delete").click(() => {
    let input = {
      removemarkupId: parseInt($("#hiddenmarkupid").val()),
    };
    $("#loader").show();
    $.post("/removeMarkup", input, function (result) {
      if (result.data) {
        $("#confirmModal").modal("hide");
        markupList();
        $("#loader").hide();
        notify("Supplier Deleted successfully", "success");
        $("#confirmModal").modal("hide");
      } else {
        for (let error of result?.errors) {
          notify(`${error?.message}`, "error");
        }
      }
    });
  });

  /* Active & Inactive */
  $("#ActiveMarkup").click(function () {
    let cbs = $.find("#markupList tr input[name='cbRow']");
    $("#activeDialog #list").empty();
    let idx = 0;
    $(cbs).each(function () {
      if (this.checked) {
        idx++;
        // $('#activeDialog #list').append(
        //   `<li data-id="${$(this).data('id')}">${$(this).data('email')}</li>`,
        // )
      }
    });
    if (idx > 0) {
      $("#activeDialog .modal-title").html("Active Markup");
      $("#activeDialog #bactive").off("click");
      $("#activeDialog #bactive").click(() => {
        $("#bactive").prop("disabled", true);
        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Markup(s) not selected", "warning");
    }
  });

  $("#InactiveMarkup").click(function () {
    let cbs = $.find("#markupList tr input[name='cbRow']");
    $("#inactiveDialog #list").empty();
    let idx = 0;
    $(cbs).each(function () {
      if (this.checked) {
        idx++;
        // $('#inactiveDialog #list').append(
        //   `<li data-id="${$(this).data('id')}">${$(this).data('email')}</li>`,
        // )
      }
    });
    if (idx > 0) {
      $("#inactiveDialog .modal-title").html("Inactive Markup");
      $("#inactiveDialog").modal("show");
    } else {
      notify("Markup(s) not selected", "warning");
    }
  });
  $("#inactiveDialog #binactive").click(() => {
    $("#inactiveDialog #binactive").prop("disabled", true);
    bulkInactive();
  });
  $("#ByStatus").change(function () {
    markupList();
  });
});
async function bulkActive() {
  $("#loader").show();
  let cbs = $.find("#markupList tr input[name='cbRow']");
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
        const response = await fetch("/activeMarkup", {
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
      notify("Markup activated successfully", "success");
      markupList();
    } else {
      notify("Unable to activate Markup(s)", "error");
    }
    $("#loader").hide();
  }
  $("#activeDialog").modal("hide");
  $("#bactive").prop("disabled", false);
  // $('.modal-backdrop').remove()
}
async function bulkInactive() {
  $("#loader").show();
  let cbs = $.find("#markupList tr input[name='cbRow']");
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
        const response = await fetch("/inactiveMarkup", {
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
      notify("Markup deactivated successfully", "success");
      markupList();
    } else {
      notify("Unable to deactivate Markup(s)", "error");
    }
    $("#loader").hide();
  }
  $("#inactiveDialog").modal("hide");
  $("#inactiveDialog #binactive").prop("disabled", false);
  // $('.modal-backdrop').remove()
}
$(document).on("click", ".delete-resource", function () {
  let id = $(this).data("id");
  $("#list").empty();
  // $("#list").append(`<li data-id="${id}">${$(this).data('name')}</li>`);
  $("#deleteDialog .modal-title").html("Delete Resource(s)");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    $("#bdelete").prop("disabled", true);
    singleDelete(id);
  });
  $("#deleteDialog").modal("show");
});
async function singleDelete(id) {
  $("#loader").show();
  const response = await fetch("/removeMarkup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }), // body data type must match "Content-Type" header
  });
  $("#loader").hide();
  $("#deleteDialog").modal("hide");
  markupList();
  $("#bdelete").prop("disabled", false);
}
function uncheck(id) {
  $(`#markupList #${id}`).click(function () {
    if (!$(this).checked) {
      $("#checkAll").attr("checked", false);
    }
  });
}
function getSupplier(id) {
  $("#loader").show();
  $("#supplierid").html("");
  $.post("/moduleSupplierList", { id: id }, (result) => {
    let html = ``;
    html = `<option value="">Choose Supplier</option>`;
    if (result?.data?.suppliers?.result?.length != 0) {
      $.each(result?.data?.suppliers?.result, (i, res) => {
        // console.log(parseInt(res.moduleid))
        if (selected_Supplier != 0 && selected_Supplier == res.id) {
          html += `<option selected value=${res.id}>${res?.name}</option>`;
        } else {
          html += `<option value=${res.id}>${res?.name}</option>`;
        }
      });

      $("#supplierid").html(html).trigger("change");
    }
    $("#loader").hide();
  });
}
var validate = function (e) {
  var t = e.value;
  e.value =
    t.indexOf(".") >= 0
      ? t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)
      : t;
};

$(".valid").keypress(function (event) {
  var $this = $(this);
  if (
    (event.which != 46 || $this.val().indexOf(".") != -1) &&
    (event.which < 48 || event.which > 57) &&
    event.which != 0 &&
    event.which != 8
  ) {
    event.preventDefault();
  }

  var text = $(this).val();
  if (event.which == 46 && text.indexOf(".") == -1) {
    setTimeout(function () {
      if ($this.val().substring($this.val().indexOf(".")).length > 3) {
        $this.val($this.val().substring(0, $this.val().indexOf(".") + 3));
      }
    }, 1);
  }

  if (
    text.indexOf(".") != -1 &&
    text.substring(text.indexOf(".")).length > 2 &&
    event.which != 0 &&
    event.which != 8 &&
    $(this)[0].selectionStart >= text.length - 2
  ) {
    event.preventDefault();
  }
});

$(".valid").bind("paste", function (e) {
  var text = e.originalEvent.clipboardData.getData("Text");
  if ($.isNumeric(text)) {
    if (
      text.substring(text.indexOf(".")).length > 3 &&
      text.indexOf(".") > -1
    ) {
      e.preventDefault();
      $(this).val(text.substring(0, text.indexOf(".") + 3));
    }
  } else {
    e.preventDefault();
  }
});

function markupList(status = "") {
  $("#markupList").html("");
  $("#loader").show();
  let input = {};
  input.status = $("#ByStatus").val();

  $.post("/markupList", { input }, function (result) {
    if (result.length) {
      markup_list = result;

      $.get("/templates/markup_item.html", function (template) {
        $.each(result, function (index, item) {
          if (item != null) {
            $.tmpl(template, item).appendTo("#markupList");
          }
        });
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
      var rec = ` `;
      rec += `<td colspan="4" align="center">No Records found</td>`;
      $("#norecords").html(rec);
    }
    $("#loader").hide();
  });
}
async function existName(id = null, type) {
  return new Promise((resolve, reject) => {
    $.post("/markupList", {}, (result) => {
      if (result.length) {
        if (type == 1) {
          result.splice(
            result.findIndex((res) => res.id == parseInt(id)),
            1
          );
          let emailExist = result.findIndex((res) => res.id == parseInt(id));
          resolve(emailExist);
        } else {
          if (no != null)
            result.splice(
              result.findIndex((res) => res.email == email),
              1
            );
          let emailExist = result.findIndex((res) => res.email == email);
          resolve(emailExist);
        }
      } else {
        reject(undefined);
      }
    });
  });
}
async function updaterolePromt(markupid) {
  clear_form("#markupForm");
  $("#markupid").val(markupid);
  let update = await existName(parseInt($("#markupid").val()), 1);
  if (update == -1) {
    markup_list.forEach(function (value, index) {
      if (value.id == markupid) {
        $("#markupClubId").val(value.clubid).trigger("change");
        $("#moduleid").val(value.moduleid).trigger("change");
        $("#tierid").val(value.tierid).trigger("change");
        $("#supplierid").val(value.supplierid).trigger("change");
        $("#ratetype").val(value.ratetype);
        $("#payment").val(value.payment);
        $("#distribution_type").val(value.distribution_type);
        $("#public_price").val(value.public_price);
        $("#fop").val(value.fop);
        $("#dependon").val(value.dependon);
        $("#method").val(value.method);
        $("#margin").val(value.margin);
        $("#credit").val(value.credit);
        $("#discount").val(value.discount);
        $("#newUserModal").modal("show");
        $("#margin").prop("readonly", false);
        $("#credit").prop("readonly", false);
        $("#discount").prop("readonly", false);
        $("#newUserModal .modal-title").html("Update Markup");

        selected_Module = value.moduleid;
        selected_Tier = value.tierid;
        selected_Supplier = value.supplierid;
      }
    });
  }
}

function deletePromt(supplierid) {
  document.querySelector("#deleteUserForm").reset();
  $("#hiddenmarkupid").val(supplierid);
}

$("#checkAll").click(function () {
  $("input:checkbox")
    .not("#flexSwitchCheckDefault")
    .prop("checked", this.checked);
});

async function bulkDelete() {
  $("#loader").show();
  let cbs = $.find("#markupList tr input[name='cbRow']");
  let ids = [];

  $(cbs).each(function () {
    if (this.checked) ids.push(parseInt($(this).data("id")));
  });

  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (req) => {
        const response = await fetch("/removeMarkup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: req,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data.removeMarkup.success) {
          return req;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("markup deleted successfully", "success");
      markupList();
    } else {
      notify("Unable to delete markup(s)", "error");
    }
    $("#loader").hide();
  }
  $("#bdelete").prop("disabled", false);
  $("#deleteDialog").modal("hide");
}

function closeModal(modalname) {
  document.getElementById(modalname).reset();
  clear_form("#markupForm");
  $("#margin").val("0.00").prop("readonly", true);
  $("#credit").val("0.00").prop("readonly", true);
  $("#discount").val("0.00").prop("readonly", true);
  $("#markupClubId").val("0").trigger("change");
  $("#markupid").val("");
  $("#newUserModal .modal-title").html("New Markup");

  selected_Module = 0;
  selected_Tier = 0;
  selected_Supplier = 0;
}
function clubChanged() {
  let clubId = $("#markupClubId").val();
  if (clubId != "" && clubId != 0 && clubId != null) {
    $.post("/club-module/list", { clubId: clubId }, (result) => {
      let html = ``;
      html = `<option value="">Choose Module</option>`;
      if (result != null && result.length != 0) {
        $.each(result, (i, res) => {
          if (selected_Module != 0 && selected_Module == res.id) {
            html += `<option selected value=${res.moduleid}>${res.name}</option>`;
          } else {
            html += `<option value=${res.moduleid}>${res.name}</option>`;
          }
        });
      }
      $("#moduleid").html(html).trigger("change");
    });

    $.post("/clubTierList", { clubId: clubId }, (result) => {
      let html = ``;
      html = `<option value="">Choose Tier</option>`;
      if (result?.data?.tiers?.result?.length != 0) {
        $.each(result?.data?.tiers?.result, (i, res) => {
          if (selected_Tier != 0 && selected_Tier == res.id) {
            html += `<option selected value=${res.id}>${res.name}</option>`;
          } else {
            html += `<option value=${res.id}>${res.name}</option>`;
          }
        });

        $("#tierid").html(html).trigger("change");
      }
    });
  }
}
