using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BOs.Models;

public partial class DnasystemContext : DbContext
{
    public DnasystemContext()
    {
    }

    public DnasystemContext(DbContextOptions<DnasystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<InvoiceDetail> InvoiceDetails { get; set; }

    public virtual DbSet<Kit> Kits { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<TestResult> TestResults { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer(GetConnectionString());
    private string GetConnectionString()
    {
        return new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build()
            .GetConnectionString("DNASystem");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Bookingid).HasName("PK__Booking__C6D307051A7EF144");

            entity.ToTable("Booking");

            entity.Property(e => e.Bookingid)
                .HasMaxLength(10)
                .HasColumnName("bookingid");
            entity.Property(e => e.Customerid)
                .HasMaxLength(10)
                .HasColumnName("customerid");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Serviceid)
                .HasMaxLength(10)
                .HasColumnName("serviceid");
            entity.Property(e => e.Staffid)
                .HasMaxLength(10)
                .HasColumnName("staffid");

            entity.HasOne(d => d.Customer).WithMany(p => p.BookingCustomers)
                .HasForeignKey(d => d.Customerid)
                .HasConstraintName("FK__Booking__custome__44FF419A");

            entity.HasOne(d => d.Service).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.Serviceid)
                .HasConstraintName("FK__Booking__service__46E78A0C");

            entity.HasOne(d => d.Staff).WithMany(p => p.BookingStaffs)
                .HasForeignKey(d => d.Staffid)
                .HasConstraintName("FK__Booking__staffid__45F365D3");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.Courseid).HasName("PK__Course__2AAB4BC9FBCA2146");

            entity.ToTable("Course");

            entity.Property(e => e.Courseid)
                .HasMaxLength(10)
                .HasColumnName("courseid");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.Managerid)
                .HasMaxLength(10)
                .HasColumnName("managerid");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");

            entity.HasOne(d => d.Manager).WithMany(p => p.Courses)
                .HasForeignKey(d => d.Managerid)
                .HasConstraintName("FK__Course__manageri__403A8C7D");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.Feedbackid).HasName("PK__Feedback__2612C14C1F4DA399");

            entity.ToTable("Feedback");

            entity.Property(e => e.Feedbackid)
                .HasMaxLength(10)
                .HasColumnName("feedbackid");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.Customerid)
                .HasMaxLength(10)
                .HasColumnName("customerid");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.Serviceid)
                .HasMaxLength(10)
                .HasColumnName("serviceid");

            entity.HasOne(d => d.Customer).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.Customerid)
                .HasConstraintName("FK__Feedback__custom__4E88ABD4");

            entity.HasOne(d => d.Service).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.Serviceid)
                .HasConstraintName("FK__Feedback__servic__4F7CD00D");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Invoiceid).HasName("PK__Invoice__12534D14FA555B76");

            entity.ToTable("Invoice");

            entity.Property(e => e.Invoiceid)
                .HasMaxLength(10)
                .HasColumnName("invoiceid");
            entity.Property(e => e.Bookingid)
                .HasMaxLength(10)
                .HasColumnName("bookingid");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");

            entity.HasOne(d => d.Booking).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.Bookingid)
                .HasConstraintName("FK__Invoice__booking__52593CB8");
        });

        modelBuilder.Entity<InvoiceDetail>(entity =>
        {
            entity.HasKey(e => e.Invoicedetailid).HasName("PK__InvoiceD__FDA4D7FABC80C8E7");

            entity.ToTable("InvoiceDetail");

            entity.Property(e => e.Invoicedetailid)
                .HasMaxLength(10)
                .HasColumnName("invoicedetailid");
            entity.Property(e => e.Invoiceid)
                .HasMaxLength(10)
                .HasColumnName("invoiceid");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Serviceid)
                .HasMaxLength(10)
                .HasColumnName("serviceid");

            entity.HasOne(d => d.Invoice).WithMany(p => p.InvoiceDetails)
                .HasForeignKey(d => d.Invoiceid)
                .HasConstraintName("FK__InvoiceDe__invoi__5535A963");

            entity.HasOne(d => d.Service).WithMany(p => p.InvoiceDetails)
                .HasForeignKey(d => d.Serviceid)
                .HasConstraintName("FK__InvoiceDe__servi__5629CD9C");
        });

        modelBuilder.Entity<Kit>(entity =>
        {
            entity.HasKey(e => e.Kitid).HasName("PK__Kit__98D52B28BBD99AA2");

            entity.ToTable("Kit");

            entity.Property(e => e.Kitid)
                .HasMaxLength(10)
                .HasColumnName("kitid");
            entity.Property(e => e.Customerid)
                .HasMaxLength(10)
                .HasColumnName("customerid");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Staffid)
                .HasMaxLength(10)
                .HasColumnName("staffid");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");

            entity.HasOne(d => d.Customer).WithMany(p => p.KitCustomers)
                .HasForeignKey(d => d.Customerid)
                .HasConstraintName("FK__Kit__customerid__3C69FB99");

            entity.HasOne(d => d.Staff).WithMany(p => p.KitStaffs)
                .HasForeignKey(d => d.Staffid)
                .HasConstraintName("FK__Kit__staffid__3D5E1FD2");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Roleid).HasName("PK__Role__CD994BF2499E5AAF");

            entity.ToTable("Role");

            entity.Property(e => e.Roleid)
                .HasMaxLength(10)
                .HasColumnName("roleid");
            entity.Property(e => e.Rolename)
                .HasMaxLength(50)
                .HasColumnName("rolename");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.Serviceid).HasName("PK__Service__45516CA7E2932C41");

            entity.ToTable("Service");

            entity.Property(e => e.Serviceid)
                .HasMaxLength(10)
                .HasColumnName("serviceid");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
        });

        modelBuilder.Entity<TestResult>(entity =>
        {
            entity.HasKey(e => e.Resultid).HasName("PK__TestResu__C6EBD0432D6185E9");

            entity.ToTable("TestResult");

            entity.Property(e => e.Resultid)
                .HasMaxLength(10)
                .HasColumnName("resultid");
            entity.Property(e => e.Customerid)
                .HasMaxLength(10)
                .HasColumnName("customerid");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Serviceid)
                .HasMaxLength(10)
                .HasColumnName("serviceid");
            entity.Property(e => e.Staffid)
                .HasMaxLength(10)
                .HasColumnName("staffid");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");

            entity.HasOne(d => d.Customer).WithMany(p => p.TestResultCustomers)
                .HasForeignKey(d => d.Customerid)
                .HasConstraintName("FK__TestResul__custo__49C3F6B7");

            entity.HasOne(d => d.Service).WithMany(p => p.TestResults)
                .HasForeignKey(d => d.Serviceid)
                .HasConstraintName("FK__TestResul__servi__4BAC3F29");

            entity.HasOne(d => d.Staff).WithMany(p => p.TestResultStaffs)
                .HasForeignKey(d => d.Staffid)
                .HasConstraintName("FK__TestResul__staff__4AB81AF0");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Userid).HasName("PK__Users__CBA1B2575AC8651D");

            entity.Property(e => e.Userid)
                .HasMaxLength(10)
                .HasColumnName("userid");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Fullname)
                .HasMaxLength(50)
                .HasColumnName("fullname");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("gender");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.Password)
                .HasMaxLength(20)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Roleid)
                .HasMaxLength(10)
                .HasColumnName("roleid");
            entity.Property(e => e.Username)
                .HasMaxLength(20)
                .HasColumnName("username");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.Roleid)
                .HasConstraintName("FK__Users__image__398D8EEE");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
