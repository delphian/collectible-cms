import { Component, EventEmitter }       from '@angular/core';
import { OnInit, Input, Output }     	 from '@angular/core';
import { Observable }                    from 'rxjs/Observable';
import { User, CurrentUser } 			 from '../../../models/user';
import { AlertMessage }                  from '../../../models/alertMessage';
import { File }                          from '../../../models/file';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { HttpService }                   from '../../../services/http/http.service';
import { FileService }                   from '../../../services/file/file.service';

@Component({
	moduleId: module.id,
    selector: 'cc-files-upload',
    templateUrl: 'upload.html',
    styleUrls: ['upload.css'],
    providers: [ FileService ]
})
export class FilesUploadComponent implements OnInit {
    @Input() alerts: AlertMessage[];
    @Output() onFileUpload = new EventEmitter<File>();
	currentUser: CurrentUser;
    unique: string = "FilesUpload" + Math.floor(Math.random() * 1000);
    file: any;
    selectButtonText: string = "Select a File";
    working: boolean = false;
    loaded: boolean = false;
    constructor(private authService: AuthenticateService, private fileService: FileService) { 
        this.currentUser = this.authService.getCurrentUser();
    }
    fileChange(fileInput: any) {
        this.file = fileInput.target.files[0];
        this.selectButtonText = this.file.name;
    }
    save() {
        this.working = true;
        let formData: FormData = new FormData();
        formData.append("file", this.file);
        this.fileService.create(this.currentUser.user, formData).subscribe(
            file => {
                this.alerts.push({ type: 'success', message: 'File uploaded.' });              
                this.onFileUpload.emit(file);
            },
            err => {
                this.alerts.push({ type: 'error', message: err });
            },
            () => { this.working = false; }
        );
    }
    ngOnInit() {
    }
};