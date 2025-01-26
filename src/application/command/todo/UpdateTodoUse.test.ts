import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTodoUseCase } from './UpdateTodoUseCase';
import { Todo } from '../../../domain/entities/Todo';
import { TodoRepository } from '../../../domain/repositories/TodoRepository';

describe('UpdateTodoUseCase', () => {
  let todoRepository: TodoRepository;
  let updateTodoUseCase: UpdateTodoUseCase;
  let mockTodo: Todo;

  beforeEach(() => {
    mockTodo = {
      id: '1',
      title: 'Old Title',
      description: 'Old Description',
      update: vi.fn()
    } as Todo;

    todoRepository = {
      findById: vi.fn(),
      update: vi.fn()
    } as unknown as TodoRepository;

    updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
  });

  it('should update a todo successfully', async () => {
    const updatedTodo = {
      ...mockTodo,
      title: 'New Title',
      description: 'New Description'
    };

    vi.spyOn(todoRepository, 'findById').mockResolvedValue(mockTodo);
    vi.spyOn(todoRepository, 'update').mockResolvedValue(updatedTodo as Todo);

    const result = await updateTodoUseCase.execute('1', 'New Title', 'New Description');

    expect(todoRepository.findById).toHaveBeenCalledWith('1');
    expect(mockTodo.update).toHaveBeenCalledWith('New Title', 'New Description');
    expect(todoRepository.update).toHaveBeenCalledWith(mockTodo);
    expect(result).toEqual(updatedTodo);
  });

  it('should throw error when todo is not found', async () => {
    vi.spyOn(todoRepository, 'findById').mockResolvedValue(null);

    await expect(updateTodoUseCase.execute('1', 'New Title', 'New Description'))
      .rejects.toThrow('Todo not found');
    expect(todoRepository.update).not.toHaveBeenCalled();
  });

  it('should handle repository errors', async () => {
    vi.spyOn(todoRepository, 'findById').mockRejectedValue(new Error('Database error'));

    await expect(updateTodoUseCase.execute('1', 'New Title', 'New Description'))
      .rejects.toThrow('Database error');
    expect(todoRepository.update).not.toHaveBeenCalled();
  });
});