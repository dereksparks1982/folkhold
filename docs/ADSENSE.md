# Folkhold Google AdSense Wiring

Folkhold reserves **one unobtrusive banner per page**, directly below the page header and before the main content. The banner must not interrupt posts, chat messages, notices, or room content.

## Current state

The frontend wiring is complete, but live Google ads are intentionally disabled until Folkhold has an approved AdSense account and real identifiers. While disabled, each eligible page shows a visible prototype placeholder in the exact future ad location.

Normal Folkhold pages currently route to the Google slot. The Tavern is deliberately reserved for a separate room-appropriate provider because its intended adult content may not be eligible for Google inventory. Future private-chat screens should likewise use a provider whose terms expressly allow that placement.

## Values needed to turn Google on

Create one **responsive Display ad unit** in AdSense and copy:

1. Publisher/client ID, in the form `ca-pub-1234567890123456`.
2. Ad slot ID, usually a numeric value such as `1234567890`.

Put those values in `ads-config.js` and change `enabled` to `true`.

Folkhold currently requests **non-personalized Google ads by default**. This prevents Google from choosing ads from a visitor's past browsing profile, although Google still performs the processing needed to serve, measure, secure, and report ads. Consent/privacy handling for jurisdictions that require it must be completed before production launch.

## ads.txt

Do not place a production `ads.txt` only at `/folkhold/ads.txt`. Ad systems expect it at the site's root domain. With the current project Pages URL, that means the correct location is expected to be:

`https://dereksparks1982.github.io/ads.txt`

The `folkhold` project repository publishes beneath `/folkhold/`, so root-domain `ads.txt` needs either the user-site repository/custom domain setup or another root-level hosting arrangement. This should be completed when the AdSense publisher ID exists.

## Long-term provider model

Google is the first provider, not the permanent single source of ads. Folkhold's page slot is provider-neutral so later builds can select an eligible provider by area, for example a general network in the Tea Room and an adult-compatible network in the Tavern, while still showing only one banner.
