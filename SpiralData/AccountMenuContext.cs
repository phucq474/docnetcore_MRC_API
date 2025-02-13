using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralData
{
   public class AccountMenuContext:DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AccountMenuEntity>().HasKey("Id");
            modelBuilder.Entity<AccountMenuEntity>().ToTable("AccountMenus");
            base.OnModelCreating(modelBuilder);
        }
    }
}
