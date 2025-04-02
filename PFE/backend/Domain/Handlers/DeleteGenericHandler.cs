using Domain.Commands;
using Domain.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Handler
{
    public class DeleteGenericHandler<TEntity> : IRequestHandler<DeleteGeneric<TEntity>, string> where TEntity : class
    {
        private readonly IRepository<TEntity> repositories;

        public DeleteGenericHandler(IRepository<TEntity> Repository)
        {
            repositories = Repository;
        }

        public Task<string> Handle(DeleteGeneric<TEntity> request, CancellationToken cancellationToken)
        {
            var result = repositories.RemouveById(request.Id);
            return Task.FromResult(result);
        }

        //public Task<string> Handle(DeleteGeneric<TEntity> request, CancellationToken cancellationToken)
        //{
        //    var result = repositories.Update(request.Obj);
        //    return Task.FromResult(result);
        //}


    }
}
