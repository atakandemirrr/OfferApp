namespace OfferApp.Models
{
    public class Customer :Generic
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string VkNo { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public ICollection<Offer> Offers { get; set; }
      

    }
}
