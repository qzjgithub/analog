import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
  host: {
    'style' : 'width:35%;display:block;max-width:400px'
  }
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.validateForm.controls[ 'checkPassword' ].updateValueAndValidity();
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls[ 'password' ].value) {
      return { confirm: true, error: true };
    }
  };

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      account            : [ null, [ Validators.email ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      name         : [ null, [ Validators.required ] ],
      position    : [ null ],
      phoneNumberPrefix: [ '+86' ],
      phone      : [ null, [ Validators.required ] ],
      email          : [ null, [ Validators.email ] ],
      comment          : [ null ],
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  backLogin(e){
    this.router.navigate([{outlets: {'userEnter': 'login'}}],{relativeTo: this.route.parent});
    return false;
  }

}
