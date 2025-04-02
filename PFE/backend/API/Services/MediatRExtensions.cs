using Domain.Commands;
using Domain.Handler;
using Domain.Queries;
using MediatR;

namespace API.Services
{
    public static class MediatRExtensions
    {
        public static IServiceCollection RegisterGenericHandlerFor<TEntity>(this IServiceCollection services)
            where TEntity : class
        {


            //Queries

            services.AddTransient<IRequestHandler<GetByIDGeneric<TEntity>, TEntity>,
            GetGenericByIDHandler<TEntity>>();

            services.AddTransient<IRequestHandler<GetAllGeneric<TEntity>, IEnumerable<TEntity>>,
            GetAllGenericHandler<TEntity>>();

            //Commands

            services.AddTransient<IRequestHandler<DeleteGeneric<TEntity>, string>,
            DeleteGenericHandler<TEntity>>();

            services.AddTransient<IRequestHandler<PostGeneric<TEntity>, string>,
            PostGenericHandler<TEntity>>();

            services.AddTransient<IRequestHandler<PutGeneric<TEntity>, string>,
            PutGenericHandler<TEntity>>();

            services.AddTransient<IRequestHandler<RemoveByEntityGenericCommand<TEntity>, string>,
            ReomveByEntityGenericHandler<TEntity>>();

            return services;
        }
    }
}
