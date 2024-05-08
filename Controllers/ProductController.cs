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
        public IActionResult CreateProduct()
        {
            
            return View();
        }
    }
}
