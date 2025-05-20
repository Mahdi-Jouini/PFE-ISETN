using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Types;

namespace Domain.DTOs
{
    public class InvitationDTO
    {
        public string? Id { get; set; }
        public string ReceiverId { get; set; }
        public string ProjectId { get; set; }
        public MemberRole Role { get; set; }
        public InvitationStatus Rtatus { get; set; }
    }
}
