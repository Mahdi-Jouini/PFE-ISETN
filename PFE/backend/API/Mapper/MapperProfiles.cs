using AutoMapper;
using Domain.DTOs;
using Domain.Models;

namespace API.Mapper
{
    public class MapperProfiles : Profile
    {
        public MapperProfiles()
        {
            CreateMap<UserDTO, User>()
                .ForMember(dest => dest.IsApproved, opt => opt.MapFrom(_ => false));
            CreateMap<User, UserDTO>();

        }
    }


}

