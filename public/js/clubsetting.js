/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */

$(document).ready(function () {
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
   * placeholder Objects
   */
  let _addTierForm = $("#addTierForm")[0];
  let _addBenifitForm = $("#addBenifitForm")[0];
  let tierData = [];
  let benifitData = [];
  let clubModule = [];
  let suppliers = [];
  let dataMarkup = [];
  let clubId = 0;

  /**
   * Opens add popup
   */
  $("#addBenifit-resource").on("click", function () {
    $("#addBenifitModal").modal("show");
  });

  /**
   * Add method
   */
  $("#addBenifit-confirm").on("click", function () {
    $("#loader").show();
    $("#addBenifit-confirm").prop("disabled", true);
    if (!_addBenifitForm.reportValidity()) {
      _addBenifitForm.reportValidity();
      $("#loader").hide();
      $("#addBenifit-confirm").prop("disabled", false);
      return;
    }
    let _data = {
      clubId: clubId,
      selected: {
        name: $("#bName").val(),
        // banner: $('#bBanner').val(),
        // thumbnail: $('#bThumbnail').val(),
        // icon: $('#bIcon').val(),
        // language: $('#bLanguage').val(),
        // type: $('#bType').val(),
        // language: $('#bLanguage').val(),
        // video: $('#bVideo').val(),
        categoryid: $("#bCategries").val(),
        countries: [$("#bCountries").val()],
        description: $("#bDescription").val(),
        // video_caption: $('#bVideoCaption').val(),
        // video_tooltip: $('#bVideoTooltip').val(),
      },
    };

    $.post(_apiBase + "/addbenifit", _data, function (res) {
      $("#addBenifitModal").modal("hide");
      if (res && !res.errors) {
        if (res.data.addBenefit.success == true) {
          notify("Record Added", "success");
          _getPageData();
        } else {
          notify(res.data.addBenefit.message, "error");
        }
      } else {
        notify(res.errors[0].message, "error");
      }
      $("#addBenifit-confirm").prop("disabled", false);
      _addBenifitForm.reset();
      $("#loader").hide();
    });
  });

  /**
   * Opens add popup
   */

  /**
   * Add method
   */
  $("#addTier-confirm").on("click", function () {
    $("#loader").show();
    $("#addTier-confirm").prop("disabled", true);
    if (!_addTierForm.reportValidity()) {
      _addTierForm.reportValidity();
      $("#loader").hide();
      $("#addTier-confirm").prop("disabled", false);
      return;
    }
    let _data = {
      clubId: clubId,
      selected: {
        name: $("#tName").val(),
        chargeable: $("#tCharge").is(":checked") ? true : false,
        //frequency: $('#frequency').val(),
        //enrollment_fees: $('#enrollmentFees').val(),
        //recurring_charge: $('#recurringCharge').val(),
        referral: $("#referral").is(":checked") ? true : false,
        externalid: $("#externalId").val(),
      },
    };

    $.post(_apiBase + "/addtier", _data, function (res) {
      $("#addTierModal").modal("hide");
      if (res && !res.errors) {
        if (res.data.addTier.success == true) {
          notify("Record Added", "success");
          _getPageData();
        } else {
          notify(res.data.addTier.message, "error");
        }
      } else {
        notify(res.errors[0].message, "error");
      }
      $("#addTier-confirm").prop("disabled", false);
      _addTierForm.reset();
      $("#loader").hide();
    });
  });

  /**
   *tire checkbox method
   */
  $(document).on("change", ".tire-resource", function () {
    $("#loader").show();
    let id = $(this).data("id");
    let checked = $(this).is(":checked");
    tierData.forEach((element) => {
      if (id == element.id) {
        let _data = {
          clubId: clubId,
          id: id,
          checked: checked,
          selected: {
            name: element.name,
            chargable: element.chargable,
            frequency: element.frequency,
            referral: element.referral,
          },
        };
        $.post(_apiBase + "/tire", _data, function (res) {
          if (res && !res.errors) {
            notify("Record Updated", "success");
            _getPageData();
          } else {
            notify(res.errors[0].message, "error");
          }
          $("#loader").hide();
        });
      }
    });
  });

  /**
   *benifit checkbox method
   */
  $(document).on("change", ".benifit-resource", function () {
    $("#loader").show();
    let tierid = $(this).data("tierid");
    let benifitid = $(this).data("benifitid");
    let checked = $(this).is(":checked");
    let id = $(this).data("recordid");
    benifitData.forEach((element) => {
      if (benifitid == element.id) {
        let _data = {
          clubId: clubId,
          checked: checked,
          id: id,
          selected: {
            tierid: tierid,
            benefitid: benifitid,
            name: element.name,
            banner: element.banner,
            thumbnail: element.thumbnail,
            icon: element.icon,
            description: element.description,
            type: element.type,
            language: element.language,
            //languagecode: element.languagecode,
            video_caption: element.video_caption,
            video: element.video,
            video_tooltip: element.video_tooltip,
          },
        };
        $.post(_apiBase + "/benifit", _data, function (res) {
          if (res && !res.errors) {
            notify("Record Updated", "success");
            _getPageData();
          } else {
            notify(res.errors[0].message, "error");
          }
          $("#loader").hide();
        });
      }
    });
  });

  /**
   *module checkbox method
   */
  $(document).on("change", ".markup-resource", function () {
    $("#loader").show();
    let moduleId = $(this).data("moduleid");
    let tierid = $(this).data("tierid");
    let checked = $(this).is(":checked");
    let supplierId = $(this).data("supplierid");
    let dataMarkupId = $(this).data("markupid");
    dataMarkup.forEach((element) => {
      if (dataMarkupId == element.id) {
        let _data = {
          clubId: clubId,
          checked: checked,
          id: dataMarkupId,
          selected: {
            tierid: tierid,
            moduleid: moduleId,
            supplierid: supplierId,
            ratetype: element.ratetype,
            payment: element.payment,
            distribution_type: element.distribution_type,
            public_price: element.public_price,
            discount: element.discount,
            fop: element.fop,
            margin: element.margin,
            credit: element.credit,
            dependon: element.dependon,
            method: element.method,
            status: element.status,
          },
        };
        $.post(_apiBase + "/markup", _data, function (res) {
          if (res && !res.errors) {
            notify("Record Updated", "success");
            _getPageData();
          } else {
            notify(res.errors[0].message, "error");
          }
          $("#loader").hide();
        });
      }
    });
  });

  /**
   *module checkbox method
   */
  $(document).on("change", ".module-resource", function () {
    $("#loader").show();
    let moduleId = $(this).data("moduleid");
    let tierid = $(this).data("tierid");
    let checked = $(this).is(":checked");
    let id = $(this).data("recordid");
    //moduleList.forEach(element => { //moduleData
    // if (moduleId == element.id) {
    let _data = {
      clubId: clubId,
      checked: checked,
      id: id,
      selected: {
        tierid: tierid,
        moduleid: moduleId,
        booking_mode: $("#bookingMode-" + moduleId + "-" + tierid).val(), //element.booking_mode,
        inventory_mode: $("#inventoryMode-" + moduleId + "-" + tierid).val(), //element.inventory_mode,
        status: clubStatus, //element.status
      },
    };
    $.post(_apiBase + "/module", _data, function (res) {
      if (res && !res.errors) {
        notify("Record Updated", "success");
        _getPageData();
      } else {
        notify(res.errors[0].message, "error");
      }
      $("#loader").hide();
    });
    //}
    //});
  });

  /**
   * initial page loader method
   */
  let booking_mode = "TEST";
  let inventory_mode = "TEST";
  let clubStatus = "ACTIVE";
  let firstTimeConfig = 0;

  function _getPageData() {
    $("#loader").show();
    clubId = window.location.pathname.split("/").pop();
    //let id = window.location.pathname.split('/').filter(e => e).slice(-1);
    let tirePlaceholder = $("#data-tire");
    let benifitPlaceholder = $("#data-benifit");
    let modulePlaceholder = $("#data-module");
    let markupPlaceholder = $("#data-markup");
    tirePlaceholder.empty();
    benifitPlaceholder.empty();
    modulePlaceholder.empty();
    markupPlaceholder.empty();
    $.get(_apiBase + "/" + clubId, {}, function (res) {
      console.log(res);
      firstTimeConfig = res.firstTimeConfig;
      if (res && !res.errors) {
        setConfig(res.config);
        let _res = res?.response?.data?.club;
        console.log(res);
        tierData = []; // res.dataTire
        benifitData = []; // res.dataBenifit
        moduleData = []; // res.dataModule
        suppliers = []; // res.dataSupplier;
        dataMarkup = []; // res.dataMarkup;
        let clubMarkup = []; // res.clubMarkup
        let moduleList = []; // res.masterMdules;

        let contries = $("#bCountries");
        contries.empty();
        contries.append(
          $("<option></option>").attr({ value: "" }).text("--Select--")
        );
        $.each(res.countries, function (key, value) {
          contries.append(
            $("<option></option>")
              .attr({ value: value.alpha2 })
              .text(value.name)
          );
        });

        let list = $("#bCategries");
        list.empty();
        list.append(
          $("<option></option>").attr({ value: "" }).text("--Select--")
        );
        $.each(res.list, function (key, value) {
          list.append(
            $("<option></option>").attr({ value: value.id }).text(value.name)
          );
        });

        $.get("/templates/club_setting_tier.html", function (template) {
          //run tier data loop and append all tier
          $.each(tierData, function (index, item) {
            item.cssClass = "tire-resource";
            $.tmpl(template, item).appendTo(tirePlaceholder);
          });

          //check valid elements
          /*
          new data structure assummes tires are for club 
          _res.tiers.forEach(element => {
            if (element.status == "ACTIVE") {
              $('#tire-resource-' + element.id).prop('checked', true)
            }
          });
          */
        });

        //build benifit tab
        $.get("/templates/club_setting_benifit.html", function (template) {
          //run tier data loop and append all tier
          $.each(tierData, function (index, item) {
            item.cssClass = "benifit-resource";
            $.tmpl(template, item).appendTo(benifitPlaceholder);
          });

          //getting active list only
          let activeTier = [];
          //_res.tiers.forEach(element => {
          tierData.forEach((element) => {
            if (element.status != "ACTIVE") {
              $(".benifit-resource-" + element.id).remove();
            } else {
              activeTier.push(element.id);
            }
          });

          //from active list getting all benifit @tbd filter by status
          activeTier.forEach((id) => {
            let data = [];
            let keymap = [];
            let table = $("#holder-benifit-resource-" + id);
            if (_res.benefits != undefined) {
              //_res.benefits.forEach(element => {
              benifitData.forEach((element) => {
                if (
                  element.tierid == id &&
                  !data.includes(id) &&
                  element.status == "ACTIVE"
                ) {
                  //data.push(element.benefitid);
                  data.push(element.id);
                  //keymap[element.benefitid] = element.id
                  keymap[element.id] = element.id;
                }
              });
            }

            table.find("tbody").html("");
            //from master benifit list activte all vaid candidates
            $.each(benifitData, function (index, item) {
              let checked = "";
              if (data.includes(item.id)) {
                checked = "checked";
              }
              table.find("tbody").append(`
              <tr>
                   <td><input type="checkbox" ${checked} class="benifit-resource" data-benifitId="${item.id}" data-tierId="${id}" data-recordId="${keymap[item.id]}"/></td>
                   <td>${item.name}</td>
               </tr>
              `);
            });
          });
        });

        //build benifit tab
        $.get("/templates/club_setting_module.html", function (template) {
          //run tier data loop and append all tier
          $.each(tierData, function (index, item) {
            item.cssClass = "module-resource";
            $.tmpl(template, item).appendTo(modulePlaceholder);
          });

          //getting active list only
          let activeTier = [];
          // _res.tiers.forEach(element => {
          tierData.forEach((element) => {
            if (element.status != "ACTIVE") {
              $(".module-resource-" + element.id).remove();
            } else {
              activeTier.push(element.id);
            }
          });

          //from active list getting all benifit @tbd filter by status
          activeTier.forEach((id) => {
            let data = [];
            let keymap = [];
            let checkMap = [];
            let table = $("#holder-module-resource-" + id);
            //_res.modules.forEach(element => {
            moduleData.forEach((element) => {
              if (
                element.tierid == id &&
                !data.includes(id) &&
                element.status == "ACTIVE"
              ) {
                data.push(element.moduleid);
                //keymap[element.moduleid] = element.id
                keymap[element.id] = element.id;
                checkMap[element.moduleid] = {
                  BookingMode: element.booking_mode,
                  inventoryMode: element.inventory_mode,
                };
              }
            });

            console.log(data, keymap);

            table.find("tbody").html("");
            table.find("tbody").append(`
              <tr>
                   <td>Module</td>
                   <td>Booking Mode</td>
                   <td>Inventory Mode</td>
                   <td>Active/Inactive</td>
                </tr>
              `);
            //from master module list activte all vaid candidates
            $.each(moduleList, function (index, item) {
              //moduleData
              let checked = "";
              if (data.includes(item.id)) {
                checked = "checked";
              }
              console.log("checked", checked);
              table.find("tbody").append(`
              <tr>
                   <td>${item.name}</td>
                   <td>
                    <select id="bookingMode-${item.id}-${id}">
                    <option value="TEST" ${
                      checkMap[item.id] != undefined &&
                      checkMap[item.id].BookingMode == "TEST"
                        ? "selected"
                        : ""
                    }>TEST</option>
                    <option value="PRODUCTION" ${
                      checkMap[item.id] != undefined &&
                      checkMap[item.id].BookingMode == "PRODUCTION"
                        ? "selected"
                        : ""
                    }>PRODUCTION</option>
                   </select>
                   </td>
                   <td>
                    <select id="inventoryMode-${item.id}-${id}">
                    <option value="TEST"  ${
                      checkMap[item.id] != undefined &&
                      checkMap[item.id].inventoryMode == "TEST"
                        ? "selected"
                        : ""
                    }>TEST</option>
                    <option value="PRODUCTION"  ${
                      checkMap[item.id] != undefined &&
                      checkMap[item.id].inventoryMode == "PRODUCTION"
                        ? "selected"
                        : ""
                    }>PRODUCTION</option>
                   </select>
                   </td>
                   <!--<td><input type="checkbox" ${checked} class="module-resource" data-moduleid="${item.id}" data-tierId="${id}" data-recordId="${item.id}"/></td>
                   -->
                   <td><input type="checkbox" ${checked} class="module-resource" data-moduleid="${item.id}" data-tierId="${id}" data-recordId="${item.id}"/></td>
                   
               </tr>
              `);
            });
          });
        });

        //build markup tab
        $.get("/templates/club_setting_markup.html", function (template) {
          //run tier data loop and append all tier
          $.each(tierData, function (index, item) {
            item.cssClass = "module-markup";
            $.tmpl(template, item).appendTo(markupPlaceholder);
          });

          //getting active list only
          let activeTier = [];
          //_res.tiers.forEach(element => {
          tierData.forEach((element) => {
            if (element.status != "ACTIVE") {
              $(".module-markup-" + element.id).remove();
            } else {
              activeTier.push(element.id);
            }
          });

          //from active list getting all benifit @tbd filter by status
          activeTier.forEach((id) => {
            let data = [];
            let keymap = [];
            let table = $("#holder-module-markup-" + id);
            //_res.modules.forEach(element => {
            moduleData.forEach((element) => {
              if (
                element.tierid == id &&
                !data.includes(id) &&
                element.status == "ACTIVE"
              ) {
                //data.push(element.moduleid);
                data.push(element.id);
                //keymap[element.moduleid] = element.id
                keymap[element.id] = element.id;
              }
            });
            table.find("tbody").html("");
            //from master module list activte all vaid candidates
            let elementCheck = 0;
            $.each(moduleData, function (index, item) {
              let supplierTxt = "";
              //if (data.includes(item.id)) {
              let mItemId = [];
              let checkedMarkup = [];
              $.each(suppliers, function (index, sItem) {
                let markupStr = ``;
                $.each(dataMarkup, function (index, mItem) {
                  $.each(clubMarkup, function (index, cmItem) {
                    if (
                      (cmItem.id =
                        mItem.id &&
                        cmItem.supplierid == sItem.id &&
                        item.id == cmItem.moduleid &&
                        cmItem.status == "ACTIVE")
                    ) {
                      checkedMarkup[sItem.id] = "checked";
                    }
                    mItemId[sItem.id] = mItem.id;
                  });
                });
                markupStr += `<input type="checkbox" data-moduleId="${
                  item.id
                }" data-tierId="${id}" data-supplierId="${
                  sItem.id
                }" data-markupId="${mItemId[sItem.id]}" ${
                  checkedMarkup[sItem.id]
                } class="markup-resource" /> `;
                supplierTxt += markupStr + sItem.shortform + `<br />`;
              });
              elementCheck = id;

              table.find("tbody").append(`
              <tr>
                   <td>${item.module}</td>
                   <td>${supplierTxt}</td>
               </tr>
              `);

              //}
              //data-moduleid="${item.id}" data-tierId="${id}" data-recordId="${keymap[item.id]}"
            });

            //remove all tires where no modules assigned
            if (elementCheck == 0) {
              $(".module-markup-" + id).remove();
            }
          });
        });
      }
    }).done(function () {
      setTimeout(() => {
        $("#loader").hide(); //wip
      }, 250);
    });
  }
  _getPageData();

  let dropArea = document.getElementById("drop-area");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDragDefaults, false);
    document.body.addEventListener(eventName, preventDragDefaults, false);
  });
  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  dropArea.addEventListener("drop", handleDrop, false);

  function preventDragDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight(e) {
    dropArea.classList.add("highlight");
  }

  function unhighlight(e) {
    dropArea.classList.remove("active");
  }

  function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
    handleFiles(files);
  }

  let uploadProgress = [];
  let progressBar = document.getElementById("progress-bar");

  function initializeProgress(numFiles) {
    progressBar.value = 0;
    uploadProgress = [];
    for (let i = numFiles; i > 0; i--) {
      uploadProgress.push(0);
    }
  }

  function updateProgress(fileNumber, percent) {
    uploadProgress[fileNumber] = percent;
    let total =
      uploadProgress.reduce((tot, curr) => tot + curr, 0) /
      uploadProgress.length;
    progressBar.value = total;
  }

  window.handleFiles = function (files) {
    files = [...files];
    initializeProgress(files.length);
    files.forEach(uploadFile);
  };

  function uploadFile(file, i) {
    console.log(file);
    //tmpl toto
    $("#main-table").append(
      `<tr>
          <td>${file.name}</td>
          <td>FIle</td>
          <td><a role="button" data-bs-toggle="modal"
																			data-bs-target="#deleteUserModal"
																			onclick="">
																			<svg xmlns="http://www.w3.org/2000/svg"
																				width="24" height="24"
																				viewBox="0 0 24 24" fill="none"
																				stroke="currentColor" stroke-width="2"
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				class="feather feather-trash align-middle">
																				<polyline points="3 6 5 6 21 6">
																				</polyline>
																				<path
																					d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
																				</path>
																			</svg></a></td>
        </tr>`
    );
    updateProgress(i, 100);
    setTimeout(() => {
      updateProgress(i, 0);
      $("#fileElem").replaceWith($("#fileElem").val("").clone(true));
    }, 2000);
    return;
  }

  let editor = null;
  const container = document.getElementById("jsoneditor");
  const options = {
    mode: "code",
    mainMenuBar: false,
  };

  function setConfig(data) {
    if (editor) {
      editor.destroy();
    }
    $("#jsoneditor").html("");
    editor = new JSONEditor(container, options);
    editor.set(data);
  }

  /**
   * Validates JSON
   */
  $("#json-validate").on("click", function () {
    editor.validate().then((arr) => {
      if (arr.length > 0) {
        notify(arr[0].message, "error");
      } else {
        notify("No error found in JSON", "success");
      }
    });
  });

  /**
   * Format JSON
   */
  $("#json-format").on("click", function () {
    editor.format();
  });

  /**
   * Save JSON
   */
  $("#json-save").on("click", function () {
    editor.validate().then((arr) => {
      if (arr.length > 0) {
        notify(arr[0].message, "error");
      } else {
        $("#loader").show();
        let _data = {
          firstTimeConfig: firstTimeConfig,
          clubid: clubId,
          data: editor.get(),
        };
        $.post(_apiBase + "/save-config", _data, function (res) {
          if (res && !res.errors) {
            firstTimeConfig = 1;
            notify("Configuration saved", "success");
          }
          $("#loader").hide();
        });
      }
    });
  });

  /**
   * Publish JSON
   */
  $("#json-publish").on("click", function () {
    editor.validate().then((arr) => {
      if (arr.length > 0) {
        notify(arr[0].message, "error");
      } else {
        $("#loader").show();
        let _data = {
          firstTimeConfig: firstTimeConfig,
          clubid: clubId,
          data: editor.get(),
        };
        $.post(_apiBase + "/publish-config", _data, function (res) {
          if (res && !res.errors) {
            firstTimeConfig = 1;
            notify("Configuration published", "success");
          }
          $("#loader").hide();
        });
      }
    });
  });
  const list_data = [];
  let select_Node;
   let tree = $("#jstree").jstree({
    core: {
      data: list_data,
    },
  });
  $("#add-folder").click(function () {
    clear_form("#addModal");
    $("#addFolderModal").modal("show");
  });
  $("#addFolder-confirm").click(function () {
    let temp_obj = {};
    temp_obj["id"] = $("#folder-id").val();
    temp_obj["text"] = $("#folder-name").val();
    if(select_Node){
    const obj =findById(list_data,select_Node)
     const child =[]
     child.push(temp_obj)
     obj.children =child
     tree.jstree("refresh");
    }else{
      tree.jstree("refresh");
      list_data.push(temp_obj)
    }
    $("#jstree").jstree(true).settings.core.data = list_data;
    tree.jstree("refresh");
    $("#addFolderModal").modal("hide");
  });
  $("#jstree").on("changed.jstree", (e,data) => {
       
       if(data?.action ==="select_node"){
        select_Node=data?.node?.id
       }
  });
function findById(data, id) {
    function iter(a) {
        if (a.id === id) {
            result = a;
            return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
    }
    let result;
    data.some(iter);
    return result
}
});
