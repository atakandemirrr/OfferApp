using Microsoft.AspNetCore.Mvc;
using OfferApp.Models;

namespace OfferApp.Controllers
{
    public class OfferController : Controller
    {
       public readonly DataContext _context;

        public OfferController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Offer/OfferList")]
        [Route("Offer/OfferList/{O}")]
        public IActionResult OfferList(int O = 0)
        {

            var OfferList = _context.Offers.ToList();
            if (O == 1)
                return Json(OfferList);
            return View();
        }
        [HttpGet]
     
        public IActionResult CreateOffer()
        {
           

            return View();

        }
    }
}
