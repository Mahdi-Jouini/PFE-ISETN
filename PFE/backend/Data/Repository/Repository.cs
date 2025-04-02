using Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Domain.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace GestionUtilisateur.Data.Repository
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly AppDbContext Context;
        public Repository(AppDbContext context)
        {
            Context = context;
        }

        public TEntity GetByID(Guid id)
        {
            return Context.Set<TEntity>().Find(id);
        }



        public string Add(TEntity entity)
        {
            try
            {
                Context.Set<TEntity>().Add(entity);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);

            }
            Context.SaveChanges();
            return "Aded successfuly";
        }

        public string AddRange(IEnumerable<TEntity> entities)
        {
            try
            {
                Context.Set<TEntity>().AddRange(entities);
            }
            catch (Exception e)
            {
                var s = e.ToString();
            }
            Context.SaveChanges();
            return "Aded successfuly";
        }


        public TEntity Get(Expression<Func<TEntity, bool>> condition = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> includes = null)
        {
            try
            {
                IQueryable<TEntity> query = Context.Set<TEntity>();

                if (includes != null)
                {
                    query = includes(query);
                }

                if (condition != null)
                {
                    return query.FirstOrDefault(condition);
                }

                return query.FirstOrDefault();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public virtual IEnumerable<TEntity> GetList(Expression<Func<TEntity, bool>> condition = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> includes = null)
        {
            IQueryable<TEntity> query = Context.Set<TEntity>();

            if (includes != null)
            {
                query = includes(query);
            }

            if (condition != null)
            {
                return query.Where(condition).ToList();
            }

            return query.ToList();
        }

        public string Remove(TEntity entity)
        {
            try
            {
                Context.Set<TEntity>().Remove(entity);
            }
            catch (Exception ex)
            {
                var s = ex.ToString();
            }
            Context.SaveChanges();
            return "Removed";
        }

        public string RemoveRange(IEnumerable<TEntity> entites)
        {
            try
            {
                Context.Set<TEntity>().RemoveRange(entites);

            }
            catch (Exception ex)
            {
                ex.ToString();
            }
            Context.SaveChanges();
            return "Remouved";
        }


        public TEntity GetById(Guid id)
        {
            IQueryable<TEntity> query = Context.Set<TEntity>();
            return Context.Set<TEntity>().FirstOrDefault();
        }

        public string Update(TEntity entity)
        {
            Context.Entry(entity).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            Context.SaveChanges();
            return "Updated";
        }


        public async Task SaveAsync()
        {
            await Context.SaveChangesAsync();
        }

        public string RemouveById(Guid id)
        {
            TEntity entitie = Context.Set<TEntity>().Find(id);
            Context.Set<TEntity>().Remove(entitie);
            Context.SaveChanges();
            return "Delete Done";
        }
    }
}