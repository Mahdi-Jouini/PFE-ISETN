using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Types;

namespace Domain.Models
{
    public class Sprint
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string SprintId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public SprintState SprintState { get; set; }
        public SprintDuration Duration { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime CompletionDate { get; set; }
        [ForeignKey("Project")]
        public string ProjectId { get; set; }
        // Navigation properties
        public virtual Project Project { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
        public virtual ICollection<FilesAttachment> FileAttachments { get; set; }

    }
}
