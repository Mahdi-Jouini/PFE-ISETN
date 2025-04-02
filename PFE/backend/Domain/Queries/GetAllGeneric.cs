
using MediatR;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Domain.Queries
{
   public class GetAllGeneric<TEntity> : IRequest<IEnumerable<TEntity>> where TEntity : class
    {
        public Expression<Func<TEntity, bool>> Condition { get; set; }
        public Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> Includes { get; set; }

        public GetAllGeneric(Expression<Func<TEntity, bool>> condition = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> includes = null)
        {
            Condition = condition;
            Includes = includes;
        }
    }
}
