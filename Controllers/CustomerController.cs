using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfferApp.Models;

namespace OfferApp.Controllers
{
    [Authorize]
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
            return Json(CustomerList);
        }
    }
}
