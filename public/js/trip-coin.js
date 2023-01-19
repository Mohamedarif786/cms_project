$(document).ready(function(){
  $.post('/programs', (result) => {
    let html = ``;
    html = `<option value="">Choose Programs</option>`
    if(result) {
      $.each(result, (i, res) => {
        html += `<option value=${res.id}>${res.name}</option>`
      })
      $("#tc-program").html(html)
    }
  })
  $.post('/memberList', (result) => {
    let html = ``;
    html = `<option value="">Choose Member</option>`
    if(result) {
      $.each(result, (i, res) => {
        html += `<option value=${res.email}>${res.firstname}</option>`
      })
      $("#tc-email").html(html)
    }
  })

  $("#AddNewtripCoin").click(function(){
		clear_form("#newForm");
    $("#tripCoinModal").modal("show");
  });

  $("#Save").click(function () {
    let _addForm =$('#newForm')[0];	
        if (!_addForm.reportValidity()) {
      _addForm.reportValidity();
      return;
    }
    $("#Save").prop("disabled", true);
    $("#loader").show();
    
    let user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);

    let input = getData("#newForm");
    
    $.post("/addtripCoin", input, function (result) {
      if (result.data) {
        if (result?.data?.reimburse?.success) {
          notify(result?.data?.reimburse?.message, "success");
        } else {
          notify(result?.data?.reimburse?.message, "error");
        }
      } else {
        notify(result.errors[0].message, "error");
      }
      $("#loader").hide();
      $("#tripCoinModal").modal("hide");
      $("#Save").prop("disabled", false);
      tripCoinList();
    });
  });
});