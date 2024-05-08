import "./App.css";

import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container} from "react-bootstrap";

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <>
        <nav>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand>Выберите раздел</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link
                  onClick={() =>
                    navigate("deformationcontrol", { replace: false })
                  }
                >
                  DeformationControl
                </Nav.Link>
                <Nav.Link
                  onClick={() =>
                    navigate("thermistorchain", { replace: false })
                  }
                >
                  ThermistorChain
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
        </nav>

            <hr />
        <Outlet />
      </>
    </div>
  );
}

export default App;


