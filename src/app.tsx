import {
  BrowserRouter as Router, Route, Routes
} from "react-router-dom";
import { GameWindow } from "./components/game/game-window";
import { Renderer } from "./components/game/renderer/renderer";
import { MainMenu } from "./components/main-menu/main-menu";

export default function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Renderer</Link>
            </li>
            <li>
              <Link to="/main">Main menu</Link>
            </li>
            <li>
              <Link to="/game">Game</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/main" element={<MainMenu/>}/>
          <Route path="/game" element={<GameWindow/>}/>
          <Route path="/" element={<Renderer/>}/>
        </Routes>
      </div>
    </Router>
  );
}