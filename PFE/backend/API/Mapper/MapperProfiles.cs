using AutoMapper;
using Domain.DTOs;
using Domain.Models;

namespace API.Mapper
{
    public class MapperProfiles : Profile
    {
        public MapperProfiles()
        {
            // User mappings
            CreateMap<UserDTO, User>();
            CreateMap<User, UserDTO>();

            // Project mappings
            CreateMap<ProjectDTO, Project>();
            CreateMap<Project, ProjectDTO>();

            // Member mappings
            CreateMap<MemberDTO, Member>();
            CreateMap<Member, MemberDTO>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));


            CreateMap<SprintDTO, Sprint>().ReverseMap();
            CreateMap<TicketDTO, Ticket>().ReverseMap();
        }
}


}

