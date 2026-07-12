using System;
using System.Collections.Generic;

namespace Footballit.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string MobileNumber { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string NationalCode { get; set; } = string.Empty;
        public string? BirthDate { get; set; }
        public string Role { get; set; } = "Player"; // Admin, Coach, Player, Parent
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // --- Personal Info ---
        public string? FatherName { get; set; }
        public string? Gender { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }

        // --- Contact Info ---
        public string? ParentMobile { get; set; }
        public string? LandlinePhone { get; set; }
        public string? HomeAddress { get; set; }

        // --- Sports Info ---
        public string? MainPosition { get; set; }
        public string? DominantFoot { get; set; }
        public string? NationalTeamExperience { get; set; } // بله/خیر

        // --- Bank Info ---
        public string? BankName { get; set; }
        public string? CardNumber { get; set; }
        public string? ShabaNumber { get; set; }

        // --- Passport Info ---
        public string? PassportNumber { get; set; }
        public DateTime? PassportIssueDate { get; set; }
        public DateTime? PassportExpiryDate { get; set; }

        // --- Clothing Info ---
        public string? ShirtSize { get; set; }
        public string? ShortsSize { get; set; }
        public int? ShoeSize { get; set; }

        // --- Insurance / RPE ---
        public int? RpeIndex { get; set; }
        public int? SleepQuality { get; set; }

        // --- Backpack Preferences ---
        public string? BackpackSport { get; set; }
        public string? BackpackTopic { get; set; }
        public string? BackpackAgeGroup { get; set; }
        public string? BackpackTrainingType { get; set; }

        // --- Registration Pref ---
        public string? CurrentTerm { get; set; }
        public string? CurrentClass { get; set; }

        // --- Documents Paths ---
        public string? NationalCardPath { get; set; }
        public string? BirthCertificatePath { get; set; }
        public string? PersonalPhotoPath { get; set; }

        // --- Auth ---
        public string? Password { get; set; }

        // Navigation properties
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
