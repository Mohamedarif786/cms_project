// import { exchange } from '../helpers/exchange.js'

let userClubId = getUserClubId()
let memberslist

function programChange() {}
$(document).ready(function () {
  'use strict'

  $('#club').each(function () {
    $(this)
      .wrap('<div class="position-relative"></div>')
      .select2({
        placeholder: 'Choose Club',
        dropdownParent: $(this).parent(),
      })
    $('#club').change(function () {
      getProgram($('#club').val())
    })
  })

  if (userClubId) {
    // $('#club').val(userClubId)
    $('#club_div').css('display', 'none')
    getProgram(userClubId)
  } else {
    fill_club_list(club)

    // $.get('/club/list', (result) => {
    //   $('#club').html()
    //   $('#loader').show()
    //   let html = ``
    //   html = `<option value="">Choose Club</option>`
    //   if (result.errors) {
    //     notify(result.errors[0].message, 'error')
    //   } else {
    //     $.each(result, (i, res) => {
    //       if (userClubId > 0 && res.id != userClubId) {
    //         delete res[i]
    //       } else {
    //         html += `<option value=${res.id}>${res.name}</option>`
    //       }
    //     })
    //     $('#club').html(html)
    //   }
    //   $('#loader').hide()
    // })
  }

  $('#program_name').each(function () {
    $(this)
      .wrap('<div class="position-relative"></div>')
      .select2({
        placeholder: 'Choose Program',
        dropdownParent: $(this).parent(),
      })
  })

  $('#Save').click(() => {
    let flag = $('#newForm')[0].checkValidity()
    if (flag) {
      if ($('#programid').val()) {
        let input = {
          programid: $('#programid').val(),
          email: $('#usr_mail').val(),
          units: $('#unit').val(),
          comments: $('#comment').val(),
        }
        $.post('/allocateCredit', input, function (result) {
          if (result.errors) {
            $('#memberAllocateModal').modal('hide')
            notify(result.errors[0].message, 'error')

            $('#loader').hide()
          } else {
            $('#memberAllocateModal').modal('hide')
            notify('Member Allocated', 'success')
            getClubMembers()
          }
        })
      } else {
        $('#memberAllocateModal').modal('hide')
        notify('Choose Program', 'error')
        $('#loader').hide()
      }
    }

    $('#newForm')[0].classList.add('was-validated')
    return flag
  })
  $('#tablerecords #ByFName').change(function () {
    getClubMembers($(this).val())
  })

  $('#tablerecords #ByLName').change(function () {
    getClubMembers(undefined, $(this).val())
  })

  $('#tablerecords #ByEmail').change(function () {
    getClubMembers(undefined, undefined, $(this).val())
  })

  $('#tablerecords #ByStatus').change(function () {
    getClubMembers(undefined, undefined, undefined, $(this).val())
  })
  /**
   * initial page loader method
   */
  $('#bulk_allocate_btn').click(function () {
    if ($('#club').val() != '') {
      $('#modal_id').modal('show')
    } else {
      notify('Select Club', 'error')
    }
  })
  $('#allocateUnit').keyup(function () {
    let exchangeRate = $('#allocateExchangeRate').val()
    let unit = $('#allocateUnit').val()
    $('#allocateEstimated').val(exchangeRate * unit)
    $('#allocateActual').val(exchangeRate * unit)
  })
})

getProgram = (clubid) => {
  $('#loader').show()
  $('#program_name').html('')
  let html = ``
  html = `<option value="">Choose Program</option>`
  $.post('/getProgramByClub', { clubid: clubid }, (result) => {
    if (!result.errors) {
      $.each(result.data.programs.result, (i, res) => {
        html += `<option value=${res.id}>${res.name}</option>`
      })
      $('#program_name').html(html)
      $('#loader').hide()
    } else {
      $('#loader').hide()
      for (let error of result.errors) {
        notify(`${error.message}`, 'error')
      }
    }
  })
}

getClubMembers = (fname, lname, email, status) => {
  // $('#loader').show();
  $('#loyaltyList').html('')
  let clubid = parseInt($('#club').val())
  let programid = parseInt($('#program_name').val())
  if (clubid && programid) {
    $.post(
      '/getClubMembersWithBalance',
      {
        clubid: clubid,
        fname: fname,
        lname: lname,
        email: email,
        status: status,
        programid: programid,
      },
      (result) => {
        if (result.errors) {
          $('#loader').hide()
          for (let error of result.errors) {
            notify(`${error.message}`, 'error')
          }
        } else {
          console.log(result)
          //   $.post("/getBalance", { programid: programid, email:res.email }, (response) => {

          //   let memberList = result.result.map((res) => {
          //     res.balance = response.toFixed(2)
          //     return res
          //   })
          // })
          _getPageData(result)
        }
        $('#loader').hide()
      },
    )
  } else {
    $('#loader').hide()
    if (!clubid) notify('Select Club', 'error')
    else if (!programid) notify('Select Program', 'error')
  }
}

function fetchprogram(id) {
  $('#programid').val(id)
}
function singleAllocation(email, currency) {
  $('#allocateEmail').val(email)
  $('#allocateCurrency').val(currency)
  $('#loader').show()
  $.get('/exchange', { currency: currency }, (val) => {
    $('#allocateExchangeRate').val(val)
    $('#loader').hide()
    $('#allocateModalId').modal('show')
  })
}

function _getPageData(memberList) {
  console.log(memberList)
  let ele = $('#loyaltyList')
  ele.find('tr').remove()
  if (memberList.length) {
    $.get('/templates/loyalty.html', function (template) {
      $.each(memberList, function (index, item) {
        $.tmpl(template, item).appendTo('#loyaltyList')
      })
      //pagination
      _CMSpagination = new CMSpagination({
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
    })
  } else {
    ele.html('<p>No content found</p>')
  }
}
