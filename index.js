let token = localStorage.getItem('token')

// Google Sign In
function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method:"POST",
        url:"http://localhost:3000/loginGoogle",
        data:{
            email:profile.getEmail(),
            password:"defaultpassword",
            id_token
        }
    })
    .done((res) => {
        $('#form-login').hide()
        $('#home').hide()
        $('#dashboard').show()
        localStorage.setItem('token',res.token)
    })
    .fail((err) => {
        console.log(err)
    })
}
// Document Ready
$(document).ready(() => {
    if(token) {
        $('#dashboard').hide()
        $('#home').hide()
        $('#form-register').hide()
        $('#form-login').hide()
        $('#page-explore').show()
    }else{
        $('#dashboard').hide()
        $('#home').show()
        $('#form-register').hide()
        $('#form-login').hide()
    }

    $(".login").on("click",(e) => {
        e.preventDefault()
        $("#home").hide()
        $('#form-register').hide()
        $("#form-login").show()
    })

    $(".register").on("click",(e) => {
        e.preventDefault()
        $("#home").hide()
        $("#form-login").hide()
        $("#form-register").show()
    })

    $("#btn-login").on("click",(e) => {
        e.preventDefault() // agar tidak reload
        let email = $('#email-login').val()
        let password = $('#password-login').val()
        $.ajax({
            method:'POST',
            url:'http://localhost:3000/login',
            data:{
                email,
                password
            }
        })
        .done((res) => {
            localStorage.setItem('token',res.token)
            $('#form-login').hide()
            $('#dashboard').show()
        })
        .fail((err) => {
            console.log(err)
        })
    })

    $('#btn-register').on("click",(e) => {
        e.preventDefault()
        let email = $('#email-register').val()
        let password = $('#password-register').val()
        $.ajax({
            method:'POST',
            url:'http://localhost:3000/register',
            data:{
                email,
                password
            }
        })
        .done((res) => {
            localStorage.setItem('token',res.token)
            $('#form-register').hide()
            $('#dashboard').show()
        })
        .fail((err) => {
            console.log(err)
        })
    })

    $('#btn-logout').on("click",(e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        // Google Sign Out
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User Sign Out')
        });
        $('#dashboard').hide()
        $('#home').show()
    })

    $("#explore").click(function(e){
        $.ajax({
            method:"GET",
            url:"http://localhost:3000/todos"
        })
        .done((res) => {
            console.log(res)
            res.result.forEach(el => {
                // $(".modal-body").append(`<p>${el.tittle}</p><br><p>${el.description}</p>`)
                $(".modal-body").append(`<div class="col-md-6 mb-4">
                <!-- Card -->
                  <div class="card hoverable">
                      <!-- Card content -->
                      <div class="card-body">
                          <div class="media">
                              <span class="card-img-100 d-inline-flex justify-content-center align-items-center rounded-circle grey lighten-3 mr-4">
                                  <i class="far fa-user fa-2x purple-text"></i>
                              </span>
                          <div class="media-body">
                              <h5 class="dark-grey-text mb-3">${el.tittle}</h5>
                              <p class="font-weight-light text-muted mb-0">${el.description}</p>
                          </div>
                      </div>
                  </div>
              </div>`)
            });
        })
    }) 
})
