var Modal1 = $('#MCreateCustomer');
$(document).on('click', '#btnCreateCustomer', async function () {
   
    Modal1.load("/Customer/CreateCustomer", function () {

        Modal1.modal('show');
    })


});