import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { DynamoDBTodoRepository } from "../../infrastructure/repositories/DynamoDBRepository";
import { CreateTodoUseCase } from "../../application/command/todo/CreateTodoUseCase";
import { GetTodoUseCase } from "../../application/query/todo/GetTodoUseCase";
import { ListTodosUseCase } from "../../application/query/todo/ListTodosUseCase";
import { UpdateTodoUseCase } from "../../application/command/todo/UpdateTodoUseCase";
import { CompleteTodoUseCase } from "../../application/command/todo/CompleteTodoUseCase";
import { DeleteTodoUseCase } from "../../application/command/todo/DeleteTodoUseCase";
import { validateSchema, todoSchemas } from "../schema/todoSchema";

const todoRepository = new DynamoDBTodoRepository();

interface CreateTodoBody {
  title: string;
  description: string;
}

interface UpdateTodoBody {
  title: string;
  description: string;
}

export const createTodo = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { title, description } = event.body as unknown as CreateTodoBody;
    const useCase = new CreateTodoUseCase(todoRepository);
    const todo = await useCase.execute(title, description);

    return {
      statusCode: 201,
      body: JSON.stringify(todo),
    };
  },
)
  .use(httpJsonBodyParser())
  .use(validateSchema(todoSchemas.createTodo))
  .use(httpErrorHandler());

export const getTodo = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id) throw new Error("Todo ID is required");

    const useCase = new GetTodoUseCase(todoRepository);
    const todo = await useCase.execute(id);

    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  },
).use(httpErrorHandler());

export const listTodos = middy(async (): Promise<APIGatewayProxyResult> => {
  const useCase = new ListTodosUseCase(todoRepository);
  const todos = await useCase.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(todos),
  };
}).use(httpErrorHandler());

export const updateTodo = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id) throw new Error("Todo ID is required");

    const { title, description } = event.body as unknown as UpdateTodoBody;
    const useCase = new UpdateTodoUseCase(todoRepository);
    const todo = await useCase.execute(id, title, description);

    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  },
)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(validateSchema(todoSchemas.updateTodo));

export const completeTodo = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id) throw new Error("Todo ID is required");

    const useCase = new CompleteTodoUseCase(todoRepository);
    const todo = await useCase.execute(id);

    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  },
).use(httpErrorHandler())
  .use(validateSchema(todoSchemas.idParam));

export const deleteTodo = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id) throw new Error("Todo ID is required");

    const useCase = new DeleteTodoUseCase(todoRepository);
    await useCase.execute(id);

    return {
      statusCode: 204,
      body: "",
    };
  },
).use(httpErrorHandler());
