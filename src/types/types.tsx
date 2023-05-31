import { Timestamp } from 'firebase/firestore';


export interface BlogType{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: Timestamp;
    createdBy: string;
    userId: string;
    comments: string[];
    continent: string;
}

export interface AddBlogType {
    title: string;
    description: string;
    imageUrl: string | File | null;
    continent: string; // Update the type to allow null values
    createdAt?: Timestamp;
  }


export interface DeleteBlogType{
    id: string;
    imageUrl: string;
}

export interface CommentType {
    commentId: string;
    user: string;
    comment: string;
    userName: string;
    createdAt: Date;
  }


