import { v4 as uuidv4 } from "uuid";
import { Todo } from "../../../domain/entities/Todo";
import { TodoRepository } from "../../../domain/repositories/TodoRepository";

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(title: string, description: string): Promise<Todo> {
    const todo = new Todo({
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return await this.todoRepository.create(todo);
  }
}
