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

    public DbSet<Loan> Loans { get; set; }

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

        modelBuilder.Entity<Loan>()
        .HasOne(l => l.BookCopy)
        .WithMany(b => b.Loans)
        .HasForeignKey(l => l.BookCopyId);

        modelBuilder.Entity<Loan>()
        .HasOne(l => l.Lender)
        .WithMany(u => u.LoansGiven)
        .HasForeignKey(l => l.LenderId)
        .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Loan>()
        .HasOne(l => l.Borrower)
        .WithMany(u => u.LoansReceived)
        .HasForeignKey(l => l.BorrowerId)
        .OnDelete(DeleteBehavior.Restrict);

    }
}