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
    public class UtilisateurDTO
    {
        //public string Id { get; set; }
        [Required]
        public string FirstName{ get; set; }
        [Required]
        public string LastName{ get; set; }
        [Required]
        public string EmailAddress{ get; set; }
        [Required]
        public string Password{ get; set; }
        public string? Role { get; set; }
    }
}
