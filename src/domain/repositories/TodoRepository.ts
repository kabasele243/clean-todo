import { Todo } from "../entities/Todo";

export interface TodoRepository {
  create(todo: Todo): Promise<Todo>;
  findById(id: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  update(todo: Todo): Promise<Todo>;
  delete(id: string): Promise<void>;
}
