using MySql.Data.MySqlClient;
using System.Data.Common;

namespace AMS_B.Models
{
    public class Dbcon
    {
        private MySqlConnection? conn;

        public Dbcon()
        {

            conn = null;

        }

        public async Task Connect()//connect database connection
        {
            string connectionString = "Server=localhost;Port=3306;Database=ecomdb;Uid=root;Pwd=root;";
            conn = new MySqlConnection(connectionString);
            await conn.OpenAsync();

        }

        public void Disconnect()//disconnect database connection
        {

            conn?.Close();
        }

        public async Task<MySqlDataReader> ExecuteQuery(string query)
        {
            MySqlCommand cmd = new(query, conn);
            DbDataReader reader = await cmd.ExecuteReaderAsync();
            return (MySqlDataReader)reader;
        }

        public async Task<int> ExecuteNonQuery(string query)
        {
            using var command = new MySqlCommand(query, conn);
            return await command.ExecuteNonQueryAsync();
        }

    }
}