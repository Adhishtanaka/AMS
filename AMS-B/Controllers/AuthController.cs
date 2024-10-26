using AMS_B.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AMS_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Dbcon _dbcon;

        public AuthController(Dbcon dbcon)
        {
            _dbcon = dbcon;
        }

        private int GetUserId()
        {
            var idClaim = User.FindFirst("id");
            if (idClaim == null)
            {
                idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            }

            return idClaim != null ? int.Parse(idClaim.Value) : 0;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login()
        {
            var request = await HttpContext.Request.ReadFromJsonAsync<UserLoginRequest>();
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { Message = "Invalid login request." });
            }


            var userrole = await Users.checkjobRole(_dbcon, request.Email);
            Users user;


            if (userrole == "Buyer")
            {
                user = new Buyer { Email = request.Email, Password = request.Password };
            }
            else
            {
                user = new Seller { Email = request.Email, Password = request.Password };
            }

            var token = await user.Login(_dbcon);
            if (token != null)
            {
                return Ok(new { AccessToken = token });
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register()
        {
            var request = await HttpContext.Request.ReadFromJsonAsync<UserRegisterRequest>();
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password)
                || string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Telephone)
                || string.IsNullOrEmpty(request.Address) || string.IsNullOrEmpty(request.Role))
            {
                return BadRequest(new { Message = "Invalid Register request." });
            }

            Users user = request.Role.ToLower() switch
            {
                "seller" => new Seller(),
                "buyer" => new Buyer(),
                _ => throw new ArgumentException("Invalid role specified")
            };

            user.Name = request.Name;
            user.Email = request.Email;
            user.Password = request.Password;
            user.Telephone = request.Telephone;
            user.Address = request.Address;

            bool success = await user.Register(_dbcon);
            if (success)
            {
                return Ok(new { Message = "Registration success" });
            }
            else
            {
                return BadRequest(new { Message = "Registration failed." });
            }
        }

        [HttpGet("GetUsersId")]
        public async Task<IActionResult> GetUsersId()
        {
            int userId = GetUserId();
            if (userId <= 0)
            {
                return BadRequest(-1);
            }
            return Ok(userId);
        }
    }
    }