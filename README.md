# In A Blink

## Elevator Pitch
**In A Blink** is a fast-paced, multiplayer drawing game that tests both creativity and memory. Imagine catching a quick glimpse of an image, and then racing against the clock to recreate it from memory—competing with friends or other players online. After the drawing phase, everyone votes on the most accurate or creative rendition. It’s fun, competitive, and endlessly replayable, with randomized images keeping each round fresh. "In A Blink" combines real-time interaction and playful competition, making it the perfect game for casual gamers and drawing enthusiasts alike!

## Key Features
- **Multiplayer Drawing Game**: Compete with 3 or more players in each game.
- **Memory-Based Challenge**: Players are shown an image for a few seconds, then must draw it from memory before the timer runs out.
- **Voting System**: After the drawing phase, players vote on the best recreation based on accuracy or creativity.
- **Leaderboard**: Tracks player wins and scores across multiple games.
- **Randomized Images**: Each round, a new image is randomly pulled from an external API to keep the game exciting.
- **Real-Time Gameplay**: Players are synchronized in real time during the image reveal, drawing phase, and voting process via WebSockets.

## Technology Breakdown

### HTML
- **Usage**: The core structure of the game is built using HTML. The drawing canvas, image display area, timer, and voting sections are all HTML elements that create the layout.
  
### CSS
- **Usage**: CSS styles the game’s interface, ensuring a clean and visually appealing design. Animations and transitions are used to create smooth phase shifts between image viewing, drawing, and voting. It also handles responsiveness, so the game looks great on different screen sizes.

### JavaScript
- **Usage**: JavaScript controls game logic and interactivity. This includes managing timers, enabling drawing on the canvas, and handling the submission of drawings and votes. JavaScript is responsible for loading the image, managing rounds, and updating the interface based on real-time events.

### React
- **Usage**: The game uses React to build a **single-page application (SPA)**, managing different game states (viewing, drawing, voting) using React components. React allows for dynamic updates to the interface without refreshing the page, offering a seamless user experience.

### WebSockets
- **Usage**: WebSockets ensure real-time synchronization between all players. The image is displayed to all players at the same time, and drawing submissions are broadcast instantly. WebSockets also manage real-time voting and leaderboard updates during and after each game round.

### Web Service (API)
- **Calling Web Services**: "In A Blink" fetches images for each round using the **Unsplash API** or **Lorem Picsum** to ensure a fresh set of visuals for players to recreate.
  - Example: The server makes a request to the Unsplash API for a random image, which is then displayed to all players for a limited time.
  
- **Providing Web Services**: A custom API is used to save drawings, track player scores, and manage user profiles. Data from the game (like drawing submissions and voting results) is sent to and stored in a backend database.
  - Example: The `/api/saveDrawing` endpoint stores completed drawings for each player.

### Authentication
- **Usage**: Authentication via email and password. Players must log in to play, allowing for personalized game experiences and tracking of individual scores. Tokens (JWT) are used to authenticate users during gameplay, ensuring secure sessions.

### Database
- **Usage**: A database that would store user profiles, match history, player scores, and drawings. This persistent storage allows users to revisit old matches, and maintains leaderboards across multiple game sessions.
  - Example: When a player finishes a game, their drawing is saved in the database, and their performance is logged for the leaderboard.

### WebSockets
- **Usage**: WebSockets power the game's real-time interaction. They are used to:
  - Broadcast the random image to all players at the same time.
  - Synchronize player actions during the drawing phase and allow all drawings to be submitted simultaneously for voting.
  - Broadcast voting results and update the leaderboard in real time.

## Sketches of Application
Below are rough sketches of the **"In A Blink"** application, showing the game flow:

### Main Game Interface
![HomePage sketch](./homepage.jpg)
*This is where users see the rules and startup*

![Server sketch](./SERVER.jpg)
*This is the page where users join or host a server for the game*

### Voting Phase Interface
![Voting Phase Sketch](./drawing.jpg)
*After all players submit their drawings, everyone votes on the most accurate or creative recreation.*

----------------------------------------------------------------------------------------------------------------------------------------------------

## HTML deliverable
For this deliverable I built out the structure of my application using HTML.

- [x] **HTML pages** - Seven HTML pages: login page, homepage(Gallery), Leaderboard, Play (host and join servers to play), voting, drawing, and About (gives a short summary of the game).
- [x] **Links** - The login/home page is linked to all other pages. The Play page has links to a drawing page, and voting page. (these pages will later show up after starting a game)
- [x] **Text** - Placeholder text is used to explain how the game works and guide users through the game’s features, such as hosting or joining a game, and viewing player scores.
- [x] **Images** - Currently, the game page contains placeholders for images, which will eventually pull from a third-party image service. 
- [x] **Login** - Input box and submit button for login(username). In the future, player data, like scores and past drawings, will be pulled from the database.
- [x] **WebSocket** - Placeholders exist on the game page for WebSocket data, which will be used to sync real-time drawing actions and game updates between players.

## CSS deliverable
For this deliverable I properly styled the application into its better appearance.

- [x] **Header, footer, and main content body**: Header is visible on all pages (the drawing/voting pages only have a logout button on the header), footer is only on the home and about page. The main content varies for each page but most lie on a card created bby bootstrap.
- [x] **Navigation elements** - I have navigation to every page and on every page there is an option to logout. When you hover over a nav link, the color darkens. 
- [x] **Responsive to window resizing** - My webpage should resize for a smaller window screen on a laptop. I haven't changed anything for phones or smaller than computer devices. The header and footer would disappear for these pages.
- [x] **Application elements** - I have contrasting colors and elements. Everything is coordinated and the theme is white, blue and orange. 
- [x] **Application text content** - Consistent fonts and emphasis on the more important text.
- [x] **Application images** - I have a logo on the login and homepage that are styled accordingly. There will be more images later but I can't style them yet. I also added some little images on the about page just for the look.

## React deliverable
For this deliverable, I used JavaScript and React to provide a rough mockup of the application's functionality for a single user experience. Each game phase has placeholders, allowing for future enhancements
- [x] **Bundled and transpiled** - done!
- [x] **Components** - Login, Home, Lobby, Drawing, Vote, Results, Leaderboard, and About. Each component uses mock functions to simulate functionality
  - [x] **login** - Users can log in using a form. Once logged in, they are routed to the Home page.
  - [x] **home** - entry point for authenticated users, providing navigation to join or create a game lobby.
  - [x] **leaderboard** - displays player scores fetched from local storage, with columns for player name, score, and date. This will be replaced with persistent storage via a database, displaying high scores across games.
  - [ ] **about** - didn't change, provides information about the game and its purpose.
  - [x] **lobby** - users join a game lobby hosted by another player or create their own. Placeholders for real-time WebSocket integration for showing live players and host designation.
  - [x] **draw** - displays an image for users to memorize and replicate. After 10 seconds, the image disappears, and users are prompted to draw from memory on the canvas. Placeholder logic shows the timer and hides the image, but a future WebSocket integration could synchronize timers across users in a real game.
  - [x] **vote** - Once a user submits their drawing, they are routed to the Vote page. Here, they see player submissions and can vote by clicking on the preferred drawing. Local storage currently tracks scores, and a mock timer counts down for the voting period.
  - [x] **results** - After voting, users are routed to the Results page. This page shows a side-by-side comparison of the original drawing and the winning drawing. Placeholder logic provides structure, with plans for real-time vote count and result display using backend support.
- [x] **Router** - navigation between components, allowing seamless transitions across game phases: login, lobby, home, about, leaderboard, drawing, voting, and results.
- [x] **Hooks** - useState and useEffect for managing state across components. (loading scores from local storage on the Leaderboard or managing timers in Drawing and Vote)

## Service deliverable
- [x] **Node.js/Express HTTP service** 
- [x] **Static middleware for frontend** 
- [X] **Calls to third party endpoints** - using https://picsum.photos/ as my 3rd party images for the game
- [x] **Backend service endpoints** - image fetching, and resetting. working on voting/user login
- [x] **Frontend calls service endpoints** - using fetch function.

