import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  PutCommandInput,
  GetCommandInput,
  ScanCommandInput,
  UpdateCommandInput,
  DeleteCommandInput
} from "@aws-sdk/lib-dynamodb";
import { Todo, TodoProps } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export class DynamoDBTodoRepository implements TodoRepository {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.TODOS_TABLE!;
  }

  async create(todo: Todo): Promise<Todo> {
    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: todo.toJSON(),
    };

    await this.docClient.send(new PutCommand(params));
    return todo;
  }

  async findById(id: string): Promise<Todo | null> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: { id },
    };

    const { Item } = await this.docClient.send(new GetCommand(params));
    if (!Item) return null;

    return new Todo(Item as TodoProps);
  }

  async findAll(): Promise<Todo[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
    };

    const { Items } = await this.docClient.send(new ScanCommand(params));
    return (Items || []).map((item) => new Todo(item as TodoProps));
  }

  async update(todo: Todo): Promise<Todo> {
    const params: UpdateCommandInput = {
      TableName: this.tableName,
      Key: { id: todo.id },
      UpdateExpression:
        "SET title = :title, description = :description, completed = :completed, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":title": todo.title,
        ":description": todo.description,
        ":completed": todo.completed,
        ":updatedAt": todo.updatedAt,
      },
      ReturnValues: "ALL_NEW"
    };

    const { Attributes } = await this.docClient.send(new UpdateCommand(params));
    return new Todo(Attributes as TodoProps);
  }

  async delete(id: string): Promise<void> {
    const params: DeleteCommandInput = {
      TableName: this.tableName,
      Key: { id },
    };

    await this.docClient.send(new DeleteCommand(params));
  }
}