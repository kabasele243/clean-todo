import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Todo, TodoProps } from './Todo';

describe('Todo', () => {
  let mockDate: string;
  let todoProps: TodoProps;
  let todo: Todo;

  beforeEach(() => {
    vi.useFakeTimers();
    mockDate = '2024-01-26T12:00:00.000Z';
    vi.setSystemTime(new Date(mockDate));

    todoProps = {
      id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      createdAt: '2024-01-26T10:00:00.000Z',
      updatedAt: '2024-01-26T10:00:00.000Z'
    };

    todo = new Todo(todoProps);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a todo with provided props', () => {
    expect(todo).toEqual(expect.objectContaining(todoProps));
  });

  it('should mark todo as completed', () => {
    todo.markAsCompleted();

    expect(todo.completed).toBe(true);
    expect(todo.updatedAt).toBe(mockDate);
  });

  it('should update todo title and description', () => {
    todo.update('New Title', 'New Description');

    expect(todo.title).toBe('New Title');
    expect(todo.description).toBe('New Description');
    expect(todo.updatedAt).toBe(mockDate);
  });

  it('should convert todo to JSON', () => {
    const json = todo.toJSON();

    expect(json).toEqual(todoProps);
  });
});