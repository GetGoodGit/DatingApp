import { Photo } from "./photo"



export interface Member {
    userName: string
    photoUrl: string
    id: number
    age: number
    knownAs: string
    created: string
    lastActive: string
    gender: string
    introduction: string
    lookingFor: string
    interests: string
    city: string
    country: string
    photos: Photo[]
  }
  
