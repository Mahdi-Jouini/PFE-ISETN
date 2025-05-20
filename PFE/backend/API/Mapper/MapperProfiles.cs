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

            // FilesAttachment mappings
            CreateMap<FilesAttachmentDTO, FilesAttachment>().ReverseMap();

            // Message mappings
            CreateMap<Message, MessageDTO>()
                .ForMember(dest => dest.SenderName, opt => opt.Ignore())
                .ForMember(dest => dest.SenderAvatar, opt => opt.Ignore());

            CreateMap<MessageDTO, Message>();
            CreateMap<SprintDTO, Sprint>().ReverseMap();
            CreateMap<TicketDTO, Ticket>().ReverseMap();

            // Notification mappings
            CreateMap<Notification, NotificationDTO>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project != null ? src.Project.Title : null))
                .ForMember(dest => dest.SprintName, opt => opt.MapFrom(src => src.Sprint != null ? src.Sprint.Title : null))
                .ForMember(dest => dest.TicketTitle, opt => opt.MapFrom(src => src.Ticket != null ? src.Ticket.Title : null))
                .ForMember(dest => dest.ActorName, opt => opt.MapFrom(src => src.Actor != null ? (src.Actor.FirstName + src.Actor.LastName) : null))
                .ForMember(dest => dest.IsRead, opt => opt.Ignore());

            // Invitation mappings
            CreateMap<InvitationDTO, Invitation>().ReverseMap(); ;

        }
}


}

