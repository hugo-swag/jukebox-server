# jukebox

## Live Deploy

[Online Jukebox](https://online-jukebox.herokuapp.com/)

## Deployment

### *How do I install the app or library?*

Clone this app and install all dependencies.

### *How do I test the app or library?*

Run "NPM test" in the terminal once all dependencies are installed.

## For Applications

### *How do I run the app?*

You can run the app on your local terminal.

### *How do I set up the app?*

Be sure to install all dependencies.

## Testing

Write a complete set of tests for all functional units and modules
You must open the server and, at least, one client in order to have the sockets communicating.
Enter the following commands in separate terminals to start:

- Server: [node src/Global/handleGlobal.js]
- Driver: [node src/Driver/handleDriver.js]
- Vendor: [node src/Vendor/handleVendor.js]

## Documentation

- UML
![UML](/images/jukebox_UML.png)

- Wireframe
![wireframe](/images/jukebox_wireframe.png)

## User Stories

**AS A USER...**

- I want to be able to listen to a song
- I want to be able to queue a song
- I want to have a simple but clear UI
- I want to be able to sign-up
- I want to be able to securely log-in
- I want to be able to bump a song's priority
- I want to be able to create a room
- I want to be able to join a room
- I want to be able to invite users by username
- I want to assign roles (admin, general)

## Contributions

[Tutorial on how to set up an express server with socket.io](https://www.joezimjs.com/javascript/plugging-into-socket-io-the-basics/)

Thanks to Jordan Yamada and Adrian Cosme-Halvorson for inspiration on how to approach some of our code.
