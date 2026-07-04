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
}