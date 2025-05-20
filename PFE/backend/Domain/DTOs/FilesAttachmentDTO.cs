using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class FilesAttachmentDTO
    {
        public int? Id { get; set; }
        public string originalName { get; set; }
        public long Size { get; set; }
        public string URL { get; set; }
        public string Type { get; set; }
        public string? ProjectId { get; set; }
        public string? SprintId { get; set; }
        public string? TicketId { get; set; }
    }
}

