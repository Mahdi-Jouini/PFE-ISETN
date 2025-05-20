using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class OtpVerificationRequest
    {
        public string EmailAddress { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}

