# Hanafi ↔ Folkhold Majlis Bridge

Status: **Roadmap / documented, not yet built**

## Why this exists

Hanafi and Folkhold are separate projects that complement one another.

Derek's design metaphor is:

- **Hanafi is the mother**: learning, faith, practice, reference, and guidance.
- **Folkhold is the father**: community, people, rooms, gathering, and social life.

This is a product metaphor, not a technical dependency. Each application must remain useful and independently deployable.

## Name

The Hanafi button that opens the community side is called:

**Majlis**

`Majlis` is preferred over `Shura` because the feature is a gathering place, not an accredited religious council or formal consultative authority.

## Intended user flow

1. A visitor is using Hanafi.
2. They select **Majlis**.
3. Hanafi opens the appropriate Folkhold public gathering view.
4. Folkhold records only enough origin context to know the visitor entered from Hanafi.
5. Folkhold keeps its normal navigation unchanged.
6. An additional **← Hanafi** button appears for that visit/session.
7. The visitor can move around Folkhold and still return to Hanafi with that button.
8. A person who enters Folkhold normally does not see the Hanafi-return button.

## Recommended implementation shape

Use a normal cross-site link with a harmless origin marker, for example:

`...?from=hanafi`

On Folkhold:

- detect the marker on entry
- store a short-lived origin value in session storage
- show **← Hanafi** while that session-origin value exists
- preserve the normal Folkhold/Hub navigation
- clear the context when the session ends or when the visitor deliberately enters Folkhold normally

The origin marker is **navigation context only**. It must never grant authentication, Keys, Room access, moderation privileges, or any other authorization.

## Entry destination

The intended destination is Folkhold's public gathering side, currently best represented by the **Village Square**. If Folkhold later gains a more specific community-hall landing surface, the Majlis button may target that instead without changing the relationship between the two sites.

## Design rules

- Do not duplicate Folkhold's social system inside Hanafi merely to make the integration look native.
- Do not merge the two repositories just to implement the bridge.
- Keep normal Folkhold branding/navigation visible after entry.
- The extra return button exists because of where the visitor came from, not because Hanafi users are a different class of Folkhold user.
- The bridge should feel like walking through a door between neighboring places rather than being redirected to an unrelated service.

## Breadcrumb

This concept was defined during the Folkhold v1.1.0 closeout discussion after Derek described the two projects as complementary parents and chose **Majlis** as the one-word Islamic name for the gathering button.
