// import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import CreditCard from './CreditCard'
import credicsLogo from "../credics-logo.jpg";
import { useEffect, useState } from 'react'
import { checkPaymentServer } from '../api/server'
// import { getPamentPageDetails } from '../api/server';

function PaymentPage() {

    const [serverOk, setServerOk] = useState(false)

    useEffect(() => {
        checkPaymentServer()
            .then((res) => {
                setServerOk(true)
            })
            .catch((err) => {
                setServerOk(false)
            })

    }, [])


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
            {/* {
                paymentPageDetails === null ?
                    <>
                        {badMessage}
                    </>
                    : */}
            <Container>
                <LogoContainer>

                    <CredicsLogo src={credicsLogo} alt="Credics Logo" />
                </LogoContainer>
                <Title>
                    Payment page
                </Title>
                <CreditCardContainer>
                    {/* <CreditCard> */}
                    <CreditCard />
                </CreditCardContainer>
                <CheckServerContainer>
                    <>
                        {
                            serverOk ?
                                <ServerOkContainer>Server up and runing </ServerOkContainer>
                                :
                                <ServerErrorContainer>Problem with the server</ServerErrorContainer>
                        }
                    </>
                </CheckServerContainer>
            </Container>

            {/* } */}
        </>
    )
}

export default PaymentPage

const Container = styled.div`
    display: flex;
    border: 1px solid black;
    border-radius: 20px;
    margin: 10px;
    background-color: white;
    flex-direction: column;
    align-items: center;
    position: relative;
`

const CreditCardContainer = styled.div`
    min-width: 100%;
    height: 100%;
    padding: 10px;
`
const LogoContainer = styled.div`
    width: 100%;
`
const CredicsLogo = styled.img`
    padding: 10px;
    width: 120px;
`

const CheckServerContainer = styled.div`
    margin: 5px 10px;
    align-self: flex-start;
    align-items: center;
`
const ServerErrorContainer = styled.div`
    color: red;

`
const ServerOkContainer = styled.div`
    color: green;
`
const Title = styled.h2`
    margin: 0px;
`