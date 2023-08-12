import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaypalService } from '../service/paypal.service';
declare var paypal: any;
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {

  tittleval: any;
  priceval: any;
  url: any;
  success: any;


  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;
  paidfor = false;
  product = {
    title: 'coffee',
    price: 777,
    desription: 'Coffee is a drink prepared from roasted coffee beans. Darkly colored, bitter, and slightly acidic, coffee has a stimulating effect on humans, primarily due to its caffeine content. It is the most popular hot drink in the world. Seeds of the Coffea plants fruits are separated to produce unroasted green coffee beans.',
    image: 'assets/1588785226-merlot-infused-coffee-1555517171.jpg'
  }

  constructor(private paypalService: PaypalService) { }

  ngOnInit(): void {
  }
  // payment(selectProduct: any) {
  //   console.log(selectProduct)
  //   this.tittleval = selectProduct.title;
  //   this.priceval = selectProduct.price;
  //   console.log(this.tittleval)
  //   console.log(this.priceval)
  //   paypal.Buttons().render('#paypal');

  //   this.paypalService.makePayments(this.tittleval,this.priceval).subscribe((data) => {
  //     console.log('data', data)
  //     this.url = data;
  //     this.success = true;
  //     window.location.href = this.url
  //   })

  // }
  payment(selectProduct: any) {
    console.log(selectProduct)
    this.tittleval = selectProduct.title;
    this.priceval = selectProduct.price;
    console.log(this.tittleval)
    console.log(this.priceval)
    paypal.Buttons(
      {
        createOrder: (data: any, actions: any) => {
          console.log('ssssssssssssssssss')
          const headers = new Headers({
            'Content-type': 'application/json; charset=UTF-8',
          });
          const price = this.priceval
          const opts = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ price }),
          };
          return fetch("http://localhost:3000/api/orders", opts)
            .then((response) => response.json())
            .then((order) => order.id);
        },
        onApprove: async (data: any) => {
          const response = await fetch(`http://localhost:3000/api/orders/${data.orderID}/capture`, {
            method: "post",
          });
          const orderData = await response.json();
          console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
          const transaction = orderData.purchase_units[0].payments.captures[0];
          alert(`Transaction ${transaction.status}: ${transaction.id}`);
        }
      }).render('#paypal');


  }
}

