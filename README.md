# Backend job interview assignment

## 📄 Intro

Hey there, welcome to the MochaLabs backend job interview.

From our business partners, you just received a request to **develop the basic BE solution** for the most popular provably fair game for online casinos called **Crash**. You can read more about Crash game and the provably fair casinos [here](https://www.casinowow.com/guides/guide-to-crash-games-and-how-they-work) and check out some well-established implementations like the one from [Stake.com](https://stake.com/casino/games/crash).

After talking with business partners and defining the scope of the project, our product team wrote up game functionality specification.

Not long after that, you sat down with the frontend team and agreed on the rough API interface that we need to deliver in order for them to start developing.

Both specifications can be found below.

## 🎲 Game functionality specification

Crash game is a **multiplayer** casino game. The point of the game is for users to place bets and cash them out before the multiplier hits the maximum value (we call this event “crash”, hence the game name).

Crash game is played in **rounds**. When one round ends, another starts automatically. Each round consists of multiple **game states** that are executed in a defined order. Game state defines the allowed set of **user actions** that differ from state to state. Each game state lasts for a different amount of time.

Game states can be defined as follows:

1. **Accepting bets** - users place their bets (each user can place just one bet per round). Always lasts exactly 10 seconds.
2. **Preparing** - no user actions. Always lasts exactly 2 seconds.
3. **Flying** - multiplier starts to grow, users can cash out their placed bets until the multiplier hits the maximum value. Lasts until the multiplier hits the maximum value.
4. **Crash** - no user actions. Always lasts exactly 1 second.

Cashed-out bets are considered to be **won**. The bet win amount is a product of placed bet amount and multiplier at the time of cash out.

Placed bets that are not cashed out before the multiplier hits the maximum value are considered to be **lost**.

For the sake of this assignment, we will not worry about the provably fair part of the Crash game. With that in mind, the maximum multiplier value for the round’s flying state can be calculated using the code:

```tsx
const getMaxMultiplier = () => Math.floor(Math.random() * 1_000) / 100 + 1;
```

The current multiplier can be calculated using the code:

```tsx
const getCurrentMultiplier = (gameDurationInSec) =>
  1 +
  0.05 * gameDurationInSec +
  0.005 * Math.pow(gameDurationInSec, 2) +
  0.00000000001 * Math.pow(gameDurationInSec, 7.2);
```

## ⚙️ API specification

**Rest API**

- Create a new user, get user info
- Get bet history for a particular user
- Get round history with corresponding multipliers

**WebSocket**

- Subscribe to the crash game info. Crash game info needs to be sent to all subscribed players every 100 ms. This info includes the current multiplier, game state, and placed bets.
- Unsubscribe from the crash game info.
- Place a new bet. When a bet is placed it is broadcasted to all subscribed players.
- Cash out placed bet. When a bet is cashed out it is broadcasted to all subscribed players.

## 🎁 Bonus assignment

Bonus assignments will not in any way affect your success for this assignment, rather they are here for you. If you had fun building the Crash game, these few features can make it even better.

- Implement **auto cash out feature**. Auto cash out is a safety mechanism that enables users to cash out even in cases when they are disconnected in the middle of the game. In order for the auto cash out feature to work user needs to specify auto cash out multiplier for each bet. If this multiplier is reached bet needs to be automatically cashed out by the crash game.
- Implement **user wallet feature**. With user wallets in place we can track user balance when user places or cashes out his bets. Placing bets decreases wallet balance, and cashing them out increases it.

## 💡Useful tips

- No UI implementation is needed for this assignment
- Do not worry about the user's balance and finances
- Do not worry about authentication/authorization
- We highly encourage you to use [socket.io](http://socket.io) for WebSocket communication
- Writing unit/integration/e2e test is not a must

# Crash Game Backend Application

This application architecture enables efficient management of user data, game rounds, and betting/cashing out operations within the Crash Game Backend system. Using NestJS along with MongoDB and TypeORM provides scalability and flexibility for future enhancements and optimizations.
It consists of two main modules: User and Crash Round. Below is a summary of each component:

## 🧑‍💼 User Module

- Handles user-related operations.
- Includes a controller to expose necessary endpoints for user management.
- Utilizes a repository to handle saving user data to the database.

## 🚀 Crash Round Module

- Manages the crash game rounds.
- Contains both a controller and a gateway.
- The controller exposes endpoints to retrieve round history.
- The gateway handles subscriptions to the game, betting, and cashing out operations.

### Services

1. **CrashRoundService**:

   - Responsible for running the game according to predefined rules.
   - Saves round information in the rounds list.

2. **CrashRoundEventsService**:
   - Processes events received from the rounds list.
   - Handles further processing of game events.

### Repository

- **RoundsRepository**:
  - Manages the interaction with the database for storing round-related data.

## 📊 Database

- MongoDB is used as the database with TypeORM tool
- Local mongoDb docker instance is created and lifted when application is started.
- Consists of three collections:
  1. **Users**: Stores user data.
  2. **Rounds**: Stores information about game rounds.
  3. **RoundBets**: Stores details of bets placed in each round.

---

## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode which starts docker mongoDB database
$ npm run start:all:dev

# watch mode
$ npm run start:dev
```
