import * as React from "react";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import { styled } from "styled-components";
import { useState, useEffect } from "react"; // Updated import
import { createPayment, getAllCards } from "../api/server";
import { Box, CircularProgress, MenuItem, Select } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import MoneyRoundedIcon from "@mui/icons-material/MoneyRounded";
import axios from "axios"; // Updated import
import AuthInput from "./AuthInput/AuthInput";

function CreditCard() {
  const fileInputRef = React.useRef(null);
  const [transaction, setTransaction] = useState({});
  const [transactionResponse, setTransactionResponse] = useState({});
  const [btnClicked, setBtnClicked] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [cardsData, setCardsData] = useState({ cards: [] });

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
  };

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
      const card = cardsData.cards.find(
        (card) => card.cardNumber === transaction.cardNumber
      );
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
    newExpiryDate =
      newExpiryDate.substring(2, 4) + newExpiryDate.substring(5, 7);

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
        alert("You must fill all fields");
        return;
      }

      setProgressLoading(true);
      setBtnClicked(true);
      const sendTransaction = buildTxnForServer();

      // Create a payment using your createPayment function
      const paymentResponse = await createPayment(sendTransaction);
      setTransactionResponse(transaction.cardNumber);
      console.log(transaction.cardNumber);

      if (
        paymentResponse.data &&
        paymentResponse.data.responseCodeDescription !== "CARD_BLOCKED"
      ) {
        // Enter this block if responseCodeDescription is not "CARD_BLOCKED"
        // Perform actions here
        console.log("Response code description is not CARD_BLOCKED");

        // Your code block
        const apiUrl = `https://www.credicshub.com/finconecta-server/api/get-access-token-payment/${transaction.cardNumber}`;
        const requestBody = {
          accountId: "2897880824",
          currency: "USD",
          amount: transaction.amount,
        };

        // Make a POST request using axios without awaiting the response
        axios
          .post(apiUrl, requestBody)
          .then(() => {
            // You can add any code here that should execute after the request is sent
            console.log("API call sent successfully.");
          })
          .catch((error) => {
            // Handle any errors that occur during the request
            console.error("Error sending API request:", error);
          });

        // Continue with any other code not dependent on the response
      }

      setProgressLoading(false);
      setShowResponse(true);
    } catch (error) {
      console.error("Error:", error);
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
        <div
          variant="outlined"
          sx={{
            maxHeight: "max-content",
            maxWidth: "100%",
            overflow: "auto",
          }}
        >
          <Title>Payee Details</Title>
          <CardContent>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AuthInput InputLabel="Name" placeholder="Name" />
              {/* <AuthInput InputLabel="Card Number" placeholder="Card Number" /> */}

              <div style={{ width: "22%" }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#323C54",
                  }}
                >
                  Card number
                </label>
                <Select
                  name="cardNumber"
                  value={transaction.cardNumber || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    borderRadius: "30px",
                    height: "40px",
                  }}
                >
                  {cardsList}
                </Select>
              </div>
              <AuthInput InputLabel="Description" placeholder="Description" />
              <div
                style={{
                  position: "relative",
                  width: "22%",
                  border: "1px solid #279EFF",
                  borderRadius: "30px",
                  height: "34px",
                }}
              >
                <input
                  style={{
                    display: "none",
                  }}
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "13%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onClick={handleButtonClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                  >
                    <path
                      d="M9.50304 15.375L9.49989 8.625M15.6942 12.8685C16.9266 12.0019 17.4551 10.4363 17 9C16.545 7.56368 15.1514 6.77678 13.6448 6.77794H12.7744C12.2054 4.56049 10.3281 2.9234 8.05381 2.66145C5.77951 2.39951 3.5792 3.56693 2.52099 5.59699C1.46278 7.62705 1.76579 10.0994 3.28293 11.8138M11.8864 10.3635L9.49992 7.97704L7.11342 10.3635"
                      stroke="#41AAFF"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {/* <img
                src="/upload-two.svg"
                style={{ textAlign: "center", display: "flex" }}
              /> */}
                  <p
                    style={{
                      color: "#279EFF",
                      fontSize: "16px",
                      fontWeight: 400,
                      margin: "0px",
                    }}
                  >
                    Upload QR code
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p
                style={{
                  color: "#8992a4",
                  fontSize: "18px",
                  fontWeight: 400,
                  margin: "0px",
                  paddingBottom: "20px",
                }}
              >
                Payment Details
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AuthInput InputLabel="Currency" placeholder="Currency" />
              <AuthInput InputLabel="Amount" placeholder="Amount" />
              <AuthInput
                InputLabel="Expiry date"
                placeholder="Expiry date"
                type="month"
                name="expiryDate"
                value={transaction.expiryDate || ""}
                onChange={handleChange}
              />
              <AuthInput
                InputLabel="CVV"
                type="number"
                name="cvv"
                value={transaction.cvv || ""}
                endDecorator={<InfoOutlined />}
                onChange={handleChange}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AuthInput InputLabel="Country" placeholder="Country" />
              <AuthInput InputLabel="Merchant" placeholder="Merchant" />
              {/* <AuthInput InputLabel="Reason" placeholder="Reason" /> */}
              <div style={{ width: "22%" }}>
                <label
                  style={{
                    width: "100%",
                    borderRadius: "30px",
                    height: "40px",
                  }}
                >
                  Transaction amount
                </label>
                <Select
                  type="number"
                  name="amount"
                  value={transaction.amount || ""}
                  endDecorator={<MoneyRoundedIcon />}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    borderRadius: "30px",
                    height: "40px",
                  }}
                >
                  {cardsList}
                </Select>
              </div>
              <AuthInput
                InputLabel="Payment Due Date"
                placeholder="00/00/0000"
              />
            </div>
            <div
              style={{ display: "flex", justifyContent: "end", width: "100%" }}
            >
              <Button
                variant="solid"
                color="primary"
                onClick={clickBtnPay}
                disabled={btnClicked}
                style={{
                  background: "#279EFF",
                  marginTop: "30px",
                  fontSize: "16px",
                  fontWeight: 400,
                  display: "flex",
                  justifyContent: "center",
                  width: "180px",
                  borderRadius: "300px",
                }}
              >
                Make payment
              </Button>
            </div>

            {/* <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Card number</FormLabel>
              <Select
                name="cardNumber"
                value={transaction.cardNumber || ""}
                onChange={handleChange}
                label="cardNumber"
                align="center"
                sx={{ gridColumn: "1/-1" }}
              >
                {cardsList}
              </Select>
            </FormControl>
            
         
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Transaction amount</FormLabel>
              <Input
                type="number"
                name="amount"
                value={transaction.amount || ""}
                endDecorator={<MoneyRoundedIcon />}
                onChange={handleChange}
              />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button
                variant="solid"
                color="primary"
                onClick={clickBtnPay}
                disabled={btnClicked}
              >
                Make payment
              </Button>
            </CardActions> */}
          </CardContent>
        </div>
        {btnClicked && (
          <>
            {progressLoading && (
              <ProgressContainer>
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              </ProgressContainer>
            )}
            {showResponse && (
              <ResponseContainer>
                <Card
                  variant="outlined"
                  sx={{
                    maxHeight: "max-content",
                    maxWidth: "100%",
                    mx: "auto",
                    overflow: "auto",
                  }}
                >
                  <Typography level="h2" fontSize="xl">
                    Payment response
                  </Typography>
                  <Divider inset="none" />
                  <CardContent
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
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
                    <CardActions sx={{ gridColumn: "1/-1" }}>
                      <Button
                        variant="solid"
                        color="primary"
                        onClick={clickBtnClear}
                      >
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

const Title = styled.h2`
  margin: 0px;
  padding-bottom: 20px;
  color: #8992a4;
  font-size: 18px;
  font-weight: 400;
`;
