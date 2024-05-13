using Microsoft.AspNetCore.Mvc;

namespace OfferApp.Controllers
{
    public class OfferController : Controller
    {
        public IActionResult OfferList()
        {
            return View();
        }
    }
}
