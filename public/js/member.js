let countryList = "";
let stateList;
let currency = [];
let languageList = "";
let userClubId = getUserClubId();
let clubsList = "";
let selected_city = 0;
let selected_state = 0;
let selected_tier = 0;
let memberListArr = []
let tierListArr;
function uncheck(id) {
  $(`#memberList #${id}`).click(function () {
    if (!$(this).checked) {
      $("#checkAll").attr("checked", false);
    }
  });
}

$(document).ready(function () {
  let _addForm = $('#newUserForm')[0];
  let _editForm = $('#updateUserForm')[0];
  let _downloadForm = $('#DownloadMemberTemplateForm')[0];
  let _importMembersForm = $('#ImportMemberTemplateForm')[0];

  $(".select2").each(function () {
    $(this)
      .wrap('<div class="position-relative"></div>')
      .select2({
        placeholder: "Select value",
        dropdownParent: $(this).parent(),
      });
  });
  memberList();
  $("#tablerecords #ByFName").change(function () {
    memberList($(this).val());
  });
  $("#tablerecords #ByLName").change(function () {
    memberList(undefined, $(this).val());
  });
  $("#tablerecords #ByEmail").change(function () {
    memberList(undefined, undefined, $(this).val());
  });
  $("#tablerecords #ByStatus").change(function () {
    memberList(undefined, undefined, undefined, $(this).val());
  });

  $("#importTemplate").click(() => {
    $("#importClubId").val("");
    $("#import_members").val("");
  });

  $("#downloadTemplate").click(() => {
    $("#DownloadMemberClubId").val("");
  });

  $("#downloadTemplateButton").click(() => {

    if (!_downloadForm.reportValidity()) {
      _downloadForm.reportValidity();
      return;
    }

    $('#loader').show();

    $("#DownloadMemberTemplate").modal("hide");
    let clubId = $("#DownloadClubId").val();
    if (clubId) {
      window.open("/member/download/" + clubId, "_blank");
    }

    $('#loader').hide();
  });
  $('#importClubId').change(() => {
    clubTier($('#importClubId').val(), selected_tier);
    $("#UpdateMemberClubId").off()


  })
  $("#imporTemplateButton").click(() => {
    if (!_importMembersForm.reportValidity()) {
      _importMembersForm.reportValidity();
      return;
    }
    $('#loader').show();

    let clubID;
    let clubid_value = $("#loggedClubidValue").val();
    let clubid_value_super_login = $("#importClubId").val();

    if (clubid_value_super_login !== undefined) {
      clubID = clubid_value_super_login;
    }
    else if (clubid_value !== undefined) {
      clubID = clubid_value;
    }
    else {
      clubID = "";
    }

    $.get("/club/tier-list/" + clubID, (result) => {
      if (result) {
        localStorage.removeItem('clubTiers');
        localStorage.setItem('clubTiers', JSON.stringify(result));

        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        /*Checks whether the file is a valid excel file*/
        if (regex.test($("#import_members").val().toLowerCase())) {
          var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
          if ($("#import_members").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
          }
          /*Checks whether the browser supports HTML5*/
          if (typeof (FileReader) != "undefined") {
            const reader = new FileReader();
            reader.onload = function (e) {
              const data = e.target.result;
              /*Converts the excel data in to object*/

              const workbook = XLSX.read(data, { type: 'array' });

              /*Gets all the sheetnames of excel in to a variable*/
              const sheet_name_list = workbook.SheetNames;
              var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
              const exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: 1 });
              if (workbook.Sheets.length > 1) {
                workbook.Sheets.splice(0, 1)
              }
              if (exceljson.length > 0 && cnt == 0) {
                exceljson.splice(0, 1)
                const newExceljson = []
                exceljson.map((val) => { newExceljson.push([...val]) })
                let respose_flag = BindTable(newExceljson, '#exceltable');
                if (respose_flag) {
                  $('#loader').show();
                  let rows = $("#tableBodyData").find("tr");
                  let counter = 0;
                  $(rows).each(function () {
                    let email = $(this).find(`:nth-child(5)`).text();
                    let phone = $(this).find(`:nth-child(8)`).text();
                    let valid_email = emailValidate(email);
                    let valid_phone = phoneValidate(phone);
                    let mail_error_text = "";
                    let phone_error_text = "";
                    let join_error_text = "";
                    if (valid_email == 0) {
                      mail_error_text = "<div>Invalid email id.</div>";
                    }

                    if (valid_phone == 0) {
                      phone_error_text = " <div>Invalid phone no.</div>";
                    }
                    if (valid_email == 0 && valid_phone == 0) {
                      join_error_text = mail_error_text + "  " + phone_error_text;
                    }
                    else {
                      if (valid_email == 0) {
                        join_error_text = mail_error_text;
                      }
                      else {
                        join_error_text = phone_error_text;
                      }
                    }

                    if (valid_email == 0 || valid_phone == 0) {
                      $(this).find(`:nth-child(1)`).html('<div id="import_status_cell' + counter + '"> <a id="ImportMemberErrorTag' + counter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + counter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + counter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + join_error_text + '</h5>     </div>        </div>    </div></div> </div>');
                    }
                    else {
                      $(this).find(`:nth-child(1)`).html('<div id="import_status_cell' + counter + '"></div>');

                      let enrolled_date;
                      let enrolled_date_value;
                      if ($(this).find(`:nth-child(15)`).text() !== undefined) {
                        enrolled_date_value = $(this).find(`:nth-child(15)`).text() ? $(this).find(`:nth-child(15)`).text() : null
                        enrolled_date = ExcelDateToJSDate(enrolled_date_value);
                      }
                      let expiry_date;
                      let expiry_date_value;
                      if ($(this).find(`:nth-child(15)`).text() !== undefined) {
                        expiry_date_value = $(this).find(`:nth-child(16)`).text() ? $(this).find(`:nth-child(16)`).text() : null
                        expiry_date = ExcelDateToJSDate(expiry_date_value);
                      }
                      //$(this).find(`:nth-child(16)`).text() // exp date


                      let tierName = $(this).find(`:nth-child(2)`).text();

                      let emailIDValue = $(this).find(`:nth-child(5)`).text();
                      let emailIDValueLower = emailIDValue.toLowerCase();

                      let rows_value = {
                        "clubid": clubID,
                      }

                      if (tierName && tierName != 'undefined') {
                        const sel = tierListArr.filter((val) => {
                          return (val.name
                            == tierName)
                        })
                        rows_value["tierid"] = sel[0].id
                      }
                      if ($(this).find(`:nth-child(3)`).text() && $(this).find(`:nth-child(3)`).text() != "undefined") {
                        rows_value["first_name"] = $(this).find(`:nth-child(3)`).text();
                      }

                      if ($(this).find(`:nth-child(4)`).text() && $(this).find(`:nth-child(4)`).text() != "undefined") {
                        rows_value["last_name"] = $(this).find(`:nth-child(4)`).text();
                      }
                      if (emailIDValueLower) {
                        rows_value["email"] = emailIDValueLower
                      }
                      if ($(this).find(`:nth-child(6)`).text() && $(this).find(`:nth-child(6)`).text() != "undefined") {
                        rows_value["password"] = $(this).find(`:nth-child(6)`).text();
                      }
                      if ($(this).find(`:nth-child(7)`).text() && $(this).find(`:nth-child(7)`).text() != "undefined") {
                        rows_value["calling_code"] = $(this).find(`:nth-child(7)`).text();
                      }
                      if ($(this).find(`:nth-child(8)`).text() && $(this).find(`:nth-child(8)`).text() != "undefined") {
                        rows_value["phone"] = $(this).find(`:nth-child(8)`).text();
                      }
                      if ($(this).find(`:nth-child(9)`).text() && $(this).find(`:nth-child(9)`).text() != "undefined") {
                        rows_value["address1"] = $(this).find(`:nth-child(9)`).text();
                      }
                      if ($(this).find(`:nth-child(10)`).text() && $(this).find(`:nth-child(10)`).text() != "undefined") {
                        rows_value["address2"] = $(this).find(`:nth-child(10)`).text();
                      }
                      if ($(this).find(`:nth-child(11)`).text() && $(this).find(`:nth-child(11)`).text() != "undefined") {
                        rows_value["country"] = $(this).find(`:nth-child(11)`).text();
                      }
                      if ($(this).find(`:nth-child(12)`).text() && $(this).find(`:nth-child(12)`).text() != "undefined") {
                        rows_value["state"] = $(this).find(`:nth-child(12)`).text();
                      }
                      if ($(this).find(`:nth-child(13)`).text() && $(this).find(`:nth-child(13)`).text() != "undefined") {
                        rows_value["city"] = $(this).find(`:nth-child(13)`).text();
                      }
                      if ($(this).find(`:nth-child(14)`).text() && $(this).find(`:nth-child(14)`).text() != "undefined") {
                        rows_value["postal_code"] = $(this).find(`:nth-child(14)`).text();
                      }
                      if (enrolled_date && enrolled_date != "undefined") { rows_value["enrolled_at"] = enrolled_date }
                      if (expiry_date_value && expiry_date_value != "undefined") {
                        rows_value["expiredat"] = expiry_date_value
                      }
                      if ($(this).find(`:nth-child(17)`).text() && $(this).find(`:nth-child(17)`).text() != "undefined") {
                        rows_value["status"] = $(this).find(`:nth-child(17)`).text();
                      }
                      if ($(this).find(`:nth-child(18)`).text() && $(this).find(`:nth-child(18)`).text() != "undefined") {
                        rows_value["external"] = $(this).find(`:nth-child(18)`).text();
                      }
                      //call getMemberAPI
                      const isEmailExist = memberListArr.some((el) => {
                        return el.email === rows_value.email;
                      });
                      if (isEmailExist) {
                        updatemember(rows_value)
                      } else {
                        addMember(rows_value)
                      }

                    }
                    counter++;
                  })
                }

                //cnt++;
              }
              $("#ImportMemberTemplate").modal("hide");
              //$('#exceltable').show();  
              $("#importingMemberData").modal("show");
              //$("#importingMemberData").attr("title", "Member Detail");

              $('#loader').hide();

            }
            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
              reader.readAsArrayBuffer($("#import_members")[0].files[0]);
            }
            else {
              reader.readAsBinaryString($("#import_members")[0].files[0]);
            }
          }
          else {
            notify('Sorry! Your browser does not support HTML5!', 'danger')
          }
        }
        else {
          notify('Please upload a valid Excel file!', 'danger')
        }
      }
      else {
        $('#loader').hide();
        notify('Club not linked with tier', 'error')
      }
    })
  });

  function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    var month = '' + date_info.getMonth(),
      day = '' + date_info.getDate(),
      year = date_info.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
  function MemberProcess(excelJsonData, rowCounter) {
    let email_value = excelJsonData.email;
    $.post("/getMember", { email: email_value }, (result) => {
      console.log("******************* ", result);
      if (result.errors) {// add success// check if data exist result.data
        for (let error of result.errors) { //remove loop
          notify(`${error.message}`, "error");
        }
      }
      else {
        let rest = result.data.get.result;
        if (rest) {
          // get full country from country code



          //update fields other that tier, status
          updateMemberDetails(excelJsonData, rest, rowCounter);

          let tierID_value = getTierIDfromTierName(excelJsonData.tier);
          let changeTierParameters;

          //update tier if tier change  
          if (rest.tierid != tierID_value) {
            changeTierParameters = {
              email: rest.email,
              tierid: tierID_value,
            }
            changeTierWhileUpdateMember(changeTierParameters, rowCounter);
          }
          // update status if status change
          if (rest.status != excelJsonData.status) {
            changeStatusParameters = {
              email: rest.email,
              clubid: rest.clubid,
            }
            changeMemberStatus(changeStatusParameters, rowCounter, excelJsonData.status);
          }
        }
        else {
          console.log("insertion excelJsonData ", excelJsonData);

          // insertion
          addMembersFromFile(excelJsonData, rowCounter);
        }
      }
    });
  }
  function changeMemberStatus(changeStatusParameters_data, rowCounter, statusValue) {
    $('#loader').show();
    if (statusValue == "DELETED") {
      $.post("/deleteMember", changeStatusParameters_data, function (result) {
        if (result.data.delete.success == true) {
          $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '">  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle align-middle me-2 svg-filter-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> </div>');
        } else {
          $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.data.delete.message + '</h5>     </div>        </div>    </div></div> </div>');
        }
      });
    }
    else if (statusValue == "ACTIVE") {
      $.post("/activeMember", changeStatusParameters_data, function (result) {
        if (result.data.active.success == true) {
          $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '">  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle align-middle me-2 svg-filter-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> </div>');
        } else {
          $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.data.active.message + '</h5>     </div>        </div>    </div></div> </div>');
        }
      });
    }
    else {
      //INACTIVE
      $.post("/inactiveMember", changeStatusParameters_data, function (result) {
        if (result.data.inactive.success == true) {
          $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '">  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle align-middle me-2 svg-filter-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> </div>');
        } else {
          $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.data.inactive.message + '</h5>     </div>        </div>    </div></div> </div>');
        }
      });
    }

  }
  function updateMemberDetails(DataInExcel, DataFromDB, rowCounter) {
    $('#loader').show();
    let fieldChangeFlag = 0;
    let updateInput = {};
    if (DataInExcel.first_name.toLowerCase() != DataFromDB.firstname.toLowerCase()) {
      let first_name_value = DataInExcel.first_name.toLowerCase();
      updateInput.first_name = first_name_value;
      fieldChangeFlag = 1;
    }

    if (DataInExcel.last_name.toLowerCase() != DataFromDB.lastname.toLowerCase()) {
      let last_name_value = DataInExcel.last_name.toLowerCase();
      updateInput.last_name = last_name_value;
      fieldChangeFlag = 1;
    }
    if (DataInExcel.address1 != DataFromDB.address1) {
      let address1_value = DataInExcel.address1;
      updateInput.address1 = address1_value;
      fieldChangeFlag = 1;
    }
    if (DataInExcel.address2 != DataFromDB.address2) {
      let address2_value = DataInExcel.address2;
      updateInput.address2 = address2_value;
      fieldChangeFlag = 1;
    }
    /* if(DataInExcel.calling_code != DataFromDB.callingcode)
    {
      let calling_code_value=DataInExcel.calling_code;
      updateInput.calling_code = calling_code_value;
      fieldChangeFlag=1;
    } */
    if (DataInExcel.city != DataFromDB.city) {
      let city_value = DataInExcel.city;
      updateInput.city = city_value;
      fieldChangeFlag = 1;
    }

    if (DataInExcel.expiredat != DataFromDB.expiredat) {
      let expiredat_value = DataInExcel.expiredat;
      updateInput.expiredat = expiredat_value;
      fieldChangeFlag = 1;
    }

    if (DataInExcel.external != DataFromDB.externalid) {
      let external_value = DataInExcel.external;
      updateInput.external = external_value;
      fieldChangeFlag = 1;
    }
    if (DataInExcel.phone != DataFromDB.phone) {
      let phone_value = DataInExcel.phone;
      updateInput.phone = phone_value;
      fieldChangeFlag = 1;
    }
    if (DataInExcel.postal_code != DataFromDB.postalcode) {
      let postal_code_value = DataInExcel.postal_code;
      updateInput.postal_code = postal_code_value;
      fieldChangeFlag = 1;
    }
    if (DataInExcel.state != DataFromDB.state) {
      let state_value = DataInExcel.state;
      updateInput.state = state_value;
      fieldChangeFlag = 1;
    }


    if (fieldChangeFlag == 1) {
      //update fields
      updateInput.id = DataFromDB.id;
      updateInput.email = DataFromDB.email;

      $.post("/updateMemberFormImport", updateInput, function (result) {
        if (!result.errors) {
          if (result.data.update.success !== undefined) {

            $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '">  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle align-middle me-2 svg-filter-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>    </div>');
            $('#loader').hide();
          } else {

            $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"     data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.data.update.message + '</h5>     </div>        </div>    </div></div> </div>');
            notify(result.data.update.message, "error");
            $('#loader').hide();
          }
        } else {
          $("#updateUserModal").modal('hide')

          $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"     data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.errors[0].message + '</h5>     </div>        </div>    </div></div> </div>');
          notify(result.errors[0].message, "error");
          $('#loader').hide();

        }
      });
    }
    else {
      //$('#loader').hide();
      $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '">  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle align-middle me-2 svg-filter-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>    </div>');
      //No changes require


    }
  }
  function changeTierWhileUpdateMember(input_changeTierParameters, rowCounter) {
    $('#loader').show();
    $.post("/member/changeTier", input_changeTierParameters, function (result) {
      if (result.data.changeTier.success == true) {
        $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '">  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle align-middle me-2 svg-filter-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> </div>');
        $('#loader').hide();
      } else {
        $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.data.changeTier.message + '</h5>     </div>        </div>    </div></div> </div>');
        $('#loader').hide();
      }
    });
  }

  function getTierIDfromTierName(TierNameValue) {
    $('#loader').show();
    let localStorageData_clubtiers = JSON.parse(localStorage.getItem("clubTiers"));
    let tierIDValue;
    $(localStorageData_clubtiers).each(function () {
      if (this.name == TierNameValue) {
        tierIDValue = this.id;
      }
    });
    return tierIDValue;
  }
  function addMembersFromFile(excelJsonDetails, rowCounter) {
    $('#loader').show();
    let tierID = getTierIDfromTierName(excelJsonDetails.tier)
    console.log("insertion tierID ---- ", tierID);
    if (tierID !== undefined) {
      excelJsonDetails.tierid = tierID;

      $.post("/member/addNew", excelJsonDetails, function (result) {

        if (!result.errors) {
          if (result.data.add.success !== undefined) {
            //notify(result.data.add.message, "success");
            $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle align-middle me-2 svg-filter-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.data.add.message + '</h5>     </div>        </div>    </div></div> </div>');
            $('#loader').hide();
          } else {
            //notify(result.data.add.message, "error");
            $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + result.data.add.message + '</h5>     </div>        </div>    </div></div> </div>');
            $('#loader').hide();
          }
          localStorage.removeItem('clubTiers');
        } else {
          for (let error of result.errors) {
            //notify(`${error.message}`, 'error')
            $("#import_status_cell" + rowCounter).html('<div id="import_status_cell' + rowCounter + '"> <a id="ImportMemberErrorTag' + rowCounter + '"   title="See the failure reason" data-bs-toggle="modal" data-bs-target="#ImportMemberError' + rowCounter + '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle align-middle me-2 svg-filter-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></a> <div class="modal fade" id="ImportMemberError' + rowCounter + '" tabindex="-1"   aria-hidden="true"   >    <div class="modal-dialog modal-dialog-centered modal-md" role="document"  >        <div class="modal-content import_member_error_popup_container ">            <div class="modal-header import_member_error_popup">    <h5 class="modal-title">' + error.message + '</h5>     </div>        </div>    </div></div> </div>');
            $('#loader').hide();
          }
          localStorage.removeItem('clubTiers');
        }
      });
    }
    //$('#loader').hide();
  }
  function BindTable(data, tableid) {/*Function used to convert the JSON array to Html Table*/

    BindTableHeader(data, tableid); /*Gets all the column headings of Excel*/
    let idx = 1;
    for (let row of data) {
      $("#tableBodyData").append(`<tr id="${idx}"></tr>`);
      let columns = Object.keys(row);
      $(`#${idx}`).append(`<td></td>`);
      for (let column of columns) {
        $(`#${idx}`).append(`<td>${row[column]}</td>`);
      }

      idx++;
    }
    return true;
  }




  function BindTableHeader(jsondata, tableid) {/*Function used to get all column names from JSON and bind the html table header*/

    var rowHash = jsondata[0];
    for (var key in rowHash) {
      if (rowHash.hasOwnProperty(key)) {
        $("#tableHeading").append(`<th>${rowHash[key]}</th>`);
      }
    }
    $("#tableHeading").prepend(`<th>Import Status</th>`);
  }

  $("#addMember").click(() => {
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      return;
    }
    $("#loader").show();
    let input = {
      clubid: $("#MemberClubId").val(),
      first_name: $("#first_name").val(),
      last_name: $("#last_name").val(),
      tierid: $("#tierid").val(),
      password: $("#password").val(),
      email: $("#email").val(),
      address1: $("#address1").val(),
      address2: $("#address2").val(),
      city: $("#city").val(),
      state: $("#state").val().split("|")[1],
      country: $("#country").val().split("|")[1],
      postal_code: $("#postal_code").val(),
      calling_code: $("#callingcode").val(),
      phone: $("#phone").val(),
      enrolled_at: $("#enrolled_at").val(),
      referred: $("#referred").val(),
      language: $("#language").val(),
      currency: $("#currency").val().toString(),
      billable: $("#billable").val(),
      cover: $("#cover").val(),
      photo: $("#photo").val(),
      password:$('password').val()
    };

    existName("", $("#email").val().trim(), 1, null).then((res) => {
      if (res == -1) {
        addMember(input);
      } else {
        notify("Email Already Exist", "danger");
      }
    });
    $("#loader").hide();
  });
  $("#updateMember").click(() => {
    if (!_editForm.reportValidity()) {
      _editForm.reportValidity();
      return;
    }
    $("#loader").show();
    let input = {
      id: parseInt($("#memberid").val()),
      first_name: $("#update_first_name").val(),
      last_name: $("#update_last_name").val(),
      phone: $("#update_phone").val(),
      email: $("#update_email").val().trim(),
      address1: $("#update_address1").val(),
      address2: $("#update_address2").val(),
      city: $("#update_city").val(),
      state: $("#update_state").val().split("|")[1],
      country: $("#update_country").val().split("|")[1],
      language: $("#update_language").val(),
      currency: $("#update_currency").val(),
      postalcode: $("#update_postal_code").val(),
      calling_code: $("#update_callingcode").val(),
    };
    if ($("#update_email").val().trim() == $("#hidden_email").val().trim()) {
      existName("", $("#update_email").val().trim(), 2, 1).then((res) => {
        if (res == -1) updatemember(input);
        else {
          notify("Email Already Exist", "danger");
        }
      });
    } else {
      existName("", $("#update_email").val().trim(), 2, null).then((res) => {
        if (res == -1) updatemember(input);
        else {
          notify("Email Already Exist", "danger");
        }
      });
    }
    $("#loader").hide();
  });

  //Active / Inactive
  $("#ActiveMember").click(function () {
    let cbs = $.find("#memberList tr input[name='cbRow']");
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
      $("#activeDialog .modal-title").html("Active Member");
      $("#activeDialog #bactive").off("click");
      $("#activeDialog #bactive").click(() => {
        $("#bactive").prop("disabled", true);
        bulkActive();
      });
      $("#activeDialog").modal("show");
    } else {
      notify("Member(s) not selected", "warning");
    }
  });

  $("#InactiveMember").click(function () {
    let cbs = $.find("#memberList tr input[name='cbRow']");
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
      $("#inactiveDialog .modal-title").html("Inactive Member");
      $("#inactiveDialog #binactive").off("click");
      $("#inactiveDialog #binactive").click(() => {
        $("#binactive").prop("disabled", true);
        bulkInactive();
      });
      $("#inactiveDialog").modal("show");
    } else {
      notify("Member(s) not selected", "warning");
    }
  });

  $("#deleteAll").click(() => {
    let cbs = $.find("#memberList tr input[name='cbRow']");
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
      $("#deleteDialog .modal-title").html("Delete Members");
      $("#deleteDialog #bdelete").off("click");
      $("#deleteDialog #bdelete").click(() => {
        $("#bdelete").prop("disabled", true);
        bulkDelete();
      });
      $("#deleteDialog").modal("show");
    } else {
      notify("Members(s) not selected", "warning");
    }
  });

  $("#Yes").click(() => {
    let namematch =
      $("#hiddenmemberemail").val().trim().toLowerCase() ==
      $("#prompt").val().trim().toLowerCase();
    if (namematch) {
      $("#deleteUserModal").modal("hide");
      $("#confirmModal").modal("show");
      let input = {
        id: $("#hiddenmemberid").val(),
        email: $("#hiddenmemberemail").val(),
      };
      var html1 = ``;
      html1 += `<h4 style="margin-top: 10px;">${input.email}</h4>`;
      $("#confrmdelete").html(html1);
    } else {
      $("#deleteUserModal").modal("hide");
      notify("Member is mismatch", "error");
    }
  });
  //delete
  $("#delete").click(() => {
    let input = {
      id: $("#hiddenmemberid").val(),
      email: $("#hiddenmemberemail").val(),
    };
    $("#loader").show();
    $.post("/deleteMember", input, function (result) {
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
      } else {
        $("#confirmModal").modal("hide");
        memberList();
        notify("Member Deleted successfully", "success");
      }
      $("#loader").hide();
    });
  });

  $.post("/languageList", {}, (result) => {
    let html = ``;
    html = `<option value="">Choose Languages</option>`;
    if (result.length != 0) {
      languageList = result;
      $.each(result, (i, res) => {
        html += `<option value=${res.code}>${res.name}</option>`;
      });
      $("#language").html(html);
      $("#update_language").html(html);
    }
  });

  $.post("/countryList", {}, (result) => {
    $("#loader").show();
    if (result.errors) {
      for (let error of result.errors) {
        notify(`${error.message}`, "error");
      }
      $("#loader").hide();
    } else {
      let html = ``;
      html = `<option value="">Choose Country</option>`;
      $("#country").empty();
      $("#update_country").empty();
      $("#callingcode").empty();

      $("#country").append(`<option value="">Choose Country</option>`);
      $("#update_country").append(`<option value="">Choose Country</option>`);
      if (result.data.countries.result) {
        $.each(result.data.countries.result, (i, res) => {
          $("#country").append(
            `<option value=${res.id}|${res.alpha2}>${res.name}</option>`
          );
          $("#update_country").append(
            `<option value=${res.id}|${res.alpha2}>${res.name}</option>`
          );
          $("#callingcode").append(
            `<option value="+${res.diallingcode}">+${res.diallingcode}</option>`
          );
          $("#update_callingcode").append(
            `<option value="+${res.diallingcode}">+${res.diallingcode}</option>`
          );
        });
        countryList = result.data.countries.result;
        let html = ``;
        html = `<option value="">Choose Currency</option>`;
        if (countryList.length != 0) {
          let currency_list = [];
          $.each(countryList, (i, res) => {
            currency_list.push({ code: res.currencycode });
            html += `<option value=${res.currencycode}>${res.currencycode}</option>`;
          });
          currency = currency_list;
          $("#currency").html(html);
          $("#update_currency").html(html);
        }
        //$("#country").html(html)
        //$("#update_country").html(html)
      }
      $("#loader").hide();
    }
  });

  /*
  $.post("/tierList", {}, (result) => {
    let html = ``;
    html = `<option value="">Choose Tier</option>`
    if (result.length != 0) {
      $.each(result, (i, res) => {
        html += `<option value=${res.id}>${res.name}</option>`
      })
      $("#tierid").html(html)
      $("#update_tierid").html(html)
    }
  })
  */
  fill_club_list("#MemberClubId");
  fill_club_list("#UpdateMemberClubId");
  fill_club_list("#importClubId");
  fill_club_list("#DownloadClubId");
  /* $.get("/club/list", {}, (result) => {
    let html = ``;
    html = `<option value="">Choose Club</option>`;
    if (result.length != 0) {
      $.each(result, (i, res) => {
        if (userClubId > 0 && res.id != userClubId) {
          delete res;
        }
        else {
          html += `<option value=${res.id}>${res.name}</option>`
        }
      })
      $("#MemberClubId").html(html)
      $("#UpdateMemberClubId").html(html)
      $("#DownloadMemberClubId").html(html)
      $("#ImportMemberClubId").html(html)
    }
  }) */

  // length 164

  $("#MemberClubId").on("change", function () {
    clubTier($(this).val(), selected_tier);
  });
  $("#UpdateMemberClubId").on("change", function () {
    clubTier($(this).val(), selected_tier);
  });  
});

function clubTier(clubid, tierId) {
  $("#loader").show();
  $.post("/clubTierList", { clubid: clubid }, (result) => {
    let html = ``;
    html = `<option value="">Choose Tier</option>`;
    if (result.data && result.data.tiers.success) {
      $.each(result.data.tiers.result, (i, res) => {
        tierListArr = result.data.tiers.result
        if (tierId == res.id) {
          html += `<option value=${res.id} selected>${res.name}</option>`;
        }
        else { html += `<option value=${res.id}>${res.name}</option>`; }
      });
      $("#tierid").html(html);
      $("#update_tierid").html(html);
    }
    $("#loader").hide();
  });
}




function addMember(inputdata) {
  const data =inputdata
  $.post("/member/addNew", inputdata, function (result) {
    // console.log(inputdata.unserialize())
    if (!result.errors) {
      if (result.data.add.success) {
        notify(result.data.add.message, "success");
        //$("#AddNewMember").hide();
        $("#loader").hide();
        $("#AddNewMember").modal("hide");
        memberList();
        sendEmail
        ({
          to: 'franklin.techzar@gmail.com',
          subject: `OTP from 2BFOUND SPORTS-Complete Your Registration`,
          html:
            `Your OTP is . Valid for 5 Mins 
            We are so glad to have you here! Let's do some exciting things together.`,
        });
      } else {
        notify(result.data.add.message, "error");
        $("#loader").hide();
      }
    } else {
      for (let error of result.errors) {
        notify(`${error.message}`, "error");
      }
    }
  });
}
function getState(country, type) {
  return new Promise((resolve, reject) => {
    $("#loader").show();
    let countryid = country.split("|")[0];
    let html = ``;
    if (type == 1) $("#state").html("");
    else $("#update_state").html("");

    html = `<option value="">Choose State</option>`;
    $.post("/states", { countryid: countryid }, (result) => {
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
        $("#loader").hide();
      } else {
        if (result.data.state.result) {
          $.each(result.data.state.result, (i, res) => {
            if (selected_state != 0 && res.name.includes(selected_state)) {
              html += `<option selected value=${res.id}|${res.name}>${res.name}</option>`;
            } else {
              html += `<option value=${res.id}|${res.name}>${res.name}</option>`;
            }
          });
          stateList = result.data.state.result;
          resolve(stateList);
          if (type == 1) $("#state").html(html);
          else {
            $("#update_state").html(html).trigger("change");
          }
        }
        $("#loader").hide();
      }
    });
  });
}
function getCity(state, type) {
  return new Promise((resolve, reject) => {
    $("#loader").show();
    let stateid = state.split("|")[0];
    let html = ``;
    if (type == 1) $("#city").html("");
    else $("#update_city").html("");

    html = `<option value="">Choose Cities</option>`;
    $.post("/cities", { stateid: stateid }, (result) => {
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, "error");
        }
        $("#loader").hide();
      } else {
        if (result.data.city.result) {
          $.each(result.data.city.result, (i, res) => {
            if (selected_city != 0 && res.name.includes(selected_city)) {
              html += `<option selected value=${res.name}>${res.name}</option>`;
            } else {
              html += `<option value=${res.name}>${res.name}</option>`;
            }
          });
          cityList = result.data.city.result;
          resolve(cityList);
          if (type == 1) $("#city").html(html);
          else {
            $("#update_city").html(html).trigger("change");
          }
        }
        $("#loader").hide();
      }
    });
  });
}

function memberList(fname, lname, email, status) {
  $("#memberList").html("");
  $("#loader").show();
  let user = JSON.parse(localStorage.getItem("user"));
  let input = { fname: fname, lname: lname, email: email, status: status };
  if (user.clubid) {
    input["clubid"] = user.clubid;
  }
  $.post("/memberList", input, (result) => {
    $("#loader").hide();
    if (result.success == false) {
      notify(result.message, "error");

      var rec = ` `;
      rec += `<td colspan="4" align="center">No Records found</td>`;
      $("#norecords").html(rec);
    } else {
      memberListArr = result
      _getPageData(result);
    }
  });
}
async function bulkActive() {
  $("#loader").show();
  let cbs = $.find("#memberList tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = $(this).data("email");
      ids.push(id);
    }
  });
  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/activeMember", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.activerole) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Member activated successfully", "success");
      memberList();
    } else {
      notify("Unable to activate supplier(s)", "error");
    }
    $("#loader").hide();
  }
  $("#activeDialog").modal("hide");
  $("#bactive").prop("disabled", false);
}

async function bulkInactive() {
  $("#loader").show();
  let cbs = $.find("#memberList tr input[name='cbRow']");
  let ids = [];
  $(cbs).each(function () {
    if (this.checked) {
      let id = $(this).data("email");
      ids.push(id);
    }
  });
  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch("/inactiveMember", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: id,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (result.data && result.data.activerole) {
          return id;
        }
      })
    );
    if (ids.length - dids.length === 0) {
      notify("Member deactivated successfully", "success");
      memberList();
    } else {
      notify("Unable to deactivated member(s)", "error");
    }
    $("#loader").hide();
  }
  $("#inactiveDialog").modal("hide");
  $("#binactive").prop("disabled", false);
}
function deleteRow(clubid, email) {
  $("#list").empty();
  $("#list").append(`<li data-id="${clubid}">${email}</li>`);
  $("#deleteDialog .modal-title").html("Delete Member");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    singleDelete(clubid, email);
  });
  $("#deleteDialog").modal("show");
}
$(document).on("click", ".delete-resource", function () {
  let id = $(this).data("id");
  let email = $(this).data("name");
  $("#list").empty();
  $("#list").append(`<li data-id="${id}">${$(this).data("name")}</li>`);
  $("#deleteDialog .modal-title").html("Delete Resource(s)");
  $("#deleteDialog #bdelete").off("click");
  $("#deleteDialog #bdelete").click(() => {
    $("#bdelete").prop("disabled", true);
    singleDelete(id, email);
  });
  $("#deleteDialog").modal("show");
});
function singleDelete(clubId, email) {
  $("#loader").show();

  $.post(
    "/deleteMember",
    {
      clubid: clubId,
      email: email,
    },
    function (result) {
      $("#loader").hide();
      if (result.data && result.data.delete.success) {
        notify(result.data.delete.message, "success");
      } else {
        notify(result.data.delete.message, "error");
      }
      memberList();
    }
  );
  $("#loader").hide();
  $("#deleteDialog").modal("hide");
}
function updatemember(input) {
  $.post("/updateMember", input, function (result) {
    if (!result.errors) {
      if (result.data.update.success) {
        $("#updateUserModal").modal("hide");
        notify("Member updated successfully", "success");
        memberList();
        $("#loader").hide();
      } else {
        notify(result.data.update.message, "error");
        $("#loader").hide();
      }
    } else {
      $("#updateUserModal").modal("hide");
      notify(result.errors[0].message, "error");
      $("#loader").hide();
    }
  });

  $("#inactiveDialog").modal("hide");
  $(".modal-backdrop").remove();
}
async function existName(id = null, email, type, no = null) {
  return new Promise((resolve, reject) => {
    $.post("/memberList", { email: email }, (result) => {
      if (result.length != 0) {
        if (type == 1) {
          result.splice(
            result.findIndex((res) => res.email == email),
            1
          );
          let emailExist = result.findIndex((res) => res.email == email);
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
        resolve(-1);
      }
    });
  });
}

function updatememberPromt(memberid, email) {
  $("#loader").show();
  document.querySelector("#updateUserForm").reset();
  $("#memberid").val(memberid);

  $.post("/getMember", { email: email }, (result) => {
    if (result.errors) {
      for (let error of result.errors) {
        notify(`${error.message}`, "error");
      }
      $("#loader").hide();
    } else {
      if (result?.data?.get?.success) {
        let rest = result?.data?.get?.result;
        $("#memberid").val(parseInt(rest.id));
        $("#update_first_name").val(rest.firstname);
        $("#update_last_name").val(rest.lastname);
        $("#update_phone").val(rest.phone);
        $("#update_email").val(rest.email);
        $("#hidden_email").val(rest.email);
        $("#update_address1").val(rest.address1);
        $("#update_address2").val(rest.address2);
        // $("#update_cover").val(rest.cover);      
        clubTier(rest.clubid, rest.tierid);
        $("#UpdateMemberClubId").val(rest.clubid).trigger("change");

        $("#update_country option").filter(function () {
          return this.text == rest.country;
        }).attr('selected', true).trigger("change");

        selected_city = rest.city;
        selected_state = rest.state;
        selected_tier = rest.tierid;

        $("#update_postal_code").val(rest.postalcode);
        $("#update_language").val(rest.language).trigger("change");
        $("#update_currency").val(rest.currency).trigger("change");
        $("#update_callingcode").val(rest.callingcode);
      } else {
        notify(result?.data?.get?.message, "error");
      }
    }
    $("#loader").hide();
  });
}

function deletePromt(id, email) {
  document.querySelector("#deleteUserForm").reset();
  $("#hiddenmemberid").val(id);
  $("#hiddenmemberemail").val(email);
}

async function bulkDelete() {
  $("#loader").show();
  let cbs = $.find("#memberList tr input[name='cbRow']");
  let ids = [];
  let id_count = 0;
  $(cbs).each(function () {
    if (this.checked)
      ids.push({
        id: parseInt($(this).data("id")),
        email: $(this).data("email"),
      });
  });
  if (ids.length) {
    let dids = await Promise.all(
      ids.map(async (req) => {
        const response = await fetch("/deleteMember", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clubid: req.id,
            email: req.email,
          }), // body data type must match "Content-Type" header
        });
        let result = await response.json();
        if (!result.errors) {
          if (result.data.delete.success) {
            id_count++;
          }
        } else {
          return req.id;
        }
      })
    );
    if (ids.length == id_count) {
      notify("Members deleted successfully", "success");
      memberList();
    } else {
      notify("Unable to delete member(s)", "error");
    }
    $("#loader").hide();
  }
  $("#deleteDialog").modal("hide");
  $("#bdelete").prop("disabled", false);
}
function closeModal(modalname) {
  $("#" + modalname).modal("hide");
  document.getElementById(modalname).reset();
}
function _getPageData(memberList) {
  let ele = $("#memberList");
  ele.find("tr").remove();
  if (memberList.length) {
    $.get("/templates/memberlist.html", function (template) {
      $.each(memberList, function (index, item) {
        if (userClubId > 0 && item.clubid != userClubId) {
          delete item;
        } else {
          let _resource = [];
          if (item.resources != null) {
            _dataResource.forEach(function (_res) {
              let _d =
                item.resources.includes(_res.id) == true ? _res.name : "";
              if (_d != "") _resource.push(_d);
            });
          }
          item.resources = _resource.join(", ");
          $.tmpl(template, item).appendTo("#memberList");
        }
      });

      if (userClubId > 0) {
        let input = {
          clubid: userClubId,
        };
        let found = false;
        $.post(`/setting/list`, input, (result) => {
          $.each(result, function (index, item) {
            if (item.name == 'MEMBER IMPORT' && item.value == 'true') {
              $('#importTemplate, #downloadTemplate').show();
              found = true
            }
          })
          if (!found) {
            $('#importTemplate, #downloadTemplate').remove();
          }
        });
      }
      else {
        $('#importTemplate, #downloadTemplate').show();
      }
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
    ele.html("<p>No content found</p>");
  }
}


function phoneValidate(phone) {
  var phone_length = phone.length;
  var phoneReg = /^[0-9]*$/;
  if (!phoneReg.test(phone)) {
    return 0;
  }
  else {
    if (phone_length < 5) {
      return 0;
    }
    else {
      return 1;
    }
  }
}

function emailValidate(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if (!emailReg.test(email)) {
    //notify("Invalid Email Format", "error");
    return 0;
  } else {
    return 1;
  }
}