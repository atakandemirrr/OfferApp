using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfferApp.Models;
using OfferApp.ViewModels;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace OfferApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ProductController : Controller
    {
        public readonly DataContext _context;

        public ProductController(DataContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("Product/ProductList")]
        [Route("Product/ProductList/{P}")]
        [Route("Product/ProductList/{P}/{Cod}")]
        public IActionResult ProductList(int P = 0, string Cod = "")
        {

            var ProductList = _context.Products.ToList();
            if (P == 1)
                return Json(ProductList);
            if (P == 2)
            {
                var SelectItems = _context.Products.Select(product => new { Code = product.Code, Name = product.Name }).ToList();
                return Json(SelectItems);
            }
            if (P == 3)
            {
                var SelectPrice = _context.Products
                                            .Where(p => p.Code == Cod)
                                            .Select(product => new { Price = product.Price })
                                            .FirstOrDefault();
                return Json(SelectPrice);
            }
            return View();
        }

        [HttpGet]
        [Route("Product/CreateProduct")]
        [Route("Product/CreateProduct/{ProductID}")]
        public PartialViewResult CreateProduct(int ProductID = 0)
        {
            ViewModels.VMProduct model = new ViewModels.VMProduct();
            if (ProductID != 0)
                model.Product = _context.Products.Where(x => x.UserTableId == ProductID).FirstOrDefault();


            return PartialView("Subpages/_CreateProduct", model);

        }

        [HttpGet]
        [Route("Product/UploadProduct")]
        public PartialViewResult UploadProduct()
        {

            return PartialView("Subpages/_UploadProduct");

        }


        [HttpPost]
        public IActionResult UploadProduct(string products)
        {
            var ProductList = _context.Products.ToList();
            List<Product> pro = JsonConvert.DeserializeObject<List<Product>>(products);
            if (pro.Count > 0)
            {
                foreach (var P in pro)
                {
                    var TableId = _context.Products.Where(o => o.Code == P.Code).Select(o => o.UserTableId).ToList();
                    if (TableId.Count == 0)
                    {
                        _context.Products.Add(P);
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



        [HttpPost]
        public JsonResult CreateProduct(Product A)
        {
            if (A.UserTableId != 0)
            {
                var product = _context.Products.Where(o => o.UserTableId == A.UserTableId);
                if (product.Any())
                {
                    foreach (var P in product)
                    {
                        P.UpdateDate = A.UpdateDate;
                        P.UpdateUser = A.UpdateUser;
                        P.Code = A.Code;
                        P.Name = A.Name;
                        P.Price = A.Price;
                        P.Piece = A.Piece;


                    }
                    _context.SaveChanges();

                    return Json("");
                }

            }
            else
            {
                var Product = new Product
                {
                    CreateDate = A.CreateDate,
                    CreateUser = A.CreateUser,
                    UpdateDate = A.UpdateDate,
                    UpdateUser = A.UpdateUser,
                    Code = A.Code,
                    Name = A.Name,
                    Price = A.Price,
                    Piece = A.Piece
                };


                _context.Products.Add(Product);
                _context.SaveChanges();

                // Eklenen son kaydın UserTableId değerini almak için:
                var lastRecord = _context.Products.OrderByDescending(o => o.UserTableId).FirstOrDefault(o => o.CreateUser == A.CreateUser);
                int userTableId = lastRecord.UserTableId;

                return Json(userTableId.ToString());
            }
            return Json("");

        }
    }
}
