
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Userdata } from '../model/member';
import { MemberService } from '../service/member.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  paymentHandler: any = null;
  SubscriptionForm!: FormGroup;
  submitted = false;
  show = false;
  model!: Userdata;
  amount!: number
  stripeToken:any
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  prices = [
    {
      title: 'Free',
      price: '0',
      features: [
        '10 users included',
        '2 GB of storage',
        'Email support',
        'Help center access',
      ],
      link: 'Sign up for free',
      linkClass: 'btn-outline-primary',
    },
    {
      title: 'Pro',
      price: '15',
      features: [
        '20 users included',
        '10 GB of storage',
        'Priority email support',
        'Help center access',
      ],
      link: 'Get started',
      linkClass: 'btn-primary',
    },
    {
      title: 'Enterprise',
      price: '29',
      features: [
        '30 users included',
        '15 GB of storage',
        'Phone and email support',
        'Help center access',
      ],
      link: 'Contact us',
      linkClass: 'btn-primary',
    }
  ]
  selectedPlan: any;
  titleVal: any;
  priceVal: any;
  url: any;
  success: any;

  constructor(private fb: FormBuilder, private memberservice: MemberService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.createForm();
    this.invokeStripe();

  }

  createForm() {
    this.SubscriptionForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  get f() {
    return this.SubscriptionForm.controls;
  }

  click(selectedPlan: any) {
    this.titleVal = selectedPlan.title
    this.priceVal = selectedPlan.price
    console.log(selectedPlan.title)
    console.log(selectedPlan.price)
    this.SubscriptionForm.patchValue({
      price: this.priceVal,
      title: this.titleVal
    })
  }

  makePayment() {
    if(this.SubscriptionForm.valid){
    this.amount = this.priceVal;
    this.memberservice.makePayments(this.stripeToken,this.amount).subscribe((data) => {
      console.log('data',data)
      this.url = data;
      this.success = true;
      window.location.href = this.url
    })
    // console.log(this.amount);
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51MCH2uSJ3axajDDmVU0KM5KR7z5lmehlSFDdC6jcJk8fLTT90ZhMTedfMg978qdfJV5UCcOD1IRl0GJXNMLlAdrg00lW6FZO3B',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log('stripeToken', stripeToken);
        // alert('Payment has been successfull!');
        paymentStripe(stripeToken)
      },
    });
  

    const paymentStripe = (stripeToken: any) => {
      // this.memberservice.makePayments(stripeToken,this.amount).subscribe((data) => {
      //   console.log('data',data)
      //   this.url = data;
      //   this.success = true;
      //   window.location.href = this.url
      // })
    }

    // paymentHandler.open({
    //   name: "angular payment",
    //   description: "subscription",
    //   // amount: this.amount * 100
    // })
  }}

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51MCH2uSJ3axajDDmVU0KM5KR7z5lmehlSFDdC6jcJk8fLTT90ZhMTedfMg978qdfJV5UCcOD1IRl0GJXNMLlAdrg00lW6FZO3B',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            // alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.SubscriptionForm.valid) {
      this.model = this.SubscriptionForm.value;
      this.memberservice.suscribe(this.model).subscribe((result) => {
        console.log(result)
        this.toastr.success(result.message, 'success');
        // this.makePayment(this.priceVal)
      })
    } else {
      this.toastr.error('Subscription Failed', 'error')
    }
  }
}
