

///sayfa a��ld���nda listeyi olu�tur
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
                $('#OfferTable').append('<tr><td>' + Offer.customerCode + '</td><td>' + Offer.offerSeri + '</td><td>' + Offer.offerDate + '</td><td>' + Offer.total + '</td><td><a id="editProduct" data-userTableId="' + Product.userTableId + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

            }
        },
        error: function (xhr, status, error) {
            // �stek ba�ar�s�z oldu�unda �al��acak fonksiyon
            console.error('Hata:', status, error);
        }

    });

}

//teklif olu�turma sayfas�nda m��teri a��l�r kutusu doldur

$(document).ready(function () {
    var C = 2;
    $.ajax({
        url: '/Customer/CustomerList/' + C + '',
        type: 'GET',
        success: function (response) {
            // Sunucudan gelen JSON yan�t�n� al


            fillDropDown(response);
        },
        error: function (xhr, status, error) {
            console.error("Bir hata olu�tu: ", error);
        }
    });

});

// A��l�r kutuyu doldurma fonksiyonu
function fillDropDown(customers) {
    var select = $("#customerSelect");
    // Her bir stok i�in a��l�r kutuya bir se�enek ekle
    customers.forEach(function (customers) {
        select.append("<option value='" + customers.code + "'>" + customers.name + "</option>");
    });
}

//m��teri a��l�r kutusu de�i�ti�inde 
$(document).on('change', '#customerSelect', async function () {
    var C = 3;
    var Cod = $("#customerSelect").val();

    $.ajax({
        url: '/Customer/CustomerList/' + C + '/' + Cod + '',
        type: 'GET',
        success: function (response) {
            // A��l�r kutuyu doldurma
            customerInformation(response);
        },
        error: function (xhr, status, error) {
            console.error("Bir hata olu�tu: ", error);
        }
    });


});

function customerInformation(customers) {
    // customerInformation id'sine sahip div'i se�
    var customerInformationDiv = document.getElementById("customerInformation");

    // customerInformationDiv i�eri�ini temizle
    customerInformationDiv.innerHTML = '';



    // Yeni bir div olu�tur
    var newDiv = document.createElement("div");

    // ��eri�i ayarla
    customers.forEach(function (customer) {
        // Yeni bir div olu�tur
        var newDiv = document.createElement("div");

        // ��eri�i ayarla
        newDiv.innerHTML =
            '<h5 style="border-bottom: 2px solid black;">Musteri Bilgileri</h5>' +
            '<p style="margin-bottom:2px;">Kodu   :' + customer.code + ' </p>' +
            '<p style="margin-bottom:2px;">VkNo   :' + customer.vkNo + ' </p>' +
            '<p style="margin-bottom:2px;">Email  :' + customer.email + ' </p>' +
            '<p style="margin-bottom:2px;">Ukle   :' + customer.country + ' </p>' +
            '<p style="margin-bottom:2px;">Adresi :' + customer.address + ' </p>';

        // Yeni olu�turulan div'i customerInformationDiv'e ekle
        customerInformationDiv.appendChild(newDiv);
    });
}


// �r�n se� a��l�r kutusunu doldur
$(document).ready(function () {
    $.ajax({
        url: '/Product/ProductList/2',
        type: 'GET',
        success: function (response) {
       
            var select = $("#productSelect");
            // Her bir stok i�in a��l�r kutuya bir se�enek ekle
            response.forEach(function (response) {
                select.append("<option value='" + response.code + "'>" + response.name + "</option>");
            });

        },
        error: function (xhr, status, error) {
            console.error("Bir hata olu�tu: ", error);
        }
    });
});

