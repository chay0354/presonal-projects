import * as React from 'react';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyRoundedIcon from '@mui/icons-material/MoneyRounded';
import { styled } from 'styled-components';
import { useState } from "react";
import moment from 'moment/moment';
import { createPayment } from '../api/server';
import { Box, CircularProgress } from '@mui/material';


function CreditCard(val) {
    var currentDate = moment().format('YYYY-MM');
    const [transaction, setTransaction] = useState({ url: val.paymentPageDetails.url, amount: val.paymentPageDetails.AMOUNT});
    // const [transaction, setTransaction] = useState({ amount: val.paymentPageDetails.amount, expiryDate: currentDate, cardNumber: '1616267083110898', cvv: '468' });
    const [transactionResponse, setTransactionResponse] = useState({});
    // const [transactionResponse, setTransactionResponse] = useState(response);
    const [btnClicked, setBtnClicked] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [progressLoding, setProgressLoding] = useState(false);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        // console.log("key: " + id + ", val: " + value);
        setTransaction(obj => {
            return { ...obj, [id]: value }
        });
    };

    const fixExpiryDateFormat = (transaction) => {
        let newExpiryDate = transaction.expiryDate.toString();
        newExpiryDate = newExpiryDate.substring(2, 4) + newExpiryDate.substring(5, 7);
        transaction.expiryDate = newExpiryDate;
    }

    const clickBtnPay = () => {
        if (transaction.amount === "" || transaction.amount == null ||
            transaction.cardNumber === "" || transaction.cardNumber == null ||
            transaction.cvv === "" || transaction.cvv == null ||
            transaction.expiryDate === "" || transaction.expiryDate == null) {
            alert('You must fill all fields');
        } else {
            setProgressLoding(true)
            setBtnClicked(true)
            fixExpiryDateFormat(transaction)
            console.log(transaction);
            createPayment(transaction)
                .then((res) => {

                    setTransactionResponse(res.data)
                    setProgressLoding(false)
                    setShowResponse(true)
                    console.log(res.data)
                    transaction.expiryDate = currentDate;
                }).catch((err) => {
                    alert("ERROR !!!", err.response.data, "danger");
                    setProgressLoding(false)
                    setBtnClicked(false)
                })
        }

    };

    const clickBtnClear = () => {
        window.location.reload();
        // setShowResponse(false)
        // setBtnClicked(false)
    }

    return (
        <Container>

            <>
                <Card
                    variant="outlined"
                    sx={{
                        maxHeight: 'max-content',
                        maxWidth: '100%',
                        mx: 'auto',
                        overflow: 'auto',
                        // resize: 'horizontal',
                    }}
                >
                    <Typography level="h2" fontSize="xl" >Insert card details</Typography>
                    <Divider inset="none" />
                    <CardContent
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                            gap: 1.5,
                        }}
                    >
                        <FormControl id="cardNumber" sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Card number</FormLabel>
                            <Input endDecorator={<CreditCardIcon />} type='number' defaultValue={transaction.cardNumber} onChange={(e) => { handleInputChange(e) }} />
                        </FormControl>
                        <FormControl id="expiryDate" >
                            <FormLabel>Expiry date</FormLabel>
                            <Input type="month" defaultValue={transaction.expiryDate} required onChange={(e) => { handleInputChange(e) }} />
                        </FormControl>
                        <FormControl id="cvv" >
                            <FormLabel>CVV</FormLabel>
                            <Input type='number' endDecorator={<InfoOutlined />} defaultValue={transaction.cvv} onChange={(e) => { handleInputChange(e) }} />
                        </FormControl>
                        <FormControl id="amount" sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Transaction amount</FormLabel>
                            <Input endDecorator={<MoneyRoundedIcon />} type='number' value={transaction.amount} disabled />
                            {/* <Input endDecorator={<MoneyRoundedIcon />} type='number' /> */}
                        </FormControl>
                        <CardActions sx={{ gridColumn: '1/-1' }}>
                            <Button variant="solid" color="primary" onClick={clickBtnPay} disabled={btnClicked}>Pay now</Button>
                        </CardActions>
                    </CardContent>
                </Card>
                {
                    btnClicked &&
                    <>
                        {
                            progressLoding &&
                            <ProgressContainer>
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            </ProgressContainer>

                        }
                        {
                            showResponse &&

                            <ResponseContainer>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        maxHeight: 'max-content',
                                        maxWidth: '100%',
                                        mx: 'auto',
                                        overflow: 'auto',
                                    }}
                                >
                                    <Typography level="h2" fontSize="xl" >Payment response</Typography>
                                    <Divider inset="none" />
                                    <CardContent
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                            gap: 1.5,
                                        }}
                                    >

                                        <FormControl id="responseCose" >
                                            <FormLabel>Response code</FormLabel>
                                            <Input type="number" value={transactionResponse.responseCode} disabled />
                                        </FormControl>
                                        <FormControl id="responseDescription" >
                                            <FormLabel>Response description</FormLabel>
                                            <Input type='text' value={transactionResponse.responseCodeDescription} disabled />
                                        </FormControl>
                                        <CardActions sx={{ gridColumn: '1/-1' }}>
                                            <Button variant="solid" color="primary" onClick={clickBtnClear}>Clear</Button>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </ResponseContainer>
                        }
                    </>
                }
            </>
        </Container >
    );
}

export default CreditCard

const Container = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: column;
`

const ProgressContainer = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: column;
    align-items: center;
`
const ResponseContainer = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: column;
    align-items: center;
`
