using Microsoft.EntityFrameworkCore;

namespace OfferApp.Models
{
  
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Offer> Offers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Offer>()
                .HasOne(o => o.Customer)
                .WithMany(c => c.Offers)
                .HasForeignKey(o => o.CustomerCode)
                .HasPrincipalKey(c => c.Code); // Customer.Code ile eşleştiriyoruz
            modelBuilder.Entity<Offer>()
                .HasOne(o => o.Product)
                .WithMany(c => c.Offers)
                .HasForeignKey(o => o.ProductCode)
                .HasPrincipalKey(c => c.Code); // Customer.Code ile eşleştiriyoruz
        }
    }
}
