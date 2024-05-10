using Microsoft.AspNetCore.Mvc;
using OfferApp.Models;

namespace OfferApp.Controllers
{
    public class ProductController : Controller
    {
        public readonly DataContext _context;

        public ProductController(DataContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult ProductList()
        {
            var ProductList = _context.Products.ToList();
            return View(ProductList);
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
    }
}
