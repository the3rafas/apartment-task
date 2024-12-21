import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGqlSuccessResponse } from './gql-generator';

@Injectable()
export class GqlResponseInterceptor<T>
  implements NestInterceptor<T, IGqlSuccessResponse<T>>
{
  constructor() {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IGqlSuccessResponse<T>> {
    const now = Date.now();
    return next.handle().pipe(
      map((res) => {
        // To continue listening, subscription have to return PubSubAsyncIterator
        return {
          code: 200,
          success: true,
          message: 'Operation done successfully',
          data: res,
        };
      }),
    );
  }
}
