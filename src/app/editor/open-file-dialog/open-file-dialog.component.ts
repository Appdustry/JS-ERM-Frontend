import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SaveFile } from 'src/app/shared/classes/saveFile.class';

@Component({
  selector: 'app-open-file-dialog',
  templateUrl: './open-file-dialog.component.html',
  styleUrls: ['./open-file-dialog.component.scss']
})
export class OpenFileDialogComponent implements OnInit {

  file: SaveFile;
  fileUploaded = false;

  constructor() {}

  ngOnInit(): void {
  }

  onFileChange($e): void{
    const file = $e.target.files.item(0);
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = (e) => {this.uploaded(e)};
  }

  uploaded($e){
    this.file = JSON.parse($e.target.result);
    this.fileUploaded = true;
  }

}
