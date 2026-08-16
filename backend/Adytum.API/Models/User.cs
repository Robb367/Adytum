namespace Adytum.API.Models;

using Microsoft.EntityFrameworkCore;

[Index(nameof(Email), IsUnique = true)]
[Index(nameof(Username), IsUnique = true)]
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
    public string PasswordHash { get; set; } = String.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? City { get; set; }
    public string? Province { get; set; }
    public string? StreetAddress { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int SearchRadiusKm { get; set; } = 20;
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsPublicProfile { get; set; } = true;
    public ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();
    public ICollection<Loan> LoansGiven { get; set; } = new List<Loan>();
    public ICollection<Loan> LoansReceived { get; set; } = new List<Loan>();
    public UserRole Role { get; set; } = UserRole.User;
}
