using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.DTOs
{
    public class ProjectDTO
    {

        public string? ProjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public User? ProductOwner { get; set; }


        public ProjectDTO()
        {
            CreatedDate = DateTime.UtcNow;
        }
    }
}
