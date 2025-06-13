using System;
using System.Collections.Generic;

namespace BOs.Models;

public partial class Course
{
    public string Courseid { get; set; } = null!;

    public string? Managerid { get; set; }

    public string? Title { get; set; }

    public DateOnly? Date { get; set; }

    public string? Description { get; set; }

    public string? Image { get; set; }

    public virtual User? Manager { get; set; }
}
