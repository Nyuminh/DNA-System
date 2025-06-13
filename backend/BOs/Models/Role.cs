using System;
using System.Collections.Generic;

namespace BOs.Models;

public partial class Role
{
    public string Roleid { get; set; } = null!;

    public string? Rolename { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
