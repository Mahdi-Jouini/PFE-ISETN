using Domain.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Member
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string MemberId { get; set; }
    public string UserId { get; set; }
    public string ProjectId { get; set; }
    public MemberRole Role { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; }

    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; }

    // Navigation property for the many-to-many relationship
    public virtual ICollection<TicketMember> TicketMembers { get; set; }
}