using System.Data;
using MySql.Data.MySqlClient;

namespace AWS_B.model { 
public class Dbcon
    {
        private MySqlConnection? conn;

        public Dbcon()
        {
            conn = null;
        }

        public void Connect()
        {
            string connectionString = "Server=localhost;Database=AWS;Uid=root;Pwd=root;";
            conn = new MySqlConnection(connectionString);
            conn.Open();
        }

        public void Disconnect()
        {
            conn?.Close();
        }

        public MySqlDataReader ExecuteQuery(string query)
        {
            MySqlCommand cmd = new(query, conn);
            MySqlDataReader reader = cmd.ExecuteReader();
            return reader;
        }

        public DataTable DisplayQuery(string query){
            MySqlCommand cmd = new(query, conn);
            MySqlDataAdapter adapter = new(cmd);
            DataTable dataTable = new();
            adapter.Fill(dataTable);
            return dataTable;
        }

}}