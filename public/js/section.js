const api_url = "/section";
let sectionInputOld;
let old_value, new_value;
$(document).ready(function () {
  section_list();
  tinymce.init({
    paste_as_text: true,
    selector: "#contentEditor",
    plugins: ["code"],
    height: "360",
    setup: function (editor) {
      editor.on("focusin", function (e) {
        old_value = tinymce.get("contentEditor").getContent();
        console.log("focusin-content", old_value);
      });
      editor.on("focusout", function (e) {
        new_value = tinymce.get("contentEditor").getContent();
        //console.log("old:", old_value);

        if (new_value !== old_value) {
          // console.log("new:", new_value);
          update("content");
        }

        //renderSectionForm(["content"]);
      });
    },
  });
  $("#addNewSection").click(function () {
    clear_form("#addModal #form");
    $("#addModal").modal("show");
  });

  /**
   * Prevent Bootstrap dialog from blocking focusin for code
   */
  document.addEventListener("focusin", (e) => {
    if (
      e.target.closest(
        ".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root"
      ) !== null
    ) {
      e.stopImmediatePropagation();
    }
  });

  console.log(444)
});
$(document).on("click", ".deleteRow", function () {
  let id = $(this).data("id");
  let name = $(this).data("name");
  $("#list").empty();
  $("#list").append(`<li data-id="${id}">${name}</li>`);
  $("#deleteDialog .modal-title").html("Delete Role");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    $("#deleteDialog #bdelete").prop("disabled", true);
    singleDelete(id);
  });
  $("#deleteDialog").modal("show");
});
$(document).on("click", ".editRow", function () {
  $("#addModal .modal-title").html("Update Section");
  $("#loader").show();
  let id = $(this).data("id");
  $("#addModal #id").val(id);
  $.get(api_url + "/" + id, function (result) {
    $("#loader").hide();
    if (result.data && result.data.section) {
      if (result.data.section.success) {
        let section = result.data.section.result;
        console.log("section:", section);
        $("#name").val(section.name);
        $("#title").val(section.title != null ? section.title : "");
        $("#title_position").val(section.title_position);
        $("#description").val(
          section.description != null ? section.description : ""
        );
        if (section.content !== "") {
          tinymce.get("contentEditor").setContent(window.atob(section.content));
        }
        $("#description_position").val(section.description_position);
        $("#icon").val(section.icon != null ? section.icon : "");
        $("#icon_position").val(section.icon_position);
        $("#thumbnail").val(section.thumbnail != null ? section.thumbnail : "");
        $("#thumbnail_position").val(section.thumbnail_position);
        $("#cover").val(section.banner != null ? section.banner : "");
        $("#cover_position").val(section.banner_position);
        $("#video").val(section.video != null ? section.video : "");
        $("#video_position").val(section.video_position);
        $("#language").val(section.language);
        $("#addSort").val(section.sort);
        $("#row").val(section.row);
        $("#column").val(section.column);
        $("#addModal").modal("show");
      } else {
        notify(result.data.section.message, "error");
      }
    }
  });
});
function singleDelete(id) {
  $("#loader").show();
  $.post(
    "/section/remove",
    {
      id: id,
    },
    function (result) {
      $("#loader").hide();
      if (result?.data && result?.data?.removeSection) {
        notify(result?.data?.removeSection?.message, "success");
        section_list();
      } else {
        notify(result?.data?.removeSection?.message, "error");
      }
    }
  );
  $("#loader").hide();
  $("#deleteDialog").modal("hide");
  $("#deleteDialog #bdelete").prop("disabled", false);
}
function section_list() {
  $.get(api_url + "/list/" + pageId, function (list) {
    $("#loader").hide();
    $("#section_list").empty();
    if (list.length > 0) {
      let inc = 1;
      $.each(list, function (index, item) {
        item.order = inc++;
      });
      loadData("#section_list", list, "/templates/section_item.html");
    }
  });
}

$("#addModal .field").focus(function () {
  old_value = $(this).val();
});

$("#addModal .field").focusout(function () {
  let field = $(this).attr("id");
  update(field);
});

function update(field) {
  console.log(field);
  let id = $("#addModal #id").val();
  if (id !== "") {
    let input = {
      id: id,
      pageid: pageId,
    };
    if (field) {
      if (field === "content") {
        console.log("content:", new_value);
        input["content"] = new_value;
      } else {
        new_value = $(`#${field}`).val();
        input[field] = $(`#${field}`).val();
      }
    }
    if (old_value !== new_value) {
      $("#loader").show();
      $.post(`${api_url}/update`, input, function (result) {
        $("#loader").hide();
        if (result.data && result.data.updateSection) {
          if (result.data.updateSection.success) {
            notify(field + " successfully updated", "success");
          } else {
            notify(result.data.updateSection.message, "error");
          }
        }
        section_list();
      });
    }
  } else {
    let input = {
      pageid: pageId,
    };
    if (field) {
      input[field] = $(`#${field}`).val();
    }
    $("#loader").show();
    $.post(`${api_url}/add`, input, function (result) {
      $("#loader").hide();
      if (result.data && result.data.addSection) {
        if (result.data.addSection.success) {
          $("#addModal #id").val(result.data.addSection.result.id);
          notify(field + " successfully updated", "success");
        } else {
          notify(result.data.addSection.message, "error");
        }
      }
      section_list();
    });
  }
}




let draged;
// Drag and drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {

  draged = {
    id: Number($(ev.target).find(".idx").data("id")),
    pageid: Number(pageId),
    sort: Number($(ev.target).find(".idx").text()),
  };
}

function drop(ev) {

  ev.preventDefault();
  let droped = {
    id: Number($(ev.target).closest('.col-md-3').find(".idx").data("id")),
    pageid: Number(pageId),
    sort: Number($(ev.target).closest('.col-md-3').find('.idx').text()),
  };
  let input = {
    draged: draged,
    droped: droped,
  };

  console.log(input);

  $("#loader").show();
  $.post("/section/sort", input, function (result) {
    $("#loader").hide();
    if (result.succeed) {
      notify(result.message, "success");
      section_list()
    } else {
      notify("Operation failed", "error");
    }
  });
}
