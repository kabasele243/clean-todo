export interface TodoProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Todo {
  public readonly id: string;
  public title: string;
  public description: string;
  public completed: boolean;
  public createdAt: string;
  public updatedAt: string;

  constructor(props: TodoProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.completed = props.completed;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  markAsCompleted(): void {
    this.completed = true;
    this.updatedAt = new Date().toISOString();
  }

  update(title: string, description: string): void {
    this.title = title;
    this.description = description;
    this.updatedAt = new Date().toISOString();
  }

  toJSON(): TodoProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
