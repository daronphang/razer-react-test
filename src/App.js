import "./App.scss";
import Profile from "src/features/profile/components/profile/profile";
import Window from "src/features/window/components/window/window";

function App() {
  return (
    <>
      <div className="main-container">
        <div className="thx-wrapper flex">
          <Profile />
          <Window />
        </div>
      </div>
      ;
    </>
  );
}

export default App;
