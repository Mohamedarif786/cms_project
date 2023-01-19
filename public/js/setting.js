const api_url = "/setting";
$(document).ready(function () {
  loadSetting();
  fill_club_list("#clubid");
  $(".addNew").click(function () {
    let clubId = $("#clubid").val();
    let name = $("#name").val();
    let value = $("#value").val();
    if (parseInt(clubId) === 0) {
      notify("Club should not be empty", "error");
      return;
    }
    if (name === "") {
      notify("Name should not be empty", "error");
      return;
    }
    if (value === "") {
      notify("Value should not be empty", "error");
      return;
    }

    let input = {
      clubid: clubId,
      name: name,
      value: value,
    };
    $("#loader").show();
    $.post(`${api_url}/add`, input, (result) => {
      $("#loader").hide();
      if (result.data && result.data.addSetting) {
        if (result.data.addSetting.success) {
          notify(result.data.addSetting.message, "success");
        } else {
          notify(result.data.addSetting.message, "error");
        }
      }
      loadSetting(clubId);
      $("#name").val("");
      $("#value").val("");
    });
  });
  $("#clubid").change(function () {
    loadSetting($(this).val());
  });
});
$(document).on("click", ".editName", function () {
  $(this).attr("readonly", false);
});
$(document).on("click", ".editValue", function () {
  $(this).attr("readonly", false);
});

$(document).on("focusout", ".editName", function () {
  
  let id = $(this).data("id");
  let clubId = $("#clubid").val();
  let name = $(`#${id}_name`).val();
  if (parseInt(clubId) === 0) {
    notify("Club should not be empty", "error");
    return;
  }
  if (name === "") {
    notify("Name should not be empty", "error");
    return;
  }
  let input = {
    id: id,
    clubid: clubId,
    name: name,
  };
  $("#loader").show();
  $.post(`${api_url}/update`, input, (result) => {
    $("#loader").hide();
    if (result.data && result.data.updateSetting) {
      if (result.data.updateSetting.success) {
        notify(result.data.updateSetting.message, "success");
      } else {
        notify(result.data.updateSetting.message, "error");
      }
    }
    loadSetting(clubId);
  });
  $(this).attr("readonly", true);
});
$(document).on("focusout", ".editValue", function () {
  
  let id = $(this).data("id");
  let clubId = $("#clubid").val();
  let value = $(`#${id}_value`).val();
  if (parseInt(clubId) === 0) {
    notify("Club should not be empty", "error");
    return;
  }
  if (value === "") {
    notify("Value should not be empty", "error");
    return;
  }
  let input = {
    id: id,
    clubid: clubId,
    value: value,
  };
  $("#loader").show();
  $.post(`${api_url}/update`, input, (result) => {
    $("#loader").hide();
    if (result.data && result.data.addSetting) {
      if (result.data.addSetting.success) {
        notify(result.data.updateSetting.message, "success");
      } else {
        notify(result.data.updateSetting.message, "error");
      }
    }
    loadSetting(clubId);
  });
  $(this).attr("readonly", true);
});

$(document).on("click", ".deleteRow", function () {
  let id = $(this).data("id");
  $("#loader").show();
  $.post(`${api_url}/remove`, { id: id }, (result) => {
    $("#loader").hide();
    if (result.data && result.data.removeSetting) {
      if (result.data.removeSetting.success) {
        notify(result.data.removeSetting.message, "success");
      } else {
        notify(result.data.removeSetting.message, "error");
      }
    }
    loadSetting($("#clubid").val());
  });
});

function loadSetting(clubId) {
  $("#loader").show();
  let input = {};
  if (clubId !== "") {
    input = {
      clubid: clubId,
    };
  }
  $.post(`${api_url}/list`, input, (result) => {
    $("#loader").hide();
    loadData("#tableBody", result, "/templates/setting_item.html");
  });
}
