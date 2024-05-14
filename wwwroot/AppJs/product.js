var Modal1 = $('#ModalCreateProduct');
var Modal = $('#ModalUploadProduct');

//sayfadaki modalý açmak için yapýldý ancak global js deki function u kullanýyorum.
$(document).on('click', '#btnUploadModal', async function () {
    Modal.modal('show');
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
            else {
                $('#ProductTable').empty();
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
                $('#ProductTable').append('<tr><td>' + Product.code + '</td><td>' + Product.name + '</td><td>' + Product.price + '</td><td>' + Product.piece + '</td><td><a id="editProduct" data-userTableId="' + Product.userTableId + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

            }
        },
        error: function (xhr, status, error) {
            // Ýstek baþarýsýz olduðunda çalýþacak fonksiyon
            console.error('Hata:', status, error);
        }

    });

}

$('#excelFile').change(function (e) {
    excelDosyaYukle();
});
function excelDosyaYukle() {
    var input = $('#excelFile')[0];
    if (input.files && input.files[0]) {
        var file = input.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var sheetName = workbook.SheetNames[0];
            var sheet = workbook.Sheets[sheetName];

            // Excel tablosundan sadece ilk 4 sütunu al
            var html = "";
            var range = XLSX.utils.decode_range(sheet['!ref']);
            for (var rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
                html += "<tr>";
                for (var colNum = range.s.c; colNum <= Math.min(range.e.c, 3); colNum++) {
                    var cellAddress = { c: colNum, r: rowNum };
                    var cellRef = XLSX.utils.encode_cell(cellAddress);
                    var cell = sheet[cellRef];
                    var cellValue = cell ? cell.v : '';
                    html += "<td>" + cellValue + "</td>";
                }
                html += "</tr>";
            }


            $('#excelData').html(html);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Lütfen bir dosya seçin.');
    }
}

$(document).on('click', '#upload', async function () {
    tablodanVeriAl();
});
function tablodanVeriAl() {
    var CreateDate = $("#CreateDate").val();
    var CreateUser = $("#CreateUser").val();
    var UpdateDate = $("#CreateDate").val();
    var UpdateUser = $("#CreateUser").val();
    var table = document.getElementById("excelData");
    var rows = table.getElementsByTagName("tr");
 
    if (rows.length != 0) {
        for (var i = 0; i < rows.length; i++) {
            var rowData = {};
            var cells = rows[i].getElementsByTagName("td");
            rowData["CreateDate"] = CreateDate;
            rowData["CreateUser"] = CreateUser;
            rowData["UpdateDate"] = UpdateDate;
            rowData["UpdateUser"] = UpdateUser;
            rowData["Code"] = cells[0].innerText;
            rowData["Name"] = cells[1].innerText;
            rowData["Price"] = cells[2].innerText;
            rowData["Piece"] = cells[3].innerText;
            CreateRow(rowData); 
         

        }
        function CreateRow(rowData) {
            $.ajax({
                type: "POST",
                url: "/Product/UploadProduct",
                dataType: 'json',
                data: rowData,
                success: function (response) {

                    //$('#ProductTable').empty();
                    //FillOutList()

                    //Modal.modal('hide');

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log("Hata oluþtu: " + errorThrown);
                }
            });
        }
    }

}







