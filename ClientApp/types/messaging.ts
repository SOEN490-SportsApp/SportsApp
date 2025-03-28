export interface message {
    messageId: string;
    chatroomId: string; //required
    senderId: string; //required
    receiverIds: string[]; //required
    senderName: string;
    content: string; //required
    createdAt: Number | Date;
    attachments: string[];
    }

export interface chatroomProps {
    chatroomId: string;
    createdAt: Number | Date;
    createdBy: string;
    members: string[];
    messages: message[];
    isEvent: boolean;
    unread: boolean;
    }

export interface messageRequest {
    chatroomId: string;
    senderId: string;
    receiverIds: string[];
    content: string;
    attachments: string[];
    }