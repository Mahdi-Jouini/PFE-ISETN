using Microsoft.Extensions.Caching.Memory;
using System;

namespace API.Services
{
    public class OtpService
    {
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _otpExpiry = TimeSpan.FromMinutes(5);

        public OtpService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string GenerateAndStoreOtp(string email)
        {
            var otp = new Random().Next(10000, 99999).ToString();
            _cache.Set(email, otp, _otpExpiry);
            Console.WriteLine($"[OTP STORED] {email}: {otp}");
            return otp;
        }

        public bool ValidateOtp(string email, string otp)
        {
            if (_cache.TryGetValue(email, out string? storedOtp))
            {
                if (storedOtp == otp)
                {
                    _cache.Remove(email);
                    return true;
                }
            }
            return false;
        }

        public string? GetStoredOtp(string email)
        {
            var otp = _cache.Get(email);
            Console.WriteLine($"[OTP FETCHED] {email}: {otp}");
            return otp?.ToString();
        }

    }
}
