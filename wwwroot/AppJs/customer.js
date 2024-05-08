var Modal1 = $('#MCreateCustomer');
$(document).on('click', '#btnCreateCustomer', async function () {
   
    Modal1.load("/Customer/CreateCustomer", function () {

        Modal1.modal('show');
    })
});

$(document).on('click', '#editCustomer', async function () {
    var userTableId = $(this).attr("data-userTableId");
    Modal1.load("/Customer/CreateCustomer/"+ userTableId + "", function () {

        Modal1.modal('show');
    })
});




$(document).on('click', '#CreateCustomer', async function () {
    var userTableId = $("#UserTableID").val();

    if (userTableId != 0)
        UpdateIslemleri();

    EkleIslemleri();

});

function EkleIslemleri() {
    var CreateDate = $("#CreateDate").val();
    var CreateUser = $("#CreateUser").val();
    var UpdateDate = $("#CreateDate").val();
    var UpdateUser = $("#CreateUser").val();
    var Code = $("#Code").val();
    var Name = $("#Name").val();
    var VkNo = $("#VkNo").val();
    var Email = $("#Email").val();
    var Country = $("#Country").val();
    var Address = $("#Address").val();
   

    var Customer = {
        CreateDate: CreateDate,
        CreateUser: CreateUser,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Code: Code,
        Name: Name,
        VkNo: VkNo,
        Email: Email,
        Country: Country,
        Address: Address

    };

       
    $.ajax({
        type: "POST",
        url: "/Customer/CustomerList",
        dataType: 'json',
        data: Customer,
        success: function (response) {
            var UserTableID = response;
            //tablo satýrlarý oluþturuluyor
            var tr = '<tr><td>' + Code + '</td><td>' + Name + '</td><td>' + VkNo + '</td><td>' + Email + '</td><td>' + Country + '</td><td>' + Address + '</td><td><a id="editCustomer" href="/Customer/CreateCustomer/' + UserTableID + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td ></tr > ';
            
            $("#CustomerTable").append(tr);
            Modal1.modal('hide');

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluþtu: " + errorThrown);
        }
    });
}



function UpdateIslemleri() {
    var UserTableID = $("#UserTableID").val();
    var UpdateDate = $("#CreateDate").val();
    var UpdateUser = $("#CreateUser").val();
    var Code = $("#Code").val();
    var Name = $("#Name").val();
    var VkNo = $("#VkNo").val();
    var Email = $("#Email").val();
    var Country = $("#Country").val();
    var Address = $("#Address").val();


    var Customer = {
        UserTableID: UserTableID,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Code: Code,
        Name: Name,
        VkNo: VkNo,
        Email: Email,
        Country: Country,
        Address: Address

    };


    $.ajax({
        type: "POST",
        url: "/Customer/CustomerList",
        dataType: 'json',
        data: Customer,
        success: function (response) {
            var UserTableID = response;
            ////tablo satýrlarý oluþturuluyor
            //var tr = '<tr><td>' + Code + '</td><td>' + Name + '</td><td>' + VkNo + '</td><td>' + Email + '</td><td>' + Country + '</td><td>' + Address + '</td><td><a id="editCustomer" href="/Customer/CreateCustomer/' + UserTableID + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td ></tr > ';

            //$("#CustomerTable").append(tr);
            Modal1.modal('hide');

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluþtu: " + errorThrown);
        }
    });
}