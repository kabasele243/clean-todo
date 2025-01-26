import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CreateTodoUseCase } from './CreateTodoUseCase';
import { Todo } from '../../../domain/entities/Todo';
import { TodoRepository } from '../../../domain/repositories/TodoRepository';
import { v4 as uuidv4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid'
}));

describe('CreateTodoUseCase', () => {
  let todoRepository: TodoRepository;
  let createTodoUseCase: CreateTodoUseCase;
  const mockDate = '2024-01-26T12:00:00.000Z';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockDate));

    todoRepository = {
      create: vi.fn()
    } as unknown as TodoRepository;

    createTodoUseCase = new CreateTodoUseCase(todoRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a todo successfully', async () => {
    const expectedTodo = new Todo({
      id: 'mocked-uuid',
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      createdAt: mockDate,
      updatedAt: mockDate
    });

    vi.spyOn(todoRepository, 'create').mockResolvedValue(expectedTodo);

    const result = await createTodoUseCase.execute('Test Todo', 'Test Description');

    expect(todoRepository.create).toHaveBeenCalledWith(expectedTodo);
    expect(result).toEqual(expectedTodo);
  });

  it('should handle repository errors', async () => {
    vi.spyOn(todoRepository, 'create').mockRejectedValue(new Error('Database error'));

    await expect(createTodoUseCase.execute('Test Todo', 'Test Description'))
      .rejects.toThrow('Database error');
  });
});