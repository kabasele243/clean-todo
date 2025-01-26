import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTodoUseCase } from './GetTodoUseCase';
import { Todo } from '../../../domain/entities/Todo';
import { TodoRepository } from '../../../domain/repositories/TodoRepository';

describe('GetTodoUseCase', () => {
  let todoRepository: TodoRepository;
  let getTodoUseCase: GetTodoUseCase;
  let mockTodo: Todo;

  beforeEach(() => {
    mockTodo = {
      id: '1',
      title: 'Test Todo',
      description: 'Test Description'
    } as Todo;

    todoRepository = {
      findById: vi.fn()
    } as unknown as TodoRepository;

    getTodoUseCase = new GetTodoUseCase(todoRepository);
  });

  it('should get a todo successfully', async () => {
    vi.spyOn(todoRepository, 'findById').mockResolvedValue(mockTodo);

    const result = await getTodoUseCase.execute('1');

    expect(todoRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockTodo);
  });

  it('should throw error when todo is not found', async () => {
    vi.spyOn(todoRepository, 'findById').mockResolvedValue(null);

    await expect(getTodoUseCase.execute('1')).rejects.toThrow('Todo not found');
  });

  it('should handle repository errors', async () => {
    vi.spyOn(todoRepository, 'findById').mockRejectedValue(new Error('Database error'));

    await expect(getTodoUseCase.execute('1')).rejects.toThrow('Database error');
  });
});