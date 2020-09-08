/**
 * @jest-environment node
 */

const axios = require('axios');
const mongoose = require('mongoose')

let testOfferId = "5f56df8bd420e04c601de3a2"


describe('Check products', () => {
    test('Product 3 should be a shoe', async () => {
        await axios.get(`http://localhost:3000/products/3`)
            .then(res => {
                const products = res.data
                expect(products.name).toEqual('shoe')
            })
    })
})

describe('Create an offer', () => {
    const body = {
        product_id: 3,
        description: "Test offer",
        price: 100,
        currency: "GBP",
        start_date: Date.now,
        end_date: "01-Jan-2021"
    }
    test('expect success', async () => {
        await axios.post(`http://localhost:3000/offers/create`, body)
            .then(res => {
                const offer = res.data
                expect(offer.description).toEqual('Test offer')
            })
    })
})

describe('Get a specific offer', () => {
    test('Expect test offer to be found', async () => {
        await axios.get(`http://localhost:3000/offers/${testOfferId}`)
            .then(res => {
                const offer = res.data
                console.log(offer)
                expect(offer.description).toEqual('Test offer')
            })
    })
})


describe('Cancel specific offer', () => {

    const bodyInsert = {
        product_id: 3,
        description: "Test offer",
        price: 100,
        currency: "GBP",
        start_date: Date.now,
        end_date: "01-Jan-2021"
    }

    let bodyCancel = {
        id: null,
        status: "CANCELLED"
    }

    test('Expect test offer to be found & return success', async () => {
        await axios.post(`http://localhost:3000/offers/create`, bodyInsert)
            .then(res => {
                const offer = res.data
                bodyCancel.id = offer._id;
            })
        await axios.patch(`http://localhost:3000/offers/update`, bodyCancel)
            .then(res => {
                const offer = res.data
                expect(offer.updatedTo).toEqual(bodyCancel.status)
            })
    })
})

describe('Cancel an expired offer', () => {

    const bodyInsert = {
        product_id: 3,
        description: "Test offer",
        price: 100,
        currency: "GBP",
        start_date: Date.now,
        end_date: "01-Jan-2020",
        status: "EXPIRED"
    }

    let bodyCancel = {
        id: null,
        status: "CANCELLED"
    }

    test('Expect the update to expired to be rejected', async () => {
        // create the offer
        await axios.post(`http://localhost:3000/offers/create`, bodyInsert)
            .then(res => {
                const offer = res.data
                bodyCancel.id = offer._id
            })

        await axios.patch(`http://localhost:3000/offers/update`, bodyCancel)
            .then(res => {
                const offer = res.data
            }).catch((error) => {
                console.log(error.isAxiosError)
                expect(error.isAxiosError).toBe(true)
            })

    })
})