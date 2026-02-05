export interface SacContactInterface {
  id: string;
  usuario_id: string;
  ticket_number: string;
  type: 'suporte' | 'reclamacao' | 'elogio';
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  created_at: Date;
  updated_at: Date;
}

export interface SacResponseInterface {
  id: string;
  contact_id: string;
  message: string;
  author: string;
  created_at: Date;
}

export interface SacAttachmentInterface {
  id: string;
  contact_id: string | null;
  response_id: number | null;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: Date;
}

export type SacContactType = 'suporte' | 'reclamacao' | 'elogio';
export type SacPriority = 'low' | 'normal' | 'high' | 'urgent';
export type SacStatus = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
