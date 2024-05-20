

//modal yükle sayfaya
var Modal1 = $('#ModalCreateUser');
//edit işleminde yap
$(document).on('click', '#editUser', async function () {
    var userTableId = $(this).attr("data-userTableId");
    Modal1.load("/User/CreateUser/" + userTableId + "", function () {

        Modal1.modal('show');
    })
});

///sayfa açıldığında listeyi oluştur
$(document).ready(function () {

    FillOutList()

});


function FillOutList() {
    var U = 1;
    $.ajax({
        url: '/User/UserList/' + U + '',
        type: 'GET',
        dataType: 'json',
        success: function (Users) {
            $.each(Users, function (index, User) {
                addRow(User);
            });
            function addRow(User) {
                $('#UserTable').append('<tr><td>' + User.userTableId + '</td><td>' + User.name + '</td><td>' + User.surname + '</td><td>' + User.email + '</td><td>' + User.password + '</td><td><a id="editUser" data-userTableId="' + User.userTableId + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

            }
        },
        error: function (xhr, status, error) {
            // İstek başarısız olduğunda çalışacak fonksiyon
            console.error('Hata:', status, error);
        }

    });

}

///db işlemleri 
$(document).on('click', '#CreateUser', async function () {
    DbIslemleri();

});

function DbIslemleri() {
    var userTableId = $("#UserTableID").val();
    var CreateDate = $("#CreateDate").val();
    var CreateUser = $("#CreateUser").val();
    var UpdateDate = $("#CreateDate").val();
    var UpdateUser = $("#CreateUser").val();
    var Name = $("#Name").val();
    var Surname = $("#Surname").val();
    var Email = $("#Email").val();
    var password = $("#password").val();
    var IsPasivve = 0;
    var IsAdmin = 0;


    var User = {
        UserTableID: userTableId,  
        CreateDate: CreateDate,
        CreateUser: CreateUser,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Name: Name,
        Surname: Surname,
        Email: Email,
        password: password,
        IsPasivve: IsPasivve,
        IsAdmin: IsAdmin

    };
  

    $.ajax({
        type: "POST",
        url: "/User/UserList",
        dataType: 'json',
        data: User,
        success: function (response) {

            if (UserTableID == 0) {
                //tablo satırları oluşturuluyor
                var tr = '<tr><td>' + UserTableID + '</td><td>' + Name + '</td><td>' + Surname + '</td><td>' + Email + '</td><td>' + Password + '</td><td><a id="editCustomer" href="/Customer/CreateCustomer/' + UserTableID + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td ></tr > ';

                $("#UserTable").append(tr);
                Modal1.modal('hide');
            } else {
                $('#UserTable').empty();
                FillOutList()

                Modal1.modal('hide');
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluştu: " + errorThrown);
        }
    });
}