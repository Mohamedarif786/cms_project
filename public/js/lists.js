//toDo move to CDN structure / minify

/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
let currentData = "";
let curentName = "";

$(document).ready(function () {
  /**
   * toggle helper for page
   */
  let exp = false;

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
   * Page forms
   */
  var _addForm = $("#addForm")[0];
  var _editForm = $("#editForm")[0];
  /**
   * Filter method
   */
  $("#advanceSearch").on("click", function () {
    if (!exp) {
      $("#advanceSearch").html("Hide Filter");
      $("#orderSetting").show("slide");
      $("#orderContent").removeClass("col-12").addClass("col-10");
    } else {
      $("#advanceSearch").html("Filter");
      $("#orderSetting").hide();
      $("#orderContent").removeClass("col-10").addClass("col-12");
    }
    exp = !exp;
    $("#clearFilter").toggle();
  });

  /**
   * side nav toggle method
   */
  $(".sidebar-toggle").on("click", function () {
    $("#sidebar").toggleClass("collapsed");
  });


  /**
   * Opens add popup
   */
  $("#add-resource").on("click", function () {
    //$('#selectedParent').hide();
    $(".itemData").hide();
    $(".prentData").hide();
    if (currentData != "") {
      //$('#selectedParent').show();
      $(".itemData").show();
      $(".prentData").show();
      $("#selectedParentText").html(
        "Selected Parent " +
        "<strong>" +
        $("#jstree").jstree("get_selected", true)[0].text +
        "</strong>"
      );
    } else {
      $(".itemData").hide();
      $(".prentData").show();
    }
    $("#addModal").modal("show");
  });

  /**
   * Add method
   */
  $("#add-confirm").on("click", function () {
    $("#loader").show();
    $("#add-confirm").prop("disabled", true);
    // if (currentData != "") {
    //  $("#resourceName").removeAttr("required");
    //  $("#resourceValue").attr("required", "required");
    //  $("#resourceText").attr("required", "required");
    //} else
    {
      $("#resourceName").attr("required", "required");
      $("#resourceValue").removeAttr("required");
      $("#resourceText").removeAttr("required");
    }
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      $("#loader").hide();
      $("#add-confirm").prop("disabled", false);
      return;
    }
    let _data = {
      name: $("#resourceName").val(),
      value: $("#resourceValue").val(),
      text: $("#resourceText").val(),
      status: $("#resourceStatus").is(":checked") ? "ACTIVE" : "INACTIVE",
    };
    if (currentData != "") {
      _data.parentid = currentData;
      // _data.name = $('#jstree').jstree('get_selected', true)[0].text;
    }
    $.post(_apiBase, _data, function (res) {
      $("#addModal").modal("hide");
      if (res && !res.errors) {
        notify("Record Added", "success");
        _getPageData(true);
      } else {
        notify(res.errors[0].message, "error");
      }
      $("#add-confirm").prop("disabled", false);
      _addForm.reset();
      $("#loader").hide();
    });
  });

  $("#edit-confirm").click(function () {
    $("#loader").show();
    let _data = {
      id: listUpdateId,//$("#editListId").val(),
      name: $("#editResourceName").val(),
      value: $("#editResourceValue").val(),
      text: $("#editResourceText").val(),
    };
    $.post(_apiBase + "/update", _data, function (res) {
      $("#editModal").modal("hide");
      if (res && !res.errors) {
        if (res.data.updateList.success) {
          notify("Record Edit", "success");
          _getPageData(true);
        }
        else {
          notify(res.data.updateList.message, "error");
        }
      } else {
        notify(res.errors[0].message, "error");
      }
      $("#add-confirm").prop("disabled", false);
      _editForm.reset();
      $("#loader").hide();
    });
  });

  /*$('#jstree').on("select_node.jstree", function (e, data) {
    var inst = data.insttance;
    var level = inst.get_path().length;
    var selected = inst.get_selected();
    var id = selected.attr('id');
    var name = selected.prop('tagName');
    console.log(name, id, level);
  });
  */

  /**
   * Tree change method
   */

  $(document).on("click", ".delete-resource", function () {
    let id = $(this).data("id");
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#deleteDialog .modal-title").html("Delete Resource(s)");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      singleDelete(id);
    });
    $("#deleteDialog").modal("show");
  });

  /**
* Opens edit popup 
*/
  var listUpdateId = "";
  $(document).on('click', '.edit-resource', function () {
    _editForm.reset();
    $('#loader').show();
    $('#editModal').modal('show');
    let id = $(this).data('id');
    $.get(_apiBase + "/" + id, {}, function (res) {
      console.log(res)
      if (res && !res.errors) {
        let _res = res;
        setTimeout(() => {
          $(".itemData").hide();
          $(".prentData").hide();
          if (currentData == "") {
            $("#selectedParentText").html(
              "Selected Parent " +
              "<strong>" +
              curentName +
              "</strong>"
            );
          }

          $('#editResourceName').val(res.name);
          $('#editResourceValue').val(res.items && res.items[0] ? res.items[0].value : '');
          $('#editResourceText').val(res.items && res.items[0] ? res.items[0].text : '');
          listUpdateId = _res.id;
          //currentData = _res.id;
          console.log(typeof (_res.items[0].text), _res.items[0].text)
          if (_res.items[0].text == null) {
            $(".itemData").hide();
            $(".prentData").show();
          } else {
            $(".itemData").show();
            $(".prentData").show();
          }

          //$('#edit-page-confirm').data('id', _res.id);// referene for edit use
          $('#loader').hide();

        });
      }
    })
  })

  async function singleDelete(id) {
    $("#loader").show();
    $.post(
      "/list/delete",
      {
        id: id,
      },
      function (result) {
        if (result.data && result.data.removeList && result.data.removeList.success) {
          notify(result.data.removeList.message, "success");
          //currentData = id
          _getPageData(true);
        } else {
          notify(result.data.removeList.message, "error");
          $("#loader").hide();
        }
      }
    );
    $("#deleteDialog").modal("hide");
  }
  /**
   * initial page loader method
   */
  function _getPageData(_setFirst) {
    $("#loader").show();
    $.get(_apiBase + "/lists", {}, function (list) {
      if (list && list.length > 0) {
        let data = [];
        let map = {};
        let node;
        for (let i = 0; i < list.length; i++) {
          map[list[i].id] = i;
          list[i].text = list[i].name;
        }
        for (let i = 0; i < list.length; i++) {
          node = list[i];
          if (node.parentid != null) {
            if (list[map[node.parentid]] == undefined) {
              list[map[node.parentid]] = [];
            }
            if (list[map[node.parentid]].children == undefined) {
              list[map[node.parentid]].children = [];
            }
            list[map[node.parentid]].children.push(node);
          } else {
            data.push(node);
          }
          if (i == 0 && _setFirst) {
            node.state = { selected: true }
            currentData = node.id;
            setTimeout(() => {
              curentName = $("#jstree").jstree("get_selected", true)[0].text;
            }, 100);
          }
          delete node.parentid;
          delete node.parent;
          delete node.name;
        }
        // console.log(data)
        $("#jstree").jstree("destroy");
        // bindChange()
        $("#jstree").jstree({
          core: {
            data: data,
          },
        });
      }
      bindChange();
      $("#loader").hide();

    });
  }
  _getPageData(false);
});

function bindChange() {
  $("#jstree").on("changed.jstree", function (e, data) {
    $("#loader").show();
    currentData = data.selected[0];
    curentName = $("#jstree").jstree("get_selected", true)[0].text
    $.get(_apiBase + "/" + currentData, {}, function (res) {
      if (res && !res.errors) {
        // console.log(res)
        $.get("/templates/lists_item.html", function (template) {

          $("#main-table").find("tbody").html("");
          try {
            let item = {
              id: currentData,
              name: $("#jstree").jstree("get_selected", true)[0].text,
            };
            $.tmpl(template, item).appendTo($("#main-table"));
          } catch (error) {

          }
          $("#main-table").show();
        });
      } else {
        notify(res.errors[0].message, "error");
      }
      $("#loader").hide();
    });
  });
}

function edit_data(id) {
  return;
}
