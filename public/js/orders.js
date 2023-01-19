//toDo move to CDN structure / minify

/**
 * Page script to manage CURD 
 * @author  Roshan Chettri
 */
$(document).ready(function () {

  /**
  * Form helper, it extends form validation and allows custom messages
  */
  $('input, textarea, select').each(function (i, o) {
    if ($(o).attr('custom_validation')) {
      o.addEventListener('invalid', function (event) {
        if (event.target.validity.valueMissing && $(event.target).attr('custom_validation')) {
          event.target.setCustomValidity($(event.target).attr('custom_validation_msg'));
        }
      })
      o.addEventListener('change', function (event) {
        event.target.setCustomValidity('');
      })
    }
  });

  /**
  * Shows information to user
  */
  function setMsg(_msg) {
    $('#msgContent').find('p').html(_msg);
    $('#msgContent').show();
    setTimeout(() => {
      $('#msgContent').hide();
    }, 2500);
  }

  /**
  * Page forms
  */
  var _addForm = $('#addForm')[0];
  var _editForm = $('#editForm')[0];

  /**
  * pagination Object
  */
  let _CMSpagination;

  /**
  * Opens add popup  
  */
  $('#add-resource').on('click', function () {
    $('#addModal').modal('show');
  })

  /**
  * Add method
  */
  $('#add-confirm').on('click', function () {
    $('#loader').show();
    $('#add-confirm').prop('disabled', true);
    if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      $('#loader').hide();
      $('#add-confirm').prop('disabled', false);
      return;
    }
    let _data = {
      "name": $('#resourceName').val(),
      "status": $('#resourceStatus').is(":checked") ? "ACTIVE" : 'INACTIVE',
      "resource": $('#policyResource').val(),
    }

    $.post(_apiBase, _data, function (res) {
      $('#addModal').modal('hide');
      if (res && !res.errors) {
        setMsg('Record Added');
        let _res = res.data.addpolicy.result;
        let ele = $("#main-table");
        $.get("/templates/memberreport_item.html", function (template) {
          $.tmpl(template, _res).prependTo(ele);
          _CMSpagination.reset();
        })
      } else {
        setMsg(res.errors[0].message);
      }
      $('#add-confirm').prop('disabled', false);
      _addForm.reset();
      $('#loader').hide();

    })

  })

  /**
  * Opens confirmation popup for delete 
  */
  $(document).on('click', '.delete-resource', function () {
    $('#deleteModal').modal('show');
    $('#delete-confirm').data('id', $(this).data('id')); // id referene for delete use
  })


  /**
  * Delete method helper
  */
  function removeRow(id, processed) {
    $.post(_apiBase + "/delete/" + id, {}, function (res) {
      if (res && !res.errors) {
        $('#row' + id).remove();
        _CMSpagination.reset();
        setMsg('Record Deleted');
      } else {
        setMsg(res.errors[0].message);
      }
      processed();
    })
  }

  /**
  * Delete method 
  */
  $('#delete-confirm').on('click', function () {
    let id = $(this).data('id');
    if (id != "all") {
      $('#loader').show();
      $('#delete-confirm').prop('disabled', true);
      removeRow(id, () => {
        $('#deleteModal').modal('hide');
        $('#delete-confirm').prop('disabled', false);
        $('#loader').hide();
      })
    } else {
      $('#deleteModal').modal('hide');
      if ($('.delete-check:checkbox:checked').length > 0) {
        $.each($('.delete-check:checkbox:checked'), function (index, item) {
          let id = $(item).data('id');
          $('#loader').show();
          removeRow(id, () => {
            $('#loader').hide();
          });
        })
      }
    }
  })

  /**
  * Opens edit popup 
  */
  $(document).on('click', '.edit-resource', function () {
    _editForm.reset();
    let id = $(this).data('id');
    $.get(_apiBase + "/" + id, {}, function (res) {
      if (res && !res.errors) {
        let _res = res.data.policy;
        $('#resourceNameEdit').val(_res.name);
        //$('#resourceStatusEdit').prop('checked', _res.status == 'ACTIVE' ? true : false);
        if (_res.resources != null) {
          $('#policyResourceEdit').val(_res.resources)
        }
        $('#editModal').modal('show');
        $('#edit-confirm').data('id', _res.id);// referene for edit use
      }
    })

  })

  /**
  * Edit method 
  */
  $('#edit-confirm').on('click', function () {
    $('#loader').show();
    $('#edit-confirm').prop('disabled', true);
    if (!_editForm.reportValidity()) {
      _editForm.reportValidity();
      $('#loader').hide();
      $('#edit-confirm').prop('disabled', false);
      return;
    }
    let id = $(this).data('id');
    let _data = {
      "policyid": id,
      "name": $('#resourceNameEdit').val(),
      //"status": $('#resourceStatusEdit').is(":checked") ? "ACTIVE" : 'INACTIVE',
      "resources": $('#policyResourceEdit').val(),
    }

    $.post(_apiBase + '/update', _data, function (res) {
      $('#editModal').modal('hide');
      if (res && !res.errors) {
        setMsg('Record Updated');
        let _res = res.data.updatepolicy.result;
        let ele = $("#main-table");
        $.get("/templates/memberreport_item.html", function (template) {
          $('#row' + id).remove();
          $.tmpl(template, _res).prependTo(ele);
          _CMSpagination.reset();
        })

      } else {
        setMsg(res.errors[0].message);
      }
      $('#edit-confirm').prop('disabled', false);
      _editForm.reset();
      $('#loader').hide();
    })

  })


  $('.sidebar-toggle').on('click', function () {
    $('#sidebar').toggleClass('collapsed')
  })
  
  $('#advanceSearch').on('click', function () {
    $('#advanceContent').toggle()
  })
  /**
  * Status change method 
  */
  $(document).on('click', '.status-resource', function () {
    $('#loader').show();
    let _data = {
      "id": $(this).data('id'),
      "status": $(this).is(":checked") ? "ACTIVE" : 'INACTIVE',
    }

    $.post(_apiBase + '/status', _data, function (res) {
      if (res && !res.errors) {
        setMsg('Record Updated');
      } else {
        setMsg(res.errors[0].message);
      }
      $('#loader').hide();
    })

  })

  /**
  * initial page loader method
  */
  function _getPageData() {
    $('#loader').show();
    let ele = $("#main-table");
    $.get(_apiBase + "/list", {}, function (data) {
      console.log("result", data);
      if (data.length) {
        const container = document.getElementById('handsontableContainer');
        const hot = new Handsontable(container, {
          data,
          colHeaders: ['Id',
            'Invoice Type',
            'Travel Type',
            'Club Name',
            'Booking Status',
            'Messages ',
            'Order Date ',
            'Booking Method ',
            'CTS Member ID ',
            'Client Member ID ',
            'Member City ',
            'Member Country',
            'Membership Tier',
            'Referrer Member ID',
            'Guest Name',
            'Guest Email',
            'Supplier',
            'Hotel Name',
            'Confirmation #',
            'Travel Start',
            'Travel End',
            'Depart City',
            'Destination City',
            'MOR',
            'Order Ident',
            'Payment ID',
            'Correlation ID',
            'Currency Type',
            'Exchange Rate',
            'Room Coins Used',
            'Room Coins in Currency',
            'Room Coins in USD',
            'Trip Coins in Currency',
            'Trip Coins in USD',
            'BitPay in Currency',
            'BitPay in USD',
            'Crypto in Currency',
            'Crypto in USD',
            'PayPal in Currency',
            'PayPal in USD',
            'Card Amt Charged in Currency',
            'Card Amt Charged in USD',
            'Credit Card Amt Collected USD',
            'Date Credit Card Collected',
            'Card Amt passed in Currency',
            'Card Amt passed in USD',
            'Total Booking in Currency',
            'Total Booking in USD',
            'Public Price in Currency',
            'Public Price in USD',
            'Savings in Currency',
            'Savings in USD',
            'Original Net Price USD',
            'Merch Markup',
            'Booking Benefit',
            'Client Markup',
            'CTS Markup',
            'Expected Margin',
            'Expected Margin %',
            'Booking Amended Date',
            'Booking Refund Date',
            'Card USD Amount Refunded',
            'Room Coins or Trip Coins USD Refunded',
            'Refund Transaction Id',
            'Revised Booking Total Amount',
            'Revised Margin',
            'Actual Net Price USD',
            'Net Price Paid Date',
            'Actual Margin Received',
            'Actual Margin Received Date',
            'Client Paid',
            'Client Paid Date',
            'PROPERTY ADDRESS',
            'PROPERTY ADDRESS 2',
            'PROPERTY CITY',
            'PROPERTY STATE',
            'PROPERTY COUNTRY',
            'PROPERTY POSTAL CODE',
            'PROPERTY PHONE',
            'Lead Time',
            'Confirmed',
            'System Date of Confirmation',
            'System Staff'],
          height: 'auto',
          width: 'auto',
          minSpareRows: 1,
          licenseKey: 'non-commercial-and-evaluation',
          customBorders: true,
          dropdownMenu: true,
          multiColumnSorting: true,
          filters: true,
          manualRowMove: true,
        });

        hot.updateSettings({
          cells(row, col, prop) {
            const cellProperties = {};
            cellProperties.editor = false;
            return cellProperties;
          }
        });
        /*
        $.get("/templates/orderreport_item.html", function (template) {
          $.each(result, function (index, item) {
            $.tmpl(template, item).appendTo(ele);
          })
          //pagination 
          _CMSpagination = new Pager({
            divId: 'fPage',
            tableId: 'main-table',
            noContentMsg: 'No Content found',
            filter: true,
            perPage: 'all',
            deleteAll: function (e) {
              if ($('.delete-check:checkbox:checked').length > 0) {
                $('#deleteModal').modal('show');
                $('#delete-confirm').data('id', 'all'); // id referene for delete use
              } else {
                setMsg('No record selected for delete');
              }
            }
          });
        });
        */
      } else {
        ele.html('<p>No content found</p>');
      }
      $('#loader').hide();
    });
  }
  _getPageData();

  $(".datetimes").daterangepicker({
    timePicker: true,
    opens: "left",
    startDate: moment().startOf("hour"),
    endDate: moment().startOf("hour").add(32, "hour"),
    locale: {
      format: "M/DD hh:mm A"
    }
  });
});