using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralData
{
   public class UserPermissionContext:DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserPermissionEntity>().HasKey("Id");
            modelBuilder.Entity<UserPermissionEntity>().ToTable("UserPermissions");
            base.OnModelCreating(modelBuilder);
        }
    }
}
