import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-entity-dialog',
  templateUrl: './new-entity-dialog.component.html',
  styleUrls: ['./new-entity-dialog.component.scss']
})
export class NewEntityDialogComponent implements OnInit {

  form: FormControl;
  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this._fb.control(null, [Validators.required]);
  }

}
