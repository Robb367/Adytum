using Adytum.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Adytum.API.Data;

public class AdytumDbContext : DbContext
{
    public AdytumDbContext(DbContextOptions<AdytumDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Book> Books { get; set; }

    public DbSet<BookCopy> BookCopies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Book>()
        .HasMany(b => b.Copies)
        .WithOne(c => c.Book)
        .HasForeignKey(c => c.BookId);

        modelBuilder.Entity<User>()
        .HasMany(u => u.BookCopies)
        .WithOne(b => b.Owner)
        .HasForeignKey(b => b.OwnerId);

}}