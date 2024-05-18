using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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

        [HttpGet]
        [Route("Offer/OfferSira")]

        public JsonResult OfferSira()
        {

            var offermaxsira = (_context.Offers.Max(c => (int?)c.OfferSira) ?? 0) + 1;


            return Json(offermaxsira.ToString());

        }

        [HttpPost]
        public IActionResult CreateOffer(string offerrow)
        {
            
            var offer = JsonConvert.DeserializeObject<Offer>(offerrow);
            //List<Offer> offer = JsonConvert.DeserializeObject<List<Offer>>(offerrow);
            if (offer.CustomerCode != "")
            {
                

                    _context.Offers.Add(offer);
                    _context.SaveChanges();
                    var sonEklenen = _context.Offers
                                            .Where(o => o.OfferSeri == offer.OfferSeri && o.OfferSira == offer.OfferSira && o.CreateUser == offer.CreateUser)
                                            .OrderByDescending(o => o.UserTableId)
                                            .Select(o => o.UserTableId)
                                            .FirstOrDefault();

                    return Json(sonEklenen.ToString());
            }
            else
            {
                return Json(new { success = false });
            }

        }


    }
}
