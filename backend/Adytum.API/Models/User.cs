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
    public string ProfilePictureUrl { get; set; } = String.Empty;
    public string DisplayName { get; set; } = String.Empty;
    public string Bio { get; set; } = String.Empty;
    public string City { get; set; } = String.Empty;
    public string Province { get; set; } = String.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int SearchRadiusKm { get; set; } = 20;
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsPublicProfile { get; set; } = true;
    public ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();
    public ICollection<Loan> LoansGiven { get; set; } = new List<Loan>();
    public ICollection<Loan> LoansReceived { get; set; } = new List<Loan>();
}
