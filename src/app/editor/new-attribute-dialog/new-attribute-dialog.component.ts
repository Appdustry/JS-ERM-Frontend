import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-attribute-dialog',
  templateUrl: './new-attribute-dialog.component.html',
  styleUrls: ['./new-attribute-dialog.component.scss']
})
export class NewAttributeDialogComponent implements OnInit {

  form = new FormGroup({
    attributeName: new FormControl(null, [Validators.required]),
    isPrimaryKey: new FormControl(false)
  });

  constructor() { }

  ngOnInit(): void {
  }

}
