import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Userdata } from '../model/member';


@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  suscribe(data: Userdata): Observable<any> {
    let name = data.name;
    let email = data.email;
    let title = data.title;
    let price = data.price;
    return this.http.post('http://localhost:3000/suscribe', {
      name, email, title, price
    })
  }


  makePayments(stripeToken: any,amount:number): Observable<any> {

    // let name = stripeToken.card.name;
  // console.log('name',)
    const url = 'http://localhost:3000/checkout'
    return this.http.post<any>(url, {
      stripeToken,amount
    })

  }
}
