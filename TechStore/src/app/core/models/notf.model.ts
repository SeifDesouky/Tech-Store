export interface INotification{
    id: string;
    type: 'order' | 'delivery' | 'refund' | 'promotion';
    message: string;
    timestamp: string;
    isRead: boolean;
}