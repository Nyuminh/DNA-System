using System;
using System.Collections.Generic;

namespace BOs.Models;

public partial class Feedback
{
    public string Feedbackid { get; set; } = null!;

    public string? Customerid { get; set; }

    public string? Serviceid { get; set; }

    public string? Comment { get; set; }

    public int? Rating { get; set; }

    public virtual User? Customer { get; set; }

    public virtual Service? Service { get; set; }
}
