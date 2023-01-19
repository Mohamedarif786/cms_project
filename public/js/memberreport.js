//toDo move to CDN structure / minify

/**
 * Page script to manage CURD
 * @author  Roshan Chettri
 */
$(document).ready(function () {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.clubid && user.clubid > 0) {
    $("#memberHaeader").hide();
    //$("#loader").show();
    $.get(_apiBase + "/list" + "/" + user.clubid, {}, function (data) {
      if (data) {
        data.forEach((element) => {
          //console.log($('#clubs').val());
          element.idcode = user.club.code + element.id;
        });
        tableData({ data });
      } else {
        tableData({ data });
      }
      //$("#loader").show();
    });
  } else {
    $("#memberHaeader").show();
    fill_club_list_all("#clubs");
  }
  /**
   * toggle helper for page
   */
  let exp = false;

  /**
   * Filter method
   */
  $("#advanceSearch").on("click", function () {
    if (!exp) {
      $("#orderSetting").show("slide");
      $("#orderContent").removeClass("col-12").addClass("col-10");
    } else {
      $("#orderSetting").hide();
      $("#orderContent").removeClass("col-10").addClass("col-12");
    }
    exp = !exp;
  });

  /**
   * side nav toggle method
   */
  $(".sidebar-toggle").on("click", function () {
    $("#sidebar").toggleClass("collapsed");
  });

  /**
   * report filter report output change event
   */
  $("#reportOutput").on("change", function () {
    $(this).val();
    tableData({ type: "reportOutput", val: $(this).val() });
  });

  /**
   * report filter order id change event
   */
  $("#orderId").keyup(function () {
    $(this).val();
    tableData({ type: "orderId", val: $(this).val() });
  });

  /**
   * clubs filter report output change event
   */
  $("#clubs").on("change", function () {
    let id = $(this).val();
    let list = JSON.parse(localStorage.getItem("club_list"));

    if (id == "") {
      return;
    }

    if (id != 'All') {
      $("#loader").show();
      let club = list.find((x) => x.id === parseInt(id));
      $.get(_apiBase + "/list" + "/" + id, {}, function (data) {
        if (data) {
          data.forEach((element) => {
            element.club = element.club ? element.club.toLowerCase() : '';
            //console.log($('#clubs').val());
            element.idcode = club.code ? club.code + element.id : element.id;
            //element.idcode = club.code + element.id;
            let isdCode = element.callingcode ? element.callingcode : ''
            element.phone = isdCode + ' ' + element.phone
            element.billable = element.billable ? 'No' : 'Yes'
          });
          tableData({ data });
        } else {
          tableData({ data });
        }
        console.log(data);

        $("#loader").hide();
      });
    }
    else {
      let allData = []
      let sizeCheck = 0
      list.forEach(element => {
        $("#loader").show();
        let club = list.find((x) => x.id === parseInt(element.id));
        $.get(_apiBase + "/list" + "/" + element.id, {}, function (data) {
          if (data) {
            data.forEach((element) => {
              //console.log($('#clubs').val());
              element.club = element.club ? element.club.toLowerCase() : '';
              element.idcode = club.code ? club.code + element.id : element.id;
              //element.idcode = club.code + element.id;
              let isdCode = element.callingcode ? element.callingcode : ''
              element.phone = isdCode + ' ' + element.phone
              element.billable = element.billable ? 'No' : 'Yes'
            });
          }
          allData.push(...data);
          sizeCheck++;
          console.log(sizeCheck + '==' + list.length)
          if (sizeCheck == list.length) {
            console.clear();
            tableData({ data: allData })
          }
          $("#loader").hide();
          console.log(allData);
        });
      });


    }

  });

  /**
   * tableData helper members , used to replay previous action by user
   */
  let reportOutputFilter = false;
  let orderDateFilter = false;
  let orderIdFilter = false;
  /**
     * binds Acttion for handsontable row
     */
  function renderActions(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    td.width = '85%';
    td.innerHTML = `<img class="logModel" src="/img/svg/gear.svg" style="height: 16px; padding-top:2px;">  ${td.innerHTML}`;
  }
  let colHeaders = [
    "Member Id",
    "Tier",
    "Club_Name",
    "Guest First Name",
    "Last_Name",
    "Guest Email",
    "Enroll_Date",
    "Address1 ",
    "Address2 ",
    "Member City",
    "State",
    "Country",
    "Zip",
    "Phone",
    "Membership_Status",
    "CTS_Member_Id",
    "Created_Date",
    "Last_Updated_Date",
    "Referred ID",
    "Referral_Name",
    //"Language",
    //"Currency",
    //"Tier Changed Date",
    "Demo Account"
  ];
  let columns = [
    {
      data: "idcode",
      type: "text",
      width: 150,
      renderer: renderActions
    },
    {
      data: "tier",
      type: "text",
      width: 200
    },
    {
      data: "club",
      type: "text",
      width: 200,
    },
    {
      data: "firstname",
      type: "text",
    },
    {
      data: "lastname",
      type: "text",
    },
    {
      data: "email",
      type: "text",
    },
    {
      data: "enrolledat",
      type: "date",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
    },
    {
      data: "address1",
      type: "text",
    },
    {
      data: "address2",
      type: "text",
    },
    {
      data: "city",
      type: "text",
    },
    {
      data: "state",
      type: "text",
    },
    {
      data: "country",
      type: "text",
    },
    {
      data: "postalcode",
      type: "text",
    },
    {
      data: "phone",
      type: "text",
    },
    {
      data: "status",
      type: "text",
    },
    {
      data: "id",
      type: "text"
    },


    {
      data: "createdat",
      type: "date",
      dateFormat: "DD-MMM-YYYY HH:MM",
      correctFormat: true,
    },
    {
      data: "statuschangedat",
      type: "date",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
    },
    {
      data: "parentid",
      type: "text",
    },
    {
      data: "parent",
      type: "text",
    },

    /*{
      data: "language",
      type: "text",
    },
    {
      data: "currency",
      type: "text",
    },
   
    {
      data: "tierchangedat",
      type: "date",
      dateFormat: "DD-MMM-YYYY",
      correctFormat: true,
    },
    */
    {
      data: "billable",
      type: "text",
    },

  ];

  /**
   * binds data for handsontable
   */
  function tableData(input) {
    if (hot) {
      hot.destroy();
    }

    //console.log(input.data.result)
    hot = new Handsontable(container, {
      data: input.data,
      colHeaders,
      columns,
      width: "100%",
      autoWrapRow: true,
      height: "60vh",
      minSpareRows: 0,
      licenseKey: "non-commercial-and-evaluation",
      customBorders: true,
      dropdownMenu: true,
      multiColumnSorting: true,
      filters: true,
      manualRowMove: true,
      afterOnCellMouseUp: function (event, pos) {
        if (
          event.target.tagName == "IMG" &&
          event.target.classList.contains("logModel")
        ) {
          let rowData = this.getDataAtRow(pos.row);
          $('#loader').show();
          let ele = $("#main-table");
          $(ele).find('tbody tr').remove();
          var filterdata = [];
          $.get(_apiBase + "/memberlogs" + "/" + rowData[15], {}, function (data) {
            if (data) {
              $.each(data, function (index, item) {
                if (item.createdat) {
                  let t = new Date(item.createdat);
                  item.createdat = moment(t).format(
                    "DD-MMM-YYYY"
                  );
                }
              })
              filterdata = data.sort((a, b) => {
                return b.createdat - a.createdat;
              });
              $.get("/templates/memberlog_item.html", function (template) {
                $.each(filterdata, function (index, item) {
                  $.tmpl(template, item).appendTo(ele);
                })
              })
            }
            else {
              ele.html('<p>No content found</p>');
            }
            $("#logModel").modal("show");
            $('#loader').hide();
          })
        }
      },
    });

    hot.updateSettings({
      minSpareRows: 0,
      cells(row, col, prop) {
        const cellProperties = {};
        cellProperties.editor = false;
        return cellProperties;
      },
    });
    let user = JSON.parse(localStorage.getItem("user"));
    if (user && user?.clubid && user?.clubid > 0) {
      hot.updateSettings({
        hiddenColumns: {
          // specify columns hidden by default
          columns: [1],
        },
      });
    }
    hot.validateCells();

    let exportPlugin = hot.getPlugin("exportFile");
    let button = document.querySelector("#export-resource");
    button.addEventListener("click", () => {
      exportPlugin.downloadFile("csv", {
        bom: false,
        columnDelimiter: ",",
        columnHeaders: true,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: "csv",
        filename: "Member_report", //_[YYYY]-[MM]-[DD]
        mimeType: "text/csv",
        rowDelimiter: "\r\n",
        rowHeaders: true,
      });
    });
  }

  /**
   * initial page loader method
   */
  let hot;
  let orderData;
  let cpOrderData;
  let userClubId = getUserClubId();
  const container = document.getElementById("handsontableContainer");

  $(".datesingle").daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: true,
      autoApply: true,
      defaultDate: null,
    },
    () => {
      _defaultOrderFrom = false;
      _defaultOrderTo = false;
    }
  );

  $("#orderDateFrom").val("");
  $("#orderDateTo").val("");

  /**
   * report filter order date from change event
   */
  let _defaultOrderFrom = true;
  $("#orderDateFrom").on("change", function () {
    if (!_defaultOrderFrom) {
      tableData({
        type: "orderDate",
        from: $(this).val(),
        to: $("#orderDateTo").val(),
      });
    }
  });

  /**
   * report filter order date to change event
   */
  let _defaultOrderTo = true;
  $("#orderDateTo").on("change", function () {
    if (!_defaultOrderTo) {
      tableData({
        type: "orderDate",
        from: $("#orderDateFrom").val(),
        to: $(this).val(),
      });
    }
  });
});
