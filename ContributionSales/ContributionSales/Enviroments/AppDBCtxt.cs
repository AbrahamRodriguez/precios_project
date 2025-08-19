using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data.Entity;          // DbContext
using System.Data.Entity.ModelConfiguration; // Fluent API

namespace ContributionSales.Enviroments
{
  public class AppDBCtxt : DbContext
  {
    public AppDBCtxt() : base("name=AppDBCtxt") { }
  }
}
