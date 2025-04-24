using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.DTOs
{
    public class MemberDTO
    {
        public string? MemberId { get; set; }
        public string UserId { get; set; }
        public string ProjectId { get; set; }
        public MemberRole Role { get; set; }
        public UserDTO? User { get; set; }
    }
}
