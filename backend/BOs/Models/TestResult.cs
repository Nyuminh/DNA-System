using System;
using System.Collections.Generic;

namespace BOs.Models;

public partial class TestResult
{
    public string Resultid { get; set; } = null!;

    public string? Customerid { get; set; }

    public string? Staffid { get; set; }

    public string? Serviceid { get; set; }

    public DateOnly? Date { get; set; }

    public string? Description { get; set; }

    public string? Status { get; set; }

    public virtual User? Customer { get; set; }

    public virtual Service? Service { get; set; }

    public virtual User? Staff { get; set; }
}
