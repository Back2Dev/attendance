import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { REGEX_ID } from '../schema'

export const orderedParts = new SimpleSchema({
    part: {
        type: String,
        label: "Part",
    },
    partId: {
        type: String,
        label: "Part Id",
    },
    partNo: {
        type: String,
        label: "Part No",
    },
    addedAt: {
        type: Date,
        label: "Date Added",
    },
    price: {
        type: SimpleSchema.Integer,
        label: "Price in cents",
    },
    qty: {
        type: SimpleSchema.Integer,
        label: "Quantity",
    },
    userId: {
        type: String,
        label: "User Id",
    },
})

