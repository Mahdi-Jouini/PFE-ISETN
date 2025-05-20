using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Domain.Types;

namespace Domain.DTOs
{

    public class SprintDTO
    {
        public string? SprintId { get; set; }
        public string ProjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public SprintState? SprintState { get; set; }
        public SprintDuration Duration { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompletionDate { get; set; }

        public List<TicketDTO>? tickets { get; set; }

    }
}

