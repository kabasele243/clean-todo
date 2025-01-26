import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string, title: string, description: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    todo.update(title, description);
    return await this.todoRepository.update(todo);
  }
}
