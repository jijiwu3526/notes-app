// 定义笔记的数据结构
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

// 笔记创建时的数据结构
export interface CreateNoteData {
  title: string;
  content: string;
}

// 笔记更新时的数据结构
export interface UpdateNoteData {
  title?: string;
  content?: string;
}

// API响应结构
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}