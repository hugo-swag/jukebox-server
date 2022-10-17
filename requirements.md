# Software Requirements

## Vision

The vision of Hugo's Jukebox is to entertain your friends and family in a casual, online settings. Connect your spotify to our simple and intuitive app to begin sharing your favorite music to anyone in your room. Our app features a fun bidding system, so once your song queue is nice and full, you can bid on your favorites to hear them sooner. It's like the classic local jukebox, but with the internet!

## Scope

IN -

- securely sign-up and login
- join or create public rooms
- connect to your spotify account
- queue your favorite songs
- bid on songs in the queue to play them sooner

OUT -

- this app will not allow chatting
- this app does not require you to spend money

## Minimum Viable Product

Our MVP is a lobby witch allows users to join or create rooms where they can listen to music, and once they sign in to their Spotify account, will be able to add songs to the queue.

**Stretch Goals:**

- A stretch goal that could be implemented would be including a way to charge users for credits to boost their bidding or make "VIP" accounts. (Paying is not *required* but it could offered).
- User profiles with saved playlists or favorited songs

## Functional Requirements

- admin accounts to clear users and rooms
- create or join room
- add songs to a queue within your room
- search for users or rooms

**Data Flow:**

- visit website
- sign-in to Spotify account though OAuth framework
- either a) create a new room, b) join an existing room, or c) search for a room or user
- listen to the music being played in the room, and/or
- queue a new song
- wait for song to play
- bid on songs in the queue to bump their position

## Non-Functional Requirements

1. Security: Security is out first priority, that's why we use industry standard OAuth practices and frameworks provided through Auth0. You can trust that your private information is secure

2. Testability: Our tests are extensive and practical providing future users with enough leeway to experiment and be creative without breaking their projects.
