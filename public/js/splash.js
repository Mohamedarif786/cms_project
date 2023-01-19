
$(document).ready(function() {
    "use strict"
    // $.get("/club/list", (result) => {
    //     $("#fl_club").html()
    //     $('#loader').show();
    //     let html = ``;
    //     html = `<option value="">Select Club</option>`
    //     if (result.errors) {
    //         notify(result.errors[0].message, "error");
    //     } else {
    //         $.each(result, (i, res) => {
    //             html += `<option value=${res.id}>${res.name}</option>`
    //         })
    //         $("#fl_club").html(html)
    //     }
    //     $('#loader').hide();
    // });
    fill_club_list("#fl_club");
    $.post("/languageList", (result) => {
        $("#language").html()
        $('#loader').show();
        let html = ``;
        html = `<option value="">Select Language</option>`
        if (result.errors) {
            notify(result.errors[0].message, "error");
        } else {
            $.each(result, (i, res) => {
                html += `<option value=${res.code}>${res.name}</option>`
            })
            $("#language").html(html)
        }
        $('#loader').hide();
    });

    $(".select2").select2();

    $("#add_btn").click(function(){

        let _addForm =$('#add-form')[0];
		if (!_addForm.reportValidity()) {
            _addForm.reportValidity();
            return;
        }
        let check_error = 0;
        var fl_type = $("#fl_type").val();
        let input = {};

        input.clubid = parseInt($("#fl_club").val());
        input.tierid = parseInt($("#fl_level").val());
        input.type = $("#fl_type").val();
        input.language = $("#language").val();        

        if(fl_type == 'VIDEO')
        {
            if($("#video_title").val() === ""){
                notify("Enter video title", "error");
                check_error = 1;
            }
            else if($("#video_file").val() === ""){
                notify("Select video", "error");
                check_error = 1;
            }
            input.video_title = $("#video_title").val();
            input.video = $("#video_file").val().split('\\').pop();
        }
        else if(fl_type == 'IMAGE')
        {
            if($("#image_title").val() === ""){
                notify("Enter Image title", "error");
                check_error = 1;
            }
            else if($("#image_file").val() === ""){
                notify("Select Image", "error");
                check_error = 1;
            }
            input.image_title = $("#image_title").val();
            input.image = $("#image_file").val().split('\\').pop();
        }
        else if(fl_type == 'TEXT')
        {
            if($("#text_title").val() === ""){
                notify("Enter Text title", "error");
                check_error = 1;
            }
            else if($("#quill-editor .ql-editor").html() === "<p><br></p>")
            {
                notify("Enter some Text", "error");
                check_error = 1;
            }
            input.text_title = $("#text_title").val();
            input.text = $("#quill-editor .ql-editor").html();
        }
        else if(fl_type == 'VIDEO_TEXT')
        {
            if($("#video_title").val() === ""){
                notify("Enter video title", "error");
                check_error = 1;
            }
            else if($("#video_file").val() === ""){
                notify("Select video", "error");
                check_error = 1;
            }
            else if($("#text_title").val() === ""){
                notify("Enter Text title", "error");
                check_error = 1;
            }
            else if($("#quill-editor .ql-editor").html() === "<p><br></p>")
            {
                notify("Enter some Text", "error");
                check_error = 1;
            }
            input.video_title = $("#video_title").val();
            input.video = $("#video_file").val().split('\\').pop();
            input.text_title = $("#text_title").val();
            input.text = $("#quill-editor .ql-editor").html();
        }
        else if(fl_type == 'TEXT_IMAGE')
        {
            if($("#image_title").val() === ""){
                notify("Enter Image title", "error");
                check_error = 1;
            }
            else if($("#image_file").val() === ""){
                notify("Select Image", "error");
                check_error = 1;
            }
            else if($("#text_title").val() === ""){
                notify("Enter Text title", "error");
                check_error = 1;
            }
            else if($("#quill-editor .ql-editor").html() === "<p><br></p>")
            {
                notify("Enter some Text", "error");
                check_error = 1;
            }
            input.image_title = $("#image_title").val();
            input.image = $("#image_file").val().split('\\').pop();
            input.text_title = $("#text_title").val();
            input.text = $("#quill-editor .ql-editor").html();
        }
        if(check_error == 0){

            $.post('/addsplash', input, function (splashresult) {
                if (!splashresult.errors) {
                  if (!splashresult.data.newsplash.success) {
                    notify(splashresult.data.newsplash.message, 'error')
                    $('#loader').hide();
                    $('#add_btn').prop("disabled", false);
                  } else {
                    notify('splash created successfully', 'success')
                  }
                  $('#loader').hide()
                  $('#add_btn').prop("disabled", false);
                } else {
                  for (let error of splashresult.errors) {
                    notify(`${error.message}`, 'error')
                  }
                  $('#loader').hide()
                  $('#add_btn').prop("disabled", false);
                }
            })
            
        }
    });
    $('#deleteAll').click(() => {
        let cbs = $.find("#splashList tr input[name='cbRow']")
        $('#list').empty()
        let idx = 0
        $(cbs).each(function () {
          if (this.checked) {
            idx++
            $('#list').append(
            //   `<li data-id="${$(this).data('id')}">${$(this).data('email')}</li>`,
            )
          }
        })
        if (idx > 0) {
          $('#deleteDialog .modal-title').html('Delete Program')
          $("#deleteDialog #bdelete").off("click");
          $('#deleteDialog #bdelete').click(() => {
            $("#bdelete").prop("disabled",true);
            bulkDelete()
          })
          $('#deleteDialog').modal('show')
        } else {
          notify('Splash(s) not selected', 'warning')
        }
    })
});

getClubLevel = () => {
    var clubId = $("#fl_club").val();
    $('#loader').show();
    $.post("/getTire",{ clubId: clubId }, (result) => {
        // console.log(result);
        $("#fl_level").html('');
        
        let html = ``;
        html = `<option value="">Select Level</option>`
        if (result.errors) {
            notify(result.errors[0].message, "error");
        } else {
            if(result.data.tiers.success){
                $.each(result.data.tiers.result, (i, res) => {
                    html += `<option value=${res.id}>${res.name}</option>`
                })
                $("#fl_level").html(html)
            }
        }
        
        $('#loader').hide();
    });
}

typeChanged = () => {
    var fl_type = $("#fl_type").val();

    $(".image-div").addClass("d-none");
    $(".video-div").addClass("d-none");
    $(".text-div").addClass("d-none");

    if(fl_type == 'VIDEO')
    {
        $(".video-div").removeClass("d-none");
    }
    else if(fl_type == 'IMAGE')
    {
        $(".image-div").removeClass("d-none");
    }
    else if(fl_type == 'TEXT')
    {
        $(".text-div").removeClass("d-none");
    }
    else if(fl_type == 'VIDEO_TEXT')
    {
        $(".text-div").removeClass("d-none");
        $(".video-div").removeClass("d-none");
    }
    else if(fl_type == 'TEXT_IMAGE')
    {
        $(".text-div").removeClass("d-none");
        $(".image-div").removeClass("d-none");
    }
}

videoChanged = () => {
    var video_file = $("#video_file").val();
    if(video_file){
        $("#video_span").html(video_file.substr(video_file.lastIndexOf('\\') + 1));
    }else{
        $("#video_span").html("Select Video");
    }
}
imageChanged = () => {
    var image_file = $("#image_file").val();
    if(image_file){
        $("#image_span").html(image_file.substr(image_file.lastIndexOf('\\') + 1));
    }else{
        $("#image_span").html("Select Image");
    }
}
splashList();
function splashList() {
    // alert("List");
    var status = $("#ByStatus").val();
    $('#loader').show()
    $.post('/splashList', { status: status }, (result) => {
      if (result.errors) {
        for (let error of result.errors) {
          notify(`${error.message}`, 'error')
        }
        $('#loader').hide()
      } else {
        _getPageData(result)
        $('#loader').hide()
      }
    })
}
function _getPageData(list) {
    let ele = $('#splashList')
    ele.find('tr').remove()
    if (list.length) {
      $.get('/templates/splashlist.html', function (template) {
        $.each(list, function (index, item) {
          let _resource = []
          if (item.resources != null) {
            _dataResource.forEach(function (_res) {
              let _d = item.resources.includes(_res.id) == true ? _res.name : ''
              if (_d != '') _resource.push(_d)
            })
          }
          item.resources = _resource.join(', ')
          $.tmpl(template, item).appendTo('#splashList')
        })
        //pagination
        _CMSpagination = new Pager({
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
      ele.html('<tr><td colspan="9"><center>No content found</center></td></tr>')
    }
}
$(document).on('click', '.delete-resource', function () {
    let id = $(this).data('id');
    $("#list").empty();
    $("#deleteDialog .modal-title").html("Delete Splash(s)");
    $("#deleteDialog #bdelete").off("click");
    $("#deleteDialog #bdelete").click(() => {
      $("#bdelete").prop("disabled", true);
      singleDelete(id);
    });
    $("#deleteDialog").modal("show");
})
async function singleDelete(id) {
    $('#loader').show();
    const response = await fetch('/deleteSplash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }), // body data type must match "Content-Type" header
    })
    $('#loader').hide();
    $("#deleteDialog").modal("hide");
    splashList();
    $("#bdelete").prop("disabled", false);
}
async function bulkDelete() {
    $('#loader').show()
    let cbs = $.find("#splashList tr input[name='cbRow']")
    let ids = []
  
    $(cbs).each(function () {
      if (this.checked) ids.push(parseInt($(this).data('id')))
    })
  
    if (ids.length) {
      let dids = await Promise.all(
        ids.map(async (req) => {
          const response = await fetch('/deletesplash', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: req,
            }), // body data type must match "Content-Type" header
          })
          let result = await response.json()
          if (result.data && result.data.removemember) {
            return id
          }
        }),
      )
      if (ids.length - dids.length === 0) {
        notify('splash deleted successfully', 'success')
        splashList()
      } else {
        notify('Unable to delete splash(s)', 'error')
      }
      $('#loader').hide()    
    }
    $("#bdelete").prop("disabled",false);
    $('#deleteDialog').modal('hide')
}