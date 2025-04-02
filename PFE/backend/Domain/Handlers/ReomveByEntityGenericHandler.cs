using Domain.Interface;
using Domain.Commands;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ProjetPoulinaDomain.Handler
{
    public class ReomveByEntityGenericHandler<TEntity> : IRequestHandler<RemoveByEntityGenericCommand<TEntity>, string> where TEntity : class

    {
        public IRepository<TEntity> GenericRepository { get; set; }
        public ReomveByEntityGenericHandler(IRepository<TEntity> genericRepository)
        {
            GenericRepository = genericRepository;
        }

        public Task<string> Handle(RemoveByEntityGenericCommand<TEntity> request, CancellationToken cancellationToken)
        {
            var result = GenericRepository.Remove(request.Entity);
            return Task.FromResult(result);
        }
    }
}
