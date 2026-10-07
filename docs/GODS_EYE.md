# God's Eye inside Folkhold

**Status: Slice 20 development candidate, owner validation pending**

God's Eye is Folkhold's mapping foundation for Wayfarer. It lives inside Folkhold and does not create a second standalone application.

## Slice 1 built October 7, 2026

- A **God's Eye** card on the Hub opens the map as a normal Folkhold screen.
- Leaflet 1.9.4 creates a worldwide interactive map only after the screen is opened.
- OpenStreetMap standard tiles display required attribution. The application never bulk-prefetches or downloads tiles in the background.
- Manual **Search** submits a query to Photon, receives up to five results, and lets the visitor select a location. No search-as-you-type or background place harvesting.
- A **Use My Location** button asks for device geolocation permission only on click. Successful coordinates are shown on the requesting device, not saved or broadcast.
- The World View button resets map center/zoom without disclosing location.
- Browser errors, denied permission, and unavailable map/search providers produce status text rather than false results.

## Providers

- Leaflet library: https://leafletjs.com/download (BSD 2-Clause).
- OSM tile requirements: https://operations.osmfoundation.org/policies/tiles/ . Use the visible map attribution and browser caching; the public tile service is best-effort, not a commercial SLA.
- Map data: https://www.openstreetmap.org/copyright .
- Photon project/demo geocoder: https://github.com/komoot/photon ; allowed only for modest usage. Public demo may throttle or change; a dedicated provider/backend is necessary for production traffic.

Providers are defined in `gods-eye/map.js` so they can be changed as an intentional later slice.

## Security/privacy boundary

No automatic GPS, no friend position lookup, no backend coordinate persistence, no account access and no person-specific location sharing are added in this slice. Key-to-Key street directions need functioning authenticated identities, permissioned Keys, explicit per-contact location grants and a routing provider. A Key exchange alone never reveals a member's whereabouts.

## Review checklist

1. Visit the Hub, open **God's Eye** and pan/zoom on PC and iPhone.
2. Search for a city/landmark and tap a result; verify the selected marker and centered map.
3. Verify no location prompt appears until **Use My Location** is pressed, and test denied permission if convenient.
4. Navigate back to Square, Hold and Radio; confirm previously accepted app controls work and the mobile bottom bar remains unchanged.

## Next separate slices

Road routing and line display → nearby discovery → weather, rates, prayer times, translation and local tools → permissioned Key-to-Key directions after the accounts/Keys backend is ready.
