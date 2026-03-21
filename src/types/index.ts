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
  id: number
  author: string
  avatar: string
  content: string
  image: string
}

export interface INavLink {
  icon: React.ReactNode
  path: string
  name: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}
