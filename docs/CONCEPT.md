# Folkhold Concept Record

This file records accepted product concepts so later builds do not quietly drift away from the original idea.

## Identity

Folkhold is a social web made of personal places. A user does not merely have a profile. They have a **Hold** that remains present while they are offline.

The shared visual direction uses deep charcoal, warm parchment, old brass, forest green, brick red, dusty blue and cream. Keys, doors and brass hardware are recurring visual language.

## Holds, Rooms and Keys

A Hold contains user-defined Rooms. Rooms can be public, keyed or private.

Keys are named for humans, for example “Sarah's House,” but internally they must become unique cryptographic credentials. Every issued Key must be independently revocable. Revoking Jeff's Key must not invalidate Sarah's Key.

The owner controls the permissions attached to each Key, including which Rooms it can open and what actions the holder may perform.

A user may list a Hold in the public Directory without making it open. Visitors without a valid Key can Knock and request access.

## Shared Places

### Public Square
Global, chronological public conversation with ordinary community rules. It is intentionally not an engagement-ranked feed.

### Notice Board
A visually physical public board inspired by fantasy tavern notice boards. Notes may include requests, invitations, events, sales, questions and “quests,” with statuses such as Open, Taken and Completed.

### Tavern
An explicitly opt-in adult area with very permissive rules for lawful speech and lawful adult sexual content. A one-time warning must clearly state what a user may encounter before entry. Production access is intended to require age verification. Minimal moderation does not mean unobserved or lawless; actual illegal conduct remains prohibited and serious illegal child-exploitation activity must be handled through appropriate reporting processes.

### Tea Room
A deliberately heavily moderated alternative for users who want strict civility and language rules.

## Customization

Users should eventually be able to customize their Holds substantially with sandboxed HTML and CSS. Customization must not allow arbitrary code to steal sessions, track visitors across the web, escape the user's Hold, or compromise Folkhold itself.

## Discovery

Folkhold should allow people search to be as broad or narrow as the searching user chooses. Future AI-assisted People Finder may help identify an old friend among similarly named people, but it must work from user-declared discoverable information and present candidates rather than asserting identity from guesswork.

## Advertising and privacy

Project principle:

> **Advertising pays for Folkhold. Your private life does not.**

Advertising is part of the free Folkhold service. Every major page and every Room reserves **one unobtrusive banner**, placed below the page/room header and before the main content so it never interrupts a conversation or post stream. Free accounts do not have an ad-off switch.

Ad eligibility is contextual. Different areas may use different allowed ad inventories: a Tea Room can use ordinary general-interest advertising while the Tavern can use an adult-compatible provider. Folkhold should support multiple providers rather than depending permanently on one network.

Google AdSense is the first network being wired into ordinary pages. Folkhold requests non-personalized Google ads by default. The Tavern and future private-chat screens are reserved for providers whose terms expressly allow those environments.

Users may explicitly choose advertising categories they prefer for Folkhold-direct ads and compatible providers. Aggregate campaign counts are acceptable. Behavioral dossiers, private-message analysis, cross-site profiling, and private-space profiling are not part of the intended business model.

## Prototype architecture

Version 0.0.1 uses only static HTML, CSS and JavaScript so it can run directly on GitHub Pages. Interactive prototype data is local/session-only. Real accounts, persistence, realtime chat, file uploads and cryptographic Keys require a backend in a later slice.
