
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Commands
{
    public class DeleteGeneric<TEntity> : IRequest<string> where TEntity : class
    {
        public DeleteGeneric(TEntity obj)
        {
            Obj = obj;
        }
        public TEntity Obj { get; }

        public DeleteGeneric(string id)
        {
            Id = id;
        }
        public string Id { get; }
    }
}
