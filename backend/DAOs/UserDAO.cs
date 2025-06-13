using BOs.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAOs
{
    public class UserDAO
    {
        private static UserDAO? instance;
        private static DnasystemContext? context;
        public UserDAO()
        {
            context = new DnasystemContext();
        }
        public static UserDAO Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new UserDAO();
                }
                return instance;
            }
        }
        public User GetUserByEmail(string email, string password)
        {
            return context.Users.SingleOrDefault(u => u.Email == email && u.Password == password);
        }
    }
}
