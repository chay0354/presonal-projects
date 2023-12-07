import "./App.css";
import styled from "styled-components";
import PaymentPage from "./components/PaymentPage";

function App() {
  return (
    <Container>
      <PaymentPage />
    </Container>
  );
}

export default App;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: #f7f8fb;
  justify-content: center;
  align-items: center;
  cursor: default;
`;
