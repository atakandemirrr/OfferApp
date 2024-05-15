
///modal açma iþlemleri
var Modal1 = $('#MCreateCustomer');
var Modal = $('#ModalUploadCustomer');

$(document).on('click', '#btnUploadModal', async function () {

    Modal.load("/Customer/UploadCustomer", function () {

        Modal.modal('show');
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
                FillOutList();

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

    FillOutList();

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


//excelden yükleme yap sayfaya
$(document).on('change', '#excelFile', async function () {
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
                for (var colNum = range.s.c; colNum <= Math.min(range.e.c, 5); colNum++) {
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

///TABLODAN AL VERÝTABANINA KAYDET
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
    var data = [];
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
            rowData["VkNo"] = cells[2].innerText;
            rowData["Email"] = cells[3].innerText;
            rowData["Country"] = cells[4].innerText;
            rowData["Address"] = cells[5].innerText;
            /*  CreateRow(rowData);   */
            if (rowData["Code"] != "") {
                data.push(rowData);
            }

        }

        var jsonData = JSON.stringify(data);

        $.ajax({
            type: "POST",
            url: "/Customer/UploadCustomer",
            dataType: 'json',
            data: { customers: jsonData },
            success: function (response) {
                var sonuc = response;
                if (response == 1) {
                    $('#CustomerTable').empty();
                    FillOutList();
                    Modal.modal('hide');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Hata oluþtu: " + errorThrown);
            }
        });

    }

}