let token = localStorage.getItem('token')
let UserId = localStorage.getItem('id')
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
        localStorage.setItem('id',res.id)
        localStorage.setItem('token',res.token)
    })
    .fail((err) => {
        console.log(err)
    })

    
}
// Document Ready
$(document).ready(() => {
    if(token) {
        $('#dashboard').show()
        $.ajax({
            method:'GET',
            url:`http://localhost:3000/todos/${UserId}`
        })
        .done((res) => {
            for (let i = 0; i < res.result.length; i++) {
                $('.col-card-todos').append(`
                    <div class="card card-todos">
                        <p style="text-align: right;"> <i class="fas fa-edit update-delete" data-toggle="modal" data-target="#updateModal" style="cursor: pointer;" id="${res.result[i].id}"></i> </p>
                        <p style="color: black;">${res.result[i].title}</p>
                        <p style="color: black;">${res.result[i].description}</p>
                        <p style="color: black;">${res.result[i].due_date}</p>
                    </div><br>
                `)
            }
        })
        .fail((err) => {
            console.log('failed show todo user list')
        })
        $('#home').hide()
        $('#form-register').hide()
        $('#form-login').hide()
        $('#page-explore').hide()
    }else{
        $('#dashboard').hide()
        $('#home').show()
        $('#form-register').hide()
        $('#form-login').hide()
        $('#page-explore').hide()
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
            $('#form-login').hide()
            $('#home').hide()
            $('#dashboard').show()
            localStorage.setItem('id',res.id)
            localStorage.setItem('token',res.token)
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

    $('.btn-logout').on("click",(e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        // Google Sign Out
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User Sign Out')
        });
        $('#dashboard').hide()
        $('#page-explore').hide()
        $('#home').show()
    })

    $('.btn-addTodo').on("click",(e) => {
        let title = $('#input-addTitle').val()
        let description = $('#input-addDescription').val()
        let due_date = $('#input-addDate').val()
        $.ajax({
            method:'POST',
            url:'http://localhost:3000/todos',
            headers: {
                token
            },
            data:{
                title,
                description,
                due_date,
                UserId
            }
        })
        .done((res) => {
            console.log('data success created')
        }) 
        .fail((err) => {
            console.log(err)
        })
    })

    $('.update-delete').on("click",(e) => {
        console.log(this.id)
        let id = this.id
        console.log(id)
        $('#updateModal').append(``)
    })

    $('.btn-home').click(function(e) {
        $('#dashboard').show()
        $('#page-explore').hide()
    })

    $(".btn-explore").click(function(e){
        $('#dashboard').hide()
        $('#page-explore').show()
        $.ajax({
            method:"GET",
            url:"http://localhost:3000/todos"
        })
        .done((res) => {
            for (let i = 0; i < res.result.length; i+=2) {
                $(".todoslist").append(`
                    <div class="col-md-6 mb-4">
                        <div class="card hoverable">
                            <div class="card-body">
                                <div class="media">
                                    <span class="card-img-100 d-inline-flex justify-content-center align-items-center rounded-circle grey lighten-3 mr-4">
                                        <i class="fab fa-react fa-2x text-info"></i>
                                    </span>
                                    <div class="media-body">
                                        <h5 class="dark-grey-text mb-3">irfanmaulana281299</h5>
                                        <p class="font-weight text-muted mb-0">${res.result[i].tittle}</p>
                                        <p class="font-weight-light text-muted mb-0">${res.result[i].description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                )

                if(res.result[i+1]){
                    $(".todoslist").append(`
                        <div class="col-md-6 mb-4">
                            <div class="card hoverable">
                                <!-- Card content -->
                                <div class="card-body">
                                    <div class="media">
                                        <span class="card-img-100 d-inline-flex justify-content-center align-items-center rounded-circle grey lighten-3 mr-4">
                                            <i class="far fa-user fa-2x purple-text"></i>
                                        </span>
                                        <div class="media-body">
                                            <h5 class="dark-grey-text mb-3">irfanmaulana281299</h5>
                                            <p class="font-weight text-muted mb-0">${res.result[i].tittle}</p>
                                            <p class="font-weight-light text-muted mb-0">${res.result[i].description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    )
                }
            }
        })
        .fail((err) => {
            console.log(err)
        })
    }) 
})
