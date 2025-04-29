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
        public DbSet<ProjectFile> Files { get; set; }

        public DbSet<TicketMember> TicketMembers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-many relationship between Ticket and Member via TicketMember
            modelBuilder.Entity<TicketMember>()
                .HasKey(tm => new { tm.TicketId, tm.MemberId }); // Composite primary key

            modelBuilder.Entity<TicketMember>()
                .HasOne(tm => tm.Ticket)
                .WithMany(t => t.TicketMembers)
                .HasForeignKey(tm => tm.TicketId)
                .OnDelete(DeleteBehavior.Restrict); // Avoiding cascade delete on Ticket

            modelBuilder.Entity<TicketMember>()
                .HasOne(tm => tm.Member)
                .WithMany(m => m.TicketMembers)
                .HasForeignKey(tm => tm.MemberId)
                .OnDelete(DeleteBehavior.Restrict); // Avoiding cascade delete on Member
        }

    }
}