import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'remote-server',
  templateUrl: 'remote-server.component.html',
  styleUrls: ['remote-server.component.css'],
  host : {
    style : 'display: block;width: 30%;'
  }
})
export class RemoteServerComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
  }

  constructor(private fb: FormBuilder) {
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
      domain : [ null, [ Validators.required ] ],
      port : [ null, [ Validators.required ] ],
      prefix : [ null ],
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

}
