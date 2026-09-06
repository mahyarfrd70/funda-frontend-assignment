import type { FeatureGroup, ListingDetail, ListingSummary } from '#shared/types/listing'

export interface RawListing {
  Id: string
  Adres: string
  Postcode: string
  Woonplaats: string
  Koopprijs: number | null
  Woonoppervlakte: number
  Perceeloppervlakte: number
  AantalKamers: number
  AangebodenSindsTekst: string
  MakelaarNaam: string
  IsVerkocht: boolean
  IsVerkochtOfVerhuurd: boolean
  Foto?: string
  FotoMedium?: string
  Heeft360GradenFoto: boolean
  HeeftVideo: boolean
  HeeftPlattegrond: boolean
  WGS84_X: number
  WGS84_Y: number
}

export interface RawListingsResponse {
  Objects: RawListing[]
}

interface RawFeature {
  Naam: string
  Waarde: string
}

interface RawFeatureGroup {
  Titel?: string
  Kenmerken: RawFeature[]
}

export interface RawDetail {
  // on the detail response `Id` is a numeric GlobalId; the UUID is `InternalId`
  InternalId: string
  Adres: string
  Postcode: string
  Plaats: string
  Koopprijs: number | null
  WoonOppervlakte: number
  PerceelOppervlakte: number
  AantalKamers: number
  AantalSlaapkamers: number | null
  AantalBadkamers: number | null
  AangebodenSindsTekst: string
  Makelaar: string
  IsVerkocht: boolean
  Bouwjaar: string | null
  Energielabel?: { Label?: string | null }
  VolledigeOmschrijving?: string
  HoofdFoto?: string
  'Media-Foto'?: string[]
  Heeft360GradenFoto?: boolean
  IndVideo?: boolean
  IndPlattegrond?: boolean
  WGS84_X: number
  WGS84_Y: number
  Kenmerken?: RawFeatureGroup[]
}

const euro = new Intl.NumberFormat('nl-NL')

function toHttps(url: string | undefined | null): string | null {
  return url ? url.replace(/^http:\/\//i, 'https://') : null
}

function resize(url: string, size: 'middel' | 'groot'): string {
  return url.replace(/_(klein|middel|groot|grotere)\.jpg$/i, `_${size}.jpg`)
}

function priceLabel(price: number | null): string {
  return price == null ? 'Prijs op aanvraag' : `€ ${euro.format(price)} k.k.`
}

// WGS84_X is longitude, WGS84_Y is latitude
function coordinates(lng: number, lat: number): { lat: number; lng: number } | null {
  return lng && lat ? { lat, lng } : null
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&euro;/g, '€')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function toSummary(raw: RawListing): ListingSummary {
  const koopprijs = raw.Koopprijs ?? null
  return {
    id: raw.Id,
    address: raw.Adres,
    postcode: raw.Postcode,
    city: raw.Woonplaats,
    price: koopprijs,
    priceLabel: priceLabel(koopprijs),
    livingArea: raw.Woonoppervlakte ?? 0,
    plotArea: raw.Perceeloppervlakte ?? 0,
    rooms: raw.AantalKamers ?? 0,
    listedSince: raw.AangebodenSindsTekst ?? '',
    agent: raw.MakelaarNaam ?? '',
    isSold: raw.IsVerkocht || raw.IsVerkochtOfVerhuurd,
    thumbnail: toHttps(raw.FotoMedium ?? raw.Foto),
    coordinates: coordinates(raw.WGS84_X, raw.WGS84_Y),
    has360Tour: Boolean(raw.Heeft360GradenFoto),
    hasVideo: Boolean(raw.HeeftVideo),
    hasFloorPlan: Boolean(raw.HeeftPlattegrond),
  }
}

export function normalizeListings(raw: RawListingsResponse): ListingSummary[] {
  return (raw.Objects ?? []).map(toSummary)
}

export function normalizeListingDetail(raw: RawDetail): ListingDetail {
  const photos = (raw['Media-Foto'] ?? [])
    .map(toHttps)
    .filter((url): url is string => url !== null)
    .map((url) => resize(url, 'groot'))

  const mainPhoto = toHttps(raw.HoofdFoto) ?? photos[0] ?? null
  const koopprijs = raw.Koopprijs ?? null

  const features: FeatureGroup[] = (raw.Kenmerken ?? []).map((group) => ({
    title: group.Titel ?? '',
    items: (group.Kenmerken ?? []).map((feature) => ({
      label: feature.Naam,
      value: stripHtml(feature.Waarde ?? ''),
    })),
  }))

  return {
    id: raw.InternalId,
    address: raw.Adres,
    postcode: raw.Postcode,
    city: raw.Plaats,
    price: koopprijs,
    priceLabel: priceLabel(koopprijs),
    livingArea: raw.WoonOppervlakte ?? 0,
    plotArea: raw.PerceelOppervlakte ?? 0,
    rooms: raw.AantalKamers ?? 0,
    listedSince: raw.AangebodenSindsTekst ?? '',
    agent: raw.Makelaar ?? '',
    isSold: Boolean(raw.IsVerkocht),
    thumbnail: mainPhoto ? resize(mainPhoto, 'middel') : null,
    coordinates: coordinates(raw.WGS84_X, raw.WGS84_Y),
    has360Tour: Boolean(raw.Heeft360GradenFoto),
    hasVideo: Boolean(raw.IndVideo),
    hasFloorPlan: Boolean(raw.IndPlattegrond),
    description: (raw.VolledigeOmschrijving ?? '').trim(),
    yearBuilt: raw.Bouwjaar ? Number(raw.Bouwjaar) || null : null,
    bedrooms: raw.AantalSlaapkamers ?? null,
    bathrooms: raw.AantalBadkamers ?? null,
    energyLabel: raw.Energielabel?.Label ?? null,
    photos,
    features,
  }
}
