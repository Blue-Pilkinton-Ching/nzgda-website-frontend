export interface GamesList {
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
