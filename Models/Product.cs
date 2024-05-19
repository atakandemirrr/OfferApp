namespace OfferApp.Models
{
    public class Product:Generic
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Piece { get; set; }
        public ICollection<Offer> Offers { get; set; }

    }
}
