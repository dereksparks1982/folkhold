# Wayfarer inside Folkhold

**Status: v1.3.0 source deployed; external provider and owner-device validation pending**

**Current public name:** Wayfarer. Internal `gods-eye` file paths, IDs and existing URL hash are retained for compatibility and are not the product name.

Wayfarer is Folkhold's travel and mapping area. It lives inside Folkhold and does not create a second standalone application.

## Slice 1 built October 7, 2026

- A **Wayfarer** card on the Hub opens the map as a normal Folkhold screen.
- OpenLayers 10.10.0 creates a worldwide interactive map only after the screen is opened. The previous renderer is no longer loaded or referenced by runtime code.
- OpenStreetMap standard tiles display required attribution. The application never bulk-prefetches or downloads tiles in the background.
- Manual **Search** submits a query to Photon, receives up to five results, and lets the visitor select a location. No search-as-you-type or background place harvesting.
- A **Use My Location** button asks for device geolocation permission only on click. Successful coordinates are shown on the requesting device, not saved or broadcast.
- The World View button resets map center/zoom without disclosing location.
- Browser errors, denied permission, and unavailable map/search providers produce status text rather than false results.

## Map-renderer replacement (October 8, 2026)

At the owner's request, Travel Companion's prior mapping library was **removed from all runtime modules**. The replacement is **OpenLayers 10.10.0**. The interactive map, markers, nearby listings and road-route overlays were migrated together. No former map-library scripts, CSS, logos or runtime attribution are requested anymore.

OpenStreetMap tile attribution remains required by OSM data licensing. This change does not replace OSM, Photon, Overpass or the external route/data services. Existing `gods-eye` filenames and URL fragment are internal compatibility identifiers only. The new provider needs physical-device/browser validation before accepting the candidate.

## Providers

- **OpenLayers 10.10.0**: https://openlayers.org/ (BSD 2-Clause). Loaded from a version-pinned JS/CSS distribution; not bundled into Folkhold source. License: https://github.com/openlayers/openlayers/blob/v10.10.0/LICENSE.md
- OSM tile requirements: https://operations.osmfoundation.org/policies/tiles/ . Use the visible map attribution and browser caching; the public tile service is best-effort, not a commercial SLA.
- Map data: https://www.openstreetmap.org/copyright .
- Photon project/demo geocoder: https://github.com/komoot/photon ; allowed only for modest usage. Public demo may throttle or change; a dedicated provider/backend is necessary for production traffic.

Providers are defined in `gods-eye/map.js` so they can be changed as an intentional later slice.

## Security/privacy boundary

No automatic GPS, no friend position lookup, no backend coordinate persistence, no account access and no person-specific location sharing are added in this slice. Key-to-Key street directions need functioning authenticated identities, permissioned Keys, explicit per-contact location grants and a routing provider. A Key exchange alone never reveals a member's whereabouts.

## Review checklist

1. Visit the Hub, open **Travel Companion** and pan/zoom on PC and iPhone.
2. Search for a city/landmark and tap a result; verify the selected marker and centered map.
3. Verify no location prompt appears until **Use My Location** is pressed, and test denied permission if convenient.
4. Navigate back to Square, Hold and Radio; confirm previously accepted app controls work and the mobile bottom bar remains unchanged.

## Next separate slices

Road routing and line display → nearby discovery → weather, rates, prayer times, translation and local tools → permissioned Key-to-Key directions after the accounts/Keys backend is ready.


## Slices 21–24: Travel features in owner review

**Slice 21: real road directions.** Search a place to select a destination. Use GPS or choose another searched place as the start; choose walking/driving and request a mapped road route with estimates. FOSSGIS Valhalla demo: https://valhalla.openstreetmap.de/ . Route requests send chosen start/destination coordinates to Valhalla. Google Maps is the primary external directions handoff and OpenStreetMap Directions remains an alternative. Either external link sends the chosen route coordinates only when clicked. The in-app road overlay still uses Valhalla. No member/Keys addresses.

**Slice 22: nearby discovery.** Manually query Overpass community OSM data for mosques, food/cafés, history, adventure and nightlife near the selected map point. Results have map markers and a distance-sorted list. Provider: https://overpass.kumi.systems/api/interpreter . Data may be incomplete; food listings do not imply halal status and listings do not prove operating hours.

**Slice 23: travel essentials.** Current conditions from https://open-meteo.com/ for selected coordinates; currency reference rates from https://frankfurter.dev/ ; Hanafi Asr prayer calculations from https://aladhan.com/prayer-times-api with user-selectable method including Diyanet Turkey. All are button-triggered, not automatic. Market exchange fees and locally posted prayer schedules may differ.

**Slice 24: language and Fair Price.** Manual two-way short translation (English/Turkish and selectable Arabic/Persian/French) via https://mymemory.translated.net/doc/spec.php ; the typed message leaves Folkhold only on Translate. A small Turkish phrasebook is prewritten and works without a translation service. Fair Price compares a quote with a reference price the user personally supplies; it does NOT invent actual local market data. Hitch currently shows the selected place and available travel tools; a genuine conversational AI is future work.

### Important boundaries

These are **GitHub source candidates**, not accepted device-tested production services. Leaflet/OSM/Photon, Valhalla, Overpass, Open-Meteo, Frankfurter, AlAdhan and MyMemory have differing terms, availability and rate limits. Public demo tile, routing and discovery servers need provisioning before serious traffic. The user must explicitly request data; there is no automatic GPS, no friend-location disclosure and no saved travel profile. Review on PC/iPhone: routes, categories, weather, rates, prayer times/date/timezone, translator, Fare Price and Hitch; verify existing Radio and UI unchanged.

## v1.3.0 Wayfarer location and naming closeout (October 8, 2026)

- Public names in the live top bar, Hub card, map page and status messaging are **Wayfarer**. Older `gods-eye` source IDs/routes/events remain untouched intentionally.
- No default Boston coordinate is in map source: it begins in a world overview. A requested browser geolocation may be incorrect, especially on desktop networks. The new request uses `enableHighAccuracy:true`, `maximumAge:0` and an 18-second timeout; the success message displays browser-reported latitude/longitude and declared accuracy in meters.
- If accuracy is unavailable or the browser estimates uncertainty over **10 km**, Folkhold displays the estimate but does not automatically treat it as the routing start. Even a low declared accuracy does **not prove** the city is correct.
- When geolocation is wrong, manually search for the actual city/address, select it, and choose **Use Selected as Start** in Directions. This is a user-selected starting point, not a claimed GPS fix.
- The owner reported Boston while in Wichita. Actual desktop/iPhone location correctness, routing provider behavior, map markers and permissions still require physical-device review. No member live-location sharing is added.
