using Footballit.API.Data;
using Footballit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Footballit.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        private async Task<User?> GetCurrentUser()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return null;
            return await _context.Users.FindAsync(userId);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Enrollments).ThenInclude(e => e.Course)
                .Include(u => u.Transactions)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();
            return Ok(user);
        }

        public class PersonalInfoRequest
        {
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? NationalCode { get; set; }
            public string? BirthDate { get; set; }
            public string? FatherName { get; set; }
            public string? Gender { get; set; }
            public int? Height { get; set; }
            public int? Weight { get; set; }
        }

        [HttpPut("personal-info")]
        public async Task<IActionResult> UpdatePersonalInfo([FromBody] PersonalInfoRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.FirstName = req.FirstName ?? user.FirstName;
            user.LastName = req.LastName ?? user.LastName;
            user.NationalCode = req.NationalCode ?? user.NationalCode;
            user.BirthDate = req.BirthDate ?? user.BirthDate;
            user.FatherName = req.FatherName;
            user.Gender = req.Gender;
            user.Height = req.Height;
            user.Weight = req.Weight;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class BankInfoRequest
        {
            public string? BankName { get; set; }
            public string? CardNumber { get; set; }
            public string? ShabaNumber { get; set; }
        }

        [HttpPut("bank-info")]
        public async Task<IActionResult> UpdateBankInfo([FromBody] BankInfoRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.BankName = req.BankName;
            user.CardNumber = req.CardNumber;
            user.ShabaNumber = req.ShabaNumber;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class ContactInfoRequest
        {
            public string? ParentMobile { get; set; }
            public string? LandlinePhone { get; set; }
            public string? HomeAddress { get; set; }
        }

        [HttpPut("contact-info")]
        public async Task<IActionResult> UpdateContactInfo([FromBody] ContactInfoRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.ParentMobile = req.ParentMobile;
            user.LandlinePhone = req.LandlinePhone;
            user.HomeAddress = req.HomeAddress;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class SportsInfoRequest
        {
            public string? MainPosition { get; set; }
            public string? DominantFoot { get; set; }
            public string? NationalTeamExperience { get; set; }
        }

        [HttpPut("sports-info")]
        public async Task<IActionResult> UpdateSportsInfo([FromBody] SportsInfoRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.MainPosition = req.MainPosition;
            user.DominantFoot = req.DominantFoot;
            user.NationalTeamExperience = req.NationalTeamExperience;

            await _context.SaveChangesAsync();
            return Ok(user);
        }
        public class PassportInfoRequest
        {
            public string? PassportNumber { get; set; }
            public DateTime? PassportIssueDate { get; set; }
            public DateTime? PassportExpiryDate { get; set; }
        }

        [HttpPut("passport")]
        public async Task<IActionResult> UpdatePassport([FromBody] PassportInfoRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.PassportNumber = req.PassportNumber;
            user.PassportIssueDate = req.PassportIssueDate;
            user.PassportExpiryDate = req.PassportExpiryDate;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class ClothingInfoRequest
        {
            public string? ShirtSize { get; set; }
            public string? ShortsSize { get; set; }
            public int? ShoeSize { get; set; }
        }

        [HttpPut("clothing")]
        public async Task<IActionResult> UpdateClothing([FromBody] ClothingInfoRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.ShirtSize = req.ShirtSize;
            user.ShortsSize = req.ShortsSize;
            user.ShoeSize = req.ShoeSize;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class InsuranceRpeRequest
        {
            public int? RpeIndex { get; set; }
            public int? SleepQuality { get; set; }
        }

        [HttpPut("insurance-rpe")]
        public async Task<IActionResult> UpdateInsuranceRpe([FromBody] InsuranceRpeRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.RpeIndex = req.RpeIndex;
            user.SleepQuality = req.SleepQuality;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class BackpackRequest
        {
            public string? BackpackSport { get; set; }
            public string? BackpackTopic { get; set; }
            public string? BackpackAgeGroup { get; set; }
            public string? BackpackTrainingType { get; set; }
        }

        [HttpPut("backpack")]
        public async Task<IActionResult> UpdateBackpack([FromBody] BackpackRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.BackpackSport = req.BackpackSport;
            user.BackpackTopic = req.BackpackTopic;
            user.BackpackAgeGroup = req.BackpackAgeGroup;
            user.BackpackTrainingType = req.BackpackTrainingType;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class RegistrationPrefRequest
        {
            public string? CurrentTerm { get; set; }
            public string? CurrentClass { get; set; }
        }

        [HttpPut("registration-pref")]
        public async Task<IActionResult> UpdateRegistrationPref([FromBody] RegistrationPrefRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            user.CurrentTerm = req.CurrentTerm;
            user.CurrentClass = req.CurrentClass;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public class PasswordRequest
        {
            public string? CurrentPassword { get; set; }
            public string? NewPassword { get; set; }
        }

        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword([FromBody] PasswordRequest req)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            // Very simple password handling for demonstration
            if (!string.IsNullOrEmpty(user.Password) && user.Password != req.CurrentPassword)
            {
                return BadRequest("رمز عبور فعلی نادرست است.");
            }

            user.Password = req.NewPassword;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost("documents")]
        public async Task<IActionResult> UploadDocuments([FromForm] IFormFile? nationalCard, [FromForm] IFormFile? birthCertificate, [FromForm] IFormFile? personalPhoto)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized();

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

            async Task<string?> SaveFile(IFormFile? file)
            {
                if (file == null || file.Length == 0) return null;
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                return "/uploads/" + fileName;
            }

            var nationalPath = await SaveFile(nationalCard);
            var birthPath = await SaveFile(birthCertificate);
            var photoPath = await SaveFile(personalPhoto);

            if (nationalPath != null) user.NationalCardPath = nationalPath;
            if (birthPath != null) user.BirthCertificatePath = birthPath;
            if (photoPath != null) user.PersonalPhotoPath = photoPath;

            await _context.SaveChangesAsync();
            return Ok(user);
        }
    }
}
