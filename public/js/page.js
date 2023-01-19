//toDo move to CDN structure / minify

/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
let pageName = "";
let pageUpdateId = 0;
let clubId = "";
let categoryId = "";
let language = "";

$(document).ready(function () {
  $(document).on("click", ".prepend", function () {
    $("#addModal").modal("show");
  });
  $(document).on("click", ".append", function () {
    $("#addModal").modal("show");
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

  $.get("/list/lists", function (result) {
    $("#loader").hide();
    $("#filter_category").empty();
    $("#category").empty();
    $("#filter_category").append(new Option("Choose Category", ""));
    $("#category").append(new Option("Choose Category", ""));
    $(result).each(function () {
      if (this.parentid === null) {
        $("#filter_category").append(new Option(this.name, this.id));
        $("#category").append(new Option(this.name, this.id));
      }
    });
  });
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
  var _addPageForm = document.getElementById("addPageForm");
  var _addSectionForm = document.getElementById("addSectionForm");

  /**
   * Opens add popup
   */
  $("#add-page").on("click", function () {
    _addPageForm.reset();
    pageUpdateId = 0;
    $("#add-page-title").html("Add Page");
    $("#addModal").modal("show");
  });

  /**
   * Opens add popup
   */
  $("#add-section").on("click", function () {
    _addSectionForm.reset();
    sectionUpdateId = 0;
    $("#mamangeSectionModel").modal("hide");
    $("#section-page-title").html("Add Section");
    $("#addSectionModal").modal("show");
  });

  /**
   * reff to current page id
   */
  var _pageId;

  /**
   * side nav toggle method
   */
  $(".sidebar-toggle").on("click", function () {
    $("#sidebar").toggleClass("collapsed");
  });

  /**
   * reff to current club id
   */
  let _clubId = null;
  let _clubData;

  /**
   * clubs filter
   */
  $("#filter_club").on("change", function () {
    _clubId = $(this).val();
    $("#loader").show();
    $.get("/club/languages/" + _clubId, function (result) {
      $("#loader").hide();
      $("#language").empty();
      $("#filter_language").empty();
      $("#language").append(new Option("Choose Language", ""));
      $("#filter_language").append(new Option("Choose Language", ""));
      $(result).each(function () {
        $("#language").append(new Option(this.name, this.code));
        $("#filter_language").append(new Option(this.name, this.code));
      });
    });
    $("#loader").show();
    $.get("pages/tierList/" + _clubId, {}, function (result) {
      $("#loader").hide();
      $("#tierid").empty();
      $("#tierid").append(new Option("Choose Tier", ""));
      $(result).each(function () {
        $("#tierid").append(new Option(this.name, this.id));
      });
    });

    pageList(_clubId, undefined, undefined);
  });
  $("#filter_category").change(function () {
    let clubId = $("#filter_club").val();
    let categoryId = $(this).val();
    pageList(clubId, categoryId, undefined);
  });

  $("#filter_language").change(function () {
    clubId = $("#filter_club").val();
    categoryId = $("#filter_category").val();
    language = $(this).val();
    pageList(clubId, categoryId, language);
  });
  /**
   * select render helper
   */
  function renderSelect() {

    return;
    $("#addClub")
      .empty()
      .append(
        $("<option></option>")
          .attr({ value: _clubId })
          .text($("#clubs option:selected").text())
      );

    let tiers = $("#tierid, #editTier");
    tiers.empty();
    tiers.append($("<option></option>").attr({ value: "" }).text("--Select--"));
    if (_clubData.tiers != null) {
      _clubData.tiers.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      $.each(_clubData.tiers, function (key, value) {
        tiers.append(
          $("<option></option>").attr({ value: value.id }).text(value.name)
        );
      });
    }

    let benefits = $("#benefitid, #editBenefit");
    benefits.empty();
    benefits.append(
      $("<option></option>").attr({ value: "" }).text("--Select--")
    );
    if (_clubData.benefits != null) {
      _clubData.benefits.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      $.each(_clubData.benefits, function (key, value) {
        benefits.append(
          $("<option></option>").attr({ value: value.id }).text(value.name)
        );
      });
    }

    let category = $("#filter_category, #editCategory");
    category.empty();
    category.append(
      $("<option></option>").attr({ value: "" }).text("--Select--")
    );
    if (_clubData.category != null) {
      _clubData.category.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      $.each(_clubData.category, function (key, value) {
        category.append(
          $("<option></option>").attr({ value: value.id }).text(value.name)
        );
      });
    }

    _clubData.languages.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    let languages = $("#language, #editLanguage");
    languages.empty();
    languages.append(
      $("<option></option>").attr({ value: "" }).text("--Select--")
    );
    $.each(_clubData.languages, function (key, value) {
      languages.append(
        $("<option></option>").attr({ value: value.code }).text(value.name)
      );
    });

    let sectionLanguages = $("#language, #editSectionLanguage");
    sectionLanguages.empty();
    sectionLanguages.append(
      $("<option></option>").attr({ value: "" }).text("--Select--")
    );
    $.each(_clubData.languages, function (key, value) {
      sectionLanguages.append(
        $("<option></option>").attr({ value: value.code }).text(value.name)
      );
    });
  }

  /**
   * base64 helper
   */
  function isBase64(txt) {
    if (txt === "") {
      return false;
    }
    try {
      return btoa(atob(txt)) == txt;
    } catch (err) {
      return false;
    }
  }

  /**
   * pages render helper
   */
  function renderPages(clubId, cagegoryId) {
    let ele = $("#main-table");
    $("#sectionRegion").hide();
    $(ele).find("tbody tr").remove();
    $("#loader").show();
    $.get(`${_apiBase}/list/${clubId}/${cagegoryId}`, function (result) {
      $("#loader").hide();
      _clubData = result;
      try {
        if (result.data) {
          let data = result.data.sort(function (a, b) {
            return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0;
          });
          $("#pages").empty();
          $.get("/templates/page_item.html", function (template) {
            $.each(data, function (index, item) {
              $.tmpl(template, item).appendTo("#pages");
            });
          });
          $("#fPageRow").show();
        } else {
          $(ele).find("thead").hide();
          $(ele).find("tbody tr").remove();
          ele.append(
            '<tr colspan=2 class="pageDataNoContent"><td>No content found</td>'
          );
        }
        renderSelect();
      } catch (error) {
        console.log(error);
        $(ele).find("thead").hide();
        $(ele).find("tbody tr").remove();
        ele.append(
          '<tr colspan=2 class="pageDataNoContent"><td>No content found</td>'
        );
      }
      $("#loader").hide();
      $("#pageContent").show();
    });
  }

  /**
   * section render helper
   */
  function renderSection(pageId) {
    _pageId = pageId;
    $("#sectionTitle").html("Section for " + pageName);
    $("#loader").show();
    $("#sectionRegion").show();
    let ele = $("#section-table");
    $(".sectionRows").remove();
    $("#section-table tbody").remove();
    ele.append(`<tbody id="sortable"></tbody>`);
    $(".pageDataRow").removeClass("table-warning");
    $("#row" + _pageId).addClass("table-warning");
    $.get(_apiBase + "/list" + "/section/" + _pageId, {}, function (result) {
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
            pageid: _pageId,
          };
          $("#loader").show();
          $.post(_apiBase + "/sort/section", _data, function (res) {
            console.log(res);
            if (res && !res.errors) {
              if (res.data.updateSection.success == true) {
                //notify("Updated", "success");
                //renderSection(_pageId);
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
            pageid: _pageId,
          };

          console.log(_data, _dataOld);
          //$('#loader').show();
          $.post(_apiBase + "/sort/section", _dataOld, function (res) {
            console.log(res);
            if (res && !res.errors) {
              if (res.data.updateSection.success == true) {
                notify("Updated", "success");
                renderSection(_pageId);
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

  /**
   * Opens section for a page
   */
  $(document).on("click", ".manage-section", function () {
    _pageId = $(this).data("id");
    pageName = $(this).data("name");
    renderSection(_pageId);
  });

  /**
   * Opens delete for a page
   */
  $(document).on("click", ".deleteRow", function () {
    let id = $(this).data("id");
    console.log(id);
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#deleteDialog .modal-title").html("Delete Page");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      singleDelete(id, "page");
    });
    $("#deleteDialog").modal("show");
  });

  /**
   * Section hover indicator
   */
  $(document).on("mouseenter", ".sectionRows", function () {
    $(this).find(".drag-icon").removeClass("fa-sort").addClass("fa-arrows-alt");
  });
  $(document).on("mouseleave", ".sectionRows", function () {
    $(this).find(".drag-icon").removeClass("fa-arrows-alt").addClass("fa-sort");
  });

  /**
   * Opens delete for a section
   */
  $(document).on("click", ".delete-section", function () {
    let id = $(this).data("id");
    $("#list").empty();
    $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
    $("#deleteDialog .modal-title").html("Delete Section");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      singleDelete(id, "section");
    });
    $("#deleteDialog").modal("show");
  });

  /**
   * Deletes single record
   */
  async function singleDelete(id, type) {
    $("#loader").show();
    removeRow(id, type, () => {
      $("#loader").hide();
      $("#deleteDialog").modal("hide");
      type == "page" ? renderPages(_clubId) : renderSection(_pageId);
    });
  }

  /**
   * Delete method helper
   */
  async function removeRow(id, type, callback) {
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
        if (result && !result.errors) {
          $("#row" + id).remove();
          _CMSpagination.reset();
          return id;
        }
        break;
      default:
        $.post(_apiBase + "/delete/" + type + "/" + id, {}, function (res) {
          if (res && !res.errors) {
            $("#row" + id).remove();
            notify("Record Deleted", "success");
          } else {
            notify(res.errors[0].message, "error");
          }
          callback();
        });
        break;
    }
  }

  /**
   * Opens edit popup
   */
  $(document).on("click", ".edit-page", function () {
    _addPageForm.reset();
    $("#add-page-title").html("Update Page");
    $("#loader").show();
    let id = $(this).data("id");
    $.get(_apiBase + "/" + id, {}, function (res) {
      if (res && !res.errors) {
        let _res = res.data.page.result;
        setTimeout(() => {
          $("#filter_category").val(_res.categoryid);
          $("#tierid").val(_res.tierid);
          $("#benefitid").val(_res.benefitid);
          $("#name").val(_res.name);
          $("#title").val(_res.title != null ? _res.title : "");
          $("#title_position").val(_res.title_position);
          $("#description").val(
            _res.description != null ? _res.description : ""
          );
          $("#description_position").val(_res.description_position);
          $("#icon").val(_res.icon != null ? _res.icon : "");
          $("#icon_position").val(_res.icon_position);
          $("#thumbnail").val(_res.thumbnail != null ? _res.thumbnail : "");
          $("#thumbnail_position").val(_res.thumbnail_position);
          $("#banner").val(_res.banner != null ? _res.banner : "");
          $("#banner_position").val(_res.banner_position);
          $("#video").val(_res.video != null ? _res.video : "");
          $("#video_position").val(_res.video_position);
          $("#language").val(_res.language);
          $("#addSort").val(_res.sort);
          //$('#addLocation').val(_res.location);
          $("#row").val(_res.row);
          $("#column").val(_res.column);
          //$('#editStatus').prop('checked', _res.status == 'ACTIVE' ? true : false);
          pageUpdateId = _res.id;
          $("#addModal").modal("show");
          //$('#edit-page-confirm').data('id', _res.id);// referene for edit use
          $("#loader").hide();
        });
      }
    });
  });

  /**
   * Opens edit section popup
   */
  $(document).on("click", ".edit-section", function () {
    $("#section-page-title").html("Update Section");
    _addSectionForm.reset();
    $("#loader").show();
    let id = $(this).data("id");
    $.get(_apiBase + "/section/" + id, {}, function (res) {
      if (res && !res.errors) {
        let _res = res.data.section.result;
        $("#sectionName").val(_res.name);
        $("#sectionTitle").val(_res.title);
        $("#sectionTitlePos").val(_res.title_position);
        $("#sectionDescription").val(_res.description);
        $("#sectionDescriptionPos").val(_res.description_position);
        if (_res.content != null && isBase64(_res.content)) {
          _res.content = atob(_res.content);
        } else {
          _res.content = "";
        }
        tinymce.get("sectionContent").setContent(_res.content);
        //$('#sectionContent').val(_res.content != null ? _res.content : '');
        $("#sectionContentPos").val(_res.content_position);
        $("#sectionThumb").val(_res.thumbnail != null ? _res.thumbnail : "");
        $("#sectionThumbPos").val(_res.thumbnail_position);
        $("#sectionCover").val(_res.cover != null ? _res.cover : "");
        $("#sectionCoverPos").val(_res.cover_position);
        $("#sectionVideo").val(_res.video != null ? _res.video : "");
        $("#sectionVideoPos").val(_res.video_position);
        $("#language").val(_res.language);
        $("#sectionSort").val(_res.sort);
        $("#sectionStatus").prop(
          "checked",
          _res.status == "ACTIVE" ? true : false
        );
        $("#mamangeSectionModel").modal("hide");
        $("#addSectionModal").modal("show");
        $("#sectionRow").val(_res.row);
        $("#sectionColumn").val(_res.column);
        //$('#edit-section-confirm').data('id', _res.id);// referene for edit use
        sectionUpdateId = _res.id;
        $("#loader").hide();
      }
    });
  });

  /**
   * Page update reff id
   */
  let oldProp = [];
  let pageInputOld = "";
  let addFormUpdate = false;
  /**
   * Page element change helper
   */
  $(".pageSelectElement").on("change", function () {
    let prop = $(this).data("property");
    if ($(this).val() == "") {
      //return;
    }
    renderPageForm(prop);
  });
  $(".pageInputElement").on("focus", function () {
    pageInputOld = $(this).val();
  });
  $(".numericLimitCheck").on("keyup", function () {
    $(this).val(
      $(this).val().length > $(this).attr("maxLength")
        ? Math.abs($(this).val().slice(0, this.maxLength))
        : Math.abs($(this).val())
    );
  });
  $(".pageInputElement").on("blur", function () {
    if (pageInputOld == $(this).val()) {
      //return
    }
    let prop = $(this).data("property");
    renderPageForm(prop);
  });
  $("#addModal").on("hidden.bs.modal", function () {
    if (addFormUpdate) {
      //renderPages(_clubId);
      pageList(clubId, categoryId, language);
      addFormUpdate = !addFormUpdate;
    }
  });
  function renderPageForm(prop) {
    $("#loader").show();
    let _data = {
      name: $("#name").val(),
      tierid: $("#tierid").val(),
      benifitid: $("#benefitid").val(),
      categoryid: categoryId,//$("#filter_category").val(),
      title: $("#title").val(),
      title_position: $("#title_position").val(),
      description: $("#description").val(),
      description_position: $("#description_position").val(),
      icon: $("#icon").val(),
      icon_position: $("#icon_position").val(),
      thumbnail: $("#thumbnail").val(),
      thumbnail_position: $("#thumbnail_position").val(),
      banner: $("#banner").val(),
      banner_position: $("#banner_position").val(),
      video: $("#video").val(),
      video_position: $("#video_position").val(),
      languages: language,//$("#language").val(),
      sort: $("#addSort").val(),
      //"location": $('#addLocation').val(),
      row: $("#row").val(),
      column: $("#column").val(),
    };
    Object.keys(_data).forEach(function (key) {
      if (!prop.includes(key) && !oldProp.includes(key)) {
        delete _data[key];
      }
    });
    _data.clubid = _clubId;
    _data.status = $("#addStatus").is(":checked") ? "ACTIVE" : "INACTIVE";
    if (pageUpdateId > 0) {
      $("#filter_category, #language, #tierid, #name").removeAttr(
        "required"
      );
      if ($("#filter_category").val() == "") {
        $("#filter_category").attr("required", "required");
      }
      if ($("#language").val() == "") {
        $("#language").attr("required", "required");
      }
      if ($("#tierid").val() == "") {
        $("#tierid").attr("required", "required");
      }
      if ($("#name").val() == "") {
        $("#name").attr("required", "required");
      }
      if (!_addPageForm.reportValidity()) {
        _addPageForm.reportValidity();
        $("#loader").hide();
        oldProp = prop.concat(oldProp);
        return;
      }
      _data.id = pageUpdateId;
      _data.languages = language;//$("#language").val();
      _data.categoryid = categoryId;//$("#filter_category").val();
    }
    if (pageUpdateId == 0) {
      $("#filter_category, #language, #tierid, #name").removeAttr(
        "required"
      );
      if ($("#filter_category").val() == "") {
        $("#filter_category").attr("required", "required");
      }
      if ($("#language").val() == "") {
        $("#language").attr("required", "required");
      }
      if ($("#tierid").val() == "") {
        $("#tierid").attr("required", "required");
      }
      if ($("#name").val() == "") {
        $("#name").attr("required", "required");
      }

      if (!_addPageForm.reportValidity()) {
        _addPageForm.reportValidity();
        $("#loader").hide();
        oldProp = prop.concat(oldProp);
        return;
      }
      console.log(_addPageForm.reportValidity())

      _data.categoryid = categoryId;//$("#filter_category").val();
      _data.languages = language;//$("#language").val();
      _data.tierid = $("#tierid").val();
      _data.name = $("#name").val();
      _data.row = $("#row").val();
      _data.column = $("#column").val();
    }

    $.post(_apiBase, _data, function (res) {
      $("#loader").hide();
      if (res && !res.errors) {
        if (pageUpdateId == 0) {
          if (res.data.addPage.success == true) {
            if (res.data.addPage.result == null) {
              notify("Record Added (Reloading ...) ", "success");
              $("#addModal").modal("hide");
              addFormUpdate = false;
              pageList(clubId, categoryId, language);//renderPages(_clubId);
            } else {
              notify("Record Added", "success");
              pageUpdateId = res.data.addPage.result.id;
              $("#add-page-title").html("Update Page");
              oldProp = [];
              addFormUpdate = true;
            }
          } else {
            notify(res.data.addPage.message, "error");
          }
        } else {
          if (pageUpdateId > 0 && res.data.updatePage.success == true) {
            $("#add-page-title").html("Update Page");
            notify("Record Updated", "success");
            addFormUpdate = true;
            oldProp = [];
          } else {
            notify(res.data.updatePage.message, "error");
          }
        }
      } else {
        notify(res.errors[0].message, "error");
      }
    });
  }

  /**
   * Page update reff(s)
   */
  let sectionUpdateId = 0;
  let sectionoldProp = [];
  let sectionInputOld = "";
  let sectionFormUpdate = false;
  /**
   * section element change helper
   */
  $(document).on("change", ".sectionSelectElement", function () {
    let prop = $(this).data("property");
    if ($(this).val() == "") {
      //return;
    }
    renderSectionForm(prop);
  });
  $(document).on("focus", ".sectionInputElement", function () {
    sectionInputOld = $(this).val();
  });
  $(document).on("blur", ".sectionInputElement", function () {
    if (sectionInputOld == $(this).val()) {
      return;
    }
    let prop = $(this).data("property");
    renderSectionForm(prop);
  });
  $("#addSectionModal").on("hidden.bs.modal", function () {
    if (sectionFormUpdate) {
      renderSection(_pageId);
      sectionFormUpdate = !sectionFormUpdate;
    }
  });
  function renderSectionForm(prop) {
    $("#loader").show();
    let _data = {
      name: $("#sectionName").val(),
      title: $("#sectionTitle").val(),
      title_position: $("#sectionTitlePos").val(),
      description: $("#sectionDescription").val(),
      description_position: $("#sectionDescriptionPos").val(),
      content: tinymce.get("sectionContent").getContent(),
      content_position: $("#sectionContentPos").val(),
      thumbnail: $("#sectionThumb").val(),
      thumbnail_position: $("#sectionThumbPos").val(),
      cover: $("#sectionCover").val(),
      cover_position: $("#sectionCoverPos").val(),
      video: $("#sectionVideo").val(),
      video_position: $("#sectionVideoPos").val(),
      languages: language,//$("#language").val(),
      status: $("#sectionStatus").is(":checked") ? "ACTIVE" : "INACTIVE",
      sort: $("#sectionSort").val(),
      //"location": $('#sectionLocation').val(),
      row: $("#sectionRow").val(),
      column: $("#sectionColumn").val(),
    };

    Object.keys(_data).forEach(function (key) {
      if (!prop.includes(key) && !oldProp.includes(key)) {
        delete _data[key];
      }
    });

    _data.pageid = _pageId;
    if (sectionUpdateId > 0) {
      _data.id = sectionUpdateId;
    }
    if (sectionUpdateId == 0) {
      $("#sectionName, #language").removeAttr("required");
      if ($("#sectionName").val() == "") {
        $("#sectionName").attr("required", "required");
      }
      if ($("#language").val() == "") {
        $("#language").attr("required", "required");
      }
      if (!_addSectionForm.reportValidity()) {
        _addSectionForm.reportValidity();
        $("#loader").hide();
        sectionInputOld = "";
        sectionoldProp = prop.concat(sectionoldProp);
        return;
      }
      _data.name = $("#sectionName").val();
      _data.sort = 1;
      _data.languages = language;//$("#language").val();
      _data.row = $("#sectionRow").val();
      _data.column = $("#sectionColumn").val();
    }
    $.post(_apiBase + "/section", _data, function (res) {
      $("#loader").hide();
      if (res && !res.errors) {
        if (sectionUpdateId == 0) {
          if (res.data.addSection.success == true) {
            notify("Record Added", "success");
            sectionUpdateId = res.data.addSection.result.id;
            $("#section-page-title").html("Update Section");
            sectionoldProp = [];
            sectionFormUpdate = true;
            sectionInputOld = "";
          } else {
            notify(res.data.addSection.message, "error");
          }
        } else {
          if (sectionUpdateId > 0 && res.data.updateSection.success == true) {
            $("#section-page-title").html("Update Section");
            sectionFormUpdate = true;
            sectionInputOld = "";
            sectionoldProp = [];
            notify("Record Updated", "success");
          } else {
            notify(res.data.updateSection.message, "error");
          }
        }
      } else {
        notify(res.errors[0].message, "error");
      }
    });
  }

  /**
   * rte
   */
  tinymce.init({
    paste_as_text: true,
    selector: "#sectionContent",
    plugins: ["code"],
    setup: function (editor) {
      editor.on("focusin", function (e) {
        if (sectionInputOld != "") {
          return;
        }
        sectionInputOld = tinymce.get("sectionContent").getContent();
      });
      editor.on("focusout", function (e) {
        if (sectionInputOld == tinymce.get("sectionContent").getContent()) {
          return;
        }
        renderSectionForm(["content"]);
      });
    },
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
});

function pageList(clubId, categoryId, language) {
  let input = {
    clubid: clubId,
    categoryid: categoryId,
    language: language,
  };
  $("#loader").show();
  $.post(`${_apiBase}/list`, input, function (result) {
    if (result.length > 0) {
      result.sort(function (a, b) {
        return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0;
      });
      loadData("#pages", result, "/templates/page_item.html");
      $("#loader").hide();
    } else {
      if (clubId !== "" && categoryId !== "" && language !== "") {
        //clear_form("#addModal #addPageForm");
        let clubName = $("#filter_club option:selected").text();
        $("#addModal #cd").val(clubName);
        $("#addModal #clubid").val($("#filter_club").val());
        $("#addModal #categoryDisplay").val($("#filter_category option:selected").text());
        $("#addModal #categoryid").val($("#filter_category").val());
        $("#addModal #languageDisplay").val($("#filter_language option:selected").text());
        $("#addModal #language").val($("#filter_language").val());
        $("#addModal").modal("show");
      }
      $("#loader").hide();
    }
  });
}
let draged;
// Drag and drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  //console.log("drag id:", $(ev.target).find(".idx").data("id"));
  //console.log("drag idx:", $(ev.target).find(".idx").text());
  draged = {
    id: Number($(ev.target).find(".idx").data("id")),
    clubid: Number($(ev.target).find(".idx").data("club")),
    categoryid: Number($(ev.target).find(".idx").data("category")),
    language: $(ev.target).find(".idx").data("lang"),
    sort: Number($(ev.target).find(".idx").text()),
  };
  console.log("dragged", draged);
  //ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  //console.log("drop id:", $(ev.target).find(".idx").data("id"));
  //console.log("drop idx:", $(ev.target).find(".idx").text());
  //ev.target.appendChild(document.getElementById(data));
  let droped = {
    id: Number($(ev.target).find(".idx").data("id")),
    clubid: Number($(ev.target).find(".idx").data("club")),
    categoryid: Number($(ev.target).find(".idx").data("category")),
    language: $(ev.target).find(".idx").data("lang"),
    sort: Number($(ev.target).find(".idx").text()),
  };
  //sconsole.log("dragged", draged);
  console.log("dropped", droped);

  let input = {
    draged: draged,
    droped: droped,
  };
  $("#loader").show();
  $.post("/page/sort", input, function (result) {
    $("#loader").hide();
    if (result.succeed) {
      notify(result.message, "success");
    } else {
      notify("Operation failed", "success");
    }
    pageList(draged.clubid, draged.categoryid, draged.language);
  });
}
