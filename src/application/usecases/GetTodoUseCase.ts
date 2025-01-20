import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export class GetTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return todo;
  }
}
