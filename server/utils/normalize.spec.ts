import { describe, expect, it } from 'vitest'
import {
  normalizeListingDetail,
  normalizeListings,
  type RawDetail,
  type RawListing,
  type RawListingsResponse,
} from './normalize'

const rawListing: RawListing = {
  Id: 'efc3296e-c7cd-462f-ba9d-d6e04da0ebbf',
  Adres: 'van Goghstraat 5',
  Postcode: '5691DJ',
  Woonplaats: 'Son en Breugel',
  Koopprijs: 700000,
  Woonoppervlakte: 151,
  Perceeloppervlakte: 303,
  AantalKamers: 5,
  AangebodenSindsTekst: '4 maanden',
  MakelaarNaam: 'PAR-3 Makelaars',
  IsVerkocht: false,
  IsVerkochtOfVerhuurd: false,
  FotoMedium: 'http://cloud.funda.nl/valentina_media/227/572/214_middel.jpg',
  Foto: 'http://cloud.funda.nl/valentina_media/227/572/214_klein.jpg',
  Heeft360GradenFoto: true,
  HeeftVideo: true,
  HeeftPlattegrond: true,
  WGS84_X: 5.48473,
  WGS84_Y: 51.51382,
}

const rawDetail: RawDetail = {
  // detail `Id` is a numeric GlobalId; the UUID lives in `InternalId`
  InternalId: 'efc3296e-c7cd-462f-ba9d-d6e04da0ebbf',
  Adres: 'van Goghstraat 5',
  Postcode: '5691DJ',
  Plaats: 'Son en Breugel',
  Koopprijs: 700000,
  WoonOppervlakte: 151,
  PerceelOppervlakte: 303,
  AantalKamers: 5,
  AantalSlaapkamers: null,
  AantalBadkamers: 1,
  AangebodenSindsTekst: '4 maanden',
  Makelaar: 'PAR-3 Makelaars',
  IsVerkocht: false,
  Bouwjaar: '1963',
  Energielabel: { Label: 'C' },
  VolledigeOmschrijving: '  *Relaxed wonen*\nmet de natuur als naaste buur.  ',
  HoofdFoto: 'http://cloud.funda.nl/valentina_media/227/572/214_groot.jpg',
  'Media-Foto': [
    'http://cloud.funda.nl/valentina_media/227/572/214_klein.jpg',
    'http://cloud.funda.nl/valentina_media/227/572/200_klein.jpg',
  ],
  Heeft360GradenFoto: false,
  IndVideo: true,
  IndPlattegrond: false,
  WGS84_X: 5.48473,
  WGS84_Y: 51.5138245,
  Kenmerken: [
    {
      Titel: 'Overdracht',
      Kenmerken: [
        { Naam: 'Vraagprijs', Waarde: '<span class="price-wrapper">€ 700.000 kosten koper</span>' },
        { Naam: 'Servicekosten', Waarde: '&euro;&nbsp;0,0 /mnd' },
      ],
    },
  ],
}

describe('normalizeListings', () => {
  it('maps the core fields', () => {
    const summary = normalizeListings({ Objects: [rawListing] })[0]!

    expect(summary).toMatchObject({
      id: 'efc3296e-c7cd-462f-ba9d-d6e04da0ebbf',
      address: 'van Goghstraat 5',
      postcode: '5691DJ',
      city: 'Son en Breugel',
      price: 700000,
      priceLabel: '€ 700.000 k.k.',
      livingArea: 151,
      plotArea: 303,
      rooms: 5,
      listedSince: '4 maanden',
      agent: 'PAR-3 Makelaars',
    })
  })

  it('rewrites http:// image URLs to https and prefers the medium size', () => {
    const summary = normalizeListings({ Objects: [rawListing] })[0]!
    expect(summary.thumbnail).toBe('https://cloud.funda.nl/valentina_media/227/572/214_middel.jpg')
  })

  it('falls back to Foto, then null, when there is no medium photo', () => {
    const withFoto = normalizeListings({ Objects: [{ ...rawListing, FotoMedium: undefined }] })[0]!
    expect(withFoto.thumbnail).toBe('https://cloud.funda.nl/valentina_media/227/572/214_klein.jpg')

    const noPhoto = normalizeListings({
      Objects: [{ ...rawListing, FotoMedium: undefined, Foto: undefined }],
    })[0]!
    expect(noPhoto.thumbnail).toBeNull()
  })

  it('maps WGS84_Y/X to { lat, lng }', () => {
    const summary = normalizeListings({ Objects: [rawListing] })[0]!
    expect(summary.coordinates).toEqual({ lat: 51.51382, lng: 5.48473 })
  })

  it('treats a listing as sold if either sold flag is set', () => {
    const a = normalizeListings({ Objects: [{ ...rawListing, IsVerkocht: true }] })[0]!
    const b = normalizeListings({ Objects: [{ ...rawListing, IsVerkochtOfVerhuurd: true }] })[0]!
    expect(a.isSold).toBe(true)
    expect(b.isSold).toBe(true)
  })

  it('handles a null price as "on request"', () => {
    const summary = normalizeListings({ Objects: [{ ...rawListing, Koopprijs: null }] })[0]!
    expect(summary.price).toBeNull()
    expect(summary.priceLabel).toBe('Prijs op aanvraag')
  })

  it('returns an empty array for an empty feed', () => {
    expect(normalizeListings({ Objects: [] })).toEqual([])
    expect(normalizeListings({} as RawListingsResponse)).toEqual([])
  })

  it('falls back to zero / empty string for missing numeric and text fields', () => {
    const bare = normalizeListings({
      Objects: [
        {
          ...rawListing,
          Woonoppervlakte: undefined,
          Perceeloppervlakte: undefined,
          AantalKamers: undefined,
          AangebodenSindsTekst: undefined,
          MakelaarNaam: undefined,
        } as unknown as RawListing,
      ],
    })[0]!

    expect(bare).toMatchObject({ livingArea: 0, plotArea: 0, rooms: 0, listedSince: '', agent: '' })
  })

  it('returns null coordinates when either coordinate is missing', () => {
    const [a] = normalizeListings({ Objects: [{ ...rawListing, WGS84_X: 0 }] })
    const [b] = normalizeListings({ Objects: [{ ...rawListing, WGS84_Y: 0 }] })
    expect(a?.coordinates).toBeNull()
    expect(b?.coordinates).toBeNull()
  })
})

describe('normalizeListingDetail', () => {
  it('maps the detail-only field names (InternalId, Plaats, WoonOppervlakte, ...)', () => {
    const detail = normalizeListingDetail(rawDetail)
    expect(detail).toMatchObject({
      id: 'efc3296e-c7cd-462f-ba9d-d6e04da0ebbf',
      city: 'Son en Breugel',
      livingArea: 151,
      plotArea: 303,
      agent: 'PAR-3 Makelaars',
      bathrooms: 1,
      bedrooms: null,
    })
  })

  it('parses Bouwjaar (a string) into a number, or null when unparseable', () => {
    expect(normalizeListingDetail(rawDetail).yearBuilt).toBe(1963)
    expect(normalizeListingDetail({ ...rawDetail, Bouwjaar: 'onbekend' }).yearBuilt).toBeNull()
    expect(normalizeListingDetail({ ...rawDetail, Bouwjaar: null }).yearBuilt).toBeNull()
  })

  it('reads the energy label, or null when missing', () => {
    expect(normalizeListingDetail(rawDetail).energyLabel).toBe('C')
    expect(normalizeListingDetail({ ...rawDetail, Energielabel: undefined }).energyLabel).toBeNull()
  })

  it('rewrites photos to https and bumps them to the large size', () => {
    const { photos } = normalizeListingDetail(rawDetail)
    expect(photos).toEqual([
      'https://cloud.funda.nl/valentina_media/227/572/214_groot.jpg',
      'https://cloud.funda.nl/valentina_media/227/572/200_groot.jpg',
    ])
  })

  it('uses HoofdFoto for the thumbnail (resized to medium), then the first photo', () => {
    expect(normalizeListingDetail(rawDetail).thumbnail).toBe(
      'https://cloud.funda.nl/valentina_media/227/572/214_middel.jpg',
    )
    const noHoofdFoto = normalizeListingDetail({ ...rawDetail, HoofdFoto: undefined })
    expect(noHoofdFoto.thumbnail).toBe(
      'https://cloud.funda.nl/valentina_media/227/572/214_middel.jpg',
    )
  })

  it('strips HTML and entities from Kenmerken values', () => {
    const group = normalizeListingDetail(rawDetail).features[0]!
    expect(group.title).toBe('Overdracht')
    expect(group.items).toEqual([
      { label: 'Vraagprijs', value: '€ 700.000 kosten koper' },
      { label: 'Servicekosten', value: '€ 0,0 /mnd' },
    ])
  })

  it('trims the description', () => {
    expect(normalizeListingDetail(rawDetail).description).toBe(
      '*Relaxed wonen*\nmet de natuur als naaste buur.',
    )
  })

  it('handles missing photos and features', () => {
    const bare = normalizeListingDetail({
      ...rawDetail,
      'Media-Foto': undefined,
      HoofdFoto: undefined,
      Kenmerken: undefined,
    })
    expect(bare.photos).toEqual([])
    expect(bare.features).toEqual([])
    expect(bare.thumbnail).toBeNull()
  })

  it('falls back to zero / empty / null for missing detail fields', () => {
    const bare = normalizeListingDetail({
      ...rawDetail,
      WoonOppervlakte: undefined,
      PerceelOppervlakte: undefined,
      AantalKamers: undefined,
      AantalBadkamers: undefined,
      AangebodenSindsTekst: undefined,
      Makelaar: undefined,
      VolledigeOmschrijving: undefined,
      WGS84_X: 0,
      Kenmerken: [{ Kenmerken: [{ Naam: 'X', Waarde: 'y' }] }],
    } as unknown as RawDetail)

    expect(bare).toMatchObject({
      livingArea: 0,
      plotArea: 0,
      rooms: 0,
      bathrooms: null,
      listedSince: '',
      agent: '',
      description: '',
      coordinates: null,
    })
    expect(bare.features[0]?.title).toBe('')
  })

  it('null price maps to "Prijs op aanvraag"', () => {
    expect(normalizeListingDetail({ ...rawDetail, Koopprijs: null }).priceLabel).toBe(
      'Prijs op aanvraag',
    )
  })
})
