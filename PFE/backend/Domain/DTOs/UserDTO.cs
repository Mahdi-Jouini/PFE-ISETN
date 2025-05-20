using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class UserDTO
    {
        public string? UserId { get; set; }
        public string FirstName{ get; set; }
        public string LastName{ get; set; }
        public string EmailAddress{ get; set; }
        public string Avatar {  get; set; }
        public string Password{ get; set; }
        public string? otp { get; set; }

        public static implicit operator UserDTO(Member v)
        {
            throw new NotImplementedException();
        }
    }
}
