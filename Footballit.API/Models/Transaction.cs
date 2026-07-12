using System;

namespace Footballit.API.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Success, Failed
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        public string? ReferenceId { get; set; }
    }
}
