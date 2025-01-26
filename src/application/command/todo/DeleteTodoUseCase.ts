import { TodoRepository } from "../../../domain/repositories/TodoRepository";

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
