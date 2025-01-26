import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTodoUseCase } from './DeleteTodoUseCase';
import { TodoRepository } from '../../../domain/repositories/TodoRepository';

describe('DeleteTodoUseCase', () => {
  let todoRepository: TodoRepository;
  let deleteTodoUseCase: DeleteTodoUseCase;

  beforeEach(() => {
    todoRepository = {
      delete: vi.fn()
    } as unknown as TodoRepository;

    deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
  });

  it('should delete a todo successfully', async () => {
    vi.spyOn(todoRepository, 'delete').mockResolvedValue();

    await deleteTodoUseCase.execute('1');

    expect(todoRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should handle repository errors', async () => {
    vi.spyOn(todoRepository, 'delete').mockRejectedValue(new Error('Database error'));

    await expect(deleteTodoUseCase.execute('1')).rejects.toThrow('Database error');
  });
});