import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from '../modal/user';
import { PaypalService } from '../service/paypal.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
    submitted = false;
    data!: user

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private service :PaypalService,
        private http : HttpClient
        
        
    ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
}

// convenience getter for easy access to form fields
get f() { return this.form.controls; }

onSubmit() {
  this.submitted = true;
  if(this.form.valid){
    this.http.post('http://localhost:3000/register',this.form.value).subscribe((data)=>{
      console.log(data)
    })
    alert('register successfully')
   this.router.navigate(['subscribe'])
  }
}
}