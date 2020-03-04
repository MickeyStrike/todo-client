let token = localStorage.getItem('token')
$(document).ready(() => {
    if(token) {
        $('#dashboard').show()
        $('#home').hide()
        $('#form-register').hide()
        $('#form-login').hide()
    }else{
        $('#dashboard').hide()
        $('#home').show()
        $('#form-register').hide()
        $('#form-login').hide()
    }

    $("#login").on("click",(e) => {
        e.preventDefault()
        $("#home").hide()
        $("#form-login").show()
    })

    $("#register").on("click",(e) => {
        e.preventDefault()
        $("#home").hide()
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
        $('#dashboard').hide()
        $('#home').show()
    })

    $('#btn-btn-google-sign-in').on("click",(e) => {
        
    })
})