import axios from 'axios';
import env from '../config/env';
// import notification from '../util/notification';

const URL = env.IS_PRODUCTION ? env.URL_PRODUCTION : env.URL_DEV

const server = axios.create({ baseURL: URL })

// const addAuthorization = () => {
//     const token = localStorage.getItem('Token') || false
//     if (token) server.defaults.headers.common['Authorization'] = token
// }

export const checkPaymentServer = (data) => {
    return new Promise((resolve, reject) => {
        // addAuthorization()
        server.get(`paymentpage`, data)
            .then(resolve)
            .catch(reject)
    })
}

export const createPayment = (data) => {
    return new Promise((resolve, reject) => {
        // addAuthorization()
        server.post(`paymentpage/finplus`, data)
            .then(resolve)
            .catch(reject)
    })
}

export const getPamentPageDetails = (data) => {
    return new Promise((resolve, reject) => {
        // addAuthorization()
        server.post(`paymentpage/getPaymentPageDetails`, data)
            .then(resolve)
            .catch(reject)
    })
}

export const getAllCards = (data) => {
    return new Promise((resolve, reject) => {
        // addAuthorization()
        server.get(`finplus/getAllCards`, data)
            .then(resolve)
            .catch(reject)
    })
}