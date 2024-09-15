namespace AWS_B.model
{
    public class AdminBanRequest
    {
        public required string Email { get; set; }
        public bool Ban { get; set; } 
    }


    public class ManageUser
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
    }

    public class Admin : User
    {
        public override string Role => "Admin";

        public async Task<List<ManageUser>> ManageAllUsers(Dbcon dbcon)
        {
            var users = new List<ManageUser>();

            try
            {
                await dbcon.Connect();

                string query = "SELECT email, name, role, status FROM user";

                using (var reader = await dbcon.ExecuteQuery(query))
                {
                    while (reader.Read())
                    {
                        var manageUser = new ManageUser
                        {
                            Email = reader.GetString(0),
                            Name = reader.GetString(1),
                            Role = reader.GetString(2),
                            Status = reader.GetString(3)
                        };
                        users.Add(manageUser);
                    }
                }

                return users;
            }
            catch (Exception ex)
            {
                // Log the exception (optional) and handle it as needed
                throw new Exception("An error occurred while retrieving users.", ex);
            }
            finally
            {
                // Ensure the database connection is always closed
                dbcon.Disconnect();
            }
        }

        public async Task<bool> BanUser(Dbcon dbcon, bool ban)
        {
            try
            {
                await dbcon.Connect();

                // Check if the email exists in the database
                string checkQuery = $"SELECT COUNT(*) FROM user WHERE email = '{Email}'";
                bool emailExists;
                using (var checkReader = await dbcon.ExecuteQuery(checkQuery))
                {
                    emailExists = checkReader.Read() && checkReader.GetInt32(0) > 0;
                }

                // If email does not exist, return false
                if (!emailExists)
                {
                    dbcon.Disconnect();
                    return false;
                }

                // Update the user status based on the ban flag
                string newStatus = ban ? "Banned" : "Active";
                string updateQuery = $"UPDATE user SET status = '{newStatus}' WHERE email = '{Email}'";
                int affectedRows = await dbcon.ExecuteNonQuery(updateQuery);

                return affectedRows > 0;
            }
            catch (Exception ex)
            {
                // Log the exception (optional) and handle it as needed
                throw new Exception("An error occurred while updating the user's status.", ex);
            }
            finally
            {
                // Ensure the database connection is always closed
                dbcon.Disconnect();
            }
        }

    }
}
