import { createParamDecorator, InternalServerErrorException, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { DataLoaderInterceptor, GET_LOADER_CONTEXT_KEY } from '../interceptors/data-loader.interceptor';
import { NestDataLoader } from '../types/loader.interface';

export const Loader: (type: Type<NestDataLoader>) => ParameterDecorator = createParamDecorator(
  (type: Type<NestDataLoader>, context:any) => {
    const [_,__,ctx] = context.args
    if (ctx[GET_LOADER_CONTEXT_KEY] === undefined) {
      throw new InternalServerErrorException(`
        You should provide interceptor ${DataLoaderInterceptor.name} globaly with ${APP_INTERCEPTOR}
      `);
    }
    return ctx[GET_LOADER_CONTEXT_KEY](type);
  },
);
