


///modal açma iþlemleri
var Modal1 = $('#MCreateCustomer');
$(document).on('click', '#btnCreateCustomer', async function () {

    Modal1.load("/Customer/CreateCustomer", function () {

        Modal1.modal('show');
    })
});

$(document).on('click', '#editCustomer', async function () {
    var userTableId = $(this).attr("data-userTableId");
    Modal1.load("/Customer/CreateCustomer/" + userTableId + "", function () {

        Modal1.modal('show');
    })
});



///db iþlemleri 
$(document).on('click', '#CreateCustomer', async function () {
     DbIslemleri();

});

function DbIslemleri() {
    var userTableId = $("#UserTableID").val();
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


    var CreateCustomer = {
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
    var UpdateCustomer = {
        UserTableID: userTableId,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Code: Code,
        Name: Name,
        VkNo: VkNo,
        Email: Email,
        Country: Country,
        Address: Address

    };

    var postData = userTableId ? UpdateCustomer : CreateCustomer;

    $.ajax({
        type: "POST",
        url: "/Customer/CustomerList",
        dataType: 'json',
        data: postData,
        success: function (response) {

            if (UserTableID == 0) {
                //tablo satýrlarý oluþturuluyor
                var tr = '<tr><td>' + Code + '</td><td>' + Name + '</td><td>' + VkNo + '</td><td>' + Email + '</td><td>' + Country + '</td><td>' + Address + '</td><td><a id="editCustomer" href="/Customer/CreateCustomer/' + UserTableID + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td ></tr > ';

                $("#CustomerTable").append(tr);
                Modal1.modal('hide');
            } else {
                $('#CustomerTable').empty();
                FillOutList()

                Modal1.modal('hide');
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluþtu: " + errorThrown);
        }
    });
}


///sayfa açýldýðýnda listeyi oluþtur
$(document).ready(function () {

    FillOutList()

});


function FillOutList() {
    var C = 1;
    $.ajax({
        url: '/Customer/CustomerList/' + C + '',
        type: 'GET',
        dataType: 'json',
        success: function (Customers) {
            $.each(Customers, function (index, Customer) {
                addRow(Customer);
            });
            function addRow(Customer) {
                $('#CustomerTable').append('<tr><td>' + Customer.code + '</td><td>' + Customer.name + '</td><td>' + Customer.vkNo + '</td><td>' + Customer.email + '</td><td>' + Customer.country + '</td><td>' + Customer.address + '</td><td><a id="editCustomer" data-userTableId="' + Customer.userTableId + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

            }
        },
        error: function (xhr, status, error) {
            // Ýstek baþarýsýz olduðunda çalýþacak fonksiyon
            console.error('Hata:', status, error);
        }

    });

}
