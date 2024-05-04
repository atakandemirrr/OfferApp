using Microsoft.EntityFrameworkCore;

namespace OfferApp.Models
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
    }
}
