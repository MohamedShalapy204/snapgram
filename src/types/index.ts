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
  location?: string
  tags?: string[]
  creator: UserAccount
  likes: string[] // List of user IDs who liked the post
  save: string[] // List of user IDs who saved the post
  $createdAt: string
}

export interface NewPost {
  caption: string
  file: File[]
  location?: string
  tags?: string
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
  userName: string
  email: string
  bio: string
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
