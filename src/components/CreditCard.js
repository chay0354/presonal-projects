
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
import { styled } from 'styled-components';
import { useState, useEffect } from 'react'; // Updated import
import { createPayment, getAllCards } from '../api/server';
import { Box, CircularProgress, MenuItem, Select } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import MoneyRoundedIcon from '@mui/icons-material/MoneyRounded';
import axios from 'axios'; // Updated import

function CreditCard() {
    const [transaction, setTransaction] = useState({});
    const [transactionResponse, setTransactionResponse] = useState({});
    const [btnClicked, setBtnClicked] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [progressLoading, setProgressLoading] = useState(false);
    const [cardsData, setCardsData] = useState({ cards: [] });

    useEffect(() => {
        getAllCards()
            .then((res) => {
                setCardsData(res.data); // Updated state variable name
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const cardsList = cardsData.cards.map((card) => (
        <MenuItem key={card.cardNumber} value={card.cardNumber}>
            {card.cardNumber}
        </MenuItem>
    ));

    useEffect(() => {
        if (transaction.cardNumber) {
            const card = cardsData.cards.find((card) => card.cardNumber === transaction.cardNumber);
            setTransaction(card);
        }
    }, [transaction.cardNumber]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTransaction((prevTransaction) => ({
            ...prevTransaction,
            [name]: value,
        }));
    };

    const buildTxnForServer = () => {
        let newExpiryDate = transaction.expiryDate.toString();
        newExpiryDate = newExpiryDate.substring(2, 4) + newExpiryDate.substring(5, 7);

        const txn = {
            cardNumber: transaction.cardNumber,
            cvv: transaction.cvv,
            amount: transaction.amount,
            expiryDate: newExpiryDate,
        };

        return txn;
    };

    const clickBtnPay = async () => {
		try {
			if (
				!transaction.amount ||
				!transaction.cardNumber ||
				!transaction.cvv ||
				!transaction.expiryDate
			) {
				alert('You must fill all fields');
				return;
			}

			setProgressLoading(true);
			setBtnClicked(true);
			const sendTransaction = buildTxnForServer();

			// Create a payment using your createPayment function
			const paymentResponse = await createPayment(sendTransaction);
			setTransactionResponse(transaction.cardNumber);
			console.log(transaction.cardNumber);

			if (paymentResponse.data && paymentResponse.data.responseCodeDescription !== "CARD_BLOCKED") {
			  // Enter this block if responseCodeDescription is not "CARD_BLOCKED"
			  // Perform actions here
			  console.log("Response code description is not CARD_BLOCKED");

			  // Your code block
			  const apiUrl = `https://www.credicshub.com/finconecta-server/api/get-access-token-payment/${transaction.cardNumber}`;
			  const requestBody = {
				accountId: '2897880824',
				currency: 'USD',
				amount: transaction.amount,
			  };

			  // Make a POST request using axios without awaiting the response
			  axios.post(apiUrl, requestBody)
				.then(() => {
				  // You can add any code here that should execute after the request is sent
				  console.log("API call sent successfully.");
				})
				.catch((error) => {
				  // Handle any errors that occur during the request
				  console.error('Error sending API request:', error);
				});

			  // Continue with any other code not dependent on the response
}

			setProgressLoading(false);
			setShowResponse(true);
		} catch (error) {
			console.error('Error:', error);
			// Handle errors here, e.g., display an error message to the user
		}
	};


    const clickBtnClear = () => {
        setTransactionResponse({});
        setShowResponse(false);
        setProgressLoading(false);
        setBtnClicked(false);
        setTransaction({});
    };

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
                    }}
                >
                    <Typography level="h2" fontSize="xl">
                        Insert card details
                    </Typography>
                    <Divider inset="none" />
                    <CardContent
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                            gap: 1.5,
                        }}
                    >
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Card number</FormLabel>
                            <Select
                                name="cardNumber"
                                value={transaction.cardNumber || ''}
                                onChange={handleChange}
                                label="cardNumber"
                                align="center"
                                sx={{ gridColumn: '1/-1' }}
                            >
                                {cardsList}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Expiry date</FormLabel>
                            <Input
                                type="month"
                                name="expiryDate"
                                value={transaction.expiryDate || ''}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>CVV</FormLabel>
                            <Input
                                type="number"
                                name="cvv"
                                value={transaction.cvv || ''}
                                endDecorator={<InfoOutlined />}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Transaction amount</FormLabel>
                            <Input
                                type="number"
                                name="amount"
                                value={transaction.amount || ''}
                                endDecorator={<MoneyRoundedIcon />}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <CardActions sx={{ gridColumn: '1/-1' }}>
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={clickBtnPay}
                                disabled={btnClicked}
                            >
                                Pay now
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>
                {btnClicked && (
                    <>
                        {progressLoading && (
                            <ProgressContainer>
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            </ProgressContainer>
                        )}
                        {showResponse && (
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
                                    <Typography level="h2" fontSize="xl">
                                        Payment response
                                    </Typography>
                                    <Divider inset="none" />
                                    <CardContent
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                            gap: 1.5,
                                        }}
                                    >
                                        <FormControl id="responseCose">
                                            <FormLabel>Response code</FormLabel>
                                            <Input
                                                type="number"
                                                value={transactionResponse.responseCode}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormControl id="responseDescription">
                                            <FormLabel>Response description</FormLabel>
                                            <Input
                                                type="text"
                                                value={transactionResponse.responseCodeDescription}
                                                disabled
                                            />
                                        </FormControl>
                                        <CardActions sx={{ gridColumn: '1/-1' }}>
                                            <Button variant="solid" color="primary" onClick={clickBtnClear}>
                                                Clear
                                            </Button>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </ResponseContainer>
                        )}
                    </>
                )}
            </>
        </Container>
    );
}

export default CreditCard;

const Container = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: column;
`;

const ProgressContainer = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: column;
    align-items: center;
`;

const ResponseContainer = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: column;
    align-items: center;
`;