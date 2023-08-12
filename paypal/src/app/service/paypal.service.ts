import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { user } from '../modal/user';


@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(private http: HttpClient) { }

  makePayments( name:any,amount:number): Observable<any> {
    const url = 'http://localhost:3000/pay'
    return this.http.post<any>(url, {name,
      amount
    })
  }

  register(data:user):Observable<any>{
    // const headers = { 'content-type': 'application/json'}  
    let name =  data.name
    let email =  data.email
   let password = data.password
  return this.http.post<any>('http://localhost:3000/register',{
   name,password,email
  })
}
}
