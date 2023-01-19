document.querySelector("[type='password']").classList.add("input-password");
document.getElementById("toggle-password").classList.remove("d-none");
const passwordInput = document.querySelector("[type='password']");

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

$("#forgetPwd").click(() => {
  let email = $("#username").val();
  let input = {
    email: email,
  };
  let baseUrl = window.location.href.substr(
    0,
    window.location.href.indexOf(window.location.pathname)
  );
  if (!$("#ReturnUrl").val()) {
    if (email.trim().length > 0) {
      $.post("/forgot", input, function (res) {
        if (res.data) {
          window.location.href = baseUrl + "/code?email=" + input.email;
        }
      });
    } else {
      $("#signin_form .invalid-feedback").first().text("Please enter your email address");
      $("#signin_form .invalid-feedback").first().show();
    }
  }

  return false;
});

$(document).keydown(function (event) {
  if (event.keyCode == 123) {
    // Prevent F12
    return false;
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
    // Prevent Ctrl+Shift+I
    return false;
  }
});

$(document).on("contextmenu", function (e) {
  e.preventDefault();
});

$(document).ready(function () {
  $("#username").focus();
  $("#toggle-password").click(() => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      $(this).attr("aria-label", "Hide password.");
      //togglePasswordButton.setAttribute("aria-label", "Hide password.");
      $("#toggle-password").html(`<svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>`);    
    } else {
      passwordInput.type = "password";
      $(this).attr(
        "aria-label",
        "Show password as plain text. " +
          "Warning: this will display your password on the screen."
      );
      $("#toggle-password").html(`<svg 
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
            stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>`);
      /*togglePasswordButton.setAttribute(
        "aria-label",
        "Show password as plain text. " +
          "Warning: this will display your password on the screen."
      );*/
    }
  });
  $("#username").focus();
  $("#btnLogin").click(() => {
    var forms = document.querySelectorAll(".needs-validation");
    let flag = $("#signin_form")[0].checkValidity();
    if (flag) {
      $("#loader").show();
      let input = {
        username: $("#username").val(),
        password: window.btoa($("#password").val()),
      };
      $.post("/signin", input, function (result) {
        let jwt;
        if (result && result.token) {
          jwt = result.token;
          let user = window.atob(jwt.split(".")[1]);
          localStorage.setItem("user", user);
          localStorage.setItem(
            "userMenu",
            JSON.stringify(result.menuPermission)
          );
          let now = new Date();
          let time = now.getTime();
          let expireTime = time + 1000 * 60;
          now.setTime(expireTime);
          document.cookie =
            "jwt=" + jwt + ";expires=" + now.toGMTString() + ";path=/";
          let baseUrl = window.location.href.substr(
            0,
            window.location.href.indexOf(window.location.pathname)
          );
          if ($("#ReturnUrl").val()) {
            window.location.href = baseUrl + $("#ReturnUrl").val();
          } else {
            window.location.href = baseUrl + "/dashboard";
          }
        } else {
          let msg = result;
         if(msg){ msg = `${msg.substr(0,1).toUpperCase()}${msg.substr(1,msg.length)}`;
          $("#signin_form .invalid-feedback").first().text(msg);
          $("#signin_form .invalid-feedback").first().show();}
        }
        $("#loader").hide();
      });
      return false;
    }
    $("#signin_form")[0].classList.add("was-validated");
    return flag;
  });
});
