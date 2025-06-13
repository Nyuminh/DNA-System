using System;
using System.Collections.Generic;

namespace BOs.Models;

public partial class Invoice
{
    public string Invoiceid { get; set; } = null!;

    public string? Bookingid { get; set; }

    public DateOnly? Date { get; set; }

    public decimal? Price { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual ICollection<InvoiceDetail> InvoiceDetails { get; set; } = new List<InvoiceDetail>();
}
