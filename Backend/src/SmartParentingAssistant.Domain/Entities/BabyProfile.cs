using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Domain.Entities
{
    public class BabyProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty; // Link to parent user
        public string Name { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string FeedingType { get; set; } = string.Empty; // e.g. "Breastfeeding", "Formula"
        public string? Notes { get; set; } // optional remarks
    }
}
