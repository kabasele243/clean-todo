import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListTodosUseCase } from './ListTodosUseCase';
import { Todo } from '../../../domain/entities/Todo';
import { TodoRepository } from '../../../domain/repositories/TodoRepository';

describe('ListTodosUseCase', () => {
  let todoRepository: TodoRepository;
  let listTodosUseCase: ListTodosUseCase;
  let mockTodos: Todo[];

  beforeEach(() => {
    mockTodos = [
      { id: '1', title: 'Todo 1' } as Todo,
      { id: '2', title: 'Todo 2' } as Todo
    ];

    todoRepository = {
      findAll: vi.fn()
    } as unknown as TodoRepository;

    listTodosUseCase = new ListTodosUseCase(todoRepository);
  });

  it('should list all todos successfully', async () => {
    vi.spyOn(todoRepository, 'findAll').mockResolvedValue(mockTodos);

    const result = await listTodosUseCase.execute();

    expect(todoRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockTodos);
  });

  it('should handle repository errors', async () => {
    vi.spyOn(todoRepository, 'findAll').mockRejectedValue(new Error('Database error'));

    await expect(listTodosUseCase.execute()).rejects.toThrow('Database error');
  });
});