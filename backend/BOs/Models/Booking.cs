using System;
using System.Collections.Generic;

namespace BOs.Models;

public partial class Booking
{
    public string Bookingid { get; set; } = null!;

    public string? Customerid { get; set; }

    public DateOnly? Date { get; set; }

    public string? Staffid { get; set; }

    public string? Serviceid { get; set; }

    public virtual User? Customer { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual Service? Service { get; set; }

    public virtual User? Staff { get; set; }
}
