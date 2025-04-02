using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Commands
{
   public class PostGeneric<TEntity> : IRequest<string> where TEntity : class
    {
        public PostGeneric(TEntity obj)
        {
            Obj = obj;
        }

        public TEntity Obj { get; }
    }
}
