using Microsoft.AspNetCore.Mvc;

namespace OfferApp.Controllers
{
    public class Panel : Controller
    {
        public IActionResult PanelPage()
        {
            return View();
        }
    }
}
