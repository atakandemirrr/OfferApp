
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OfferApp.Models;
using OfferApp.ViewModels;

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


            if (O == 1)
            {


                var OfferList = _context.Offers
                                    .Include(o => o.Customer) // LEFT JOIN için Include kullanıyoruz
                                    .GroupBy(o => new
                                    {
                                        o.OfferDate,
                                        o.DeliveryDate,
                                        SeriSira = o.OfferSeri + " - " + o.OfferSira,
                                        o.OfferSira,
                                        o.Customer.Name
                                    })
                                    .Select(g => new
                                    {
                                        OfferDate = g.Key.OfferDate,
                                        DeliveryDate = g.Key.DeliveryDate,
                                        SeriSira = g.Key.SeriSira,
                                        OfferSira = g.Key.OfferSira,
                                        Name = g.Key.Name,
                                        Total = g.Sum(o => o.Total)
                                    })
                                    .ToList();
                return Json(OfferList);
            }

            return View();
        }

        [HttpGet]
        [Route("Offer/CreateOffer")]
        [Route("Offer/CreateOffer/{OfferSira?}")]
        public IActionResult CreateOffer(int? OfferSira)
        {
            ViewModels.VMOffer model = new VMOffer();
            if (OfferSira.HasValue && OfferSira.Value != 0)
            {

                model.Offers = _context.Offers.Where(x=>x.OfferSira==OfferSira).ToList();


                return View(model);
            }
            return View(model);
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


        /*Şuan Kullanılmıyor*/
        [HttpGet]
        [Route("Offer/EditOffer/{UserTableID}")]

        public JsonResult EditOffer(int UserTableID)
        {
            var OfferDatas = _context.Offers.Where(o => o.UserTableId == UserTableID).Select(o => new { o.ProductCode, o.Price, o.Piece, o.Total }).ToList(); ;


            return Json(OfferDatas);
        }


        [HttpPost]

        public JsonResult EditOffer(string offerrow)
        {
            var offerUpdate = JsonConvert.DeserializeObject<Offer>(offerrow);

            var Offer = _context.Offers.Where(o => o.UserTableId == offerUpdate.UserTableId);

            if (Offer.Any())
            {
                foreach (var O in Offer)
                {
                    O.UpdateDate = offerUpdate.UpdateDate;
                    O.UpdateUser = offerUpdate.UpdateUser;
                    O.ProductCode = offerUpdate.ProductCode;
                    O.Price = offerUpdate.Price;
                    O.Total = offerUpdate.Total;
                    O.Piece = offerUpdate.Piece;
                }
                _context.SaveChanges();

                return Json("");
            }
            return Json("Teklif bulunamadı.");

        }


        /* UPDATE İÇİN YAPILDI SONRA KAPATILDI CREATE KULLANILICAK*/
        //[HttpGet]
        //[Route("Offer/UpdateOffer/{OfferSira}")]

        //public IActionResult UpdateOffer(int OfferSira)
        //{
        //    var offers = _context.Offers.Where(o => o.OfferSira == OfferSira).ToList();
        //    if (!offers.Any())
        //    {
        //        return NotFound();
        //    }
        //    return View("CreateOffer", offers);
        //}

    }
}
