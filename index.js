let token = localStorage.getItem('token')
var UserId = localStorage.getItem('id')
var email = localStorage.getItem('email')
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
        localStorage.setItem('email',profile.getEmail())
        UserId = localStorage.getItem('id')
        generateUserTodo(UserId)
        generateFormTodoUpdateDelete(UserId)
    })
    .fail((err) => {
        console.log(err)
    })

    
}

function generateUserTodo(UserId) {
    $.ajax({
        method:'GET',
        url:`http://localhost:3000/todos/${UserId}`
    })
    .done((res) => {
        for (let i = 0; i < res.result.length; i++) {
            $('.col-card-todos').append(`
                <div class="card card-todos">
                    <p style="text-align: right;"> <i class="fas fa-edit update-delete" data-toggle="modal" data-target="#updateModal${res.result[i].id}" style="cursor: pointer;" id="${res.result[i].id}"></i> </p>
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
}

function update(id) {
    let todoId = $(`#input-updateId-${id}`).val()
    let title = $(`#input-updateTitle-${id}`).val()
    let description = $(`#input-updateDescription-${id}`).val()
    let due_date = $(`#input-updateDate-${id}`).val()
    $.ajax({
        method:'PUT',
        url:`http://localhost:3000/todos/${todoId}`,
        headers:{
            token
        },
        data:{
            title,
            description,
            due_date
        }
    })
    .done((res) => {
        $('.col-card-todos').empty()
        generateUserTodo(UserId)
        console.log('success update')
    })
    .fail((err) => {
        console.log(err)
        console.log('failed update')
    })
}

function deleteTodo(id) {
    $.ajax({
        method:'DELETE',
        url:`http://localhost:3000/todos/${id}`
    })
    .done((res) => {
        console.log('success delete')
        $('.col-card-todos').empty()
        generateUserTodo(UserId)
    })
    .fail((err) => {
        console.log('failed delete')
    })
}

function generateFormTodoUpdateDelete(UserId) {
    $.ajax({
        method:'GET',
        url:`http://localhost:3000/todos/${UserId}`
    })
    .done((res) => {
        for (let i = 0; i < res.result.length; i++) {
            let id = res.result[i].id
            $('#updateModal').append(`
                <div class="modal fade" id="updateModal${res.result[i].id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Update Todo</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body updateDelete">
                                <form>
                                    <label>Id</label>
                                    <input type="text" class="form-control input-updateId" value="${res.result[i].id}" id="input-updateId-${res.result[i].id}" readonly>
                                    <label> Title </label><br>
                                    <input type="text" class="form-control input-updateTitle" value="${res.result[i].title}" id="input-updateTitle-${res.result[i].id}"><br>
                                    <label> Description </label><br>
                                    <input type="text" class="form-control input-updateDescription" value="${res.result[i].description}" id="input-updateDescription-${res.result[i].id}"><br>
                                    <label> Date </label><br>
                                    <input type="date" class="form-control" id="input-updateDate-${res.result[i].id}">
                                </form>
                            </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary btn-update" onclick="update(${id})" id="update${res.result[i].id}" data-dismiss="modal">Update Todo</button>
                                <button type="button" class="btn btn-primary btn-delete" onclick="deleteTodo(${id})" id="delete${res.result[i].id}" data-dismiss="modal">Delete Todo</button>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        }
    })
    .fail((err) => {
        console.log('failed show todo user list')
    })
    
}

function modalContact(email) {

    $('.card-profile').append(`
    <img src="https://api.kwelo.com/v1/media/identicon/${email}" alt="Identicon for ${email}">
    <h3 style="color: black;font-family: 'Fredoka One', cursive;">Irfan Maulana</h3>
    <p class="title-profile">Student in Hacktiv8</p>
    <p>2020</p>
    <p><button class="btn-profile" data-target="#contactModal" data-toggle="modal">Contact</button></p>`)


    $('#contact').append(`<div class="modal fade" id="contactModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Contact</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control input-updateId" value="${email}" readonly>
            </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>`)
}

// Document Ready
$(document).ready(() => {
    if(token) {
        $('#dashboard').show()
        generateUserTodo(UserId)
        generateFormTodoUpdateDelete(UserId)
        modalContact(email)
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
            UserId = localStorage.getItem('id')
            localStorage.setItem('token',res.token)
            localStorage.setItem('email',email)
            generateUserTodo(UserId)
            generateFormTodoUpdateDelete(UserId)
            modalContact(email)
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
            localStorage.setItem('id',res.id)
            localStorage.setItem('email',email)
            UserId = localStorage.getItem('id')
            $('#form-register').hide()
            $('#dashboard').show()
            generateUserTodo(UserId)
            generateFormTodoUpdateDelete(UserId)
            modalContact(email)
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
        $('.col-card-todos').empty()
        $('#dashboard').hide()
        $('#page-explore').hide()
        $('#home').show()
    })

    $('#btn-addTodo').on("click",(e) => {
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
            UserId = localStorage.getItem('id')
            $('.col-card-todos').empty()
            generateUserTodo(UserId)
            generateFormTodoUpdateDelete(UserId)
            console.log('data success created')
        }) 
        .fail((err) => {
            console.log(err)
        })
    })

    $('.btn-home').click(function(e) {
        $('#dashboard').show()
        $('#page-explore').hide()
    })

    $(".btn-explore").click(function(e){
        $('#dashboard').hide()
        $('#page-explore').show()
        $(".todoslist").empty()
        $.ajax({
            method:"GET",
            url:"http://localhost:3000/todos"
        })
        .done((res) => {
            for (let i = 0; i < res.result.length; i+=2) {
                if(res.result[i].User){
                    $(".todoslist").append(`
                        <div class="col-md-6 mb-4">
                            <div class="card hoverable">
                                <div class="card-body">
                                    <div class="media">
                                        <span class="card-img-100 d-inline-flex justify-content-center align-items-center rounded-circle grey lighten-3 mr-4">
                                            <img src="https://api.kwelo.com/v1/media/identicon/${res.result[i].User.email}" alt="Identicon for ${res.result[i].User.email}">
                                        </span>
                                        <div class="media-body">
                                            <h5 class="dark-grey-text mb-3">${res.result[i].User.email}</h5>
                                            <p class="font-weight text-muted mb-0">${res.result[i].title}</p>
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
                                                <img src="https://api.kwelo.com/v1/media/identicon/${res.result[i].User.email}" alt="Identicon for ${res.result[i].User.email}">
                                            </span>
                                            <div class="media-body">
                                                <h5 class="dark-grey-text mb-3">${res.result[i].User.email}</h5>
                                                <p class="font-weight text-muted mb-0">${res.result[i].title}</p>
                                                <p class="font-weight-light text-muted mb-0">${res.result[i].description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        )
                    }
                }
            }
        })
        .fail((err) => {
            console.log(err)
        })
    }) 
})
