using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfferApp.Models;

namespace OfferApp.Controllers
{
    //[Authorize]
    public class CustomerController : Controller
    {
        public readonly DataContext _context;

        public CustomerController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult CustumerList()
        {
            var CustomerList = _context.Customers.ToList();
            return View(CustomerList);
        }



        [Route("Customer/CreateCustomer")]
        [Route("Customer/CreateCustomer/{CustomerId}")]
        public PartialViewResult CreateCustomer(int CustomerId=0)
        {
            ViewModels.VMCustomers model = new ViewModels.VMCustomers();
            if (CustomerId != 0)
                model.Customer = _context.Customers.Where(x => x.UserTableId == CustomerId).FirstOrDefault();
             

            return PartialView("Subpages/_CreateCustomer", model);
        }
        


     
    }
}
