using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AMS_B.Models
{

    public class UserLoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class UserRegisterRequest
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Telephone { get; set; }
        public required string Address { get; set; }
        public required string Role { get; set; }
    }

    public abstract class Users {

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public abstract string Role { get; }

        public async Task<bool> Register(Dbcon dbcon)
        {
            await dbcon.Connect();
            string checkQuery = $"SELECT COUNT(*) FROM user WHERE Email = '{Email}'";
            bool emailExists;
            using (var checkReader = await dbcon.ExecuteQuery(checkQuery))
            {
                if (checkReader.Read())
                {
                    emailExists = checkReader.GetInt32(0) > 0;
                }
                else
                {
                    emailExists = false;
                }
            }
            if (emailExists)
            {
                dbcon.Disconnect();
                return false;
            }
            string insertQuery = $"INSERT INTO user (name, email, password, tp, address, role) VALUES ('{Name}', '{Email}', '{Password}', '{Telephone}', '{Address}', '{Role}')";
            int affectedRows = await dbcon.ExecuteNonQuery(insertQuery);

            dbcon.Disconnect();
            return affectedRows > 0;


        }
        public async Task<string?> Login(Dbcon dbcon)
        {
            await dbcon.Connect();
            string query = $"SELECT userid, role FROM user WHERE Email = '{Email}' AND Password = '{Password}'";
            using var reader = await dbcon.ExecuteQuery(query);
            if (reader.Read())
            {
                int id = reader.GetInt32(0);   
                string role = reader.GetString(1);  
                dbcon.Disconnect();
                return GenerateJwtToken(id, Email, role);  
            }

            dbcon.Disconnect();
            return null;
        }
        public static async Task<string?> checkjobRole(Dbcon dbcon, string Email)
        {
            await dbcon.Connect();
            string query = $"SELECT role FROM user WHERE Email='{Email}'";
            string? role = null;
            using var reader = await dbcon.ExecuteQuery(query);
            if (await reader.ReadAsync())
            {
                role = reader["role"]?.ToString();
            }
            return role;
        }
        private string GenerateJwtToken(int id, string email, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("75ca9af8c0ff1fccb1b51eb721785a47b237782ac6533364873a96882fc51227"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim("id", id.ToString()), 
                new Claim("role", role),         
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var token = new JwtSecurityToken(
                issuer: "yourdomain.com",
                audience: "yourdomain.com",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);


        }

    }
}
