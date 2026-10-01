# Hanafi ↔ Folkhold Majlis Bridge

Status: **Folkhold origin-aware return is implemented; Hanafi Majlis entry remains to be completed**

## Why this exists

Hanafi and Folkhold are separate projects that complement one another.

Derek's design metaphor is:

- **Hanafi is the mother**: learning, faith, practice, reference, and guidance.
- **Folkhold is the father**: community, people, rooms, gathering, and social life.

This is a product metaphor, not a technical dependency. Each application must remain useful and independently deployable.

## Current cross-link foundation

The projects already have ordinary reciprocal links:

- Folkhold's GitHub README has a **Links** section that points to the Folkhold Web App and Hanafi Learning Deck.
- Hanafi's existing Web App **Links** page contains a **Folkhold** card linking to the Folkhold Web App.

## Implemented Folkhold origin behavior

Folkhold now loads `hanafi-bridge.js`.

When Folkhold is entered with:

`?from=hanafi`

it:

- records `hanafi` as the browser-session navigation origin
- adds **← Hanafi** to the Folkhold top bar
- preserves that return control while the Hanafi session-origin remains active
- clears the origin when the visitor deliberately returns to Hanafi
- clears stale Hanafi origin on a normal direct Folkhold entry without a source marker

The origin marker is **navigation context only**. It grants no authentication, Keys, Room access, moderation privileges, or other authorization.

## Name

The Hanafi button that opens the community side is called:

**Majlis**

`Majlis` is preferred over `Shura` because the feature is a gathering place, not an accredited religious council or formal consultative authority.

## Intended complete user flow

1. A visitor is using Hanafi.
2. They select **Majlis**.
3. Hanafi opens the appropriate Folkhold public gathering view with the Hanafi origin marker.
4. Folkhold records only enough origin context to know the visitor entered from Hanafi.
5. Folkhold keeps its normal navigation unchanged.
6. **← Hanafi** appears for that visit/session.
7. The visitor can move around Folkhold and still return to Hanafi with that button.
8. A person who enters Folkhold normally does not see the Hanafi-return button.

## Remaining work

The Folkhold half of the origin-aware behavior is implemented and deployed. The remaining bridge work is on Hanafi:

- add/use **Majlis** as the intentional community doorway
- target Folkhold's public gathering destination with the Hanafi origin marker
- validate the complete round trip on deployed desktop and mobile surfaces

## Entry destination

The intended destination is Folkhold's public gathering side, currently best represented by the **Village Square**. If Folkhold later gains a more specific community-hall landing surface, the Majlis button may target that instead without changing the relationship between the two sites.

## Design rules

- Do not duplicate Folkhold's social system inside Hanafi merely to make the integration look native.
- Do not merge the two repositories just to implement the bridge.
- Keep normal Folkhold branding/navigation visible after entry.
- The extra return button exists because of where the visitor came from, not because Hanafi users are a different class of Folkhold user.
- The bridge should feel like walking through a door between neighboring places rather than being redirected to an unrelated service.

## Breadcrumb

The concept was defined during the Folkhold v1.1.0 closeout discussion after Derek described the two projects as complementary parents and chose **Majlis** as the one-word Islamic name for the gathering button.

The first reciprocal-link foundation was added on September 30, 2026. On October 1, 2026 Folkhold's origin-aware return half was implemented in `hanafi-bridge.js` and deployed successfully. The Hanafi-side Majlis entry remains the final half of this slice.
