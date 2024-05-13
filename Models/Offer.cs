using System.ComponentModel.DataAnnotations;

namespace OfferApp.Models
{
    public class Offer : Generic
    {
        public string OfferDate { get; set; }
        public string DeliveryDate { get; set; }
        public string OfferSeri { get; set; }
        public int OfferSira { get; set; }

        public string CustomerCode { get; set; }
        public string Product { get; set; }
        public int Piece { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
        public int Statu { get; set; }/*0 hazırlandı 1 onayda 2 onaylandı 3 rededildi*/
    }
}
