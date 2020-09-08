
const express = require('express')
const router = express.Router();
const Offer = require('../models/offer')
const { body, validationResult } = require('express-validator');

const validStatuses = ['NEW', 'CANCELLED', 'EXPIRED']

router.get(`/`, async (req, res) => {
    try {
        const expiredOffers = await Offer.updateMany({ end_date: { $lt: (new Date()) } },
            { $set: { "status": "EXPIRED" } }
        );
        const offers = await Offer.find()
        res.json(offers)
    }
    catch (err) {
        res.json({ message: err })
    }
})

router.get(`/:id`, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id)
        res.json(offer)
    }
    catch (err) {
        res.json({ message: err })
    }
})

router.post(`/create`, [
    body('description').exists().isLength({ min: 5 }).withMessage('Description is too short')
]
    , (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const offerData = req.body;
        const offer = new Offer(offerData)

        offer.save()
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.json({ message: err })
            })
    })



router.patch(`/update`, [
    body('id')
        .isMongoId()
        .custom(value => {
            return Offer.findById(value)
                .then(offer => {
                    if (offer.status !== "NEW")
                        return Promise.reject('Only offers with status NEW can be cancelled')
                })
        }),
    body('status').isIn(validStatuses).withMessage('Valid statuses are : ' + validStatuses.toString())
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedOffer = await Offer.updateOne(
            { _id: req.body.id },
            { $set: { status: req.body.status } }
        )
        res.json({ modified: updatedOffer.nModified, updatedTo: req.body.status })
    }
    catch (err) {
        res.json({ message: err })
    }

})




module.exports = router;
