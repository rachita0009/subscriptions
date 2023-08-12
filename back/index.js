require("./db/server");
const express = require("express");
var cors = require('cors');

// import { createConnection } from "typeorm";
// import cookieParser from "cookie-parser";
// import { sendMail } from "./mail";
// import { token } from "morgan";

const app = express();
const stripe = require("stripe")("sk_test_51MCH2uSJ3axajDDmjALD8Yo8JZWJ2Eb8QLaOch0tX7FXx5Vaw6nTHqEgOAw1u0utDLQmCnJOKl5vpsYx3SdEM0KZ00lolQH98O");
app.use((req, res, next) => {
    if (req.originalUrl === '/hooks') {
        next();
    } else {
        express.json()(req, res, next);
    }

    //   app.use(cookieParser());
    app.use(cors());
    //   routes(app);
    app.get('/success.html', (req, res) => {
        res.send("Success")
    })
    app.get('/cancel.html', (req, res) => {
        res.send("Payment Cancelled")
    })
    app.post('/checkout', async (req, res) => {
        amounttt = req.body.amount
        const product = await stripe.products.create({
            name: 'demo',
        });
        const price = await stripe.prices.create({
            unit_amount: amounttt * 100,
            recurring: { interval: 'month' },
            currency: 'usd',
            product: product.id,
        })
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {

                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `http://localhost:3000/success.html`,
            cancel_url: `http://localhost:3000/cancel.html`,
            payment_method_types: ["card"],

        });
        return res.json(session.url);
    });



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const endpointSecret = 'whsec_d4c2873ef0a3b8f6bb8198127d98bb0fe05bbfe99f3780cfd4e563710f0fe30b';
    app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.log(err);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('paymentIntent was successfull', paymentIntent);
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        // Return a 200 response to acknowledge receipt of the event
        res.send();
    })
   
});

app.listen(3000, () => {
    console.log('Listening to port 3000');
})