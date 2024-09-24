using MySql.Data.MySqlClient;
using System.Data.Common;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AMS_B.Models
{
    public class Dbcon
    {
        private MySqlConnection? conn;

        public Dbcon()
        {
            conn = null;
        }

        // Connect to the database
        public async Task Connect()
        {
            string connectionString = "Server=localhost;Port=3306;Database=ecomdb;Uid=root;Pwd=root;";
            conn = new MySqlConnection(connectionString);
            await conn.OpenAsync();
        }

        // Disconnect the database
        public void Disconnect()
        {
            conn?.Close();
        }

        // Execute a SELECT query and return a data reader
        public async Task<MySqlDataReader> ExecuteQuery(string query, Dictionary<string, object>? parameters = null)
        {
            MySqlCommand cmd = new(query, conn);

            // If parameters are provided, add them to the command
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            DbDataReader reader = await cmd.ExecuteReaderAsync();
            return (MySqlDataReader)reader;
        }

        // Execute a non-query (INSERT, UPDATE, DELETE) and return the number of affected rows
        public async Task<int> ExecuteNonQuery(string query, Dictionary<string, object>? parameters = null)
        {
            using var command = new MySqlCommand(query, conn);

            // If parameters are provided, add them to the command
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    command.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            return await command.ExecuteNonQueryAsync();
        }

        // Execute a scalar query and return a single value (useful for retrieving auto-generated IDs)
        public async Task<object> ExecuteScalar(string query, Dictionary<string, object>? parameters = null)
        {
            using var command = new MySqlCommand(query, conn);

            // If parameters are provided, add them to the command
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    command.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            return await command.ExecuteScalarAsync();
        }
    }
}
