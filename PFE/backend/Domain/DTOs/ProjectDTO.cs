using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ProjectDTO
    {
        public string? ProjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime CompletionDate { get; set; }
        public UserDTO ProductOwner { get; set; }

        public List<MemberDTO>? Members { get; set; }
    }
}
