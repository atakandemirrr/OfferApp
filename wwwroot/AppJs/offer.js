

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
                $('#OfferTable').append('<tr><td>' + Offer.customerCode + '</td><td>' + Offer.offerSeri + '</td><td>' + Offer.offerDate + '</td><td>' + Offer.total + '</td><td><a id="editProduct" data-userTableId="' + Product.userTableId + '" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></a></td></tr>');

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

//// tabloyu oluþtur grid için
$(document).ready(function () {
    $("#jsGrid").jsGrid({
        height: "70%",
        width: "100%",
        editing: true,
        autoload: true,
        paging: true,
        deleteConfirm: function (item) {
            return "The client \"" + item.Name + "\" will be removed. Are you sure?";
        },
        rowClick: function (args) {
            showDetailsDialog("Edit", args.item);
        },
        controller: db,
        fields: [
            { name: "Name", type: "text", width: 150 },
            { name: "Age", type: "number", width: 50 },
            { name: "Address", type: "text", width: 200 },
            { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
            { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
            {
                type: "control",
                modeSwitchButton: false,
                editButton: false,
                headerTemplate: function () {
                    return $("<button>").attr("type", "button").text("Add")
                        .on("click", function () {
                            showDetailsDialog("Add", {});
                        });
                }
            }
        ]
    });

    $("#detailsDialog").dialog({
        autoOpen: false,
        width: 400,
        close: function () {
            $("#detailsForm").validate().resetForm();
            $("#detailsForm").find(".error").removeClass("error");
        }
    });

    $("#detailsForm").validate({
        rules: {
            name: "required",
            age: { required: true, range: [18, 150] },
            address: { required: true, minlength: 10 },
            country: "required"
        },
        messages: {
            name: "Please enter name",
            age: "Please enter valid age",
            address: "Please enter address (more than 10 chars)",
            country: "Please select country"
        },
        submitHandler: function () {
            formSubmitHandler();
        }
    });

    var formSubmitHandler = $.noop;

    var showDetailsDialog = function (dialogType, client) {
        $("#name").val(client.Name);
        $("#age").val(client.Age);
        $("#address").val(client.Address);
        $("#country").val(client.Country);
        $("#married").prop("checked", client.Married);

        formSubmitHandler = function () {
            saveClient(client, dialogType === "Add");
        };

        $("#detailsDialog").dialog("option", "title", dialogType + " Client")
            .dialog("open");
    };

    var saveClient = function (client, isNew) {
        $.extend(client, {
            Name: $("#name").val(),
            Age: parseInt($("#age").val(), 10),
            Address: $("#address").val(),
            Country: parseInt($("#country").val(), 10),
            Married: $("#married").is(":checked")
        });

        $("#jsGrid").jsGrid(isNew ? "insertItem" : "updateItem", client);

        $("#detailsDialog").dialog("close");
    };
});

/*http://js-grid.com/demos/data-manipulation.html incele*/