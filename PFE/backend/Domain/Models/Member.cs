using Domain.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Domain.Types;

public class Member
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string MemberId { get; set; }
    public string UserId { get; set; }
    public string ProjectId { get; set; }
    public MemberRole Role { get; set; }
    public InvitationStatus Status { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; }

    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; }

    public virtual ICollection<TicketMember> TicketMembers { get; set; }
}