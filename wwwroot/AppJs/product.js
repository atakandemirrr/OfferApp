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
    Modal1.load("/Product/CreateProduct/" + userTableId + "", function () {

        Modal1.modal('show');
    })
});



//modal içerisindeki kaydet butonuna týklayýnca
$(document).on('click', '#CreateProduct', async function () {
    var userTableId = $("#UserTableID").val();
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
    var Price = $("#Price").val();
    var Piece = $("#Piece").val();

    var CreateProduct = {
        CreateDate: CreateDate,
        CreateUser: CreateUser,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Code: Code,
        Name: Name,
        Price: Price,
        Piece: Piece
    };

    var UpdateProduct = {
        UserTableID: userTableId,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        Code: Code,
        Name: Name,
        Price: Price,
        Piece: Piece
    };

    var postData = userTableId ? UpdateProduct : CreateProduct;

    $.ajax({
        type: "POST",
        url: "/Product/CreateProduct",
        dataType: 'json',
        data: postData,
        success: function (response) {
            if (userTableId == 0) {
                var UserTableID = response;
                var tr = '<tr><td>' + Code + '</td><td>' + Name + '</td><td>' + Price + '</td><td>' + Piece + '</td><td><a id="editProduct" data-userTableId="' + UserTableID + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>';

                $("#ProductTable").append(tr);
                Modal1.modal('hide');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluþtu: " + errorThrown);
        }
    });
}

$(document).ready(function () {
    var J = 1;
    $.ajax({
        url: '/Product/ProductList/' + J + '',
        type: 'GET',
        dataType: 'json',
        success: function (Products) {
            $.each(Products, function (index, Product) {
                addRow(Product);
            });
            function addRow(Product) {
                $('#ProductTable tbody').append('<tr><td>' + Product.code + '</td><td>' + Product.name + '</td><td>' + Product.price + '</td><td>' + Product.piece + '</td><td><a id="editProduct" data-userTableId="' + Product.userTableId + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

            }
        },
        error: function (xhr, status, error) {
            // Ýstek baþarýsýz olduðunda çalýþacak fonksiyon
            console.error('Hata:', status, error);
        }

    });

  

});







