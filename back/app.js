require("./db/server");
var cors = require('cors');
// const Data = require("./model/user");
// // const User = require("./model/users");
// const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.json({
    verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url.startsWith('/webhook/stripe')) {
            req.rawBody = buf.toString()
        }
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const paypal = require('paypal-rest-sdk');
// const  fetch  = require("node-fetch");
const fetch = require('node-fetch');
// const fetch = require('node-fetch')
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdL8dtCwbCZD_-SM5f6BpryVagj8C1A9CBFK7FokSOMgTNYxcnNCSr3QARw_-byZxp0pHhb3oY1kEwfB',
    'client_secret': 'ENlzkWgEL-GU-zjhigq-g9ceNPB2suUaZukWMAg0-8jKKg64zX2BiirEyBlH0WrkNLG6IZAARai5IDpV'
});
const endpointSecret = 'whsec_d4c2873ef0a3b8f6bb8198127d98bb0fe05bbfe99f3780cfd4e563710f0fe30b';
signingSecrect = 'whsec_pzhNZEUtsjZvqeLygfXosLjUOymvSkJr';
const stripe = require("stripe")("sk_test_51MCH2uSJ3axajDDmjALD8Yo8JZWJ2Eb8QLaOch0tX7FXx5Vaw6nTHqEgOAw1u0utDLQmCnJOKl5vpsYx3SdEM0KZ00lolQH98O");
const base = "https://api-m.sandbox.paypal.com";


// console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrr')






// app.post("/suscribe", async (req, res) => {

//     try {

//         const body = req.body;
//         if (!(body.name && body.email && body.title && body.price)) {
//             res.status(400).send("ALL FIELD  IS REQUIRED")
//         }
//         // const existUser = await Data.findOne({ email: body.email });
//         // if (existUser) {
//         //     return res.status(409).json({ status: false, error: "USER ALREADY REGISTER", data: [] })
//         // }
//         const user = await Data.create({
//             name: body.name,
//             email: body.email.toLowerCase(),
//             title: body.title,
//             price: body.price
//         });

//         return res.status(200).json({ "status": true, message: "Subscription Successfull", data: user })
//     } catch (err) {
//         console.log(err)
//         return res.status(404).json({ "status": false, message: "Subscription failed" })
//     }
// }
// )

// // app.post("/checkout", async (req, res) => {
// //     // console.log(req.body)


// //         token = req.body.token;
// //         const customer = await stripe.customers
// //             .create({
// //                 email: req.body.email,
// //                 source: token.id,
// //             })
// //             .then((customer) => {
// //                 // console.log(customer);
// //                 return stripe.PaymentIntent.create({
// //                     amount: 1000,
// //                     description: "subscription",
// //                     currency: "USD",
// //                     customer: customer.id,
// //                 });
// //             })
// //             .then((charge) => {
// //                 console.log(charge);
// //                 res.json({
// //                     data: "success",
// //                 });
// //             })
// //             .catch((err) => {
// //                 console.log(err)
// //                 res.json({
// //                     data: "failure",
// //                 });
// //             });
// //         return true;

// // })
app.get('/success.html', (req, res) => {
    res.send("Success")
})
app.get('/cancel.html', (req, res) => {
    res.send("Payment Cancelled")
})

app.post('/checkout', async (req, res) => {
    amounttt = req.body.amount
    // token = req.body.token;
    console.log('req.body', req.body)
    const product = await stripe.products.create({
        // email: req.body.email,
        // amount: req.body.amount,

        name: 'demo'
    });
    // console.log('product', req)
    console.log('product', product)
    // const price = await stripe.prices.create({
    //     // unit_amount: req.body.unit_amount * 100,
    //     unit_amount: product.amount * 100,
    //     recurring: { interval: 'month' },
    //     // description: "subscription",
    //     currency: "USD",
    //     product: product.id,
    //     // name :product.name
    // })

    const price = await stripe.prices.create({
        unit_amount: amounttt * 100,
        currency: 'usd',
        recurring: { interval: 'month' },
        product: product.id,
    });

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        success_url: `http://localhost:3000/success.html`,
        cancel_url: `http://localhost:3000/cancel.html`,
        payment_method_types: ["card"],
        line_items: [
            {

                price: price.id,
                quantity: 1,
            },
        ],

    });
    // console.log(session.url)
    return res.json(session.url)
})

// // stripe webhook //
app.post("/hooks", bodyParser.raw({ type: "application/json" }), async (req, res) => {
    const payload = req.rawBody
    // console.log('payloadddd',payload)
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false
        })
        return;
    }
    console.log(event.type)
    console.log(event.data.object)
    console.log(event.data.object.id)
    res.json({
        success: true
    })
    res.send();

})
// // app.post('/hooks', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
// //     try { 
// //         // const signature = req.headers['stripe-signature'];

// //         // console.log('reqqqqqqqq',req)
// //         // let stripeSignature = req.headers["stripe-signature"];

// //         // if (stripeSignature == null) {
// //         //     console.log('No stripe signature found!');
// //         // }
// //         const stripePayload = req.body;
// //         // console.log('stripePayload',stripePayload)
// //         console.log('stripePayloadsssssssssssss', stripePayload)
// //         const header = stripe.webhooks.generateTestHeaderString({
// //             stripePayload,
// //             signingSecret,
// //           });


// //         let event = stripe.webhooks.constructEvent(stripePayload, header, signingSecret);

// //         console.log(event.type)
// //         console.log('event', event)
// //         console.log(event.data.object)
// //         console.log(event.data.object.id)
// //         res.json({
// //             success: true
// //         })

// //     } catch (err) {
// //         console.log(err)
// //         res.status(400).json({ success: false })
// //     }

// // })


// app.post('/hooks', bodyParser.raw({ type: "application/json" }), (req, res) => {
//     const stripePayload = req.rawBody;
//     const sig = req.headers['stripe-signature'];

//     let event;
//     let data;
//     let eventType;
//     if (endpointSecret) {
//         try {
//             event = stripe.webhooks.constructEvent(stripePayload, sig, endpointSecret);
//             console.log('try  weebhok verified')

//         } catch (err) {
//             console.log('catchhh')
//             console.log('errrr', err)
//             return res.status(400).send(`Webhook Error: ${err.message}`);

//         }
//         data = event.data.object;
//         eventType = event.type
//     } else {
//         data = req.body.data.object;
//         eventType = req.body.type;
//     }
//     // Handle the event

//     if (eventType === "checkout.session.completed ") {
//         stripe.products.retrieve(data.product).then((product) => {
//             console.log(product);
//             console.log('data', data)
//         }).catch(err => console.log(err.message))
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     res.send().end();
// });

// // app.use((req, res, next) => {
// //     if (req.originalUrl === '/hooks') {
// //       next();
// //     } else {
// //       express.json()(req, res, next);
// //     }
// //   });
// // //   app.use(cookieParser());
// // //   app.use(cors());









// // app.post('/checkout', function (req, res) {
// //     console.log(req.body);
// //     token = req.body.token;
// //     stripe.customers.create({
// //         email: req.body.email,
// //         source: token.id,
// //         // mode: 'payment'
// //     })
// //         .then(customer =>
// //             stripe.subscriptions.create({
// //                 amount: 1000,
// //                 items: [
// //                     {
// //                         plan: req.planId
// //                     }],
// //                 // amount,
// //                 description: 'testing subscription',
// //                 currency: "USD",

// //                 customer: customer.id
// //             }))
// //         .then((charge) => {
// //             console.log(charge);
// //             res.json({
// //                 data: "success",
// //             });
// //         })
// //         .catch((err) => {
// //             console.log(err)
// //             res.json({
// //                 data: "failure",
// //             });
// //         });

// //         // const session = await stripe.checkout.sessions.create({
// //         //     success_url: 'https://example.com/success',
// //         //     cancel_url: 'https://example.com/cancel',
// //         //     line_items: [
// //         //       {price: 'price_H5ggYwtDq4fbrJ', quantity: 2},
// //         //     ],
// //         //     mode: 'payment',
// //         //   });
// // });

// // app.post('/checkout',async(req,res)=>{
// //     const product = await stripe.products.create({
// //         name: 'Gold Special',
// //       });

// //       const price = await stripe.prices.create({
// //         unit_amount: 1200,
// //         currency: 'usd',
// //         recurring: {interval: 'month'},
// //         product: 'prod_MwKZ15XGgMpcK8',
// //       });
// //       const customer = await stripe.customers.create({
// //         description: 'My First Test Customer ',
// //       });
// // })



// // app.post("/checkout", async (req, res) => {

// //     try {

// //         const body = req.body;
// //         if (!(body.name && body.email && body.title && body.price)) {
// //             res.status(400).send("ALL FIELD  IS REQUIRED")
// //         }
// //         // const existUser = await Data.findOne({ email: body.email });
// //         // if (existUser) {
// //         //     return res.status(409).json({ status: false, error: "USER ALREADY REGISTER", data: [] })
// //         // }
// //         const user = await Data.create({
// //             name: body.name,
// //             email: body.email,
// //             title: body.title,
// //             price: body.price
// //         });

// //         const product = await stripe.products.create({
// //             // email: req.body.email,
// //             name: body.name,
// //             // price: body.price
// //         });
// //         const price = await stripe.prices.create({
// //             // unit_amount: req.body.unit_amount * 100,
// //             unit_amount: 1000,
// //             recurring: { interval: 'month' },
// //             // description: "subscription",
// //             currency: "USD",
// //             product: product.id,

// //         })
// //         const session = await stripe.checkout.sessions.create({
// //             mode: "subscription",
// //             success_url: `http://localhost:3000/success.html`,
// //             cancel_url: `http://localhost:3000/cancel.html`,
// //             payment_method_types: ["card"],
// //             line_items: [
// //                 {
// //                     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
// //                     price: price.id,
// //                     quantity: 1,
// //                 },
// //             ],

// //         });
// //     return res.json(session.url)

// //         // return res.status(200).json({ "status": true, message: "Subscription Successfull", data: user })



// //     } catch (err) {
// //         console.log(err)
// //         return res.status(404).json({ "status": false, message: "Subscription failed" })
// //     }
// // }
// // )


// // app.post('/pay', (req, res) => {
// //     price = req.body.amount;
// //     title = req.body.name

// //     const create_payment_json = {
// //         "intent": "sale",
// //         "payer": {
// //             "payment_method": "paypal"
// //         },
// //         "redirect_urls": {
// //             "return_url": "http://localhost:3000/success",
// //             "cancel_url": "http://localhost:3000/cancel"
// //         },
// //         "transactions": [{
// //             "item_list": {
// //                 "items": [{
// //                     "name": title,

// //                     "price": price,
// //                     "currency": "USD",
// //                     "quantity": 1
// //                 }]
// //             },
// //             "amount": {
// //                 "currency": "USD",
// //                 "total": price
// //             },
// //             //   "description": "Hat for the best team ever"
// //         }]
// //     };

// //     app.get('/success', (req, res) => {
// //         const payerId = req.query.PayerID;
// //         const paymentId = req.query.paymentId;

// //         const execute_payment_json = {
// //             "payer_id": payerId,
// //             "transactions": [{
// //                 "amount": {
// //                     "currency": "USD",
// //                     "total": price
// //                 }
// //             }]
// //         };
// //         paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
// //             if (error) {
// //                 console.log(error.response);
// //                 throw error;
// //             } else {
// //                 console.log(JSON.stringify(payment));
// //                 res.send('Success');
// //             }
// //         });
// //     });

// //     paypal.payment.create(create_payment_json, (error, payment) => {
// //         if (error) {
// //             throw error;
// //         } else {
// //             for (let i = 0; i < payment.links.length; i++) {
// //                 if (payment.links[i].rel === 'approval_url') {
// //                     res.redirect(payment.links[i].href);
// //                 }
// //             }
// //             console.log("Create Payment Response");
// //             console.log('PAYMENT', payment);
// //         }
// //     });

// // });

// // app.get('/cancel', (req, res) => res.send('Cancelled'));

// app.post("/api/orders", async (req, res) => {
//     console.log('reqqqqqqqqqqqqqqqqqqqqqq', req.body.price)
//     const price = req.body.price
//     try {
//         const order = await createOrder(price);
//         res.json(order);
//         console.log(order)
//     } catch (err) {
//         console.log(err)
//     }
// });

// app.post("/api/orders/:orderID/capture", async (req, res) => {
//     const { orderID } = req.params;
//     const captureData = await capturePayment(orderID);
//     res.json(captureData);
// });

// async function createOrder(price) {
//     console.log(price);
//     const accessToken = await generateAccessToken();
//     const url = `${base}/v2/checkout/orders`;
//     const response = await fetch(url, {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },


//         body: JSON.stringify({
//             intent: "CAPTURE",
//             purchase_units: [
//                 {
//                     amount: {
//                         currency_code: "USD",
//                         value: price,
//                     },
//                 },
//             ],
//         }),
//     });
//     const data = await response.json();
//     return data;
// }

// async function capturePayment(orderId) {
//     const accessToken = await generateAccessToken();
//     const url = `${base}/v2/checkout/orders/${orderId}/capture`;
//     const response = await fetch(url, {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//     const data = await response.json();
//     return data;
// }

// async function generateAccessToken() {
//     const auth = Buffer.from("AdL8dtCwbCZD_-SM5f6BpryVagj8C1A9CBFK7FokSOMgTNYxcnNCSr3QARw_-byZxp0pHhb3oY1kEwfB" + ":" + "ENlzkWgEL-GU-zjhigq-g9ceNPB2suUaZukWMAg0-8jKKg64zX2BiirEyBlH0WrkNLG6IZAARai5IDpV").toString("base64")
//     const response = await fetch(`${base}/v1/oauth2/token`, {
//         method: "post",
//         body: "grant_type=client_credentials",
//         headers: {
//             Authorization: `Basic ${auth}`,
//         },
//     });
//     const data = await response.json();
//     return data.access_token;
// }



// app.post('/register', async (req, res) => {
//     try {
//         const { name, email, password } = req.body
//         if (!(name && email && password)) {
//             res.status(400).send("All input is required");
//         }
//         encryptedPassword = await bcrypt.hash(password, Number(10));
//         const user = await User.create({
//             name: name,
//             email: email.toLowerCase(),
//             password: encryptedPassword
//         })
//         return res.status(200).json({ message: "sucess", data: user })

//     } catch (err) {
//         console.log(err)
//         return res.status(401).json({ message: "failed to register" })
//     }
// })


// app.post('/pay', async (req, res) => {
//     // console.log("reqqqqqqqqqqqqq",req.body)

//     const price = req.body.selectedPlan.price
//     console.log('price', price)
//     const title = req.body.selectedPlan.title
//     console.log(title)
//     // const description = req.body.selectedPlan.features
//     // console.log(description)


//     var billingPlanAttribs = {
//         "product_id": "PROD-7FM781316A1021356",
//         "name": "demo",
//         "description": "description",
//         "type": "fixed",
//         "payment_definitions": [{
//             "name": title,
//             "type": "REGULAR",
//             "frequency_interval": "1",
//             "frequency": "MONTH",
//             "cycles": "11",
//             "amount": {
//                 "currency": "USD",
//                 "value": price
//             }
//         }],
//         "merchant_preferences": {
//             "setup_fee": {
//                 "currency": "USD",
//                 "value": "1"
//             },
//             "cancel_url": "http://localhost:3000/cancel",
//             "return_url": "http://localhost:3000/processagreement",
//             "max_fail_attempts": "0",
//             "auto_bill_amount": "YES",
//             "initial_fail_amount_action": "CONTINUE"
//         }
//     };
//     var billingPlanUpdateAttributes = [{
//         "op": "replace",
//         "path": "/",
//         "value": {
//             "state": "ACTIVE"
//         }
//     }];

//     paypal.billingPlan.create(billingPlanAttribs, function (error, billingPlan) {
//         if (error) {
//             console.log(error);
//             throw error;
//         } else {
//             // Activate the plan by changing status to Active
//             paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
//                 if (error) {
//                     console.log(error);
//                     throw error;
//                 } else {
//                     console.log('billingPlan', billingPlan)
//                     console.log(billingPlan.id);
//                 }
//             });
//         }
//     });
// });

// app.get('/createagreement', function (req, res) {
//     console.log(req);
//     var billingPlan = req.query.plan;

//     var isoDate = new Date();
//     isoDate.setSeconds(isoDate.getSeconds() + 4);
//     isoDate.toISOString().slice(0, 19) + 'Z';

//     var billingAgreementAttributes = {
//         "name": "Standard Membership",
//         "description": "Food of the World Club Standard Membership",
//         "start_date": isoDate,
//         "plan": {
//             "id": billingPlan
//         },
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "shipping_address": {
//             "line1": "W 34th St",
//             "city": "New York",
//             "state": "NY",
//             "postal_code": "10001",
//             "country_code": "US"
//         }
//     };

//     // Use activated billing plan to create agreement
//     paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
//         if (error) {
//             console.error(error);
//             throw error;
//         } else {
//             //capture HATEOAS links
//             var links = {};
//             billingAgreement.links.forEach(function (linkObj) {
//                 links[linkObj.rel] = {
//                     'href': linkObj.href,
//                     'method': linkObj.method
//                 };
//             })

//             //if redirect url present, redirect user
//             if (links.hasOwnProperty('approval_url')) {
//                 res.redirect(links['approval_url'].href);
//             } else {
//                 console.error('no redirect URI present');
//             }
//         }
//     });

// })
// app.get('/processagreement', function (req, res) {
//     var token = req.query.token;

//     paypal.billingAgreement.execute(token, {}, function (error, billingAgreement) {
//         if (error) {
//             console.error(error);
//             throw error;
//         } else {
//             console.log(JSON.stringify(billingAgreement));
//             res.send('Billing Agreement Created Successfully');
//         }
//     });
// });



// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// app.post("/api/products", async (req, res) => {
//     // console.log('reqqqqqqqqqqqqqqqqqqqqqq', req.body.price)
//     // const price = req.body.price
//     try {
//         const product = await createProduct();
//         res.json(product);
//         console.log(product)
//     } catch (err) {
//         console.log(err)
//     }
// });

// app.post("/api/products/:productID/capture", async (req, res) => {
//     const { productID } = req.params;
//     const captureData = await createPlan(productID);
//     res.json(captureData);
// });


// async function createProduct() {
//     // console.log(price);
//     const accessToken = await generateToken();
//     const url = `${base}/v1/catalogs/products`;
//     const response = await fetch(url, {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({
//             "name": "Video Streaming Service",
//             "description": "A video streaming service",
//             "type": "SERVICE",
//             "category": "SOFTWARE",
//             "image_url": "https://example.com/streaming.jpg",
//             "home_url": "https://example.com/home"
//         }),
//     });
//     const data = await response.json();
//     return data;
// }

// async function generateToken() {
//     const auth = Buffer.from("AdL8dtCwbCZD_-SM5f6BpryVagj8C1A9CBFK7FokSOMgTNYxcnNCSr3QARw_-byZxp0pHhb3oY1kEwfB" + ":" + "ENlzkWgEL-GU-zjhigq-g9ceNPB2suUaZukWMAg0-8jKKg64zX2BiirEyBlH0WrkNLG6IZAARai5IDpV").toString("base64")
//     const response = await fetch(`${base}/v1/oauth2/token`, {
//         method: "post",
//         body: "grant_type=client_credentials",
//         headers: {
//             Authorization: `Basic ${auth}`,
//         },
//     });
//     const data = await response.json();
//     return data.access_token;
// }


// async function createPlan(productID) {
//     console.log(productID)
//     const accessToken = await generateAccessToken();
//     const url = `${base}/v1/billing/plans`;
//     const response = await fetch(url, {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//             "PayPal-Request-Id": "PRODUCT-18062020-001"
//         },
//     });
//     const data = await response.json();
//     return data;
// }


app.post('/webhook/paypal', async (req, res) => {
    console.log(req.body)
    return res.status(200).json({ success: true })
});

// app.post('/webhook/paypal', async (req, res) => {
//     // console.log(req.body)
//     // return res.status(200).json({ success: true })

// // const webhooks = req.body
//     paypal.notification.webhook.create( function (req, res) {
//         console.log("req.body",req.body)
//             console.log("Create webhook Response");
//             console.log('webhook');
//             return res.status(200).json({ success: true })
        
//     });

// });

app.post('/webhook/stripe', bodyParser.raw({ type: "application/json" }), async (req, res) => {
    // console.log(req.body)
    const payload = req.rawBody
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, signingSecrect);

    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false
        })
        return;
    }
    console.log(event.type)
    console.log(event.data.object)
    console.log(event.data.object.id)
    res.json({
        success: true
    })

});


app.listen(3000, () => {
    console.log('Listening to port 3000');
})
