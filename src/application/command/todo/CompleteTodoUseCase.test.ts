import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompleteTodoUseCase } from './CompleteTodoUseCase';
import { Todo } from '../../../domain/entities/Todo';
import { TodoRepository } from '../../../domain/repositories/TodoRepository';

describe('CompleteTodoUseCase', () => {
  let todoRepository: TodoRepository;
  let completeTodoUseCase: CompleteTodoUseCase;
  let mockTodo: Todo;

  beforeEach(() => {
    mockTodo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      markAsCompleted: vi.fn()
    } as Todo;

    todoRepository = {
      findById: vi.fn(),
      update: vi.fn()
    } as unknown as TodoRepository;

    completeTodoUseCase = new CompleteTodoUseCase(todoRepository);
  });

  it('should complete a todo successfully', async () => {
    vi.spyOn(todoRepository, 'findById').mockResolvedValue(mockTodo);
    vi.spyOn(todoRepository, 'update').mockResolvedValue({
      ...mockTodo,
      completed: true
    } as Todo);

    const result = await completeTodoUseCase.execute('1');

    expect(todoRepository.findById).toHaveBeenCalledWith('1');
    expect(mockTodo.markAsCompleted).toHaveBeenCalled();
    expect(todoRepository.update).toHaveBeenCalledWith(mockTodo);
    expect(result).toEqual({
      ...mockTodo,
      completed: true
    });
  });

  it('should throw error when todo is not found', async () => {
    vi.spyOn(todoRepository, 'findById').mockResolvedValue(null);

    await expect(completeTodoUseCase.execute('1')).rejects.toThrow('Todo not found');
    expect(todoRepository.findById).toHaveBeenCalledWith('1');
    expect(todoRepository.update).not.toHaveBeenCalled();
  });

  it('should handle repository errors properly', async () => {
    vi.spyOn(todoRepository, 'findById').mockRejectedValue(new Error('Database error'));

    await expect(completeTodoUseCase.execute('1')).rejects.toThrow('Database error');
    expect(todoRepository.update).not.toHaveBeenCalled();
  });
});