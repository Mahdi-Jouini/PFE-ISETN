using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class FilesAttachment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string originalName { get; set; }
        public long Size { get; set; }
        public string URL { get; set; }
        public string Type { get; set; }

        [ForeignKey("Project")]
        public string? ProjectId { get; set; }

        [ForeignKey("Sprint")]
        public string? SprintId { get; set; }

        [ForeignKey("Ticket")]
        public string? TicketId { get; set; }

        public virtual Project? Project { get; set; }
        public virtual Sprint? Sprint { get; set; }
        public virtual Ticket? Ticket { get; set; }
    }
}