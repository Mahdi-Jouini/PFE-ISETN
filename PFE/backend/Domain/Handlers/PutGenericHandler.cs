using Domain.Commands;
using Domain.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ProjetPoulinaDomain.Handler
{

    public class PutGenericHandler<TEntity> : IRequestHandler<PutGeneric<TEntity>, string> where TEntity : class
    {
        private readonly IRepository<TEntity> repositories;

        public PutGenericHandler(IRepository<TEntity> Repository)
        {
            repositories = Repository;
        }

        public Task<string> Handle(PutGeneric<TEntity> request, CancellationToken cancellationToken)
        {
            var result = repositories.Update(request.Obj);
            return Task.FromResult(result);
        }
    }
}
