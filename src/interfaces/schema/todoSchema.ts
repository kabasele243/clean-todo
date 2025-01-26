import Joi from 'joi';
import createHttpError from 'http-errors';
import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';

// Validation Schemas
export const todoSchemas = {
  createTodo: Joi.object({
    title: Joi.string().required().min(1).max(100),
    description: Joi.string().required().min(1).max(500)
  }),
  
  updateTodo: Joi.object({
    title: Joi.string().required().min(1).max(100),
    description: Joi.string().required().min(1).max(500)
  }),

  idParam: Joi.object({
    id: Joi.string().required().uuid()
  })
};

// Validation Middleware
export const validateSchema = (schema: Joi.Schema) => {
  const middleware: middy.MiddlewareObj<APIGatewayProxyEvent> = {
    before: async (request) => {
      try {
        if (schema === todoSchemas.idParam && request.event.pathParameters) {
          await schema.validateAsync(request.event.pathParameters, { abortEarly: false });
        } else if (request.event.body) {
          await schema.validateAsync(request.event.body, { abortEarly: false });
        }
      } catch (error) {
        throw createHttpError(400, {
          message: 'Validation failed',
          details: (error as any).details
        });
      }
    }
  };
  return middleware;
};