using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace SpiralData
{
    public class OOLListsContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OOLListsEntity>().HasKey("Id");
            modelBuilder.Entity<OOLListsEntity>().ToTable("OOLLists");
            base.OnModelCreating(modelBuilder);
        }
        public List<OOLListsEntity> GetList(int AccountId)
        {
            var data = OOLLists.Where(o => o.AccountId==AccountId && o.Status == 1).ToList();
            if (data != null)
                return data;
            else
                return null;
        }
    }
}
