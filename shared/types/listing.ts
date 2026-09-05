/**
 * The shape the app actually consumes. The server routes
 * (`/api/listings`, `/api/listings/[id]`) translate Funda's raw feed —
 * Dutch keys, `/Date(...)/` strings, HTML fragments in values, `http://`
 * image URLs — into these types. Nothing raw crosses the server boundary,
 * so the client never has to know the feed exists.
 *
 * Lives in `shared/` so both `server/` and the Vue pages can import it via
 * `#shared/types/listing`.
 */

export interface Coordinates {
  lat: number
  lng: number
}

export interface ListingSummary {
  id: string
  address: string
  postcode: string
  city: string
  /** null when the price is "on request" */
  price: number | null
  /** ready to render, e.g. "€ 700.000 k.k." */
  priceLabel: string
  /** living area in m² (0 when unknown) */
  livingArea: number
  /** plot area in m² (0 when unknown) */
  plotArea: number
  rooms: number
  /** human string straight from Funda, e.g. "4 maanden" */
  listedSince: string
  agent: string
  isSold: boolean
  /** https, medium size; null when the listing has no photo */
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

export interface ListingDetail extends ListingSummary {
  /** plain text; newlines kept, Funda's markdown-ish `*asterisks*` left as-is */
  description: string
  yearBuilt: number | null
  bedrooms: number | null
  bathrooms: number | null
  /** energy label letter, e.g. "C"; null when not available */
  energyLabel: string | null
  /** every photo, https, large size */
  photos: string[]
  /** grouped "Kenmerken", HTML stripped from the values */
  features: FeatureGroup[]
}
