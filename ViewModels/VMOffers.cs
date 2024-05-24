using OfferApp.Models;

namespace OfferApp.ViewModels
{
    public class VMOffer
    {
      public List<Offer> Offers { get; set; } = new List<Offer>();
        public Offer _Offer { get; set; } = new Offer();

        public Customer _Customer { get; set; }=new Customer();
    }
}
