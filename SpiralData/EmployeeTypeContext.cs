using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralData
{
    public class EmployeeTypeContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmployeeTypesEntity>().HasKey("Id");
            modelBuilder.Entity<EmployeeTypesEntity>().ToTable("EmployeeTypes");
            base.OnModelCreating(modelBuilder);
        }
    }
}
