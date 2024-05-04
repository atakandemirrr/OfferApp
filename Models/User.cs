using System.ComponentModel.DataAnnotations;

namespace OfferApp.Models
{
    public class User : Generic
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }

        [Required]
        [MaxLength(25)]
        public string Email { get; set; }
        public bool IsPasivve { get; set; }/*0 aktif 1 pasif*/
        public bool IsAdmin { get; set; }/*0 hayır 1 evet*/
    }
}
