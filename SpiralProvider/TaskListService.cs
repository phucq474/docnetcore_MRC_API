using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralService
{
    public interface ITaskListService
    {
        List<TaskListEntity> GetList();
    }
    public class TaskListService: ITaskListService
    {
        private TaskListContext _context;
        public TaskListService(TaskListContext context)
        {
            _context = context;
        }
        public List<TaskListEntity> GetList()
        {
            return _context.GetList();
        }
    }
}
