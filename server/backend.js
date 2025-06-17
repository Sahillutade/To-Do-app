function LoadView(url){
    $.ajax({
        method: 'get',
        url: url,
        success: (response) => {
            $("section").html(response);
        }
    });
}

// jQuery Load Action

$(() => {

    if($.cookie('uname')){
        LoadDashBoard();
    }
    else{
        LoadView('../public/home.html');
    }

    $(document).on('click', '#home-register-button', () => {
        LoadView("../public/register.html");
    })

    $(document).on('click', '#home-login-button', () => {
        LoadView("../public/login.html");
    })

    $(document).on('click', '#btn-home', () => {
        LoadView("../public/home.html");
    })

    // Register Click

    $(document).on('click','#btnRegister',() => {

        var user = {
            userid: $("#txtUserName").val(),
            password: $("#txtPassword").val(),
            email: $("#txtEmail").val()
        };

        $.ajax({
            method: 'post',
            url: 'http://127.0.0.1:4040/register-user',
            data: user
        });
        alert('Registeres Successfully..');

    });

    // Login Click

    $(document).on('click','#btnLogin',() => {

        $.ajax({
            method: 'get',
            url: 'http://127.0.0.1:4040/users',
            success: (users) => {
                console.log(users);
                var user = users.find(item => item.userid===$("#txtUserName").val());
                if(user){
                    if(user.password===$("#txtPassword").val()){
                        $.cookie('uname', $("#txtUserName").val(),{expires:2});
                        LoadDashBoard();
                    }
                    else{
                        alert('Invalid Password');
                    }
                }
                else{
                    alert('Invalid User Name');
                }
            }
        })

    })

    function LoadDashBoard(){
        $.ajax({
            method: 'get',
            url: './dashboard.html',
            success: (response) => {
                $("section").html(response);
                $("#active-user").html($.cookie('uname'));
                $.ajax({
                    method: 'get',
                    url: 'http://127.0.0.1:4040/appointments',
                    success: (appointments => {

                        var results = appointments.filter(appointment => appointment.userid===$.cookie('uname'));
                        results.map(appointment => {
                            $(`<div class="alert mx-2 alert-success">
                                    <h3> ${appointment.title} </h3>
                                    <p> ${appointment.description} </p>
                                    <div class="bi bi-calendar"> ${appointment.date} </div>
                                    <div>
                                        <button id="btn-edit" value=${appointment.appointment_id} data-bs-target="#edit-appointment" data-bs-toggle="modal" class="bi bi-pen-fill btn btn-warning"></button>
                                        <button id="btn-delete" value=${appointment.appointment_id} class="bi bi-trash-fill btn btn-danger mx-2"></button>
                                    </div>        
                                </div>`).appendTo("#appointment-cards");
                        })
                    })
                })
            }
        })
    }

    // Signout Click

    $(document).on('click','#btn-signout',() => {
        $.removeCookie('uname');
        LoadView('./home.html');
    })

    // Add Appointment Click

    $(document).on('click','#btn-add',() => {
        var appointment = {
            appointment_id: parseInt($("#appointment-id").val()),
            title: $("#appointment-title").val(),
            description: $("#appointment-description").val(),
            date: $("#appointment-date").val(),
            userid: $.cookie('uname')
        }

        $.ajax({
            method: 'post',
            url: 'http://127.0.0.1:4040/add-appointment',
            data: appointment,
        });
        LoadDashBoard();
    })

    //Delete Appointment

    $(document).on('click','#btn-delete',(e) => {
        var flag = confirm('Are you sure?\nWant to Delete?');
        if(flag===true){
            $.ajax({
                method: 'delete',
                url: `http://127.0.0.1:4040/delete-appointment/${e.target.value}`
            });
            LoadDashBoard();
        }
    })

    // Edit Appointment

    $(document).on('click','#btn-edit',(e)=>{
        $.ajax({
            method: 'get',
            url: `http://127.0.0.1:4040/appointments/${e.target.value}`,
            success: (appointment) => {
                console.log(appointment);
                $("#edit-appointment-id").val(appointment.appointment_id);
                $("#edit-appointment-title").val(appointment.title);
                $("#edit-appointment-description").val(appointment.description);
                $("#edit-appointment-date").val(appointment.date.substring(0,appointment.date.indexOf('T')));
            }
        })
    })

    // Update & Save Appointment

    $(document).on('click','#btn-save',() => {
        console.log($("#edit-appointment-id").val());

        var appointment = {
            appointment_id: $("#edit-appointment-id").val(),
            title: $("#edit-appointment-title").val(),
            description: $("#edit-appointment-description").val(),
            date: $("#edit-appointment-date").val(),
            userid: $.cookie('uname')
        }

        $.ajax({
            method: 'put',
            url: `http://127.0.0.1:4040/edit-appointment/${$("#edit-appointment-id").val()}`,
            data: appointment
        });
        LoadDashBoard();
    })

})