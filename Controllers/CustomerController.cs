using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfferApp.Models;
using System.Diagnostics.Metrics;
using System.Net;

namespace OfferApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CustomerController : Controller
    {
        public readonly DataContext _context;

        public CustomerController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Customer/CustomerList")]
        [Route("Customer/CustomerList/{C}")]
        [Route("Customer/CustomerList/{C}/{Cod}")]
        public IActionResult CustomerList(int C, string? Cod)
        {
            var CustomerList = _context.Customers.ToList();
            if (C == 1)
                return Json(CustomerList);
            if (C == 2)
            {
                var SelectItems = _context.Customers.Select(customer => new { Code = customer.Code, Name = customer.Name }).ToList();
                return Json(SelectItems);
            }
            if (C == 3)
            {
                var customerInformation = _context.Customers.Where(o => o.Code == Cod);
                return Json(customerInformation);
            }
            return View();
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
            else
            {


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
            return Json("");

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

        [HttpGet]
        [Route("Customer/UploadCustomer")]
        public PartialViewResult UploadCustomer()
        {

            return PartialView("Subpages/_UploadCustomer");

        }

        [HttpPost]
        public IActionResult UploadCustomer(string customers)
        {
            var CustomerList = _context.Customers.ToList();
            List<Customer> cus = JsonConvert.DeserializeObject<List<Customer>>(customers);
            if (cus.Count > 0)
            {
                foreach (var P in cus)
                {
                    var TableId = _context.Customers.Where(o => o.Code == P.Code).Select(o => o.UserTableId).ToList();
                    if (TableId.Count == 0)
                    {
                        _context.Customers.Add(P);
                        _context.SaveChanges();
                    }

                }
                return Json("1");
            }
            else
            {
                return Json(new { success = false });
            }

        }


    }
}
