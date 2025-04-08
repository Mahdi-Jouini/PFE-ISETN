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
        [Required]
        public string FirstName{ get; set; }
        [Required]
        public string LastName{ get; set; }
        [Required]
        public string EmailAddress{ get; set; }
        public string? Avatar {  get; set; }
        [Required]
        public string Password{ get; set; }
        public bool? IsAdmin { get; set; }
        [Required]
        public string otp { get; set; }
    }
}
