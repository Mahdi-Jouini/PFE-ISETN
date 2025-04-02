using AutoMapper;
using Domain.DTOs;
using Domain.Models;

namespace API.Mapper
{
    public class MapperProfiles : Profile
    {
        public MapperProfiles()
        {
            CreateMap<UtilisateurDTO, Utilisateur>()
                .ForMember(dest => dest.IsApproved, opt => opt.MapFrom(_ => false));
            CreateMap<Utilisateur, UtilisateurDTO>();

        }
    }


}

