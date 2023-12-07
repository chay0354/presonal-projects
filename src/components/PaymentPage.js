// import React, { useEffect, useState } from 'react'
import { styled } from "styled-components";
import CreditCard from "./CreditCard";
import credicsLogo from "../credics-logo.jpg";
import AtmImg from "../images/AtmCard.svg";
import { useEffect, useState } from "react";
import { checkPaymentServer } from "../api/server";
// import { getPamentPageDetails } from '../api/server';

function PaymentPage() {
  const [serverOk, setServerOk] = useState(false);

  useEffect(() => {
    checkPaymentServer()
      .then((res) => {
        setServerOk(true);
      })
      .catch((err) => {
        setServerOk(false);
      });
  }, []);

  // const [paymentPageDetails, setpaymentPageDetails] = useState(null);
  // const [badMessage, setBadMessage] = useState();

  // useEffect(() => {
  //     const data = { "url": window.location.href };
  //     getPamentPageDetails(data)
  //         .then((res) => {
  //             if (res.data) {
  //                 // console.log(res.data);
  //                 setpaymentPageDetails(res.data)
  //                 setpaymentPageDetails(obj => {
  //                     return { ...obj, ['url']: data.url }
  //                 });
  //             }
  //         })
  //         .catch((err) => {
  //             switch (err.response.data) {
  //                 case 'No data found':
  //                     setBadMessage('Not found payment page for this URL')
  //                     break;
  //                 case 'This payment page was already in use':
  //                     setBadMessage('This payment page was already in use')
  //                     break;
  //                 case 'This payment page expired':
  //                     setBadMessage('This payment page expired')
  //                     break;
  //                 default:
  //                     console.log(err)
  //                     break;
  //             }
  //             console.log(err)
  //             setpaymentPageDetails(null)
  //         })
  // }, [])

  return (
    <>
      <Container>
        <img src={AtmImg} style={{ width: "100%" }} />
        <LogoContainer>
          <CreditCardContainer>
            {/* <CreditCard> */}
            <CreditCard />
          </CreditCardContainer>

          <CheckServerContainer>
            <>
              {serverOk ? (
                <ServerOkContainer>Server up and runing </ServerOkContainer>
              ) : (
                <ServerErrorContainer>
                  Problem with the server
                </ServerErrorContainer>
              )}
            </>
          </CheckServerContainer>
        </LogoContainer>
      </Container>

      {/* } */}
    </>
  );
}

export default PaymentPage;

const Container = styled.div`
  border-radius: 20px;
  padding: 30px;
  align-items: center;
  border-radius: 20px;
  background: #fff;
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.1);
`;

const CreditCardContainer = styled.div`
  min-width: 100%;
  height: 100%;
  padding: 10px;
`;
const LogoContainer = styled.div`
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 30px;
  align-items: center;
  border-radius: 20px;
  background: #fff;
`;

const CheckServerContainer = styled.div`
  /* margin: 5px 10px;
  align-self: flex-start;
  align-items: center; */
`;
const ServerErrorContainer = styled.div`
  color: red;
`;
const ServerOkContainer = styled.div`
  color: green;
`;
