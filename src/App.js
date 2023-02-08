import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import Guide from "./Pages/Guide"
import Visualizer from "./Pages/KnowledgeVisualizer"
import Model from "./Pages/Model"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
function App() {
  return (
    <Router>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">KGTeller</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="visualizer">Visualize</Nav.Link>
            <Nav.Link href="model">Generate</Nav.Link>
            <Nav.Link href="guide">Guide</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/visualizer' element={<Visualizer/>} />
        <Route path='/model' element={<Model/>} />
        <Route path='/guide' element={<Guide/>} />
      </Routes>
    </Router>
  );
}

export default App;