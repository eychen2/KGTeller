import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"
import Home from "./Pages/Home"
import Visualizer from "./Pages/KnowledgeVisualizer"
import Model from "./Pages/Model"
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/visualizer' element={<Visualizer/>} />
        <Route path='/model' element={<Model/>} />
      </Routes>
    </Router>
  );
}

export default App;