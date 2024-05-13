var Modal1 = $('#ModalCreateOffer');


///sayfa açýldýðýnda listeyi oluþtur
$(document).ready(function () {

    FillOutList()

});


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
            // Ýstek baþarýsýz olduðunda çalýþacak fonksiyon
            console.error('Hata:', status, error);
        }

    });

}