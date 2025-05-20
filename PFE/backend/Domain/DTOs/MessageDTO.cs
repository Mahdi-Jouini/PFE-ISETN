using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class MessageDTO
    {
        public string? MessageId { get; set; }
        public string Content { get; set; }
        public DateTime? SentAt { get; set; }
        public string? SenderId { get; set; }
        public string? SenderName { get; set; }
        public string? SenderAvatar { get; set; }
        public string ProjectId { get; set; }
    }


}
