using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferApp.Models;
using System.Data;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

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



        //[AllowAnonymous]
        //[HttpPost]
        //public async Task<IActionResult> LoginProcedures(User p)
        //{

        //    var data = _context.Users.FirstOrDefault(x => x.Email == p.Email && x.Password == p.Password && x.IsPasivve == false);
        //    if (data != null)
        //    {

        //        var claims = new List<Claim>
        //        {
        //            new Claim(ClaimTypes.Name, data.UserTableId.ToString())
        //        };
        //        var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        //        var principal = new AuthenticationProperties
        //        {

        //            IsPersistent = true,
        //            ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(20)
        //        };

        //        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(userIdentity), principal);
        //        return RedirectToAction("PanelPage", "Panel");

        //    }
        //    return View();
        //}

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> LoginProcedures(User p)
        {
            if (p.Email == "admin@gmail.com" && p.Password == "Admin2024")
            {
                // İlk Veritabanı oluşturma, OfferApp veritabanını kontrol et
                var databaseExists = _context.Database.GetDbConnection().State != ConnectionState.Closed;

                if (!databaseExists)
                {
                    // OfferApp veritabanı yok, oluştur
                    _context.Database.EnsureCreated();

                    // Şimdi tekrar kullanıcıyı kontrol et
                    if (p.Email == "admin@gmail.com" && p.Password == "Admin2024")
                    {
                        // Kullanıcı bulundu, oturum açma işlemini gerçekleştir
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name,"0"), // Admini 0 Yaptım
                             new Claim(ClaimTypes.Role, "Admin")
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
                    else //yoksa giriş yap
                    {
                        if (p.Email == "admin@gmail.com" && p.Password == "Admin2024")
                        {
                            // Kullanıcı bulundu, oturum açma işlemini gerçekleştir
                            var claims = new List<Claim>
                        {
                                new Claim(ClaimTypes.Name,"0"), // Admini 0 Yaptım
                            new Claim(ClaimTypes.Role, "Admin")
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

                }


            }
            else
            {
                var data = _context.Users.FirstOrDefault(x => x.Email == p.Email && x.Password == p.Password && x.IsPasivve == false);
                if (data != null)
                {

                    var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, data.UserTableId.ToString()),
                    new Claim(ClaimTypes.Role, data.IsAdmin ? "Admin" : "")
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
