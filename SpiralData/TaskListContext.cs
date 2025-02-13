using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class TaskListContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskListEntity>().HasKey("Id");
            modelBuilder.Entity<TaskListEntity>().ToTable("TaskList");
            base.OnModelCreating(modelBuilder);
        }
        public List<TaskListEntity> GetList()
        {
            var lst = new List<TaskListEntity>();
            lst = TaskLists.Where(t => t.Status == 1).ToList();
            return lst;
        }
    }
}
