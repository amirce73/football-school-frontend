using System;

namespace Footballit.API.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        
        public int CourseId { get; set; }
        public Course? Course { get; set; }
        
        public string Status { get; set; } = "Pending"; // Success, Failed, Cancelled
        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    }
}
