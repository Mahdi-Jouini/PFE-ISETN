using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Types;

namespace Domain.Models
{
    public class Ticket
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string TicketId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TicketType Type { get; set; }
        public TicketState Status { get; set; }
        public TicketDifficulty Difficulty { get; set; }
        [ForeignKey("Sprint")]
        public string SprintId { get; set; }
        // Navigation properties
        public virtual Sprint Sprint { get; set; }
        public virtual ICollection<TicketMember> TicketMembers { get; set; }
        public virtual ICollection<FilesAttachment> FileAttachments { get; set; }

    }
}