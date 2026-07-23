using Footballit.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Footballit.API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public TestController(AppDbContext context, IConfiguration config) { _context = context; _config = config; }
        
        [HttpGet("user15")]
        public async Task<IActionResult> GetUser15()
        {
            var user = await _context.Users.FindAsync(15);
            return Ok(user);
        }
        
        [HttpGet("token/{mobile}")]
        public async Task<IActionResult> GetToken(string mobile) {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.MobileNumber == mobile);
            if (user == null) return NotFound();
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.MobileNumber),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"], _config["Jwt:Audience"], claims,
                expires: DateTime.Now.AddDays(1), signingCredentials: creds
            );
            return Ok(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}
