using System;
using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Sprint> Sprints { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketMember> TicketMembers { get; set; }
        public DbSet<FilesAttachment> FilesAttachments { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<UserNotification> UserNotifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-many relationship between Ticket and Member via TicketMember
            modelBuilder.Entity<TicketMember>()
                .HasKey(tm => new { tm.TicketId, tm.MemberId });

            modelBuilder.Entity<TicketMember>()
                .HasOne(tm => tm.Ticket)
                .WithMany(t => t.TicketMembers)
                .HasForeignKey(tm => tm.TicketId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TicketMember>()
                .HasOne(tm => tm.Member)
                .WithMany(m => m.TicketMembers)
                .HasForeignKey(tm => tm.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            // File attachment relationships
            modelBuilder.Entity<FilesAttachment>()
                .HasOne(f => f.Project)
                .WithMany(p => p.FileAttachments)
                .HasForeignKey(f => f.ProjectId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            modelBuilder.Entity<FilesAttachment>()
                .HasOne(f => f.Sprint)
                .WithMany(s => s.FileAttachments)
                .HasForeignKey(f => f.SprintId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            modelBuilder.Entity<FilesAttachment>()
                .HasOne(f => f.Ticket)
                .WithMany(t => t.FileAttachments)
                .HasForeignKey(f => f.TicketId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            // Notification relationships

            modelBuilder.Entity<UserNotification>()
            .HasKey(un => new { un.UserId, un.NotificationId });

            modelBuilder.Entity<UserNotification>()
                .HasOne(un => un.User)
                .WithMany(u => u.UserNotifications)
                .HasForeignKey(un => un.UserId);

            modelBuilder.Entity<UserNotification>()
                .HasOne(un => un.Notification)
                .WithMany(n => n.UserNotifications)
                .HasForeignKey(un => un.NotificationId);

        }
    }
}