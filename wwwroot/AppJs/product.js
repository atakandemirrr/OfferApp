var Modal1 = $('#ModalCreateProduct');

//sayfadaki modalý açmak için yapýldý ancak global js deki function u kullanýyorum.
$(document).on('click', '#btnCreateCustomer', async function () {
   
    Modal1.load("/Product/CreateCustomer", function () {

        Modal1.modal('show');
    })
});

///düzenle butonuna týklayýnca gelir
$(document).on('click', '#editProduct', async function () {
    var userTableId = $(this).attr("data-userTableId");
    Modal1.load("/Product/CreateProduct/"+ userTableId + "", function () {

        Modal1.modal('show');
    })
});



//modal içerisindeki kaydet butonuna týklayýnca
$(document).on('click', '#CreateProduct', async function () {
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
    var Price = $("#Price").val();
    var Piece = $("#Piece").val();

   

    var Product = {
        CreateDate: CreateDate,
        CreateUser: CreateUser,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Code: Code,
        Name: Name,
        Price: Price,
        Piece: Piece
    };

       
    $.ajax({
        type: "POST",
        url: "/Product/CreateProduct",
        dataType: 'json',
        data: Product,
        success: function (response) {
            var UserTableID = response;
            //tablo satýrlarý oluþturuluyor
            var tr = '<tr><td>' + Code + '</td><td>' + Name + '</td><td>' + Price + '</td><td>' + Piece + '</td><td><a id="editProduct" href="/Product/CreateProduct/' + UserTableID + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td ></tr > ';
            
            $("#ProductTable").append(tr);
            Modal1.modal('hide');

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluþtu: " + errorThrown);
        }
    });
}



function UpdateIslemleri() {
  
    var UpdateDate = $("#CreateDate").val();
    var UpdateUser = $("#CreateUser").val();
    var Code = $("#Code").val();
    var Name = $("#Name").val();
    var Price = $("#Price").val();
    var Piece = $("#Piece").val();



    var Product = {
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Code: Code,
        Name: Name,
        Price: Price,
        Piece: Piece
    };



    $.ajax({
        type: "POST",
        url: "/Product/CreateProduct",
        dataType: 'json',
        data: Product,
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