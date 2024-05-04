
/*siprariş formu için 08.04.2024 tarihind Atakan yaptı*/
$("#stockSelect").change(function () {
    var stockCode = $(this).val();
    FiyatGetir(stockCode)

});
/*stok seçildiğinde fiyat gelen */
function FiyatGetir(stockCode) {
    if (stockCode.trim() !== '') {
        $.get("/Order/ProductSelection", { stockCode: stockCode }, function (data) {

            $("#stockPrice").val(data);
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
    var stokSelect = $("#stockSelect").val();
    var birimfiyat = $("#stockPrice").val();
    var adet = $("#quantity").val();
    var toplam = $("#total").val();
    var CreateDate = $("#CreDate").val();
    var UpdateDate = $("#CreDate").val();
    var CariKod = $("#CariKod").val();
    var SipSira = $("#SipSira").val();
    var SipSeri = $("#SipSeri").val();
    var Statu = $("#Statu").val();
    var SipTrh = $("#SipTrh").val();
    var TesTrh = $("#TesTrh").val();

    var data = {
        stok: stokSelect,
        birimFiyat: birimfiyat,
        adet: adet,
        toplam: toplam,
        CreateDate: CreateDate,
        UpdateDate: UpdateDate,
        OrderDate: SipTrh,
        DeliveryDate: TesTrh,
        CariKod: CariKod,
        SipSira: SipSira,
        SipSeri: SipSeri,
        Statu: Statu

    };


    $.ajax({
        type: "POST",
        url: "/Order/CreateOrder",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (response) {
            var UserTableID = response;
            //tablo satırları oluşturuluyor
            var tr = '<tr><td>' + stokSelect + '</td><td>' + adet + '</td><td>' + birimfiyat + '</td><td>' + toplam + '</td><td><button id="silButton" readonly   data-usertableid="' + UserTableID + '" class="badge bg-danger text-white">Sil</button></td></tr>';
            $("#SipTable").append(tr);
            //alanları temizle
            $("#stockSelect").val("");
            $("#stockPrice").val("");
            $("#total").val("");
            $("#quantity").val("");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Hata oluştu: " + errorThrown);
        }
    });
}



$(document).ready(function () {
    // AJAX isteği gönderme
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/Stoklar/EditOrderDropdown", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Sunucudan gelen JSON yanıtını al
            var stocks = JSON.parse(xhr.responseText);

            // Açılır kutuyu doldurma
            fillDropDown(stocks);
        }
    };
    xhr.send();
});

// Açılır kutuyu doldurma fonksiyonu
function fillDropDown(stocks) {
    var select = $("#stockSelect");
    // Her bir stok için açılır kutuya bir seçenek ekle
    stocks.forEach(function (stock) {
        select.append("<option value='" + stock.stokKodu + "'>" + stock.stokAdi + "</option>");
    });
}



//sil butonuna tılayınca çalışan işlemler veritabanındam silme işlemi yapılıyor.

$(document).on('click', '#silButton', async function () {
    var userTableId = $(this).attr("data-usertableid");
    var button = $(this);
    SilIslemleri(userTableId);
})

function SilIslemleri(userTableId) {
    $.ajax({
        type: "POST",
        url: "/Order/DeleteOrder",
        data: { UserTableID: userTableId },
        success: function (response) {

            console.log("Silme işlemi başarılı.");

            var element = $('[data-usertableid="' + userTableId + '"]')[0]; // jQuery ile elementi seç
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
        error: function (xhr, textStatus, errorThrown) {

            console.log("Hata oluştu: " + errorThrown);
        }
    });
}

//oanaya gönder butonuna tılayınca çalışan işlemler veritabanında update işlemi yapılıyor.

$(document).on('click', '#onayGonderme', async function () {
    var SipSira = $("#SipSira").val();
    var Statu = $(this).attr("data-statu");

    StatuUpdate(SipSira, Statu);
})

function StatuUpdate(SipSira, Statu) {
    $.ajax({
        type: "POST",
        url: "/Order/OrderStatuUpdate",
        data: { SipSira: SipSira, Statu: Statu },
        success: function (response) {

            Swal.fire({
                position: 'top-bottom',
                icon: 'success',
                title: "Siparişiniz Onaya Gönderilmiştir.",
                showConfirmButton: false,
                timer: 15000
            })

        },
        error: function (xhr, textStatus, errorThrown) {

            console.log("Hata oluştu: " + errorThrown);
        }
    });
}
///yazdırma işlemi
$(document).on('click', '#btnprint', async function () {

    printDiv2();
})


function printDiv2() {
    /*style css içerisinde printableArea id sini içeren alanı kapat ondan dolayı çalışmıyor*/
    var printContents = document.getElementById('bodyContent').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    setTimeout(function () {
        window.print();
        document.body.innerHTML = originalContents;
    }, 500);
}

/////indirme işlemi
//$(document).on('click', '#indirmeButonu', async function () {

//    convertToPDF();
//})

//function convertToPDF() {
//    // HTML içeriğini al
//    const sayfaHtml = document.documentElement.outerHTML;

//    // Yeni bir jsPDF nesnesi oluştur
//    var doc = new jsPDF();

//    // HTML içeriğini PDF'e dönüştür
//    doc.html(sayfaHtml, {
//        callback: function (doc) {
//            // PDF'i indir
//            doc.save("sayfa.pdf");
//        }
//    });
//}

//function dow() {
//    //burada css ve js leri almıyor bunu kontrol et
//    const sayfaHtml = document.documentElement.outerHTML;


//    const dosyaAdı = 'sayfa.html';
//    const dosyaIcerigi = new Blob([sayfaHtml], { type: 'text/html' });

//    const link = document.createElement('a');
//    link.href = URL.createObjectURL(dosyaIcerigi);
//    link.download = dosyaAdı;
//    link.click();

//}

// modal açma işlemi orders viewden order sheetteki viewı aç
//$(document).on('click', '#openModal1905', async function () {

//    openModal222();
//})
//function openModal222() {
//    // Modalı bul
//    var modal = document.getElementById("exampleModal");
//     // Modalı göster
//    modal.style.display = "block";
  
//}


$(document).on('click', '#openModalButton', async function () {
    $('#exampleModal').modal('show');
})









