# The "La boulette" game

The frontend and the backend are in 2 separated folder and are both nodes projects.

This project is heavily relying on [socket.io](https://socket.io/) in other to exchange data about the game.

## Sockets exchanges

### From frontend to backend

| socket                       | arguments                            | description                                                                                          |
| ---------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| request-new-room             | (none                                | Request a new room to the backend                                                                    |
| join-room                    | {roomid:string, playerName:string}   | Makes the player join a room                                                                         |
| player-ready-to-start-update | { isReady: boolean, words:string[] } | Notify the backend that the player is ready to start or not and sends the list of the player's words |
| player-ready-state-update    | isReady: boolean                     | Notify the backend that the player is ready or not for the next round                                |
| guessed-word-turn-end        | {word: string, hasGuessed: boolean}  | Notify the backend that the player guessed or not a word a the end of it's turn                      |
| guessed-word                 | word:string                          | Notify the backend that the players has guessed the word and ask for a new one                       |

### From backend to frontend

| socket          | arguments                             | description                                                                                                       |
| --------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| new-room-id     | roomid:number                         | Sends the newly created room's id                                                                                 |
| invalid-room-id | (none)                                | Notify the frontend that the roomid in invalid (the game has not been generated)                                  |
| player-list     | playerList:string[]                   | Sends the updated player list to the frontend. Happens every time the list is updated                             |
| new-round       | roundIndex:number                     | Notify the frontend that a new round just started                                                                 |
| new-turn        | currentPlayerid:number                | Notify the frontend that a new turn just started                                                                  |
| new-word        | new-word:string                       | Sends a new word to be guessed. This socket is only sent to the player who is trying make the other guess         |
| counter         | { timeLeft:number, totalTime:number } | Notify the frontend that the time has updated its time. The values are used to display the countdown progress bar |
| times-up        | (none)                                | Notify the players that the turn's time is up                                                                     |
