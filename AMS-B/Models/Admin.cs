namespace AMS_B.Models
{
    public class AdminBanRequest
    {
        public required string Email { get; set; }
        public bool Ban { get; set; }
    }


    public class ManageUser
    {
        public required string Email { get; set; }
        public required string Name { get; set; }
        public required string Role { get; set; }
        public required string Status { get; set; }
        public required string Telephone { get; set; }
    }

    public class Admin : Users
    {
        public override string Role => "Admin";

        public async Task<List<ManageUser>> ManageAllUsers(Dbcon dbcon, string nameFilter = "")
        {
            var users = new List<ManageUser>();
            try
            {
                await dbcon.Connect();
                string query = "SELECT email, name, role, status, tp FROM user";
                if (!string.IsNullOrEmpty(nameFilter))
                {
                    query += $" WHERE name LIKE '{nameFilter}%'";
                }

                using (var reader = await dbcon.ExecuteQuery(query))
                {
                    while (reader.Read())
                    {
                        var manageUser = new ManageUser
                        {
                            Email = !reader.IsDBNull(0) ? reader.GetString(0) : string.Empty,
                            Name = !reader.IsDBNull(1) ? reader.GetString(1) : string.Empty,
                            Role = !reader.IsDBNull(2) ? reader.GetString(2) : string.Empty,
                            Status = !reader.IsDBNull(3) ? reader.GetString(3) : string.Empty,
                            Telephone = !reader.IsDBNull(4) ? reader.GetString(4) : string.Empty
                        };
                        users.Add(manageUser);
                    }
                }

                return users;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving users.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }


        public async Task<bool> BanUser(Dbcon dbcon, bool ban)
        {
            try
            {
                await dbcon.Connect();

                string checkQuery = $"SELECT COUNT(*) FROM user WHERE email = '{Email}'";
                bool emailExists;
                using (var checkReader = await dbcon.ExecuteQuery(checkQuery))
                {
                    emailExists = checkReader.Read() && checkReader.GetInt32(0) > 0;
                }

                if (!emailExists)
                {
                    dbcon.Disconnect();
                    return false;
                }

                string newStatus = ban ? "Banned" : "Active";
                string updateQuery = $"UPDATE user SET status = '{newStatus}' WHERE email = '{Email}'";
                int affectedRows = await dbcon.ExecuteNonQuery(updateQuery);

                return affectedRows > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the user's status.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }

    }
}
