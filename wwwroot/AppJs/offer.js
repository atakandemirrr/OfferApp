

///sayfa açýldýðýnda listeyi oluþtur
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
                $('#OfferTable').append('<tr><td>' + Offer.name + '</td><td>' + Offer.seriSira + '</td><td>' + Offer.offerDate + '</td><td>' + Offer.deliveryDate + '</td><td>' + Offer.total + '</td><td><a id="editProduct" data-userTableId="" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

            }
        },
        error: function (xhr, status, error) {
            // Ýstek baþarýsýz olduðunda çalýþacak fonksiyon
            console.error('Hata:', status, error);
        }

    });

}

//teklif oluþturma sayfasýnda müþteri açýlýr kutusu doldur

$(document).ready(function () {
    var C = 2;
    $.ajax({
        url: '/Customer/CustomerList/' + C + '',
        type: 'GET',
        success: function (response) {
            // Sunucudan gelen JSON yanýtýný al


            fillDropDown(response);
        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluþtu: ", error);
        }
    });

});

// Açýlýr kutuyu doldurma fonksiyonu
function fillDropDown(customers) {
    var select = $("#customerSelect");
    // Her bir stok için açýlýr kutuya bir seçenek ekle
    customers.forEach(function (customers) {
        select.append("<option value='" + customers.code + "'>" + customers.name + "</option>");
    });
}

//müþteri açýlýr kutusu deðiþtiðinde 
$(document).on('change', '#customerSelect', async function () {
    var C = 3;
    var Cod = $("#customerSelect").val();

    $.ajax({
        url: '/Customer/CustomerList/' + C + '/' + Cod + '',
        type: 'GET',
        success: function (response) {
            // Açýlýr kutuyu doldurma
            customerInformation(response);
        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluþtu: ", error);
        }
    });


});

function customerInformation(customers) {
    // customerInformation id'sine sahip div'i seç
    var customerInformationDiv = document.getElementById("customerInformation");

    // customerInformationDiv içeriðini temizle
    customerInformationDiv.innerHTML = '';



    // Yeni bir div oluþtur
    var newDiv = document.createElement("div");

    // Ýçeriði ayarla
    customers.forEach(function (customer) {
        // Yeni bir div oluþtur
        var newDiv = document.createElement("div");

        // Ýçeriði ayarla
        newDiv.innerHTML =
            '<h5 style="border-bottom: 2px solid black;">Musteri Bilgileri</h5>' +
            '<p style="margin-bottom:2px;">Kodu   :' + customer.code + ' </p>' +
            '<p style="margin-bottom:2px;">VkNo   :' + customer.vkNo + ' </p>' +
            '<p style="margin-bottom:2px;">Email  :' + customer.email + ' </p>' +
            '<p style="margin-bottom:2px;">Ukle   :' + customer.country + ' </p>' +
            '<p style="margin-bottom:2px;">Adresi :' + customer.address + ' </p>';

        // Yeni oluþturulan div'i customerInformationDiv'e ekle
        customerInformationDiv.appendChild(newDiv);
    });
}


// ürün seç açýlýr kutusunu doldur
$(document).ready(function () {
    $.ajax({
        url: '/Product/ProductList/2',
        type: 'GET',
        success: function (response) {

            var select = $("#productSelect");
            // Her bir stok için açýlýr kutuya bir seçenek ekle
            response.forEach(function (response) {
                select.append("<option value='" + response.code + "'>" + response.name + "</option>");
            });

        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluþtu: ", error);
        }
    });
});


/*siprariþ formu açýlýr kutudaki deðer deðiþtiðinde*/
$("#productSelect").change(function () {
    var stockCode = $(this).val();
    FiyatGetir(stockCode)

});
/*stok seçildiðinde fiyat gelen */
function FiyatGetir(stockCode) {
    if (stockCode.trim() !== '') {
        $.ajax({
            url: '/Product/ProductList/3/' + stockCode + '',
            type: 'GET',
            success: function (response) {
                $("#stockPrice").val(response.price);
            },
            error: function (xhr, status, error) {
                console.error("Bir hata oluþtu: ", error);
            }
        });

    } else {
        // Seçilen deðer boþ ise, fiyat alanýný temizle
        $("#stockPrice").val('');
    }
}


/*adet deðiþtiðinde kullanýlan*/
$("#quantity").change("input", function () {
    calculateTotal();
});

function calculateTotal() {

    var quantity = parseFloat($("#quantity").val());
    var stockPrice = parseFloat($("#stockPrice").val());

    // Eðer adet veya birim fiyat boþsa veya NaN ise, toplam alanýný temizle
    if (isNaN(quantity) || isNaN(stockPrice)) {
        $("#total").val('');
        return;
    }

    // Toplamý hesapla ve total alanýna yaz
    var total = quantity * stockPrice;
    $("#total").val(total.toFixed(2)); // Ýki ondalýk basamakla sýnýrla
}


//ekle butonuna týlayýnca çalýþan iþlemler veritabanýna kayýt iþlemi yapýlýyor.
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
            //tablo satýrlarý oluþturuluyor
            var tr = '<tr><td>' + ProductName + '</td><td>' + Piece + '</td><td>' + Price + '</td><td>' + Total + '</td><td><button id="silButton" readonly   data-usertableid="' + UserTableID + '" class="badge bg-danger text-white">Sil</button></td><td><td><a id="editOffer" data-userTableIdedit="' + UserTableID + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>';
            $("#OfferRowTable").append(tr);
            //alanlarý temizle
            $("#productSelect").val("");
            $("#stockPrice").val("");
            $("#total").val("");
            $("#quantity").val("");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluþtu: " + errorThrown);
        }
    });
}




//form açýldýðýnda sýra alanýný bul getir - seri sira alanýný yaz
$(document).ready(function () {

    $.ajax({
        url: '/Offer/OfferSira',
        type: 'GET',
        success: function (response) {
            $("#OfferSira").val(response);
            var metin = 'Teklif Seri - Sira : ABC - ' + response + '';
            const hElement = document.getElementById("serisira");
            hElement.textContent = metin;

        },
        error: function (xhr, status, error) {
            console.error("Bir hata oluþtu: ", error);
        }
    });

})


//form açýldýðýnda ekle - güncelle butonlarý ile ilgili iþelmler  
$(document).ready(function () {
    btnselection();
});

function btnselection() {

    var btnscm = $('#BtnSecim').val();
    var btnArea = $('#btnArea');

    if (btnscm == "0") {
        btnArea.append('<button style="width: 100%;" id="ekle" class="btn btn-primary" readonly>Ekle</button>');
    } else {
        btnArea.append('<button type="hidden" style="width: 100%;" id="update" class="btn btn-primary" readonly>Guncelle</button>');
    }
}

//edit butonuna týlayýnca çalýþan iþlemler veritabanýna kayýt iþlemi yapýlýyor.
$(document).on('click', '#editOffer', async function () {
    var UserTableID = $(this).attr("data-userTableIdedit");

    $.ajax({
        type: "GET",
        url: '/Offer/EditOffer/' + UserTableID + '',

        dataType: 'json',
        success: function (response) {
            $("#productSelect").val(response.product);
            $("#stockPrice").val(response.price);
            $("#total").val(response.total);
            $("#quantity").val(response.piece);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluþtu: " + errorThrown);
        }
    });
})