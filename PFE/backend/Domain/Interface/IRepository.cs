using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Domain.Interface
{
    public interface IRepository<TEntity> where TEntity : class
    {

        TEntity GetByID(Guid id);
        string Add(TEntity entity);
        string AddRange(IEnumerable<TEntity> entities);
        string Update(TEntity entity);

        TEntity Get(Expression<Func<TEntity, bool>>? condition = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? includes = null);

        IEnumerable<TEntity> GetList(Expression<Func<TEntity, bool>>? condition = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? includes = null);

        string RemouveById(Guid id);
        string Remove(TEntity entity);
        string RemoveRange(IEnumerable<TEntity> entites);

        Task SaveAsync();
    }
}
