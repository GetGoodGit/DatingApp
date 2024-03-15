import { Component,EventEmitter,Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup =new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(private accountService: AccountService,private toastr: ToastrService,
    private fb: FormBuilder,private router: Router) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  initilizeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: new FormControl('',[Validators.required,this.matchValues('password')]),
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next:() => this.registerForm.controls['confirmpassword'].updateValueAndValidity()
    })
  }

  matchValues(match:string): ValidatorFn{
    return(control: AbstractControl)=>{
      return control.value === control.parent?.get(match)?.value ? null : {notMatching:true}
    }
  }

  register(){
    const dob = this.getDateonly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value,dateOfBirth:dob};
    this.accountService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationErrors = error
      }
    })
  }

  private getDateonly(dob: string | undefined) {
    if(!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset()))
           .toISOString().slice(0,10);
  }

  cancel() {
    this.cancelRegister.emit(false); 
  }
}
