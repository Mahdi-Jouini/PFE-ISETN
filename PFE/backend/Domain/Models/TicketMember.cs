using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models
{
    public class TicketMember
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string TicketMemberId { get; set; } 
        public string TicketId { get; set; }
        public string MemberId { get; set; }

        [ForeignKey("TicketId")]
        public virtual Ticket Ticket { get; set; }

        [ForeignKey("MemberId")]
        public virtual Member Member { get; set; }

        public DateTime AssignedDate { get; set; }
    }
}