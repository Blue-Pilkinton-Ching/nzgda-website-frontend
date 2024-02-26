import { IncomingHttpHeaders } from 'http'

export interface GamesListItem {
  total: number
  limit: number
  skip: number
  data: Game[]
}

export interface Game {
  id: number
  name: string
  description: string
  thumbnail: string
  screenshot?: string
  approved: number
  partner: string
  url?: string
  userId: number
  type: string
  tags?: string
  uploadStatus: string
  iosLink?: string
  androidLink?: string
  androidApplicationId?: string
  iosApplicationId?: string
  gamefrootLink?: string
  fileSize?: number
  exclude?: string
  width?: number
  height?: number
  tvnzLink?: string
  tvnzShowName?: string
  orientation?: string
  parent: number
  createdAt?: string
  updatedAt?: string
}

export interface AuthHeader {
  authorization: IncomingHttpHeaders
}

export interface DashboardData {}

export interface DashboardBody {
  admins: Admin[]
}

export interface Admin {
  email: string
  uid: string
}

export type UserPrivilege =
  | 'missing'
  | 'invalid'
  | 'error'
  | 'noprivilege'
  | 'admin'

export interface GamesListItem {
  id: number
  name: string
}
