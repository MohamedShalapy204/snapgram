import React from "react"

export interface SignInFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  name: string
  email: string
  password: string
}

export interface Post {
  $id: string
  caption: string
  imageUrl: string
  imageId: string // Essential for Storage deletion
  location?: string
  tags?: string[]
  creator: string
  likes: string[] // List of user IDs who liked the post
  save: string[] // List of user IDs who saved the post
  $createdAt: string
  $updatedAt?: string
}

export interface NewPost {
  caption: string
  file?: File[]
  location?: string
  tags?: string
}

export interface NewReel {
  caption: string
  file: File[]
  audio?: string
  tags?: string
}

export interface Reel {
  $id: string
  creator: string
  caption: string
  videoUrl: string
  videoId: string
  audio: string
  tags?: string[]
  likes: string[]
  $createdAt: string
  $updatedAt: string
}

export interface Comment {
  $id: string
  postId?: string
  reelId?: string
  userId: string
  text: string
  $createdAt: string
  $updatedAt?: string
}

export interface NewComment {
  postId?: string
  reelId?: string
  userId: string
  text: string
}

export interface INavLink {
  icon: React.ReactNode
  path: string
  name: string
}

export interface UserAccount {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  verified: boolean
}

export interface User {
  $id: string
  name: string
  username: string
  email: string
  bio?: string
  imageId: string
  imageUrl: string
  posts: string[]
  liked: string[]
  save: string[]
  $createdAt: string
  $updatedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserAccount | null
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
}
