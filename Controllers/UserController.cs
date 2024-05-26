using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferApp.Models;

namespace OfferApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        public readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("User/UserList")]
        [Route("User/UserList/{U}")]
        public IActionResult UserList(int U)
        {
            var UsersList = _context.Users.ToList();
            if (U == 1)
                return Json(UsersList);
            return View();
        }

        [HttpPost]
        public JsonResult UserList(User A)
        {
            if (A.UserTableId != 0)
            {
                var user = _context.Users.Where(o => o.UserTableId == A.UserTableId);
                if (user.Any())
                {
                    foreach (var U in user)
                    {
                        U.UpdateDate = A.UpdateDate;
                        U.UpdateUser = A.UpdateUser;
                        U.Name = A.Name;
                        U.Surname = A.Surname;
                        U.Email = A.Email;
                        U.Password = A.Password;
                        U.IsAdmin = A.IsAdmin; 
                    }
                    _context.SaveChanges();

                    return Json("");
                }

            }
            else
            {

                _context.Users.Add(A);
                _context.SaveChanges();

                // Eklenen son kaydın UserTableId değerini almak için:
                var lastRecord = _context.Users.OrderByDescending(o => o.UserTableId).FirstOrDefault(o => o.CreateUser == A.CreateUser);
                int userTableId = lastRecord.UserTableId;

                return Json(userTableId.ToString());
            }
            return Json("");

        }

        [Route("User/CreateUser")]
        [Route("User/CreateUser/{UserId}")]
        public PartialViewResult CreateUser(int UserId = 0)
        {
            ViewModels.VMUser model = new ViewModels.VMUser();
            if (UserId != 0)
                model.User = _context.Users.Where(x => x.UserTableId == UserId).FirstOrDefault();


            return PartialView("Subpages/_CreateUser", model);
        }


    }
}
