///modal alma işlemleri
var Modal1 = $('#MOfferSheet');

///sayfa açıldığında listeyi oluştur
$(document).ready(function () {

    FillOutList()

});

///liste doldurma
function FillOutList() {
    var O = 1;
    $.ajax({
        url: '/Offer/OfferList/' + O + '',
        type: 'GET',
        dataType: 'json',
        success: function (Offers) {
            $.each(Offers, function (index, Offer) {
                addRow(Offer);
            });
            function addRow(Offer) {
                $('#OfferTable').append('<tr><td>' + Offer.name + '</td><td>' + Offer.seriSira + '</td><td>' + Offer.offerDate + '</td><td>' + Offer.deliveryDate + '</td><td>' + Offer.total + '</td><td>' + '<a href="#" id="btnOpenModal" data-url="/Offer/OfferSheet/' + Offer.offerSira + '" data-zindex="1"> <i style="font-size: 24px;" class="icofont icofont-list"></i></a >' + '</td><td><a href="CreateOffer/' + Offer.offerSira + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

            }
        },
        error: function (xhr, status, error) {
            // İstek başarısız olduğunda çalışacak fonksiyon
            console.error('Hata:', status, error);
        }

    });

}

//teklif oluşturma sayfasında müşteri açılır kutusu doldur

$(document).ready(function () {
    var C = 2;
    $.ajax({
        url: '/Customer/CustomerList/' + C + '',
        type: 'GET',
        success: function (response) {
            // Sunucudan gelen JSON yanıtını al


            fillDropDown(response);
        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluştu: ", error);
        }
    });

});

// Müşteri Açılır kutuyu doldurma fonksiyonu
function fillDropDown(customers) {
    var select = $("#customerSelect");
    // Her bir stok için açılır kutuya bir seçenek ekle
    customers.forEach(function (customers) {
        select.append("<option value='" + customers.code + "'>" + customers.name + "</option>");
    });
}

//müşteri açılır kutusu değiştiğinde 
$(document).on('change', '#customerSelect', async function () {
    var C = 3;
    var Cod = $("#customerSelect").val();

    $.ajax({
        url: '/Customer/CustomerList/' + C + '/' + Cod + '',
        type: 'GET',
        success: function (response) {
            // Açılır kutuyu doldurma
            customerInformation(response);
        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluştu: ", error);
        }
    });


});

function customerInformation(customers) {
    // customerInformation id'sine sahip div'i seç
    var customerInformationDiv = document.getElementById("customerInformation");

    // customerInformationDiv içeriğini temizle
    customerInformationDiv.innerHTML = '';



    // Yeni bir div oluştur
    var newDiv = document.createElement("div");

    // İçeriği ayarla
    customers.forEach(function (customer) {
        // Yeni bir div oluştur
        var newDiv = document.createElement("div");

        // İçeriği ayarla
        newDiv.innerHTML =
            '<h5 style="border-bottom: 2px solid black;">Müşteri Bilgileri</h5>' +
            '<p style="margin-bottom:2px;">Kodu   :' + customer.code + ' </p>' +
            '<p style="margin-bottom:2px;">VkNo   :' + customer.vkNo + ' </p>' +
            '<p style="margin-bottom:2px;">Email  :' + customer.email + ' </p>' +
            '<p style="margin-bottom:2px;">Ukle   :' + customer.country + ' </p>' +
            '<p style="margin-bottom:2px;">Adresi :' + customer.address + ' </p>';

        // Yeni oluşturulan div'i customerInformationDiv'e ekle
        customerInformationDiv.appendChild(newDiv);
    });
}


// ürün seç açılır kutusunu doldur
$(document).ready(function () {
    $.ajax({
        url: '/Product/ProductList/2',
        type: 'GET',
        success: function (response) {

            var select = $("#productSelect");
            // Her bir stok için açılır kutuya bir seçenek ekle
            response.forEach(function (response) {
                select.append("<option value='" + response.code + "'>" + response.name + "</option>");
            });

        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluştu: ", error);
        }
    });
});


/*siprariş formu açılır kutudaki değer değiştiğinde*/
$("#productSelect").change(function () {
    var stockCode = $(this).val();
    FiyatGetir(stockCode)

});
/*stok seçildiğinde fiyat gelen */
function FiyatGetir(stockCode) {
    if (stockCode.trim() !== '') {
        $.ajax({
            url: '/Product/ProductList/3/' + stockCode + '',
            type: 'GET',
            success: function (response) {
                $("#stockPrice").val(response.price);
            },
            error: function (xhr, status, error) {
                console.error("Bir hata oluştu: ", error);
            }
        });

    } else {
        // Seçilen değer boş ise, fiyat alanını temizle
        $("#stockPrice").val('');
    }
}


/*adet değiştiğinde kullanılan*/
$("#quantity").change("input", function () {
    calculateTotal();
});

function calculateTotal() {

    var quantity = parseFloat($("#quantity").val());
    var stockPrice = parseFloat($("#stockPrice").val());

    // Eğer adet veya birim fiyat boşsa veya NaN ise, toplam alanını temizle
    if (isNaN(quantity) || isNaN(stockPrice)) {
        $("#total").val('');
        return;
    }

    // Toplamı hesapla ve total alanına yaz
    var total = quantity * stockPrice;
    $("#total").val(total.toFixed(2)); // İki ondalık basamakla sınırla
}


//ekle butonuna tılayınca çalışan işlemler veritabanına kayıt işlemi yapılıyor.
$(document).on('click', '#ekle', async function () {
    EkleIslemleri();
})


function EkleIslemleri() {
    var OfferDate = $("#OfferDate").val();
    var DeliveryDate = $("#DeliveryDate").val();
    var OfferSeri = $("#OfferSeri").val();
    var OfferSira = $("#OfferSira").val();
    var CustomerCode = $("#customerSelect").val();
    var Product = $("#productSelect").val();
    var ProductName = $("#productSelect").find('option:selected').text();
    var Price = $("#stockPrice").val();
    var Piece = $("#quantity").val();
    var Total = $("#total").val();
    var CreateDate = $("#CreateDate").val();
    var UpdateDate = $("#CreateDate").val();
    var Statu = "0";
    var CreateUser = $("#CreateUser").val();
    var UpdateUser = $("#CreateUser").val();

    var data = {
        CreateDate: CreateDate,
        CreateUser: CreateUser,
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        OfferDate: OfferDate,
        DeliveryDate: DeliveryDate,
        OfferSeri: OfferSeri,
        OfferSira: OfferSira,
        CustomerCode: CustomerCode,
        ProductCode: Product,
        Piece: Piece,
        Price: Price,
        Total: Total,
        Statu: Statu


    };
    var jsonData = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: "/Offer/CreateOffer",

        dataType: 'json',
        data: { offerrow: jsonData },
        success: function (response) {
            var UserTableID = response;
            //tablo satırları oluşturuluyor
            var tr = '<tr><td>' + Product + '</td><td>' + ProductName + '</td><td>' + Piece + '</td><td>' + Price + '</td><td>' + Total + '</td><td><button id="silButton" readonly   data-usertableid="' + UserTableID + '" class="badge bg-danger text-white">Sil</button></td><td><td><a id="editOffer" data-userTableIdedit="' + UserTableID + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>';
            $("#OfferRowTable").append(tr);
            //alanları temizle
            $("#productSelect").val("");
            $("#stockPrice").val("");
            $("#total").val("");
            $("#quantity").val("");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluştu: " + errorThrown);
        }
    });
}




//form açıldığında sıra alanını bul getir - seri sira alanını yaz
$(document).ready(function () {
    var deger = $("#OfferSeri").val();


    if (typeof deger !== 'undefined') {
        if (deger == '') {
            $.ajax({
                url: '/Offer/OfferSira',
                type: 'GET',
                success: function (response) {
                    $("#OfferSira").val(response);
                    $("#OfferSeri").val('ABC');
                    var metin = 'Teklif Seri - Sira : ABC - ' + response + '';
                    const hElement = document.getElementById("serisira");
                    hElement.textContent = metin;

                },
                error: function (xhr, status, error) {
                    console.error("Bir hata oluştu: ", error);
                }
            });
        } else {

            var sira = $("#OfferSira").val();
            var metin = 'Teklif Seri - Sira : ABC - ' + sira + '';
            const hElement = document.getElementById("serisira");
            hElement.textContent = metin;
        }
    }



})


//form açıldığında ekle - güncelle butonları ile ilgili işelmler  
$(document).ready(function () {
    btnselection();
});

function btnselection() {

    var btnscm = $('#BtnSecim').val();
    var btnArea = $('#btnArea');

    if (btnscm == "0") {
        btnArea.append('<button style="width: 100%;" id="ekle" class="btn btn-primary" readonly>Ekle</button>');
    } else {
        btnArea.append('<button type="hidden" style="width: 100%;" id="update" class="btn btn-primary" readonly>Güncelle</button>');
    }
}

//edit butonuna tılayınca çalışan işlemler.
$(document).on('click', '#editOffer', async function () {
    var UserTableID = $(this).attr("data-userTableIdedit");
    var tr = $(this).closest("tr");
    currentRow = tr;
    // Satırdaki verileri al
    var stokKodu = tr.find("td:eq(0)").text();
    var adet = tr.find("td:eq(2)").text();
    var fiyat = tr.find("td:eq(3)").text();
    var toplam = tr.find("td:eq(4)").text();


    // Form alanlarına verileri yaz
    $("#productSelect").val(stokKodu);
    $("#quantity").val(adet);
    $("#stockPrice").val(fiyat);
    $("#total").val(toplam);
    $("#BtnSecim").val(UserTableID);
    $('#btnArea').empty();
    btnselection();
});

$(document).on('click', '#update', async function () {
    //güncellenmiş veriler
    var UserTableID = $(this).attr("data-userTableIdedit");
    var Product = $("#productSelect").val();
    var ProductName = $("#productSelect").find('option:selected').text();
    var Price = $("#stockPrice").val();
    var Piece = $("#quantity").val();
    var Total = $("#total").val();
    var UpdateDate = $("#CreateDate").val();
    var UpdateUser = $("#CreateUser").val();

    var data = {
        UpdateDate: UpdateDate,
        UpdateUser: UpdateUser,
        ProductCode: Product,
        Piece: Piece,
        Price: Price,
        Total: Total
    };
    var jsonData = JSON.stringify(data);


    $.ajax({
        url: '/Offer/EditOffer',
        type: 'Post',
        data: { offerrow: jsonData },
        success: function (response) {
            // İlgili satırdaki verileri güncelle
            currentRow.find("td:eq(0)").text(Product);
            currentRow.find("td:eq(1)").text(ProductName);
            currentRow.find("td:eq(2)").text(Piece);
            currentRow.find("td:eq(3)").text(Price);
            currentRow.find("td:eq(4)").text(Total);
            $("#BtnSecim").val(UserTableID);
            $('#btnArea').empty();
            btnselection();

            $("#productSelect").val("");
            $("#stockPrice").val("");
            $("#total").val("");
            $("#quantity").val("");

        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluştu: ", error);
        }
    });
});


/*Sil butonuna tıklayınca*/
$(document).on('click', '#silButton', async function () {
    //güncellenmiş veriler
    var UserTableID = $(this).attr("data-usertableid");


    $.ajax({
        url: '/Offer/RowDeleteOffer/' + UserTableID + '',
        type: 'Post',

        success: function () {
            var element = $('[data-usertableid="' + UserTableID + '"]')[0]; // jQuery ile elementi seç
            if (element) {
                var parentElement = element.parentNode; // Birinci üst elementi bul
                if (parentElement) {
                    var grandparentElement = parentElement.parentNode; // İkinci üst elementi bul
                    if (grandparentElement) {
                        grandparentElement.remove(); // İkinci üst elementi kaldır
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluştu: ", error);
        }
    });
});

///yazdırma işlemi
function printModalBody() {
    var printContents = document.getElementById('modal-body-content').innerHTML;
    var originalContents = document.body.innerHTML; 
    document.body.innerHTML = printContents;
     window.print();   
    document.body.innerHTML = originalContents;
    location.reload();

    
}

/////İndire İşlemleri

function generatePDF() {
    var element = document.getElementById('modal-body-content');

    html2canvas(element, {
        scale: 2
    }).then(canvas => {
        var imgData = canvas.toDataURL('image/png');
        var pdf = new jsPDF('p', 'mm', 'a4');
        var imgWidth = 210;
        var pageHeight = 297;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;

        var position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save('siparis_formu.pdf');
    });
}
