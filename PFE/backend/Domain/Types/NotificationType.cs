namespace Domain.Types
{
    public enum NotificationType
    {
        // Project related
        ProjectCreated,
        ProjectUpdated,
        ProjectDeleted,

        // Membership related
        MemberInvited,
        MemberJoined,
        MemberLeft,
        MemberRoleChanged,

        // Sprint related
        SprintCreated,
        SprintStarted,
        SprintCompleted,

        // Ticket related
        TicketCreated,
        TicketAssigned,
        TicketStatusChanged,
        TicketCompleted,

        // Communication
        MessageReceived,

        // General
        Information
    }
}