using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfferApp.Models;
using System.Diagnostics.Metrics;
using System.Net;

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
        public IActionResult CustomerList()
        {
            var CustomerList = _context.Customers.ToList();
            return View(CustomerList);
        }


        [HttpPost]
        public JsonResult CustomerList(Customer A)
        {
            if (A.UserTableId != 0)
            {
                var customer = _context.Customers.Where(o => o.UserTableId == A.UserTableId);
                if (customer.Any())
                {
                    foreach (var C in customer)
                    {
                        C.UpdateDate = A.UpdateDate;
                        C.UpdateUser = A.UpdateUser;
                        C.Code = A.Code;
                        C.Name = A.Name;
                        C.VkNo = A.VkNo;
                        C.Email = A.Email;
                        C.Country = A.Country;
                        C.Address = A.Address;


                    }
                    _context.SaveChanges();

                    return Json("");
                }

            }


            var Customer = new Customer
            {
                CreateDate = A.CreateDate,
                CreateUser = A.CreateUser,
                UpdateDate = A.UpdateDate,
                UpdateUser = A.UpdateUser,
                Code = A.Code,
                Name = A.Name,
                VkNo = A.VkNo,
                Email = A.Email,
                Country = A.Country,
                Address = A.Address
            };


            _context.Customers.Add(Customer);
            _context.SaveChanges();

            // Eklenen son kaydın UserTableId değerini almak için:
            var lastRecord = _context.Customers.OrderByDescending(o => o.UserTableId).FirstOrDefault(o => o.CreateUser == A.CreateUser);
            int userTableId = lastRecord.UserTableId;

            return Json(userTableId.ToString());

        }



        [Route("Customer/CreateCustomer")]
        [Route("Customer/CreateCustomer/{CustomerId}")]
        public PartialViewResult CreateCustomer(int CustomerId = 0)
        {
            ViewModels.VMCustomers model = new ViewModels.VMCustomers();
            if (CustomerId != 0)
                model.Customer = _context.Customers.Where(x => x.UserTableId == CustomerId).FirstOrDefault();


            return PartialView("Subpages/_CreateCustomer", model);
        }




    }
}
