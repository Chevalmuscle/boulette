# The "La boulette" game

"La boulette" is a game meant to be played with your close friends in a party.

**If you know the name of the game in english, please contact me.**

The frontend and the backend are in 2 separated folder and are both nodes projects.

This project is heavily relying on [socket.io](https://socket.io/) in other to exchange data about the game.

## The Game

Each player enters 5 words that will be added in the word bank. Each word has to be guessed to be removed from the bank. When the bank is empty, a new round starts and all the same words go back to the bank. The players are split into two even teams. The goal of the game is to make your team guess as many words you can with rules specified by the current round.

### How to play

Go to the [hosted version](http://boulette--frontend.herokuapp.com/) or run the fontend and backend on your computer by following README in the frontend and backend folder

1. Hop in a video call with your friends. You can choose the one you like as long as you can understand and see correctly your friends
2. Generate a game and share the link with the roomid with your friends
3. Each player enters their 5 words that will be added into the word bank
4. Split the players into teams (random or not)
5. Ready up
6. If you see a word on the screen, you are the one who has to make your team guess the word. See the [Rounds](#round) section to see the rules of each round. You can guess as many words as you can during the round, but you cannot skip one
7. If you don't see a big word on the screen and
   - It's your team member's turn: Try to guess the word (by talking)
   - It's not your team member's turn: It's the other team's turn. Make sure they follow the rules and enjoy their silliness
8. Repeat steps 6-7 as long as there's words left in the bank
9. If there's no more word, the round is over and a new one start. You have to decide on the next round's rules.

### Rounds

You are free to have different rules for each round. These are the one I use:

1. Describe: describe the word to your team with any words but the ones who sound similar
2. Mime: mime the word (no sound, pointing or objects)
3. One word: same rules as round 1, but you can only say one word. You can change your tone, but not the word.

Other round ideas:

- Statue (hard): stay in the same position and do not speak
- Neanderthal: Use a very basic vocabulary to describe the word

## Post mortem / Missing features

This game has been made so that me and by friends can play. The UI is far from done and there are little bugs, mostly due to the web socket exchanges and game state.

Here are some features that I wanted to add.

- Internationalization. Current situation: the game is french and english at the same time
- Handle hot joining. Current situation: the players can join back by entering 5 new words (that won't go into the word bank)
- Notification to all players when a word has been guessed
- Notification when your turn will start
- Countdown for a player's turn start
- A list of the players during the game so that everyone can see who's next
- Teams. Current situation: the teams are made by players and the game has no idea which players are on which teams. Ideally, the team's turn alternate
- Add round rules into the game
- Scores (ex: +10 to a team when a word is guessed)
- Room names. Current situation: random generated room id
- Private rooms with password
- Video & Chat

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
