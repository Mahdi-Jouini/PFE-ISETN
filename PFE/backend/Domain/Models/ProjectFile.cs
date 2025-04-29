using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ProjectFile
    {
        [Key]
        public int Id { get; set; }
        public string Nom { get; set; }
        public long Taille { get; set; }

        public string URL { get; set; }

        public string Type { get; set; }

       
        public string? TicketId { get; set; }
        public string? SprintId { get; set; }

        [ForeignKey("TicketId")]
        public virtual Ticket? Ticket { get; set; }

        [ForeignKey("SprintId")]
        public virtual Sprint? Sprint { get; set; }
    }
}
