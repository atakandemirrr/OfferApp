using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfferApp.Models;
using System.Security.Claims;

namespace OfferApp.Controllers
{
    public class LoginController : Controller
    {
        private readonly DataContext _context;

        public LoginController(DataContext context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public IActionResult LoginProcedures()
        {
            return View();
        }



        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> LoginProcedures(User p)
        {

            var data = _context.Users.FirstOrDefault(x => x.Email == p.Email && x.Password == p.Password && x.IsPasivve == false);
            if (data != null)
            {

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, data.UserTableId.ToString())
                };
                var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new AuthenticationProperties
                {

                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(20)
                };

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(userIdentity), principal);
                return RedirectToAction("PanelPage", "Panel");

            }
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> LogOut() /*Çıkış İşlemi İçin Kullanılıcak*/
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("LoginProcedures", "Login");

        }
    }
}
