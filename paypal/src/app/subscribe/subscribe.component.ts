import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
declare var paypal: any;

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  prices = [
    {
      plan_id: 'P-8BJ97778B2427653DMONPHMA',
      title: 'Basic Plan',
      price: '10',
      features: [
        '10 users included',
        '2GB Bandwidth',
        '150GB Storage',
        '5 Host Domain',
      ],
      link: 'Sign up for free',
      linkClass: 'btn-outline-primary',
    },
    {
      plan_id:'',
      title: 'Pro',
      price: '15',
      features: [
        '20 users included',
        '10 GB of storage',
        '200GB Storage',
        '15 Host Domain',
      ],
      link: 'Get started',
      linkClass: 'btn-primary',
    },
    {
      plan_id:'',
      title: 'Enterprise',
      price: '30',
      features: [
        '30 users included',
        '15 GB of storage',
        '250GB Storage',
        '20 Host Domain',
      ],
      link: 'Contact us',
      linkClass: 'btn-primary',
    }
  ]

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    
  }

  subscribe(selectedPlan: any) {
    paypal.Buttons({
      createSubscription: function(data: any, actions:any) {
        return actions.subscription.create({
          'plan_id': 'P-8BJ97778B2427653DMONPHMA' // Creates the subscription
        });
      },
      onApprove: function(data:any, actions:any) {
        alert('You have successfully created subscription ' + data.subscriptionID); // Optional message given to subscriber
      }
    }).render('#paypal-button-container');

    // this.http.post("http://localhost:3000/pay",{selectedPlan}).subscribe((response)=>{
    //   console.log(response);
    // })
    // this.ngOnInit()

    // paypal.Buttons({
    //   createSubscription: async () => {
    //     console.log('ssssssssssss')
    //     var url = "https://api.paypal.com/v1/billing/subscriptions/" ;
      
    //     var options = {
    //       "method": "POST",
    //       "contentType": "application/json",
    //       "headers": {
    //         "Content-Type": "application/json",
            
    //       },
    //       "payload": JSON.stringify({
    //         "plan_id": "X-XXXXXXXXXXXXXXXXXXX"
    //       })
    //     };
    //     var response = fetch(url, options);
    //     console.log(response);
    //   },
    //   onApprove: async (data: any) => {
    //     const response = await fetch(`http://localhost:3000/api/plans/${data.planID}/capture`, {
    //       method: "post",
    //     });
    //     const planData = await response.json();
    //     console.log('Capture result', planData, JSON.stringify(planData, null, 2));
    //     const transaction = planData.purchase_units[0].payments.captures[0];
    //     alert('You have successfully created subscription ');
    //     // alert(`Transaction ${transaction.status}: ${transaction.id}`);
    //   }
    // }).render('#paypal');
    // paypal.Buttons({
    //   createSubscription: function(data:any, actions:any) {
    //     return actions.subscription.create({
    //       plan_id: 'P-0DP14899WT104452BCRYDNJQ' // Creates the subscription
    //     });
    //   },
    //   onApprove: function(data:any, actions:any) {
    //     alert('You have successfully created subscription ' + data.subscriptionID); // Optional message given to subscriber
    //   }
    // }).render('#paypal');
    // <script src="https://www.paypal.com/sdk/js?client-id=ARNPbw9ejSgL4bHABydz7Pkgv8ZappLGwEERtGvSLyNa35i-4JFu46WFF2pvP1pY7OJgXG2d39vj5aHV&vault=true&intent=subscription" data-sdk-integration-source="button-factory"></script>
    // <script>
    // paypal.Buttons({
    //     style: {
    //         shape: 'rect',
    //         color: 'gold',
    //         layout: 'vertical',
    //         label: 'subscribe'
    //     },
    //     createSubscription: function(data:any, actions:any) {
    //       return actions.subscription.create({
    //         /* Creates the subscription */
    //         plan_id: 'P-7VJ247815H2495519MONMHXA'
    //       });
    //     },
    //     onApprove: function(data:any, actions:any) {
    //       alert(data.subscriptionID); // You can add optional success message for the subscriber here
    //     }
    // }).render('#paypal-button-container-P-7VJ247815H2495519MONMHXA'); // Renders the PayPal button
    // </script>
  }
}
