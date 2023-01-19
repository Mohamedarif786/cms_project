// $(document).ready(function() {

//     function notify(msg, typ) {
//         var message = msg;
//         var type = typ;
//         var duration = 2500;
//         var ripple = true;
//         var dismissible = true;
//         var positionX = 'Right';
//         var positionY = 'top';
//         window.notyf.open({
//             type,
//             message,
//             duration,
//             ripple,
//             dismissible,
//             position: {
//                 x: positionX,
//                 y: positionY
//             }
//         });
//     }

//     var _formForgot = document.getElementById('formForgot');


//     $('#btnForgot').on('click', function() {
//         let flag = _formForgot[0].checkValidity();
//         if (flag) {
//             let input = {
//                 username: $("#username").val(),
//                 password: bcrypt.hashSync($("#password").val())
//             };

//             let chkdata = input.username == $("#email").val()
//             if (chkdata) {
//                 $.post("/updateRole", input, function(result) {

//                     if (result) {
//                         $("#updateUserModal").modal('hide')
//                         notify('Role updated successfully', "success");
//                         let allroles = JSON.parse(localStorage.getItem('roleList'))
//                         console.log(allroles)
//                         allroles = allroles.map(res => {

//                             if (res.id === parseInt($("#roleid").val())) {
//                                 console.log('id', res);
//                                 res.name = $("#update_name").val()
//                                 return res
//                             }
//                             return res
//                         })
//                         localStorage.setItem("roleList", JSON.stringify(allroles));
//                         roleList()
//                         $('#loader').hide()
//                     } else {
//                         $("#updateUserModal").modal('hide')
//                         notify(result.errors[0].message, "error");
//                         $('#loader').hide();
//                     }
//                 });
//             } else {
//                 notify('No user was found with that email address. ', "error");

//             }
//             //console.log(input);
//             // $.post("/signin", input, function(data) {
//             //     console.log(data);
//             //     let udata = data.accessToken.split(".")[1];
//             //     //console.log(data);
//             //     udata = JSON.parse(window.atob(udata));
//             //     localStorage.setItem("token", data);
//             //     localStorage.setItem("user", udata[0]);
//             //     let baseUrl = window.location.href.substr(0, window.location.href.indexOf(window.location.pathname));
//             //     window.location.href = baseUrl + $("#ReturnUrl").val();
//             // });
//             return false;
//         }
//         $("#formForgot")[0].classList.add('was-validated');
//         return flag;
//     })

// });