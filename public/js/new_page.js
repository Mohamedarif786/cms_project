const api_url = "/page";
let pageData = [];
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

  /**
   * Page forms
   */
  var _cloneForm = document.getElementById('cloneForm');

  $("#filter_club").change(function () {
    page_list();
    let clubId = $(this).val();
    $("#loader").show();
    $.get("/club/languages/" + clubId, function (result) {
      $("#loader").hide();
      $("#filter_language").empty();

      $("#filter_language").append(new Option("Choose Language", ""));
      $(result).each(function () {
        $("#filter_language").append(new Option(this.name, this.code));
      });
    });
    $("#loader").show();

    $.get("page/tierlist/" + clubId, {}, function (result) {
      $("#loader").hide();
      $("#tierid").empty();
      $("#tierid").append(new Option("Choose Tier", ""));
      $(result).each(function () {
        $("#tierid").append(new Option(this.name, this.id));
      });
    });
  });
  $("#filter_category").change(() => {
    page_list();
  });
  $("#filter_language").change(() => {
    page_list();
    $("#addNewPage").attr("disabled", false);
  });
  $.get("/list/lists", function (result) {
    $("#loader").hide();
    $("#filter_category").empty();
    $("#filter_category").append(new Option("Choose Category", ""));

    $(result).each(function () {
      if (this.parentid === null) {
        $("#filter_category").append(new Option(this.name, this.id));
      }
    });
  });

  $("#loader").show();
  $.post("/benefitsList", {}, function (result) {
    $("#loader").hide();
    $("#benefitid").empty();
    $("#benefitid").append(new Option("Choose Benefit", ""));
    $(result).each(function () {
      $("#benefitid").append(new Option(this.name, this.id));
    });
  });

  $("#addNewPage").click(function () {
    $("#formClubId").val($("#filter_club").val());
    $("#categoryDisplay").val($("#filter_category option:selected").text());
    $("#languageDisplay").val($("#filter_language option:selected").text());
    $("#categoryid").val($("#filter_category").val());
    $("#language").val($("#filter_language").val());
    $("#addModal").modal("show");
  });

  $("#page_list_clone").click(function () {
    $('#loader').show();
    let ele = $("#main-table");
    $(ele).find('tbody tr').remove();
    $.get("/templates/clone_page_item.html", function (template) {
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
      //toClub: $("#clone_club option:selected").text(),
      fromClubId: $("#filter_club").val(),
      categoryId: $("#filter_category").val(),
      language: $("#filter_language").val(),
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


});
function page_list() {
  let clubId = $("#filter_club").val();
  let categoryId = $("#filter_category").val();
  let language = $("#filter_language").val();
  if (clubId !== "" && categoryId !== "" && language !== "") {
    $("#loader").show();
    $.post(
      `${api_url}/list`,
      {
        clubid: clubId,
        categoryid: categoryId,
        language: language,
      },
      function (list) {
        $("#loader").hide();
        $("#page_list").empty();
        if (list.length > 0) {
          list = list.sort((a, b) => {
            return a.sort - b.sort;
          });

          let inc = 1;
          $.each(list, function (index, item) {
            item.order = inc++;
          });

          pageData = list;
          loadData("#page_list", list, "/templates/page_item.html");
          $('#page_list_clone').show()
        }
      }
    );
  } else {
    notify("Choose club, category and language", "warning");
  }
}
let old_value;
$("#addModal .field").focus(function () {
  old_value = $(this).val();
});

$("#addModal .field").focusout(function () {
  let field = $(this).attr("id");
  update(field);
});

$(document).on("click", ".edit-page", function () {
  //_addPageForm.reset();
  $("#add-page-title").html("Update Page");
  $("#loader").show();
  let id = $(this).data("id");
  $("#addModal #id").val(id);
  $("#formClubId").val($("#filter_club").val());
  $("#categoryDisplay").val($("#filter_category option:selected").text());
  $("#languageDisplay").val($("#filter_language option:selected").text());
  $("#categoryid").val($("#filter_category").val());
  $("#language").val($("#filter_language").val());
  $.get(api_url + "/" + id, {}, function (result) {
    $("#loader").hide();
    if (result.data && result.data.page) {
      if (result.data.page.success) {
        let page = result.data.page.result;
        $("#tierid").val(page.tierid);
        $("#benefitid").val(page.benefitid);
        $("#name").val(page.name);
        $("#title").val(page.title != null ? page.title : "");
        $("#title_position").val(page.title_position);
        $("#description").val(page.description != null ? page.description : "");
        $("#description_position").val(page.description_position);
        $("#icon").val(page.icon != null ? page.icon : "");
        $("#icon_position").val(page.icon_position);
        $("#thumbnail").val(page.thumbnail != null ? page.thumbnail : "");
        $("#thumbnail_position").val(page.thumbnail_position);
        $("#banner").val(page.banner != null ? page.banner : "");
        $("#banner_position").val(page.banner_position);
        $("#video").val(page.video != null ? page.video : "");
        $("#video_position").val(page.video_position);
        $("#language").val(page.language);
        $("#addSort").val(page.sort);
        $("#row").val(page.row);
        $("#column").val(page.column);
        $("#addModal").modal("show");
      } else {
        notify(result.data.page.message, "error");
      }
    }

    //$('#edit-page-confirm').data('id', _res.id);// referene for edit use
  });
});
$(document).on("click", ".deleteRow", function () {
  let id = $(this).data("id");
  let name = $(this).data("name");
  $("#list").empty();
  $("#list").append(`<li data-id="${id}">${name}</li>`);
  $("#deleteDialog .modal-title").html("Delete Page");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    singleDelete(id);
  });
  $("#deleteDialog").modal("show");
});
$(document).on("click", "#sectionModal .editSecRow", function () {
  console.log("Section Edit Click");
  $("#mamangeSectionModel").modal("show");
});
$(document).on("click", ".sectionRow", function () {
  let id = $(this).data("id");
  let name = $(this).data("name");
  window.location.href = "/sections/" + id;
});

async function singleDelete(id) {
  $("#loader").show();
  $.post("/pages/delete/" + id, {}, function (result) {
    $("#loader").hide();
    $("#deleteDialog").modal("hide");
    if (result.data && result.data.removePage) {
      if (result.data.removePage.success) {
        notify(result.data.removePage.message, "success");
      } else {
        notify(result.data.removePage.message, "error");
      }
    }
    page_list();
  });
}

function update(field) {
  let id = $("#addModal #id").val();
  if (id !== "") {
    let input = {
      id: id,
      clubid: $("#filter_club").val(),
      categoryid: $("#filter_category").val(),
      language: $("#filter_language").val(),
    };
    if (field) {
      input[field] = $(`#${field}`).val();
    }
    let new_value = $(`#${field}`).val();
    if (old_value !== new_value) {
      $("#loader").show();
      $.post(`${api_url}/update`, input, function (result) {
        $("#loader").hide();
        if (result.data && result.data.updatePage) {
          if (result.data.updatePage.success) {
            notify(field + " successfully updated", "success");
          } else {
            notify(result.data.updatePage.message, "error");
          }
        }
        page_list();
      });
    }
  } else {
    let clubId = $("#filter_club").val();
    let categoryId = $("#filter_category").val();
    let language = $("#filter_language").val();

    if (clubId === "") {
      notify("Please choose club", "error");
      return;
    }

    if (categoryId === "") {
      notify("Please choose category", "error");
      return;
    }

    if (language === "") {
      notify("Please choose language", "error");
      return;
    }

    let input = {
      clubid: $("#filter_club").val(),
      categoryid: $("#filter_category").val(),
      language: $("#filter_language").val(),
    };
    if (field) {
      input[field] = $(`#${field}`).val();
    }
    console.log(input);
    $("#loader").show();
    $.post(`${api_url}/add`, input, function (result) {
      $("#loader").hide();
      if (result.data && result.data.addPage) {
        if (result.data.addPage.success) {
          $("#addModal #id").val(result.data.addPage.result.id);
          notify(field + " successfully updated", "success");
        } else {
          notify(result.data.addPage.message, "error");
        }
      }
      page_list();
    });
  }
}

function renderSection(id, name) {
  //id = pageId;
  $("#sectionTitle").html("Section for " + name);
  $("#loader").show();
  $("#sectionRegion").show();
  let ele = $("#section-table");
  $(".sectionRows").remove();
  $("#section-table tbody").remove();
  ele.append(`<tbody id="sortable"></tbody>`);
  $(".pageDataRow").removeClass("table-warning");
  $("#row" + id).addClass("table-warning");
  $.get(api_url + "/list" + "/section/" + id, {}, function (result) {
    if (result != null) {
      result.sort((a, b) => a.sort - b.sort);
      $.get("/templates/pagesection_item.html", function (template) {
        $.each(result, function (index, item) {
          //if (isBase64(item.name)) {
          //item.name = atob(item.name);
          //}
          $.tmpl(template, item).appendTo(ele);
        });
      });
      $(".sectionHead").show();
      if ($("#sortable").sortable("instance")) {
        $("#sortable").sortable("destroy");
      }
    } else {
      $(".sectionHead").hide();
      ele.append(
        '<tr colspan=1 class="sectionRows"><td>No content found</td></td>'
      );
    }
    let oldIndex;
    let oldId;
    $("#sortable").sortable({
      start: function (e, ui) {
        // creates a temporary attribute on the element with the old index
        oldIndex = ui.item.index();
        console.log("oldIndex", oldIndex);
      },
      update: function (e, ui) {
        //console.log('ui.item.sortable.update', $($(e)[0].target.lastChild).data('id'), oldIndex)
        //console.log(index, $($(e)[0].target.lastChild).data('id'), oldIndex)

        let index = ui.item.index(); //== 0 ? ui.item.index() + 1 : ui.item.index()
        //oldIndex = oldIndex == 0 ? oldIndex + 1 : oldIndex
        let _data = {
          id: $($(ui.item)[0]).data("id"),
          sort: index,
          pageid: id,
        };
        $("#loader").show();
        $.post(_apiBase + "/sort/section", _data, function (res) {
          console.log(res);
          if (res && !res.errors) {
            if (res.data.updateSection.success == true) {
              //notify("Updated", "success");
              //renderSection(id);
            } else {
              notify(res.data.updateSection.message, "error");
            }
          } else {
            notify(res.errors[0].message, "error");
          }
          $("#loader").hide();
        });

        let _dataOld = {
          id: $($(e)[0].target.lastChild).data("id"),
          sort: oldIndex,
          pageid: id,
        };

        console.log(_data, _dataOld);
        //$('#loader').show();
        $.post(_apiBase + "/sort/section", _dataOld, function (res) {
          console.log(res);
          if (res && !res.errors) {
            if (res.data.updateSection.success == true) {
              notify("Updated", "success");
              renderSection(id);
            } else {
              notify(res.data.updateSection.message, "error");
            }
          } else {
            notify(res.errors[0].message, "error");
          }
          $("#loader").hide();
        });
      },
    });
    $("#mamangeSectionModel").modal("show");
    $("#loader").hide();
    $(".pageContent").show();
  });
}

let draged;
// Drag and drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  draged = {
    id: Number($(ev.target).find(".idx").data("id")),
    clubid: Number($("#filter_club").val()),
    categoryid: Number($("#filter_category").val()),
    language: $("#filter_language").val(),
    sort: Number($(ev.target).find(".idx").text()),
  };
}

function drop(ev) {

  ev.preventDefault();
  let droped = {
    id: Number($(ev.target).closest('.col-md-3').find(".idx").data("id")),
    clubid: Number($("#filter_club").val()),
    categoryid: Number($("#filter_category").val()),
    language: $("#filter_language").val(),
    sort: Number($(ev.target).closest('.col-md-3').find('.idx').text()),
  };
  let input = {
    draged: draged,
    droped: droped,
  };
  $("#loader").show();
  $.post("/page/sort", input, function (result) {
    $("#loader").hide();
    if (result.succeed) {
      notify(result.message, "success");
      page_list();
    } else {
      notify("Operation failed", "error");
    }
  });
}
