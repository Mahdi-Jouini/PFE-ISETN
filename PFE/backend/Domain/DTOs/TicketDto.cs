using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.DTOs
{
    public class TicketDTO
    {
        public string TicketId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TypeTicket Type { get; set; }
        public TicketState Status { get; set; }
        public TicketDifficulty Difficulty { get; set; }    
        public string SprintId { get; set; }
        public string MemberId { get; set; }
       
    }
}
