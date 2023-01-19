// import * as FileSaver from "../.././node_modules/file-saver/dist/FileSaver";
// import * as ExcelJS from "exceljs";
// const ExcelJS = require('exceljs/dist/es5');
// const FileSaver = require('file-saver');
let import_dats = [];
let clubs = [];
var _editForm = document.getElementById("editForm");
var _refundForm = document.getElementById("refundForm");

var resultData = [];
let main_array = [];

function selectAll() {
  if ($("#select-all").prop("checked")) {
    $(".im-checkbox").prop("checked", true);
  } else {
    $(".im-checkbox").prop("checked", false);
  }
}

function selectAll() {
  if ($("#select-all").prop("checked")) {
    $(".im-row-checkbox").prop("checked", true);
  } else {
    $(".im-row-checkbox").prop("checked", false);
  }
}
function add_order_array(add_arr) {
  const input = {};
  if (add_arr.length) {
    add_arr.map((val, index) => {
      const keys = Object.keys(val);
      keys.map((key) => {
        input[key.replace(/\s/g, "").toLowerCase()] = val[key];
      });
      $.post(`/addOrder`, input, async function (result) {
        await result;
      });
    });
  }
  return false;
}
function update_order_array(update_arr) {
  const input = {};
  if (update_arr.length) {
    update_arr.map((val, index) => {
      const keys = Object.keys(val);
      keys.map((key) => {
        input[key.replace(/\s/g, "").toLowerCase()] = val[key];
      });
      $.post(`/updateOrder`, input, async function (result) {
        await result;
      });
    });
  }
  return true;
}

$(document).ready(function () {
  const club_list = JSON.parse(localStorage.getItem("club_list"));
  console.log(club_list);
  $(".import-excel").click(function () {
    let name = $(this).data("name");
    // alert(name);
    $("#excelImportModal .modal-title").html(name);

    import_dats = [];
    $("#import-file").show();
    $("#import-label").hide();
    $("#excelImportModal").modal("show");
    $("#modal-content").removeClass("modal-dialog-new");
    $("#table_view_div").html("");
    $("#import-file").val("");
  });
  $("#import-confirm-btn").click(function () {
    var main_array = [];

    $(".im-row-checkbox").each(function () {
      if ($(this).prop("checked")) {
        let row = $(this).data("id");
        let temp_arr = [];
        temp_arr["orderid"] = $(this).data("orderid");
        $(".im-col-checkbox").each(function () {
          if ($(this).prop("checked")) {
            let col = $(this).data("id");
            let col_name = $(this).data("name");
            temp_arr[col_name] = import_dats[row][col];
          }
        });
        main_array.push(temp_arr);
      }
    });
    if (main_array && main_array.length) {
      let add_arr = [];
      let update_arr = [];

      let orderList = [];
      $.get("orderList", {}, (res) => {
        if (res.length) {
          $.each(res, function (index, item) {
            orderList.push(item.orderid);
          });
          for (var i = 0; i < main_array.length; i++) {
            if (orderList.includes(main_array[i]["orderid"])) {
              update_arr.push(main_array[i]);
            } else {
              add_arr.push(main_array[i]);
            }
          }

          if (add_order_array(add_arr)) {
            notify("added Successfully", "success");
            $("#excelImportModal").modal("hide");
          } else if (update_order_array(update_arr)) {
            notify("Updated Successfully", "success");
            $("#excelImportModal").modal("hide");
          } else if (!add_order_array(add_arr)) {
            notify("Add Something Went Wrong", "error");
            $("#excelImportModal").modal("hide");
          } else {
            notify("Update Something Went Wrong", "error");
            $("#excelImportModal").modal("hide");
          }
        }
      });
    } else {
      notify("Please select atleast one row or columns", "warning");
    }
  });

  $("#import-file").change(function (event) {
    $("#modal-content").addClass("modal-dialog-new");
    if (
      ![
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(event.target.files[0].type)
    ) {
      document.getElementById("table_view_div").innerHTML =
        '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';
      excel_file.value = "";
      return false;
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = function (event) {
      var ordrIDColumns = -1;
      const data = new Uint8Array(reader.result);
      const work_book = XLSX.read(data, { type: "array" });
      const sheet_name = work_book.SheetNames;
      const sheet_data = XLSX.utils.sheet_to_json(
        work_book.Sheets[sheet_name[0]],
        { header: 1 }
      );
      import_dats = sheet_data;
      if (sheet_data.length > 0) {
        let table_output =
          '<table class="table table-stripped table-border table-hover" id="listViewTable">';
        for (var row = 0; row < sheet_data.length; row++) {
          table_output += "<tr>";

          if (row == 0) {
            table_output +=
              '<td><label><input type="checkbox" id="select-all" onChange=selectAll()> All </label></td>';
            for (var cell = 0; cell < sheet_data[row].length; cell++) {
              if (row == 0) {
                if (
                  sheet_data[row][cell].trim().toLowerCase() === "orderid" ||
                  sheet_data[row][cell].trim().toLowerCase() === "order id" ||
                  sheet_data[row][cell].trim().toLowerCase() === "order-id" ||
                  sheet_data[row][cell].trim().toLowerCase() === "order_id"
                ) {
                  ordrIDColumns = cell;
                }
              }
            }
            if (ordrIDColumns == -1) {
              $("#import-file").val("");
              $("#modal-content").removeClass("modal-dialog-new");
              return notify("Order Id not found", "error");
            }
          } else {
            table_output +=
              '<td><input type="checkbox" class="im-row-checkbox" data-id="' +
              row +
              '" data-orderid="' +
              sheet_data[row][ordrIDColumns] +
              '"></td>';
          }

          for (var cell = 0; cell < sheet_data[row].length; cell++) {
            if (row == 0) {
              if (cell == ordrIDColumns) {
                table_output +=
                  '<th class="d-none ' +
                  sheet_data[row][cell].replace(/\s/g, "").toLowerCase() +
                  '">' +
                  sheet_data[row][cell] +
                  "</th>";
              } else {
                table_output +=
                  '<th class="d-none ' +
                  sheet_data[row][cell].replace(/\s/g, "").toLowerCase() +
                  '"> <label><input type="checkbox" class="im-col-checkbox" data-id="' +
                  cell +
                  '" data-name="' +
                  sheet_data[row][cell].trim() +
                  '"> ' +
                  sheet_data[row][cell] +
                  "</label></th>";
              }
            } else {
              if (sheet_data[row][cell] != undefined) {
                table_output +=
                  '<td class="d-none ' +
                  sheet_data[0][cell].replace(/\s/g, "").toLowerCase() +
                  '">' +
                  sheet_data[row][cell] +
                  "</td>";
              } else {
                table_output +=
                  '<td class="d-none ' +
                  sheet_data[0][cell].replace(/\s/g, "").toLowerCase() +
                  '"></td>';
                //
                //   $("#import-file").val("");

                //   return notify('This column '+sheet_data[0][cell]+' cannot be empty (or) Remove the columns','warning')
              }
            }
          }
          table_output += "</tr>";
        }
        table_output += "</table>";
        document.getElementById("table_view_div").innerHTML = table_output;
        $("#import-file").hide();
        $("#import-label").hide();

        columns.map(function (value, index) {
          if (value.showTable) {
            $(
              "." + value.title.replace(/\s/g, "").toLowerCase().trim()
            ).removeClass("d-none");
          }
        });
      }
      excel_file.value = "";
    };
  });

  let exp = false;
  $("#advanceSearch").on("click", function () {
    if (!exp) {
      $("#advanceSearch").html("Hide Filter");
      $("#orderSetting").show("slide");
      $("#orderContent").removeClass("col-12").addClass("col-9");
    } else {
      $("#advanceSearch").html("Filter");
      $("#orderSetting").hide();
      $("#orderContent").removeClass("col-9").addClass("col-12");
    }
    exp = !exp;
    $("#clearFilter").toggle();
  });
  $(".sidebar-toggle").on("click", function () {
    $("#sidebar").toggleClass("collapsed");
  });
  $("#reportOutput").on("change", function () {
    tableData({
      id: "reportOutput",
      val: $(this).val(),
      filterType: "reportOutput",
    });
  });
  /**
   * CLubs Filter
   */
  $("#club").on("change", function () {
    tableData({
      id: "club",
      val: $(this).val(),
      filterType: "includeText",
      resetText: "",
    });
  });

  /**
   * report filter order id change event
   */
  $("#orderId").keyup(function () {
    tableData({ id: "orderid", val: $(this).val(), filterType: "text" });
  });

  $("#orderCnf").keyup(function () {
    tableData({
      id: "confirmation_number",
      val: $(this).val(),
      filterType: "sameText",
    });
  });

  /**
   * report filter order date from change event
   */
  $("#orderDateFrom").on("change", function () {
    tableData({
      id: "createdat",
      from: $(this).val(),
      to: $("#orderDateTo").val(),
      filterType: "date",
    });
  });

  /**
   * report filter order date to change event
   */
  $("#orderDateTo").on("change", function () {
    tableData({
      id: "createdat",
      from: $("#orderDateFrom").val(),
      to: $(this).val(),
      filterType: "date",
    });
  });

  /**
   * report filter order date from change event
   */
  $("#orderPaymentFrom").on("change", function () {
    tableData({
      id: "ClientPaidDate",
      from: $(this).val(),
      to: $("#orderPaymentTo").val(),
      filterType: "text",
    });
  });

  /**
   * report filter order date to change event
   */
  $("#orderPaymentTo").on("change", function () {
    tableData({
      id: "ClientPaidDate",
      from: $("#orderPaymentFrom").val(),
      to: $(this).val(),
      filterType: "date",
    });
  });

  /**
   * report filter order guest name change event
   */
  $("#orderPasName").keyup(function () {
    tableData({
      id: "guest_firstname",
      val: $(this).val(),
      filterType: "text",
    });
  });

  /**
   * report filter order guest email change event
   */
  $("#orderPasEmail").keyup(function () {
    tableData({ id: "guest_email", val: $(this).val(), filterType: "text" });
  });

  /**
   * report filter travel date from change event
   */
  $("#orderTravelFrom").on("change", function () {
    tableData({
      id: "start_date",
      from: $(this).val(),
      to: $("#orderTravelTo").val(),
      filterType: "date",
    });
    tableData({
      id: "end_date",
      from: $(this).val(),
      to: $("#orderTravelTo").val(),
      filterType: "date",
    });
  });

  /**
   * report filter travel date to change event
   */
  $("#orderTravelTo").on("change", function () {
    tableData({
      id: "start_date",
      from: $("#orderTravelFrom").val(),
      to: $(this).val(),
      filterType: "date",
    });
    tableData({
      id: "end_date",
      from: $("#orderTravelFrom").val(),
      to: $(this).val(),
      filterType: "date",
    });
  });

  /**
   * report filter mor change event
   */
  $("#orderMor").on("change", function () {
    tableData({
      id: "mor",
      val: $(this).val(),
      filterType: "sameText",
      resetText: "All",
    });
  });

  /**
   * report filter orderstatus change event
   */
  $("#orderStatus").on("change", function () {
    tableData({
      id: "orderstatus",
      val: $(this).val(),
      filterType: "sameText",
      resetText: "All",
    });
  });

  /**
   * report filter mode change event
   */
  $("#orderMode").on("change", function () {
    tableData({
      id: "mode",
      val: $(this).val(),
      filterType: "sameText",
      resetText: "All",
    });
  });

  /**
   * report filter invoice_type change event
   */
  $("#orderInvoiveType").on("change", function () {
    tableData({
      id: "invoice_type",
      val: $(this).val(),
      filterType: "sameText",
      resetText: "All",
    });
  });

  /**
   * report filter module change event
   */
  $("#orderTravelType").on("change", function () {
    tableData({
      id: "module",
      val: $(this).val(),
      filterType: "sameText",
      resetText: "All",
    });
  });

  /**
   * report filter refund date from change event
   */
  $("#orderRefundFrom").on("change", function () {
    tableData({
      id: "refundedat",
      from: $(this).val(),
      to: $("#orderRefundTo").val(),
      filterType: "date",
    });
  });

  /**
   * report filter refund date to change event
   */
  $("#orderRefundTo").on("change", function () {
    tableData({
      id: "refundedat",
      from: $("#orderRefundFrom").val(),
      to: $(this).val(),
      filterType: "date",
    });
  });

  /**
   * report filter payment status no change event
   */
  $("#paymentStatus").on("change", function () {
    tableData({
      id: "verified",
      val: $(this).val(),
      filterType: "sameText",
      resetText: "All",
    });
  });

  /**
   * Add cancle event
   */
  $("#add-cancle").on("click", function () {
    $("#add-row, #add-save, #add-cancle, #add-update,#add-cancle-edit").hide();
    $("#add-row").show();
    hot.alter("remove_row", 0);
  });

  /**
   * Add save event
   */
  $("#add-save").on("click", function () {
    $("#add-row, #add-save, #add-cancle, #add-update, #add-cancle-edit").hide();
    $("#add-row").show();
    hot.updateSettings({
      cells(row, col, prop) {
        const cellProperties = {};
        cellProperties.readOnly = true;
        return cellProperties;
      },
    });
  });

  /**
   * Add row event
   */
  $("#add-row").on("click", function () {
    $("#add-row, #add-save, #add-cancle, #add-update,#add-cancle-edit").hide();
    $("#add-save, #add-cancle").show();
    hot.alter("insert_row", 0);
    hot.selectRows(0, 0);
    //hot.validateCells();
    //hot.render();
  });

  /**
   * Add cancle edit event
   */
  $("#add-cancle-edit").on("click", function () {
    $("#add-row,#add-save, #add-cancle, #add-update, #add-cancle-edit").hide();
    $("#add-row").show();
    hot.updateSettings({
      cells(row, col, prop) {
        const cellProperties = {};
        cellProperties.readOnly = true;
        return cellProperties;
      },
    });
    for (var i = 0; i < hot.countCols(); i++) {
      hot.setCellMeta(_edit.selectedRow, i, "className", "");
    }
    _edit.state = false;
  });

  /**
   * Update event
   */
  $("#edit-confirm").on("click", function () {
    /*
    let _data2 = {
      'itemid': 'itemid'
    }
    $('.editFormElement').each(function (i, obj) {
      if (!$(obj).attr('disabled')) {
        let key = $(obj).attr('id');
        _data2[key] = $(obj).val();
      }
    });
    resultData.forEach(element => {
      if (element.orderid == $("#orderid").val()) {
        _data2['itemid'] = element.itemid;
      }
    });

    console.log(_data2);

    return;
    */

    $("input, textarea, select")
      .off()
      .on()
      .each(function (i, o) {
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

    $("#loader").show();
    if (!_editForm.reportValidity()) {
      _editForm.reportValidity();
      $("#loader").hide();
      return;
    }

    let _data = {
      itemid: "itemid",
    };
    $(".editFormElement").each(function (i, obj) {
      if (!$(obj).attr("disabled")) {
        let key = $(obj).attr("id");
        _data[key] = $(obj).val();
      }
    });
    resultData.forEach((element) => {
      if (element.orderid == $("#orderid").val()) {
        _data["itemid"] = element.itemid;
      }
    });


    $.post(_apiBase, _data, function (result) {
      if (result && !result.errors) {
        if (result.data.updateorder.success) {
          notify("Order updated", "success");
          $("#editModal").modal("hide");
          _getPageData();
        } else {
          notify(result.data.updateorder.message, "error");
        }
      } else {
        notify(result.errors[0].message, "error");
      }
      $("#loader").hide();
    });

    /*
    $("#add-row, #add-save, #add-cancle, #add-update, #add-cancle-edit").hide();
    $("#add-row").show();
    hot.updateSettings({
      cells(row, col, prop) {
        const cellProperties = {};
        cellProperties.readOnly = true;
        return cellProperties;
      },
    });
    for (var i = 0; i < hot.countCols(); i++) {
      hot.setCellMeta(_edit.selectedRow, i, "className", "");
    }
    _edit.status = false;
    */
  });

<<<<<<< HEAD
=======


  /**
 * Update event
 */
  $("#cancel-confirm").on("click", function () {
    $("#loader").show();
    let _data = {
      'itemid': 'itemid',
      'orderstatus': 'CANCEllED'
    }

    resultData.forEach(element => {
      if (element.orderid == cancelId) {
        _data['itemid'] = element.itemid;
      }
    });
    console.log(_data);
    $.post(_apiBase, _data, function (result) {
      if (result && !result.errors) {
        if (result.data.updateorder.success) {
          notify('Order updated', 'success')
          $('#testMarkModal').modal('hide');
          _getPageData()
        }
        else {
          notify(result.data.updateorder.message, 'error')
        }
      }
      else {
        notify(result.errors[0].message, 'error')
      }
      $("#loader").hide();
    })
  });




  /**
   * Update event
   */
  $("#refund-confirm").on("click", function () {

    $("input, textarea, select").off().on().each(function (i, o) {
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

    $("#loader").show();
    if (!_refundForm.reportValidity()) {
      _refundForm.reportValidity();
      $("#loader").hide();
      return;
    }

    let _data = {
      'itemid': 'itemid',
      'orderstatus': 'REFUNDED'
    }


    resultData.forEach(element => {
      if (element.orderid == refundId) {
        _data['itemid'] = element.itemid;
      }
    });

    console.log(_data);


    $.post(_apiBase, _data, function (result) {
      if (result && !result.errors) {
        if (result.data.updateorder.success) {
          notify('Order updated', 'success')
          $('#editModal').modal('hide');
          _getPageData()
        }
        else {
          notify(result.data.updateorder.message, 'error')
        }
      }
      else {
        notify(result.errors[0].message, 'error')
      }
      $("#loader").hide();
    })

  });



>>>>>>> 11dc00d0f447a51d9ea9d1e6e833eedd058033f5
  let colHeaders = [
    "Order Id", //orderid
    "Invoice Type", //invoice_type
    "Travel Type", //module
    "Club Name", //club
    "Booking Status", //orderstatus
    "Messages ", //orderreason
    "Order Date ", //orderdateReff
    "Booking Method ", //mode
    "CTS Member ID ", //memberid  should be clubid + memberid
    //"Client Member ID", // externalid
    "Member City ", //member_city
    "Member Country", //member_country
    "Membership Tier", //tier
    "Referrer Member ID", //referrerid
    "Guest Name", //guest_firstname
    "Guest Email", //guest_email
    "Supplier", //supplier
    "Hotel Name", //property_name
    "Confirmation #", //confirmation_number
    "Travel Start", //start_date
    "Travel End", //end_date
    "Depart City", // deptCity
    "Destination City", // descCity
    "MOR", //mor
    "Order Ident", // orderIdent
    "Payment ID", // transactionid
    "Correlation ID", // correlationId
    "Currency Type", //currency
    "Exchange Rate", //rate
    "Room Coins Used", //roomcoins
    "Room Coins in Currency", //roomcoins_amount
    "Room Coins in USD", //usd_roomcoins_amount
    "Trip Coins in Currency", //tripcoins_amount
    "Trip Coins in USD", //usd_tripcoins_amount
    "BitPay in Currency", //bitPayCurrency
    "BitPay in USD", // bitPayUsd
    "Crypto in Currency", //cryptoCurrency
    "Crypto in USD", //cryptoUsd
    "PayPal in Currency", //paypalCurrency
    "PayPal in USD", //paypalUsd
    "Card Amt Charged in Currency", //cardAmtChargedCurrency
    "Card Amt Charged in USD", //cardAmtChargedUsd

    "Credit Card Amt Collected USD", // creditCardAmtCollectedUsd import feild
    "Date Credit Card Collected", // dateCreditCardCollected import feild
    "Card Amt passed in Currency", //CardAmtPassedInCurrency
    "Card Amt passed in USD", //CardAmtPassedInUsd

    "Total Booking in Currency", //bookingInCurrency
    "Total Booking in USD", //bookingInUsd
    "Public Price in Currency", //public_price
    "Public Price in USD", //usd_public_price
    "Savings in Currency", //saving
    "Savings in USD", //usd_saving
    "Original Net Price USD", //usd_net_price
    "Merch Markup", //fee
    "Booking Benefit", // bookingBenifit
    "Client Markup", //client_margin_temp
    "CTS Markup", //our_price
    "Expected Margin", //margin
    "Expected Margin %", //margin_perc
    "Booking Amended Date", //updatedat
    "Booking Refund Date", //refundedat
    "Card USD Amount Refunded", //usd_refund
    "Room Coins or Trip Coins USD Refunded", //usd_roomcoins +usd_tripcoins
    "Refund Transaction Id", // reff.reference
    "Revised Booking Total Amount", // reff.amount
    "Revised Margin", //revised_margin

    "Actual Net Price USD", //actualNetPriceUsd import feild
    "Net Price Paid Date", //netPricePaidDate  import feild
    "Actual Margin Received", // actualMarginReceived import feild
    "Actual Margin Received Date", // actualMarginReceivedDate import feild
    "Client Paid", // clientPaid //**************   'Client Paid', import feild
    "Client Paid Date", // ClientPaidDate **************   'Client Paid Date', import feild

    "PROPERTY ADDRESS", //property_address1
    "PROPERTY ADDRESS 2", //property_address2
    "PROPERTY CITY", //property_city
    "PROPERTY STATE", //property_state
    "PROPERTY COUNTRY", //property_country
    "PROPERTY POSTAL CODE", //property_postalcode
    "PROPERTY PHONE", //property_phone
    "Lead Time (Days)", //leadTime
    "Confirmed", //verified
    //"System Date of Confirmation", //createdat
    "System Staff", //creator
  ];
  let columns = [
    {
      data: "orderid",
      showTable: true,
      type: "text",
      title: "Order Id",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      renderer: renderActions,
    },
    {
      data: "invoice_type",
      showTable: false,
      type: "dropdown",
      editAllowedToRoles: ["role1"],
      readOnly: false,
      title: "Invoice type",
      source: ["NONE", "SALE", "REFUNDED", "TEST", ""],
    },
    {
      data: "module",
      showTable: true,
      type: "dropdown",
      editAllowedToRoles: [],
      readOnly: false,
      title: "Travel Type",
      source: [
        "FLIGHT",
        "HOTEL",
        "CAR",
        "ACTIVITY",
        "TOUR",
        "CRUISE",
        "INSURANCE",
        "GATEWAY TRIP",
        "GATEWAY CRUISE",
        "GROUP TRIP",
        "GROUP CRUISE",
        "VACATION RENTAL",
        "",
      ],
    },
    {
      data: "club",
      showTable: true,
      type: "dropdown",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Club",
      source: clubs,
    },
    {
      data: "orderstatus",
      showTable: true,
      type: "dropdown",
      editAllowedToRoles: ["role2"],
      readOnly: false,
      title: "Order status",
      source: ["CREATED", "BOOKED", "CANCEllED", "FAILED", "REFUNDED", ""],
    },
    {
      data: "orderreason",
      showTable: true,
      editAllowedToRoles: ["role1", "role2"],
      readOnly: true,
      type: "text",
      title: "Order Reason",
    },
    {
      data: "createdat", //* */
      showTable: false,
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      type: "date",
      title: "Created Date",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
    },
    {
      data: "mode",
      showTable: true,
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      type: "dropdown",
      title: "Mode",
      source: ["ONLINE", "OFFLINE", ""],
    },
    {
      data: "memberid",
      showTable: true,
      editAllowedToRoles: [],
      readOnly: true,
      title: "Member Id",
      type: "text",
    },
    //{
    //data: "External Id",
    //showTable:false,
    //editAllowedToRoles: ["role1", "role2", "role3"],
    //readOnly: false,
    //title: "External Id",
    //type: "text",
    //},
    {
      data: "member_city",
      showTable: true,
      editAllowedToRoles: [],
      readOnly: true,
      title: "Member City",
      type: "text",
    },
    {
      data: "member_country",
      showTable: true,
      editAllowedToRoles: [],
      readOnly: true,
      title: "Member Country",
      type: "text",
    },
    {
      data: "tier",
      showTable: true,
      editAllowedToRoles: [],
      readOnly: false,
      title: "Tier",
      type: "text",
    },
    {
      data: "referrerid",
      showTable: false,
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      title: "Referrence Id",
      type: "numeric",
    },
    {
      data: "guest_firstname",
      showTable: false,
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Guest First Name",
      type: "text",
    },
    {
      data: "guest_email",
      showTable: false,
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Guest Email",
      type: "text",
    },
    {
      data: "supplier",
      showTable: true,
      editAllowedToRoles: [],
      readOnly: true,
      title: "Supplier",
      type: "text",
    },
    {
      data: "property_name",
      showTable: false,
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      type: "text",
      title: "Property Name",
    },
    {
      data: "confirmation_number",
      showTable: false,
      editAllowedToRoles: [],
      readOnly: true,
      type: "text",
      title: "Confirmation #",
      //type:'dropdown'
      // source: ['Yes', 'No', '']
    },
    {
      data: "start_date",
      showTable: false,
      editAllowedToRoles: [],
      readOnly: true,
      type: "date",
      title: "Travel Start",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
    },
    {
      data: "end_date",
      showTable: false,
      type: "date",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Travel End",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
    },
    {
      data: "deptCity", //depart city
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Departure City",
    },
    {
      data: "descCity", //dest city
      showTable: false,
      title: "Destination City",
      editAllowedToRoles: [],
      readOnly: true,
      type: "text",
    },
    {
      data: "mor",
      showTable: true,
      type: "dropdown",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      title: "MOR",
      source: ["CTS", "SUPPLIER", ""],
    },
    {
      data: "orderIdent",
      showTable: false,
      title: "Order Indent",
      editAllowedToRoles: [],
      readOnly: true,
      type: "text",
    },
    {
      data: "transactionid",
      showTable: false,
      title: "Transaction Id",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      type: "text",
    },
    {
      data: "correlationId", //Correlation ID
      showTable: false,
      title: "Correlation Id",
      editAllowedToRoles: [],
      readOnly: true,
      type: "text",
    },
    {
      data: "currency",
      showTable: false,
      title: "Currency",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      type: "text",
    },
    {
      data: "rate",
      showTable: false,
      title: "Rate",
      editAllowedToRoles: [],
      readOnly: true,
      type: "numeric",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "roomcoins",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Room Coins",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "roomcoins_amount",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Room Coin Amount",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "usd_roomcoins_amount",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "USD Room Coin Amount",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "tripcoins_amount",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Trip Coins Amounts",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "usd_tripcoins_amount",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "USD Trip Coin Amount",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "bitPayCurrency",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: false,
      title: "Bit Pay Currency",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "bitPayUsd",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: false,
      title: "Bit Pay USD",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "cryptoCurrency",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Crypto Currency",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "cryptoUsd",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Crypto USD",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "paypalCurrency",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: false,
      title: "Paypal Currency",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "paypalUsd",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: false,
      title: "Paypal USD",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "cardAmtChargedCurrency",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Card Amount Charged Currency",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "cardAmtChargedUsd",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Card Amount Charged USD",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "creditCardAmtCollectedUsd",
      showTable: false,
      //type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Credit Card Amount Colleccted USD",
      type: "numeric",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "dateCreditCardCollected",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Date Credit Card Collected",
      //dateFormat: 'DD-MMM-YYYY',
      //correctFormat: true
    },
    {
      data: "CardAmtPassedInCurrency",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Card Amt Passed In Currency",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "CardAmtPassedInUsd",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Card Amt Passed In USD",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "bookingInCurrency",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Booking in Currency",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "bookingInUsd",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Booking in USD",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "public_price",
      showTable: false,
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      type: "numeric",
      title: "Public Price",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "usd_public_price",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      title: "USD public price",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "saving",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Saving",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "usd_saving",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "USD saving",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "usd_net_price",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "USD net price",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "fee", //fees or update api
      showTable: false,
      editAllowedToRoles: [],
      readOnly: true,
      type: "numeric",
      title: "Fee",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "bookingBenifit",
      showTable: false,
      title: "Booking Benefit",
      editAllowedToRoles: [],
      readOnly: false,
      type: "text",
    },
    {
      data: "client_margin_temp", //merchant_fees
      showTable: false,
      title: "Client Margin ",
      editAllowedToRoles: [],
      readOnly: false,
      type: "numeric",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "our_price",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      title: "CTS Markup",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "margin",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Expected Margin",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "margin_perc",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: false,
      title: "Expected Margin %",
    },
    {
      data: "updatedat",
      showTable: false,
      type: "date",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Booking Amended Date",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
    },
    {
      data: "refundedat",
      showTable: false,
      type: "date",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Refunded Date",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
      //validator: (e) => { return e == 'Invalid date' ? '' : e; }
    },
    {
      data: "usd_refund",
      showTable: false,
      type: "numeric",
      title: "USD refund",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "roomCoinTripCoin",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Room Coin or Trip Coin USD Refunded",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "reff.reference",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Refunded Transaction Id",
    },
    {
      data: "reff.amount",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Revised Booking Total Amount",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      data: "revised_margin",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Revised Margin",
      numericFormat: {
        pattern: "0.00",
      },
    },
    {
      //import feild db provision
      data: "actualNetPriceUsd",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Actual Net Price USD",
    },
    {
      //import feild db provision
      data: "netPricePaidDate",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Net Price Paid Date",
    },
    {
      //import feild db provision
      data: "actualMarginReceived",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Actual Margin Received",
    },
    {
      //import feild db provision
      data: "actualMarginReceivedDate",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Actual Margin Received Date",
    },
    {
      //import feild db provision
      data: "clientPaid",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Client Paid",
    },
    {
      //import feild db provision
      data: "ClientPaidDate",
      showTable: false,
      type: "text",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Client Paid Date",
    },
    {
      data: "property_address1",
      showTable: false,
      type: "text",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Property Address1",
    },
    {
      data: "property_address2",
      showTable: false,
      type: "text",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Property Address2",
    },
    {
      data: "property_city",
      showTable: false,
      type: "text",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "City",
    },
    {
      data: "property_state",
      showTable: false,
      type: "text",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "State",
    },
    {
      data: "property_country",
      showTable: false,
      type: "text",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Country",
    },
    {
      data: "property_postalcode",
      showTable: false,
      type: "text",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      title: "Postal Code",
    },
    {
      data: "property_phone",
      showTable: false,
      type: "text",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: false,
      title: "Property phone",
    },
    {
      data: "leadTime",
      showTable: false,
      type: "numeric",
      editAllowedToRoles: [],
      readOnly: true,
      title: "Lead time",
      //numericFormat: {
      //pattern: "00",
      //},
    },
    {
      data: "verified",
      showTable: false,
      title: "Verified",
      editAllowedToRoles: [],
      readOnly: true,
      type: "dropdown",
      source: ["Yes", "No", ""], //Pending 'Succeed', 'Failed'
    },
    // {
    //   data: "createdat",
    //   showTable: false,
    //   type: "date",
    //   editAllowedToRoles: ["role1", "role2", "role3"],
    //   readOnly: true,
    //   title: "Created Date",
    //   dateFormat: "DD-MMM-YYYY",
    //   correctFormat: true,
    // },
    {
      data: "creator",
      showTable: false,
      title: "Creator",
      editAllowedToRoles: ["role1", "role2", "role3"],
      readOnly: true,
      type: "text",
    },
  ];
  let keyColumns = [
    "orderid",
    "invoice_type",
    "module",
    "club",
    "orderdateReff",
    "externalid",
    "tier",
    "referrerid",
    "guest_firstname",
    "guest_email",
    "property_name",
    "confirmation_number",
    "start_date",
    "end_date",
    "mor",
    "currency",
    "roomcoins_amount",
    "usd_roomcoins_amount",
    "usd_tripcoins_amount",
    "bitPayUsd",
    "cryptoCurrency",
    "paypalCurrency",
    "cardAmtChargedUsd",
    "CardAmtPassedInUsd",
    "bookingInUsd",
    "usd_public_price",
    "usd_saving",
  ];

  //let keyColumns = ['createdat', 'start_date', 'leadTime'];
  /**
   * binds data for handsontable
   */
  function tableData(input) {
    if (!hot) {
      return;
    }
    if (input.filterType == "reportOutput") {
      let plugin = hot.getPlugin("hiddenColumns");
      columns.forEach((element, pos) => {
        if (input.val == "Key" && !keyColumns.includes(element.data)) {
          plugin.hideColumn(pos);
        }
        if (input.val != "Key") {
          plugin.showColumn(pos);
        }
      });
      hot.render();
      return;
    }
    const filters = hot.getPlugin("filters");
    let index = 0;
    columns.forEach((element, pos) => {
      if (element.data == input.id) {
        index = pos;
      }
    });
    if (input.filterType == "text") {
      filters.clearConditions(index);
      filters.addCondition(index, "contains", [input.val], "conjunction");
      filters.filter();
    }
    if (input.filterType == "sameText") {
      filters.clearConditions(index);
      filters.addCondition(index, "eq", [input.val], "conjunction");
      filters.filter();
      if (input.val == input.resetText) {
        filters.clearConditions(index);
        filters.filter();
      }
    }

    if (input.filterType == "includeText") {
      filters.clearConditions(index);
      input.val.forEach((element) => {
        filters.addCondition(index, "eq", [element], "disjunction");
        filters.filter();
      });
      /*
      if (input.val == input.resetText) {
        filters.clearConditions(index);
        filters.filter();
      }
      if (input.val.length == 0) {
        filters.clearConditions(index);
        filters.filter();
      }
      */
    }

    if (input.filterType == "date") {
      filters.clearConditions(index);
      filters.addCondition(
        index,
        "date_after",
        [moment(input.from).format("DD-MMM-YYYY")],
        "conjunction"
      );
      filters.addCondition(
        index,
        "date_before",
        [moment(input.to).format("DD-MMM-YYYY")],
        "conjunction"
      );
      filters.filter();
    }
    hot.render();
  }

  /**
   * binds Acttion for handsontable row
   */
  function renderActions(instance, td, row, col, prop, value, cellProperties) {

    //console.log(instance.getDataAtRow(row));
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
<<<<<<< HEAD
    td.width = "85%";
    td.innerHTML = `<img class="testMarkModal" src="/img/svg/gear.svg" style="height: 16px; padding-top:2px;"> <img class="editModal" src="/img/svg/pencil-square.svg" style="height: 16px; padding-top:2px;"> ${td.innerHTML}`;
=======
    td.width = '85%';
    if (orderRefundStatus.includes(value)) {
      td.innerHTML = ` ${td.innerHTML}`;
    } else {
      if (orderCancleStatus.includes(value)) {
        td.innerHTML = ` <img class="refundMarkModal" src="/img/svg/refund.png" style="height: 16px; padding-top:2px;">  <img class="editModal" src="/img/svg/pencil-square.svg" style="height: 16px; padding-top:2px;"> ${td.innerHTML}`;
      }
      else {
        td.innerHTML = `<img class="testMarkModal" src="/img/svg/gear.svg" style="height: 16px; padding-top:2px;"> <img class="editModal" src="/img/svg/pencil-square.svg" style="height: 16px; padding-top:2px;"> ${td.innerHTML}`;
      }
    }
>>>>>>> 11dc00d0f447a51d9ea9d1e6e833eedd058033f5
  }

  /**
   * initial page loader method
   */
  let orderCancleStatus = [];
  let orderRefundStatus = [];
  let hot;
  let refundId;
  let cancelId;
  const container = document.getElementById("handsontableContainer");
  let userClubId = getUserClubId();
  function _getPageData() {
    $("#loader").show();
    let ele = $("#main-table");
    $.get(_apiBase + "/list", {}, function (res) {
      let data = res.data;
      resultData = res.data;
      let dataActions = res.dataActions;
      let clist = JSON.parse(localStorage.getItem("club_list"));
      let html = ``;
      //html = `<option value="">Choose Club</option>`
      if (res.clubs) {
        res.clubs.forEach((element) => {
          element.name = element.name.toLowerCase();
          clubs.push(element.name);
          html += `<option value="${element.name}">${element.name}</option>`;
        });
      }
      $("#club").html(html);
      let reportData = [];
      if (data && data.length) {
        data.forEach((element) => {
          if (
            (userClubId > 0 && element.clubid == userClubId) ||
            userClubId == 0
          ) {
            reportData.push(element);
          }
        });
      }
      if (reportData && reportData.length) {
        //columns.map((val) => {
        //if (val.showTable) {
        reportData.forEach((element) => {
          {
            let code = "";
            if (clist) {
              let club = clist.find(
                (x) => x.id === parseInt(element["clubid"])
              );
              if (club) {
                code = club.code;
              }
            }
            element["verified"] = element["verified"] ? "Yes" : "No"; //'Succeed', "Pending" || "Failed" ?

            var a = new Date(parseInt(element.createdat));
            var b = new Date(parseInt(element.start_date));
            element["leadTime"] = Math.round((b - a) / (1000 * 3600 * 24));
            const excelDate = element.createdat;
            //const unixTimestamp = (excelDate - 25569) * 86400
            //const date = moment(new Date(unixTimestamp));
            element["createdat"] = moment(parseInt(element.createdat)).format(
              "DD-MMM-YYYY"
            ); //date
            element["start_date"] = moment(parseInt(element.start_date)).format(
              "DD-MMM-YYYY"
            );
            element["end_date"] = moment(parseInt(element.end_date)).format(
              "DD-MMM-YYYY"
            );
            element["cancelledat"] = moment(
              parseInt(element.cancelledat)
            ).format("DD-MMM-YYYY");
            element["refundedat"] = moment(parseInt(element.refundedat)).format(
              "DD-MMM-YYYY"
            );
            if (element["refundedat"] == "Invalid date") {
              element["refundedat"] = "";
            }
            element["updateat"] = moment(parseInt(element.updateat)).format(
              "DD-MMM-YYYY"
            );
            element["verifiedat"] = moment(parseInt(element.verifiedat)).format(
              "DD-MMM-YYYY"
            );
            element["memberid"] = code + element["memberid"];

            if (
              element["ourprice"] == undefined ||
              element["ourprice"] == null
            ) {
              element["ourprice"] = 0;
            }
            if (
              element["roomcoins_amount"] == undefined ||
              element["roomcoins_amount"] == null
            ) {
              element["roomcoins_amount"] = 0;
            }
            if (
              element["tripcoins_amount"] == undefined ||
              element["tripcoins_amount"] == null
            ) {
              element["tripcoins_amount"] = 0;
            }
            if (
              element["pakcage_amount"] == undefined ||
              element["pakcage_amount"] == null
            ) {
              element["pakcage_amount"] = 0;
            }
            if (
              element["insurance_amount"] == undefined ||
              element["insurance_amount"] == null
            ) {
              element["insurance_amount"] = 0;
            }

            element["club"] = element.club ? element.club.toLowerCase() : "";
            element["bookingInCurrency"] =
              element["ourprice"] -
              (element["roomcoins_amount"] + element["tripcoins_amount"]) +
              element["pakcage_amount"] +
              element["insurance_amount"];

            // console.log(element['ourprice'], element['roomcoins_amount'], element['tripcoins_amount'], element['tripcoins_amount'], element['pakcage_amount'],element['insurance_amount'])

            element["bookingInCurrency"] = Math.abs(
              element["bookingInCurrency"]
            );

            if (
              element["usd_ourprice"] == undefined ||
              element["usd_ourprice"] == null
            ) {
              element["usd_ourprice"] = 0;
            }
            if (
              element["usd_roomcoins_amount"] == undefined ||
              element["usd_roomcoins_amount"] == null
            ) {
              element["usd_roomcoins_amount"] = 0;
            }
            if (
              element["usd_tripcoins_amount"] == undefined ||
              element["usd_tripcoins_amount"] == null
            ) {
              element["usd_tripcoins_amount"] = 0;
            }
            if (
              element["usd_pakcage_amount"] == undefined ||
              element["usd_pakcage_amount"] == null
            ) {
              element["usd_pakcage_amount"] = 0;
            }
            if (
              element["usd_insurance_amount"] == undefined ||
              element["usd_insurance_amount"] == null
            ) {
              element["usd_insurance_amount"] = 0;
            }

            element["bookingInUsd"] =
              element["usd_ourprice"] -
              (element["usd_roomcoins_amount"] +
                element["usd_tripcoins_amount"]) +
              element["usd_pakcage_amount"] +
              element["usd_insurance_amount"];

            element["bookingInUsd"] = Math.abs(element["bookingInUsd"]);

            element["roomCoinTripCoin"] = element["usd_roomcoins"];

            let supplier = element["supplier"] == "cts" ? "cts" : "supplier";
            let prepaid = element["prepaid"] ? "Prepaid" : "Postpaid";

            let ordIndent = ["ean"];
            if (element["rate_type"] != null) {
              ordIndent.push(element["rate_type"]);
            }
            if (supplier != null) {
              ordIndent.push(supplier);
            }
            if (prepaid != null) {
              ordIndent.push(prepaid);
            }

            element["orderIdent"] =
              ordIndent.join() == "" ? "" : ordIndent.join("-");

            element["bitPayCurrency"] = "0"; //dummy data filled
            element["bitPayUsd"] = "0"; //dummy data filled
            element["cryptoCurrency"] = "0"; //dummy data filled
            element["cryptoUsd"] = "0"; //dummy data filled
            element["paypalCurrency"] = "0"; //dummy data filled
            element["paypalUsd"] = "0"; //dummy data filled

            element["cardAmtChargedCurrency"] = "0"; //dummy data filled
            element["cardAmtChargedUsd"] = "0"; //dummy data filled
            element["creditCardAmtCollectedUsd"] = "0"; //dummy data filled

            // if (element['payment_gateway'] == 'CARD') {
            //  element['cardAmtChargedCurrency'] = element['payable'];
            //element['cardAmtChargedUsd'] = element['usd_payable'];

            // }

            element["creditCardAmtCollectedUsd"] = ""; //import feild

            element["CardAmtPassedInCurrency"] = 0;
            element["CardAmtPassedInUsd"] = 0;

            element["dateCreditCardCollected"] = ""; //dummy data filled

            if (element["mor"] == "CTS") {
              element["cardAmtChargedCurrency"] = element["payable"];
              element["cardAmtChargedUsd"] = element["usd_payable"];
            }
            if (element["mor"] == "SUPPLIER") {
              element["CardAmtPassedInCurrency"] = element["payable"];
              element["CardAmtPassedInUsd"] = element["usd_payable"];
            }
            element["actualNetPriceUsd"] = "0"; //dummy data filled
            element["netPricePaidDate"] = "0"; //dummy data filled

            element["actualMarginReceived"] = "0"; //dummy data filled
            element["actualMarginReceivedDate"] = "26-Jul-2022"; //dummy data filled
            element["clientPaid"] = "";

            element["ClientPaidDate"] = "26-Jul-2022";

            element["deptCity"] = ""; //dummy data filled
            element["descCity"] = ""; //dummy data filled
            element["correlationId"] = ""; //dummy data filled

            //console.log(element['route'], element['payment_gateway'], element['payment_mode'], element['payable'], element['usd_payable'])

            let benifit = [];
            if (element["packageid"] != null) {
              benifit.push(element["packageid"]);
            }
            if (element["package"] != null) {
              benifit.push(element["package"]);
            }
            if (element["package_amount"] != null) {
              benifit.push(element["package_amount"]);
            }
            element["bookingBenifit"] =
              benifit.join() == "" ? "" : benifit.join();

            element["client_margin_temp"] = 0;
            element["reff"] = { itemnumber: "", reference: "", amount: "" };
            dataActions.forEach((reff) => {
              if (element["orderid"] == reff["itemnumber"]) {
                element["reff"] = reff;
                //delete reff;
              }
            });
            element["confirmation_number"] =
              element["confirmation_number"] == null
                ? ""
                : element["confirmation_number"];
            element["orderdateReff"] = element["createdat"];

            element["module"] =
              element["module"] == "VR" ? "VACATION RENTAL" : element["module"];

            element['module'] = element['module'] == 'VR' ? 'VACATION RENTAL' : element['module'];

            element['invoice_type'] = element['invoice_type'] == 'SOLD' ? 'SALE' : element['invoice_type'];
            if (element['orderstatus'] == 'CANCEllED' || element['orderstatus'] == "FAILED") {
              orderCancleStatus.push(element['orderid']);
            }
            if (element['orderstatus'] == 'REFUNDED') {
              orderRefundStatus.push(element['orderid']);
            }


          }
        });
        //}
        //})

        console.log(orderRefundStatus);

        hot = new Handsontable(container, {
          data: reportData,
          colHeaders,
          columns,
          licenseKey: "non-commercial-and-evaluation",
          width: "100%",
          autoWrapRow: true,
          height: "60vh",
          multiColumnSorting: true,
          filters: true,
          hiddenColumns: true,
          dropdownMenu: true,
          invalidCellClassName: "errorClass",
          hiddenRows: {
            indicators: false,
            copyPasteEnabled: false,
          },
          afterOnCellMouseUp: function (event, pos) {
            if (
              event.target.tagName == "IMG" &&
              event.target.classList.contains("testMarkModal")
            ) {
              let rowData = this.getDataAtRow(pos.row);
              cancelId = rowData[0];
              console.log('can', cancelId);
              $("#testMarkModal").modal("show");
            }
            if (
              event.target.tagName == "IMG" &&
              event.target.classList.contains("refundMarkModal")
            ) {
              _refundForm.reset();
              let rowData = this.getDataAtRow(pos.row);
              refundId = rowData[0];
              console.log('ref', refundId);
              $("#refundMarkModal").modal("show");
            }
            if (
              event.target.tagName == "IMG" &&
              event.target.classList.contains("editModal")
            ) {
              _editForm.reset();
              $(
                "#add-row, #add-save, #add-cancle, #add-update,#add-cancle-edit"
              ).hide();
              $("#add-update, #add-cancle-edit").show();

              let rowData = this.getDataAtRow(pos.row);
              $("#edidRegion").empty();
              $("#loader").show();
              $("#tempLoading").html("Order Report Loading ...");
              columns.forEach((element, index) => {
                renderEditFeild(element, rowData[index]);
              });
              $(".datesingle").daterangepicker(
                {
                  singleDatePicker: true,
                  showDropdowns: true,
                  autoApply: true,
                },
                () => {}
              );
              $("#loader").hide();
              $("#tempLoading").html("Order Report ");
              $("#editModal").modal("show");

              return;
              hot.updateSettings({
                cells(row, col, prop) {
                  const cellProperties = {};
                  const visualRowIndex = this.instance.toVisualRow(row);
                  const visualColIndex = this.instance.toVisualColumn(col);
                  if (visualRowIndex !== pos.row) {
                    cellProperties.readOnly = true;
                  }
                  if (_edit.state == false && pos.row == visualRowIndex) {
                    for (var i = 0; i < hot.countCols(); i++) {
                      _edit.selectedRow = visualRowIndex;
                      hot.setCellMeta(
                        visualRowIndex,
                        i,
                        "className",
                        "area highlight"
                      );
                    }
                    _edit.state = false;
                  }
                  return cellProperties;
                },
              });
            }
          },
        });
        hot.updateSettings({
          minSpareRows: 0,
          cells(row, col, prop) {
            const cellProperties = {};
            cellProperties.readOnly = true;
            return cellProperties;
          },
        });
        hot.validateCells();
        hot.render();
        let exportPlugin = hot.getPlugin("exportFile");
        let button = document.querySelector("#export-resource");
        button.addEventListener("click", () => {
          let append = moment().format("DD-MMM-YYYY hh:mm:ss");
          exportPlugin.downloadFile("csv", {
            bom: false,
            columnDelimiter: ",",
            columnHeaders: true,
            exportHiddenColumns: false,
            exportHiddenRows: false,
            fileExtension: "csv",
            filename: "Order_report" + append,
            mimeType: "text/csv",
            rowDelimiter: "\r\n",
            rowHeaders: true,
          });
        });
      } else {
        $("#handsontableContainer").html("<p>No content found</p>");
      }
      $("#loader").hide();
    });
  }
  var _edit = { state: false };
  _getPageData();

  $(".datesingle").daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: true,
      autoApply: true,
    },
    () => {}
  );

  var _filterForm = $("#filterForm")[0];
  $("#clearFilter").on("click", function () {
    _filterForm.reset();
    hot.getPlugin("filters").clearConditions();
    hot.getPlugin("filters").filter();
    hot.render();
  });

  let currentRole = ["role1", "role2", "role3"];
  function renderEditFeild(element, data) {
    let allowed = false;
    currentRole.forEach((role) => {
      if (element.editAllowedToRoles.includes(role)) {
        allowed = true;
      }
    });
    if (!allowed) return;
    let ele;
    if (element.type == "dropdown") {
      let renderOption = `<option value="">--select--</option>`;
      let sel;
      element.source.forEach((dropElement) => {
        sel = dropElement == data ? "selected" : "";
        renderOption =
          renderOption +
          `<option value="${dropElement}" ${sel}>${dropElement}</option>`;
      });
      ele = `
    <div class="row" style="display: flex;justify-content: space-between;">
		  <div class="col">
			  <div class="mb-3">
        <label class="form-label">${element.title ? element.title : ""}</label>
        <select ${
          !element.readOnly
            ? `required custom_validation="true" custom_validation_msg="Provide data for ${element.title}"`
            : ""
        } ${
        element.readOnly ? "disabled" : ""
      } class="form-control editFormElement" id="${
        element.data
      }">${renderOption}</select>
        </div>
			</div>
		</div>`;
    } else if (element.type == "numeric") {
      data = parseFloat(data).toFixed(2);
      ele = `
    <div class="row" style="display: flex;justify-content: space-between;">
		  <div class="col">
			  <div class="mb-3">
				  <label class="form-label">${element.title ? element.title : ""}</label>
					<input type="number" ${
            !element.readOnly
              ? `required custom_validation="true" custom_validation_msg="Provide data for ${element.title}"`
              : ""
          }  ${
        element.readOnly ? "disabled" : ""
      } class="form-control editFormElement" id="${
        element.data
      }" value="${data}" />
        </div>
			</div>
		</div>`;
    } else {
      data = data == null ? "" : data;
      let dateClass = element.type == "date" ? "datesingle" : "";
      if (dateClass == "datesingle") {
        try {
          data =
            moment(data).format("MM-DD-YYYY") != "Invalid date"
              ? moment(data).format("MM-DD-YYYY")
              : moment(date()).format("MM-DD-YYYY");
        } catch (error) {
          data = "";
        }
      }

      ele = `
    <div class="row" style="display: flex;justify-content: space-between;">
		  <div class="col">
			  <div class="mb-3">
				  <label class="form-label">${element.title ? element.title : ""}</label>
					<input ${
            !element.readOnly
              ? `required custom_validation="true" custom_validation_msg="Provide data for ${element.title}"`
              : ""
          }  ${
        element.readOnly ? "disabled" : ""
      } class="form-control editFormElement ${dateClass}" id="${
        element.data
      }" value="${data}" />
        </div>
			</div>
		</div>`;
    }
    $("#edidRegion").append(ele);
  }
  $("#excel-sample").click(() => {
    const clubs = [];
    club_list.map((val) => {
      if (val.name) {
        clubs.push({ name: val.name });
      }
    });
    clubs.join(", ")
    console.log(clubs);
    rawData = [
      {
        name: "Order-report",
        values: [
          { header: "Order Id", value: "" },
          { header: "Invoice type", value: [{ name: "" }] },
          {
            header: "Invoice type",
            value: [
              { value: "CREATED" },
              { value: "BOOKED" },
              { value: "CANCEllED" },
              { value: "FAILED" },
            ],
          },
          {
            header: "Travel Type",
            value: [
              { name: "FLIGHT" },
              { name: "HOTEL" },
              { name: "CAR" },
              { name: "ACTIVITY" },
              { name: "TOUR" },
              { name: "CRUISE" },
              { name: "INSURANCE" },
              { name: "GATEWAY TRIP" },
              { name: "GATEWAY CRUISE" },
              { name: "GROUP TRIP" },
              { name: "GROUP CRUISE" },
              { name: "VACATION RENTAL" },
            ],
          },
          {
            header: "Order status",
            value: [
              { name: "CREATED" },
              { name: "BOOKED" },
              { name: "CANCEllED" },
              { name: "FAILED" },
            ],
          },
          { header: "CLUB", value: clubs },
          { header: "Mode", value: [{ name: "Online" }, { name: "Offline" }] },
          { header: "MOR", value: [{ name: "CTS" }, { name: "SUPPLIER" }] },
        ],
      },
    ];
    const dataFormated = transform(rawData);
    exportAsExcelFile(dataFormated, "ordr-report");
  });
  async function exportAsExcelFile(workbookData, excelFileName) {
    const workbook = new ExcelJS.Workbook();
    workbookData.forEach(({ workSheet, rows }) => {
      const sheet = workbook.addWorksheet(workSheet);
      const uniqueHeaders = [
        ...new Set(
          rows.reduce((prev, next) => [...prev, ...Object.keys(next)], [])
        ),
      ];
      sheet.columns = uniqueHeaders.map((x) => ({ header: x, key: x }));

      rows.forEach((jsonRow, i) => {
        let cellValues = { ...jsonRow };

        uniqueHeaders.forEach((header, j) => {
          if (Array.isArray(jsonRow[header])) {
            cellValues[header] = "";
          }
        });
        sheet.addRow(cellValues);
        uniqueHeaders.forEach((header, j) => {
          if (Array.isArray(jsonRow[header])) {
            const jsonDropdown = jsonRow[header];
            sheet.getCell(getSpreadSheetCellNumber(i + 1, j)).dataValidation = {
              type: "list",
              formulae: [`"${jsonDropdown.join(",")}"`],
            };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, excelFileName);
  }
  function getSpreadSheetCellNumber(row, column) {
    let result = "";
    // Get spreadsheet column letter
    let n = column;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }
    // Get spreadsheet row number
    result += `${row + 1}`;
    return result;
  }
  const EXCEL_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const EXCEL_EXTENSION = ".xlsx";
  function saveAsExcelFile(buffer, fileName) {
    const data = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  function transform(data) {
    const noOfRowaToGenerate = 10;
    return data.map(({ name, values }) => {
      const headers = values.reduce(
        (prev, next) => ({
          ...prev,
          [next.header]: Array.isArray(next.value)
            ? next.value.map(({ name }) => name)
            : next.value,
        }),
        {}
      );
      return {
        workSheet: name,
        rows: Array(noOfRowaToGenerate).fill(headers),
      };
    });
  }
});
