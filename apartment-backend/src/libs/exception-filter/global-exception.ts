import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';

/**
 * Global exception filter to handle all types of exceptions
 * accept just HttpException and QueryFailedError
 */
@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
  /**
   * Formatted error response which all methods persist it to be returned
   */
  private response = {
    code: 500,
    success: false,
    message: 'Something went wrong!',
  };

  /**
   * Catches and processes exceptions
   * @param exception The thrown exception
   * @param host The arguments host
   * @returns Formatted error response
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      this.handleHttpException(exception);
    }
    if (exception instanceof QueryFailedError) {
      this.handleDatabaseException(exception);
    }

    return this.response;
  }

  /**
   * Handles HTTP exceptions
   * @param exception The HTTP exception
   */
  private handleHttpException(exception: HttpException) {
    const response = exception.getResponse() as {
      message: string[];
      statusCode: HttpStatus;
    };
    this.response.code = response.statusCode;
    this.response.message =
      response.message?.[0] ?? response.message.join(', ');
    Logger.error(response.message);
  }

  /**
   * Handles database query exceptions
   * @param exception The database query exception
   */
  private handleDatabaseException(exception: QueryFailedError) {
    this.response.code = 500;
    this.response.message = `Records already exist in database`;
    Logger.error(exception.message);
  }
}
