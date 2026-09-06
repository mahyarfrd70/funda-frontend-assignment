// The shape the app consumes — server/utils/normalize.ts maps Funda's raw feed
// into these. Imported by both server/ and the pages via `#shared/types/listing`.

export interface Coordinates {
  lat: number
  lng: number
}

export interface ListingSummary {
  id: string
  address: string
  postcode: string
  city: string
  price: number | null
  priceLabel: string
  livingArea: number
  plotArea: number
  rooms: number
  listedSince: string
  agent: string
  isSold: boolean
  thumbnail: string | null
  coordinates: Coordinates | null
  has360Tour: boolean
  hasVideo: boolean
  hasFloorPlan: boolean
}

export interface FeatureGroup {
  title: string
  items: { label: string; value: string }[]
}

export interface ListingPhoto {
  /** small image (`_klein`) — used for the gallery thumbnail strip */
  thumb: string
  /** large image (`_groot`) — only requested once the photo is opened */
  full: string
}

export interface ListingDetail extends ListingSummary {
  description: string
  yearBuilt: number | null
  bedrooms: number | null
  bathrooms: number | null
  energyLabel: string | null
  photos: ListingPhoto[]
  features: FeatureGroup[]
}
