function uncheck(id) {
  $(`#tierList #${id}`).click(function () {
    if (!$(this).checked) {
      $("#checkAll").attr("checked", false);
    }
  });
}

/**
 * Page forms
 */
var _cloneForm = document.getElementById('cloneForm');
var fromClubId;
$(document).ready(function () {

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

  $(".select2").each(function () {
    $(this)
      .wrap("<div class=\"position-relative\"></div>")
      .select2({
        placeholder: "Select value",
        dropdownParent: $(this).parent()
      });
  })
  /**
  * clubs filter  
  */
  $('#club').on('change', function () {
    let clubId = $(this).val();
    fromClubId = clubId;
    renderClublangauge(clubId, [])
  });


  $("#page_list_clone").click(function () {
    $('#loader').show();
    let ele = $("#main-table-clone");
    $(ele).find('tbody tr').remove();
    $.get("/templates/clone_tier_item.html", function (template) {
      $.each(pageData, function (index, item) {
        $.tmpl(template, item).appendTo(ele);
      })
    })
    $('#loader').hide();
    $('#clone-page-confirm').removeAttr('disabled')
    $("#cloneModal").modal("show");
  })

  $("#clone-page-confirm").click(function () {
    $('#loader').show();
    if (!_cloneForm.reportValidity()) {
      _cloneForm.reportValidity();
      $('#loader').hide();
      return;
    }

    if ($('.clone-check:checkbox:checked').length == 0) {
      notify('Select pages to be cloned', 'warning')
      $('#loader').hide();
      return;
    }
    $('#clone-page-confirm').attr('disabled', 'disabled')
    let ids = [];
    $('.clone-check:checkbox:checked').each(function () {
      ids.push(Number($(this).data('id')))
    });

    let input = {
      ids: ids,
      toClubId: $('#clone_club').val(),
      fromClubId: fromClubId,
    };
    $.post(`${api_url}/clonepage`, input, function (result) {
      notify("successfully updated", "success");

      /*
      if (result.data && result.data.updatePage) {
        if (result.data.updatePage.success) {
          notify(field + " successfully updated", "success");
        } else {
          notify(result.data.updatePage.message, "error");
        }
      }
      */
    });

    $('#loader').hide();
    //$("#cloneModal").modal("show");
  })

  // $.get("/club/list", (result) => {
  //   $("#club").html('')
  //   $("#ByClub").html('')
  //   $('#loader').show();
  //   let html = ``;
  //   html = `<option value="">Choose Club</option>`
  //   if (result.errors) {
  //     notify(result.errors[0].message, "error");
  //   } else {
  //     clubList = result
  //     $.each(result, (i, res) => {
  //       html += `<option value=${res.id}>${res.name}</option>`
  //     });
  //     $("#club").html(html)
  //     $("#ByClub").html(html)
  //   }
  //   $('#loader').hide();
  // });
  fill_club_list("#club");
  fill_club_list("#ByClub");

  tierList();
  $("#tierModal").on("shown.bs.modal", function () {
    $("#name").focus();
  });

  $("#AddNewTier").click(function () {
    $("#newForm")[0].classList.remove("was-validated");
    $("#tierModal .modal-title").html("Add Tier");

    $('#Save').removeAttr('disabled');
    $('#languagesCont').empty()
    $("#tierModal #club").val("").trigger("change");
    $("#tierModal #name").val("");
    $("#tierModal #description").val("");
    $("#tierId").val("");

    $("#tierModal").modal("show");
  });

  $("#ActiveTier").click(function () {
    let cbs = $.find("#tierList tr input[name='cbRow']");
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
      $("#activeDialog .modal-title").html("Active Tiers");
      $("#activeDialog #bactive").off("click");
      $("#activeDialog #bactive").click(() => {
        $("#activeDialog #bactive").prop("disabled", true);
        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Tier(s) not selected", "warning");
    }
  });

  $("#InactiveTier").click(function () {
    let cbs = $.find("#tierList tr input[name='cbRow']");
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
      $("#inactiveDialog .modal-title").html("Inactive Tiers");
      $("#inactiveDialog #binactive").off("click");
      $("#inactiveDialog #binactive").click(() => {
        $("#inactiveDialog #binactive").prop("disabled", true);
        bulkInactive();
      });
      $("#inactiveDialog").modal("show");
    } else {
      notify("Tier(s) not selected", "warning");
    }
  });

  $("#Save").click(function () {
    let _addForm = $('#newForm')[0];
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      return;
    }
    $("#Save").prop("disabled", true);
    $("#loader").show();
    let names = [];
    $('.languageSet').each(function (i, obj) {
      names.push({ language: $(obj).data('code'), name: $(obj).val() })
    });
    let input = {
      name: $("#name").val().toUpperCase(),
      club: $("#club").val(),
      chargeable: $("input[name=chargeable]:checked").val(),
      referral: $("input[name=referral]:checked").val(),
      status: "ACTIVE",
      names: names
    };
    if (names?.length == 0) {
      delete input.names
    }
    if ($("#tierId").val() !== "") {
      input.id = $("#tierId").val();
      $.post("/updateTier", input, function (result) {
        if (result?.data) {
          if (result?.data?.updateTier?.success) {
            notify(result?.data?.updateTier?.message, "success");
            tierList()
          } else {
            notify(result?.data?.updateTier?.message, "error");
          }
        } else {
          notify(result?.errors[0]?.message, "error");
        }

        $("#loader").hide();
        $("#tierModal").modal("hide");
        $("#Save").prop("disabled", false);
      });
    } else {
      $.post("/addTier", input, function (result) {
        if (result?.data) {
          if (result?.data?.addTier?.success) {
            notify(result?.data?.addTier?.message, "success");
          } else {
            notify(result?.data?.addTier?.message, "error");
          }
        } else {
          notify(result?.errors[0]?.message, "error");
        }

        $("#loader").hide();
        $("#tierModal").modal("hide");
        $("#Save").prop("disabled", false);
        tierList();
      });
    }
  });

  $(".closeAll").click(function () {
    $("#name").val("");
    $("#newRoleForm")[0].classList.remove("was-validated");
  });

  $("#deleteAll").click(() => {
    let cbs = $.find("#tierList tr input[name='cbRow']");
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
      $("#deleteDialog .modal-title").html("Delete Tier");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#deleteDialog #bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Tier(s) not selected", "warning");
    }
  });

  $("#tablerecords #ByName").change(function () {
    tierList();
  });

  $("#tablerecords #ByStatus").change(function () {
    tierList();
  });

  $("#ByChargable").change(function () {
    tierList();
  });

  $("#ByReferral").change(function () {
    tierList();
  });

  $("#ByClub").change(function () {
    tierList();
  });
});

function tierList() {
  var status = $("#ByStatus").val();
  $("#tierList").empty();
  $("#loader").show();
  $.post(
    "/tierList",
    {
      name: $("#ByName").val(),
      chargable: $("#ByChargable").val(),
      referral: $("#ByReferral").val(),
      club: $("#ByClub").val(),
      status: status,
    },
    function (result) {

      if (result.length) {
        result.sort((a, b) => a.name.localeCompare(b.name))
        $.get("/templates/tier_item.html", function (template) {
          $.each(result, function (index, item) {
            $.tmpl(template, item).appendTo("#tierList");
          })
          _CMSpagination = new Pager({
            divId: 'fPage',
            tableId: 'tablerecords',
            noContentMsg: 'No Content found',
            filter: false,
            deleteAll: function (e) {
              if ($('.delete-check:checkbox:checked').length > 0) {
                $('#deleteModal').modal('show')
                $('#delete-confirm').data('id', 'all') // id referene for delete use
              } else {
                setMsg('No record selected for delete')
              }
            },
          })
        });

        $("#loader").hide();


      } else {
        var rec = `<td colspan="8" align="center">No Records found</td>`;
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
  let cbs = $.find("#tierList tr input[name='cbRow']");
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
        const response = await fetch("/removeTier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result?.data && result?.data?.removerole) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Tier deleted successfully", "success");
      tierList();
    } else {
      notify("Unable to delete Tier(s)", "error");
    }
    $("#loader").hide();
    $("#deleteDialog #bdelete").prop("disabled", false);
  }
  $("#deleteDialog").modal("hide");
}

async function bulkActive() {
  $("#loader").show();
  let cbs = $.find("#tierList tr input[name='cbRow']");
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
        const response = await fetch("/activeTier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result?.data && result?.data?.activeTier) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Tier activated successfully", "success");
      tierList();
    } else {
      notify("Unable to activate Tier(s)", "error");
    }
    $("#loader").hide();
    $("#activeDialog #bactive").prop("disabled", false);
  }
  $("#activeDialog").modal("hide");
}

async function bulkInactive() {
  $("#loader").show();
  let cbs = $.find("#tierList tr input[name='cbRow']");
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
        const response = await fetch("/inactiveTier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result?.data && result?.data?.inactiveTier) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Tier deactivated successfully", "success");
      tierList();
    } else {
      notify("Unable to deactivate Tier(s)", "error");
    }
    $("#loader").hide();
    $("#inactiveDialog #binactive").prop("disabled", false);
  }
  $("#inactiveDialog").modal("hide");
}

function singleDelete(id) {
  $("#loader").show();

  $.post(
    "/removeTier",
    {
      id: id,
    },
    function (result) {
      $("#loader").hide();
      if (result?.data && result?.data?.removeTier) {
        notify(result?.data?.removeTier?.message, "success");
      } else {
        notify(result?.errors[0]?.message, "error");
      }
      tierList();
    }
  );
  $("#loader").hide();
  $("#deleteDialog #bdelete").prop("disabled", false);
  $("#deleteDialog").modal("hide");
}

function updateRow(id, name, clubid, referral, chargeable, names) {
  $("#newForm")[0].classList.remove("was-validated");
  $('#Save').removeAttr('disabled')
  $("#tierModal .modal-title").html("Update Tier");
  $("#tierModal #tierId").val(id);
  $("#tierModal #name").val(name);
  $("#tierModal #club").val(clubid).trigger("change");
  $("#tierModal [name=chargeable][value=" + chargeable + "]").prop("checked", true);
  $("#tierModal [name=referral][value=" + referral + "]").prop("checked", true);
  $('#languagesCont').empty();
  renderClublangauge(clubid, JSON.parse(names));
  $("#tierModal").modal("show");

}
function deleteRow(id, name) {
  $("#loader").show();

  $.post("/check-language-exist", { tierId: id, }, function (result) {
    // console.log(result);
    $("#loader").hide();
    if (result?.data && result?.data?.languages) {
      let language_list = result?.data?.languages?.result;
      if (language_list == null || language_list.length == 0) {
        $("#list").empty();
        $("#list").append(`<li data-id="${id}">${name}</li>`);
        $("#deleteDialog .modal-title").html("Delete Tier");
        $("#deleteDialog #bdelete").off("click");
        $("#deleteDialog #bdelete").click(() => {
          $("#deleteDialog #bdelete").prop("disabled", true);
          singleDelete(id);
        });
        $("#deleteDialog").modal("show");
      }
      else {
        $("#deleteCheckDialog .modal-title").html("Tier is used on Languages");
        $("#dc-message").html("<p>Delete following on Languages </p>");
        $("#deleteCheckDialog").modal("show");

        var html_text = '';
        language_list.forEach(function (item) {
          html_text += "<li>" + item.name + "</li>";
        });

        $("#dc-list").html(html_text);
      }
    } else {
      notify(result?.errors[0]?.message, "error");
    }
  });




}


function renderClublangauge(clubId, names) {
  // console.log(clubId);
  // console.log(names);
  $("#newForm")[0].classList.remove("was-validated");
  $('#loader').show().css({ 'z-index': 99999 });
  $.get("/language/list/" + clubId, function (results) {
    // console.log(result);
    $('#languagesCont').empty().append(`
                  <div class="row"style="display: flex;justify-content: space-between;">
										<div class="col">
											<div class="mb-3">
												<span>Tier Languages</span>
										  </div>
                    </div>
									</div>`);
    let result = results.languages;
    if (result && result.length > 0) {
      let check = [];
      if (names) {
        check = names.map(a => a.language);
      }

      result.forEach(element => {
        let value = '';
        console.log(element)
        if (check.includes(element.code)) {
          let selected = names.filter(item => item.language == element.code);
          value = selected[0].name
        }
        let str = `<div class="row"
														style="display: flex;justify-content: space-between;">
														<div class="col">
															<div class="input-group mb-3">
																<span class="input-group-text w-25">${element.name}</span>
																<input class="form-control languageSet" value="${value}" required data-code='${element.code}'/>
															  <div class="invalid-feedback">
                                  ${element.name} value required
                                </div>
                              </div>
														</div>
													</div>`;
        $('#Save').removeAttr('disabled')

        $('#languagesCont').append(str)
      });
    }
    else {
      $('#languagesCont').empty().append(`
                  <div class="row"style="display: flex;justify-content: space-between;">
										<div class="col">
											<div class="mb-3">
												<span>Languages not found for club, required! </span>
										  </div>
                    </div>
									</div>`);
      $('#Save').attr('disabled', 'disabled')
    }
    $('#languagesCont').show();
    $('#loader').hide().css({ 'z-index': '' });
  })
}