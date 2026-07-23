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
        public string? BirthCertificateNo { get; set; }
        public string? Gender { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public string? BloodGroup { get; set; }
        public string? MaritalStatus { get; set; }
        public string? MilitaryServiceStatus { get; set; }
        public string? Religion { get; set; }
        public string? Sect { get; set; }
        public string? Occupation { get; set; }
        public string? HealthStatus { get; set; }
        public string? Description { get; set; }

        // --- Contact Info ---
        public string? PostalCode { get; set; }
        public string? ParentMobile { get; set; }
        public string? LandlinePhone { get; set; }
        public string? HomeAddress { get; set; }
        public string? EmergencyPhone { get; set; }
        public string? Email { get; set; }
        public string? Telegram { get; set; }
        public string? Instagram { get; set; }
        public string? LinkedIn { get; set; }
        public string? Facebook { get; set; }
        public string? Website { get; set; }
        public string? Eitaa { get; set; }
        public string? Rubika { get; set; }
        public string? Whatsapp { get; set; }
        public string? Bale { get; set; }
        public string? ParentsWorkAddress { get; set; }

        // --- Sports Info ---
        public string? MainPosition { get; set; }
        public string? DominantFoot { get; set; }
        public string? NationalTeamExperience { get; set; } // بله/خیر
        public string? SportsInsuranceNumber { get; set; }
        public string? SportsSlogan { get; set; }
        public string? PlayingAbility { get; set; }
        public string? CompetitionSeason { get; set; }

        // --- Bank Info ---
        public string? BankName { get; set; }
        public string? CardNumber { get; set; }
        public string? ShabaNumber { get; set; }

        // --- Passport Info ---
        public string? PassportNumber { get; set; }
        public string? PassportIssueDate { get; set; }
        public string? PassportExpiryDate { get; set; }
        public string? EnglishName { get; set; }


        public string? EnglishSurname { get; set; }

        // --- Clothing Info ---
        public string? ShirtSize { get; set; }
        public string? ShortsSize { get; set; }
        public int? ShoeSize { get; set; }
        public string? SlipperSize { get; set; }
        public string? SportsWarmerSize { get; set; }

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
