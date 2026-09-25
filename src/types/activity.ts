export type Priority = 'low' | 'medium' | 'high';

export interface Activity {
  id: string;
  title: string;
  notes: string;
  is_completed: boolean;
  category: string;
  priority: Priority;
  estimated_minutes: number;
  created_at: string;
  completed_at: string | null;
}

export interface ActivityFilterParams {
  page?: number;
  limit?: number;
  category?: string;
  priority?: string;
  is_completed?: boolean;
  search?: string;
  start_date?: string; // DD-MM-YYYY
  end_date?: string;   // DD-MM-YYYY
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  total_items: number;
  total_page: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: PaginatedData<T>;
}

export interface ActivityFormData {
  title: string;
  notes: string;
  category: string;
  priority: Priority;
  estimated_minutes: number;
  is_completed: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}