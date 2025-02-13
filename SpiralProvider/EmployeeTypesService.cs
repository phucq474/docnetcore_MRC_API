using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SpiralService
{
    public interface IEmployeeTypesService
    {
        EmployeeTypesEntity GetById(int Id);
        List<EmployeeTypesEntity> GetDynamic();
    }
    public class EmployeeTypesService : IEmployeeTypesService
    {
        private readonly EmployeeTypeContext _context;
        public EmployeeTypesService (EmployeeTypeContext context)
        {
            _context = context;
        }
        public EmployeeTypesEntity GetById(int Id)
        {
            var data = _context.EmployeeTypes.Where(e => e.Id == Id).FirstOrDefault();
            if(data != null)
            {
                return data;
            }
            return null;
        }

        public List<EmployeeTypesEntity> GetDynamic()
        {
            var data = _context.EmployeeTypes.Where(e => e.Status == 1).ToList();
            if (data != null)
            {
                return data;
            }
            return null;
        }
    }
}
