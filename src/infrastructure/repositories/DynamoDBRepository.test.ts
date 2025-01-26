import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DynamoDBTodoRepository } from '../../../.build/src/infrastructure/repositories/DynamoDBRepository';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Todo } from '../../domain/entities/Todo';


vi.mock('@aws-sdk/client-dynamodb');
vi.mock('@aws-sdk/lib-dynamodb');

describe('DynamoDBTodoRepository', () => {
  let repository: DynamoDBTodoRepository;
  const mockSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TODOS_TABLE = 'todos-table';
    
    // Mock DynamoDBDocumentClient
    vi.mocked(DynamoDBDocumentClient).from.mockReturnValue({
      send: mockSend
    } as any);

    repository = new DynamoDBTodoRepository();
  });

  describe('create', () => {
    it('should create a todo item', async () => {
      const todo = new Todo({
        id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      mockSend.mockResolvedValueOnce({});

      const result = await repository.create(todo);

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(PutCommand)
      );
      expect(result).toEqual(todo);
    });
  });

  describe('findById', () => {
    it('should return todo when found', async () => {
      const todoData = {
        id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockSend.mockResolvedValueOnce({ Item: todoData });

      const result = await repository.findById('1');

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(GetCommand)
      );
      expect(result?.toJSON()).toEqual(todoData);
    });

    it('should return null when todo not found', async () => {
      mockSend.mockResolvedValueOnce({ Item: null });

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const todosData = [
        {
          id: '1',
          title: 'Todo 1',
          description: 'Description 1',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Todo 2',
          description: 'Description 2',
          completed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      mockSend.mockResolvedValueOnce({ Items: todosData });

      const results = await repository.findAll();

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(ScanCommand)
      );
      expect(results).toHaveLength(2);
      expect(results.map(r => r.toJSON())).toEqual(todosData);
    });

    it('should return empty array when no todos exist', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const results = await repository.findAll();

      expect(results).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a todo item', async () => {
      const todo = new Todo({
        id: '1',
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      mockSend.mockResolvedValueOnce({ Attributes: todo.toJSON() });

      const result = await repository.update(todo);

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(UpdateCommand)
      );
      expect(result.toJSON()).toEqual(todo.toJSON());
    });
  });

  describe('delete', () => {
    it('should delete a todo item', async () => {
      mockSend.mockResolvedValueOnce({});

      await repository.delete('1');

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(DeleteCommand)
      );
    });
  });
});