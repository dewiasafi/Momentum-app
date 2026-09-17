export interface Activity {
  id?: number | string;
  title: string;
  notes?: string;
  is_completed: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}