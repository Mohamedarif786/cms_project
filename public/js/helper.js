document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  var process = false
  let menu = JSON.parse(localStorage.getItem("userMenu"));
  $('#sideNav1', '#sideNav2', '#sideNav3', '#sideNav4', '#sideNav5', '#sideNav6', '#sideNav7').find('ul').empty();
  if (menu && menu.length > 0 && !process) {
    menu.forEach(element => {
      $('#sideNav' + element.parentid).find('ul').append($(`<li class="sidebar-item"><a class="sidebar-link" href="${element.url}">${element.name}</a></li>`))
    });
    process = true
  }
  let clubid = getUserClubId();
  if (clubid && clubid > 0) {
    //  $("#sidebar").find(".adminMenu").remove();
    // $("#sidebar").find(".clubMenu").show();
  }
  // Your code to run since DOM is loaded and ready
});

function getUserClubId() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return 0;//user.clubid ? user.clubid : 0; // is admin
  } else {
    return 0;
  }
  //8752 cmstesting clubid
}

function notify(msg, typ) {
  var message = msg;
  var type = typ;
  var duration = 2500;
  var ripple = true;
  var dismissible = true;
  var positionX = "Right";
  var positionY = "top";
  window.notyf.open({
    type,
    message,
    duration,
    ripple,
    dismissible,
    position: {
      x: positionX,
      y: positionY,
    },
  });
}

function checkexist() {
  let checkexist = [];
  $("input[name=checkOne]:checked").each(function () {
    checkexist.push(parseInt($(this).val()));
  });
  if (checkexist.length) $("#deleteAllUserModal").modal("show");
  else notify("Select atleast one", "error");
}

function notify(msg, typ) {
  var message = msg;
  var type = typ;
  var duration = 2500;
  var ripple = true;
  var dismissible = true;
  var positionX = "Right";
  var positionY = "top";
  window.notyf.open({
    type,
    message,
    duration,
    ripple,
    dismissible,
    position: {
      x: positionX,
      y: positionY,
    },
  });
}

function set_display_name() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    $(".displayName").text(`${user.firstname} ${user.lastname}`);
    if (user.clubid === undefined || user.clubid === null) {
      club_list();
      country_list();
    }
  }
  $(".select2").each(function () {
    $(this).wrap('<div class="position-relative"></div>').select2({
      dropdownParent: $(this).parent(),
    });
  });
}

function country_list() {
  let list = JSON.parse(localStorage.getItem("country_list"));
  if (!list) {
    $.get("/country/list", function (result) {
      if (result && result.length > 0) {
        localStorage.setItem("country_list", JSON.stringify(result));
      }
    });
  }
}

function fill_country_list(element, value, valueKey) {
  let list = JSON.parse(localStorage.getItem("country_list"));
  if (list && list.length > 0) {
    $(element).empty();
    $(element).append(new Option("Choose Country", 0));
    $(list).each((idx, item) => {
      if (value && item.id === value) {
        $(element).append(new Option(item.name, item.alpha2, true));
      } else {
        $(element).append(new Option(item.name, item.alpha2));
      }
    });
    $(element).find("select").val(value).trigger("change");
  }
}

function fill_dialling_code_list(element, value) {
  let list = JSON.parse(localStorage.getItem("country_list"));
  if (list && list.length > 0) {
    $(element).empty();
    //$(element).append(new Option("", 0));
    $(list).each((idx, item) => {
      if (value && item.id === value) {
        $(element).append(
          new Option(`+${item.diallingcode}`, `+${item.diallingcode}`, true)
        );
      } else {
        $(element).append(
          new Option(`+${item.diallingcode}`, `+${item.diallingcode}`)
        );
      }
    });
    $(element).find("select").val(value).trigger("change");
  }
}

function club_list() {
  let list = JSON.parse(localStorage.getItem("club_list"));
  if (!list) {
    $.get("/club/list", function (result) {
      if (result && result.length > 0) {
        localStorage.setItem("club_list", JSON.stringify(result));
      }
    });
  }
}

function fill_club_list(element, value) {
  let list = JSON.parse(localStorage.getItem("club_list"));
  if (list && list.length > 0) {
    let clubList = [];
    let userClubId = getUserClubId();
    $.each(list, (i, res) => {
      if ((userClubId > 0 && res.id == userClubId) || userClubId == 0) {
        clubList.push(res);
      }
    })
    $(element).empty();
    $(element).append(new Option("Choose Club", 0));
    $(clubList).each((idx, item) => {
      if (value && item.id === value) {
        $(element).append(new Option(item.name, item.id, true));
      } else {
        $(element).append(new Option(item.name, item.id));
      }
    });
    $(element).find("select").val(value).trigger("change");
  }
}

function fill_club_list_all(element, value) {
  let list = JSON.parse(localStorage.getItem("club_list"));
  if (list && list.length > 0) {
    let clubList = [];
    let userClubId = getUserClubId();
    $.each(list, (i, res) => {
      if ((userClubId > 0 && res.id == userClubId) || userClubId == 0) {
        clubList.push(res);
      }
    })
    $(element).empty();
    $(element).append(new Option("Choose Club", 0));
    if (userClubId == 0) {
      $(element).append(new Option("All", 'All'));
    }
    $(clubList).each((idx, item) => {
      if (value && item.id === value) {
        $(element).append(new Option(item.name, item.id, true));
      } else {
        $(element).append(new Option(item.name, item.id));
      }
    });
    $(element).find("select").val(value).trigger("change");
  }
}

function clear_form(element) {
  $(element).find(":input").val("");
  $(element).find("textarea").val("");
  $(element)
    .find("textarea")
    .each(function (k, v) {
      if (tinyMCE.get(k)) tinyMCE.get(k).setContent("");
    });
  $(element).find("select").val("").trigger("change");
  $(element).find("select").prop("selectedIndex", 0);
}

function showActiveMenu() {
  $(".sidebar-item").removeClass("active");
  $(".sidebar-dropdown").removeClass("show");

  let current_path = window.location.pathname;
  current_path = current_path.replaceAll("/", "");
  $("#menu-" + current_path).addClass("active");

  if (
    current_path == "roles" ||
    current_path == "resource" ||
    current_path == "policy" ||
    current_path == "users" ||
    current_path == "policy-owners"
  ) {
    $("#sideNav1").addClass("active");
    $("#admin").addClass("show");
  } else if (current_path == "import" || current_path == "export") {
    $("#sideNav2").addClass("active");
    $("#dataHolder").addClass("show");
  } else if (
    current_path == "menu" ||
    current_path == "manage_language" ||
    current_path == "manage-module"
  ) {
    $("#sideNav3").addClass("active");
    $("#configuration").addClass("show");
  } else if (
    current_path == "club" ||
    current_path == "tiers" ||
    current_path == "language" ||
    current_path == "manage-module-club" ||
    current_path == "manage_suppliers" ||
    current_path == "manage_markup" ||
    current_path == "manage_benefits" ||
    current_path == "members" ||
    current_path == "programs" ||
    current_path == "settings" ||
    current_path == "smtp" ||
    current_path == "orders" ||
    current_path == "currency" ||
    current_path == "markups"
  ) {
    $("#sideNav4").addClass("active");
    $("#config").addClass("show");
  } else if (
    current_path == "member-report" ||
    current_path == "order-report"
  ) {
    $("#sideNav5").addClass("active");
    $("#reports").addClass("show");
  } else if (
    current_path == "loyalty-allocation" ||
    current_path == "order-report"
  ) {
    $("#sideNav6").addClass("active");
    $("#program-menu").addClass("show");
  } else if (
    current_path == "templates" ||
    current_path == "splash" ||
    current_path == "list" ||
    current_path == "pages"
  ) {
    $("#sideNav7").addClass("active");
    $("#content").addClass("show");
  }
}
$("#changePassword #change").click(function () {
  let data = getData("#changePassword #formChangePassword");
  data.newPassword = window.btoa(data.newPassword);
  data.confirmPassword = window.btoa(data.confirmPassword);
  console.log(data);
  $("#loader").show();
  $.post("/password/change", data, function (result) {
    $("#loader").hide();
    console.log(result);
  });
  return false;
});
function signout() {
  localStorage.clear();
  let href = window.location.href.toString();
  let baseUrl = href.substring(0, href.indexOf(window.location.pathname));

  window.location.href = baseUrl + "/signout";
}

function isValid(form) {
  return $(form)[0].checkValidity();
}

function getData(form) {
  try {
    let flag = $(form)[0].checkValidity();
    let data;
    if (flag) {
      data = $(form).serializeObject();
    }
    return data;
  } catch (e) {
    console.log(e);
  }
}

function fillData(form, data) {
  try {
    let keys = Object.keys(data);
    let inputs = $(form).find(":input");
    $(inputs).each(function () {
      let field = $(this).attr("name");
      if (keys.includes(field)) {
        $(this).val(data[field]);
      }
    });

    let textareas = $(form).find("textarea");
    $(textareas).each(function () {
      let field = $(this).attr("name");
      if (keys.includes(field)) {
        $(this).val(data[field]);
        $(this)
          .find("textarea")
          .each(function (k, v) {
            tinyMCE.get(k).setContent(data[field]);
          });
      }
    });

    let dropdowns = $(form).find("select");
    $(dropdowns).each(function () {
      let field = $(this).attr("name");
      if (keys.includes(field)) {
        $(this).val(data[field]).trigger("change");
      }
    });
  } catch (e) {
    console.log(e);
  }
}

(function ($) {
  $.fn.serializeObject = function () {
    "use strict";

    var result = {};
    var extend = function (i, element) {
      var node = result[element.name];

      // If node with same name exists already, need to convert it to an array as it
      // is a multi-value field (i.e., checkboxes)

      if ("undefined" !== typeof node && node !== null) {
        if ($.isArray(node)) {
          node.push(element.value);
        } else {
          result[element.name] = [node, element.value];
        }
      } else {
        result[element.name] = element.value;
      }
    };

    $.each(this.serializeArray(), extend);
    return result;
  };
})(jQuery);

function loadData(container, data, template) {
  $(container).empty();
  $.get(template, function (template) {
    $.each(data, function (index, item) {
      $.tmpl(template, item).appendTo(container);
    });
  });
}
