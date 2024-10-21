using MySql.Data.MySqlClient;


namespace AMS_B.Models
{
    public class Dbcon : IDisposable
    {
        private MySqlConnection? conn;
        private bool disposed = false;
        private readonly string connectionString;

        public Dbcon()
        {
            connectionString = "Server=localhost;Port=3306;Database=ecomdb;Uid=root;Pwd=root;";
        }

        private async Task EnsureConnectionOpen()
        {
            if (conn == null)
            {
                conn = new MySqlConnection(connectionString);
            }

            if (conn.State != System.Data.ConnectionState.Open)
            {
                await conn.OpenAsync();
            }
        }

        public async Task Connect()
        {
            await EnsureConnectionOpen();
        }

        public async Task Disconnect()
        {
            if (conn != null && conn.State == System.Data.ConnectionState.Open)
            {
                await conn.CloseAsync();
            }
        }

        public async Task<MySqlDataReader> ExecuteQuery(string query, Dictionary<string, object>? parameters = null)
        {
            await EnsureConnectionOpen();

            using var cmd = new MySqlCommand(query, conn);
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            // CommandBehavior.CloseConnection will automatically close the connection when the reader is closed
            return (MySqlDataReader)await cmd.ExecuteReaderAsync(System.Data.CommandBehavior.CloseConnection);
        }

        public async Task<int> ExecuteNonQuery(string query, Dictionary<string, object>? parameters = null)
        {
            await EnsureConnectionOpen();

            using var command = new MySqlCommand(query, conn);
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    command.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            var result = await command.ExecuteNonQueryAsync();
            await Disconnect();
            return result;
        }

        public async Task<object> ExecuteScalar(string query, Dictionary<string, object>? parameters = null)
        {
            await EnsureConnectionOpen();

            using var command = new MySqlCommand(query, conn);
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    command.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            var result = await command.ExecuteScalarAsync();
            await Disconnect();
            return result ?? DBNull.Value;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    conn?.Dispose();
                }
                disposed = true;
            }
        }

        ~Dbcon()
        {
            Dispose(false);
        }
    }
}