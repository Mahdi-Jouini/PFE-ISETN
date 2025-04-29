using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.DTOs
{
    /* public class SprintDto
     {
         public string SprintId { get; set; }
         public string UserStory { get; set; }
         public string Title { get; set; }
         public string Description { get; set; }
         public DateTime StartDate { get; set; }
         public DateTime EndDate { get; set; }
         public string ProjectId { get; set; }
     }*/

        public class SprintDTO
        {
            public string SprintId { get; set; }
            public string UserStory { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string ProjectId { get; set; }
      
        }
    }

