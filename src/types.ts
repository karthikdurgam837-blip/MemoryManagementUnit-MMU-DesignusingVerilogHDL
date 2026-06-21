export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
  timestamp: string;
}

export type Priority = 'High' | 'Medium' | 'Low';
export type ActionCategory = 'keep' | 'donate' | 'discard' | 'relocate';

export interface ChecklistItem {
  id: string;
  item: string;
  priority: Priority;
  zone: string;
  category: ActionCategory;
  completed: boolean;
}

export interface ReorgStrategy {
  zone: string;
  proposal: string;
  productsSuggested?: string[];
}

export interface RoomAnalysis {
  clutterScore: number; // 1 to 10
  category: string; // e.g., Living Room, Kitchen
  assessment: string;
  areasOfConcern: string[];
  checklist: ChecklistItem[];
  strategies: ReorgStrategy[];
  maintenanceRoutine: string[];
}

export interface Room {
  id: string;
  name: string;
  image: string; // base64 payload
  createdAt: string;
  analysis: RoomAnalysis | null;
  chatHistory: ChatMessage[];
}
