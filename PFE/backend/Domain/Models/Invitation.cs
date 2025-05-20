using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Types;

namespace Domain.Models
{
    public class Invitation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string ReceiverId { get; set; }
        public string ProjectId { get; set; }
        public MemberRole Role { get; set; }
        public InvitationStatus Status { get; set; }

        //Foreign Keys :
        [ForeignKey("ReceiverId")]
        public virtual User? User { get; set; }

        [ForeignKey("ProjectId")]
        public virtual Project? Project { get; set; }
    }
}
