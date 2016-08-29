import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { File } from '../../../models/file';
import { AlertMessage } from '../../../models/alertMessage';
import { FileService } from '../../../services/file/file.service';
import { ImagesTable, Options as TableOptions } from '../../../components/files/views/images/table/table.component';
import { Pagination, Options as PaginationOptions } from '../../../components/site/pagination/pagination.component';
import { Options as ThumbnailOptions } from '../../../components/files/views/images/thumbnail/thumbnail.component';

@Component({
    moduleId: module.id,
    selector: 'cc-user-images',
    templateUrl: 'images.html',
    styleUrls: ['images.css'],
    providers: [
        FileService
    ],
    directives: [
        ImagesTable
    ]
})
export class UserImages implements OnInit {
    @Input() options: Options;
    @Input() user: User;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    files: File[];
    constructor(private fileService: FileService) { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["user"] !== undefined && changes["user"].currentValue !== undefined) {
            this.getImages();
        }
    }
    getImages() {
        this.working = true;
        this.fileService.readAll(this.user._id).subscribe(
            files => { this.files = files; this.loaded = true; },
            err => this.onAlert.emit({ type: 'error', message: err }),
            () => this.working = false
        );
    }
};

/**
 * Support Classes.
 */
export class Options {
    title: string;
    table: TableOptions;
}
