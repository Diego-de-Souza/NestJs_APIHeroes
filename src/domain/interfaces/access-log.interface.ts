import { strict } from "assert";

export interface AccessLogData {
    route: string;
    method: string;
    ip: string;
    userAgent?: string;
    userId?: string | null;
    timestamp: Date;
    statusCode?: number;
    responseTime?: number;
    actionType?: 'page_view' | 'login' | 'api_call' | 'other';
}
