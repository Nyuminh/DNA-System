using System;
using System.Collections.Generic;

namespace BOs.Models;

public partial class InvoiceDetail
{
    public string Invoicedetailid { get; set; } = null!;

    public string? Invoiceid { get; set; }

    public string? Serviceid { get; set; }

    public int? Quantity { get; set; }

    public virtual Invoice? Invoice { get; set; }

    public virtual Service? Service { get; set; }
}
