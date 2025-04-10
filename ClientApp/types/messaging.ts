export interface message {
    messageId: string;
    chatroomId: string; //required
    senderId: string; //required
    receivers: member[]; //required
    senderName: string;
    content: string; //required
    createdAt: Number | Date;
    attachments: string[];
    senderImage: string
    }

export interface chatroomProps {
    chatroomId: string;
    createdAt: Number | Date;
    createdBy: string;
    members: member[];
    messages: message[];
    isEvent: boolean;
    unread: boolean;
    }

export interface messageRequest {
    chatroomId: string;
    senderId: string;
    receivers: member[];
    content: string;
    attachments: string[];
    senderName: string;
    // senderImage: string;
    }

export interface member {
    userId: string;
    username: string;
    userImage: string;
}
