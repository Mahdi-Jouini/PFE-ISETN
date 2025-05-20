using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string MessageId { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public string SenderId { get; set; }
        public string ProjectId { get; set; }





        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; }

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }
    }


}
