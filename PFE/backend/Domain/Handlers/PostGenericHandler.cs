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
    public class PostGenericHandler<TEntity> : IRequestHandler<PostGeneric<TEntity>, string> where TEntity : class
    {
        private readonly IRepository<TEntity> repositories;

        public PostGenericHandler(IRepository<TEntity> Repository)
        {
            repositories = Repository;
        }

        public Task<string> Handle(PostGeneric<TEntity> request, CancellationToken cancellationToken)
        {
            var result = repositories.Add(request.Obj);
            return Task.FromResult(result);
        }
    }
}
