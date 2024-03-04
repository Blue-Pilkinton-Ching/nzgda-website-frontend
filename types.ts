import { IncomingHttpHeaders } from 'http'
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
  gamefrootLink?: string
  fileSize?: number
  exclude?: string
  width?: number
  height?: number
  orientation?: string
  createdAt?: string
  updatedAt?: string
  playableOnHeihei?: boolean
  displayAppBadge?: boolean
}

export interface AuthHeader {
  authorization: IncomingHttpHeaders
}

export interface AdminDashboard {
  admins: Admin[]
  partners: Partner[]
  gameslist: GameListItem[]
  authRequests: AuthRequest[]
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

export interface GameListItem {
  id: number
  name: string
  thumbnail: string
  hidden: boolean
  partner: string
  exclude: string
  app?: boolean
}

export interface AuthRequest {
  email: string
  uid: string
}

export interface Partner {
  hidden: boolean
  name: string
}

export interface GamesList {
  data: GameListItem[]
  partners: Partner[]
}
