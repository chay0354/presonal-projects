import './App.css';
import styled from 'styled-components'
import PaymentPage from './components/PaymentPage';

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
  /* height:100%; */
  display: flex;
  background-color: #D8D8D8 ;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default;
`