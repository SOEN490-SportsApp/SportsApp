export type PostComment = {
    id: string;
    creationDate: string;
    updatedAt: string;
    content: string;
    createdBy: string;
  };
  
  export type Post = {
    id: string;
    creationDate: string;
    updatedAt: string;
    eventId: string;
    content: string;
    createdBy: string;
    attachments: string[];
    comments: PostComment[];
    likes: number;
  };