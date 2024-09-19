import { Component, OnInit } from '@angular/core';
import { StreamInterface } from '../../interfaces/streamEvent.interface';
import { AllStreamEventService } from '../../services/stream-event/all-stream-event.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";

@Component({
  selector: 'app-stream-event',
  standalone: true,
  imports: [SubNavbarComponent],
  templateUrl: './stream-event.component.html',
  styleUrl: './stream-event.component.scss'
})
export class StreamEventComponent implements OnInit {

  streamEvent!: StreamInterface
  allOldStreams: Array<StreamInterface> = [];
  page: number = 1;
  limit: number = 5;
  streamTitle: string = ''
  constructor(
    private _allStreamEventService: AllStreamEventService,
    private _domSanitizer:DomSanitizer
  ) { }


  ngOnInit(): void {
this.getAllOldStreams()
  }

  getAllOldStreams() {
    this._allStreamEventService.getAllOldStreams(
      this.page,
      this.limit,
      this.streamTitle
    ).subscribe({
      next: (res) => {
        this.allOldStreams = res.data
        console.log(res.data);
        
      },
      error: (err) => {
        console.log(err);
      },
      complete: () =>{
        console.log("Succes, Got All Old Streams");
      }
    })
  }

  getSanitizedUrl(streamUrlCode: string): SafeResourceUrl {
    return this._domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${streamUrlCode}`);
  }

  getThumbnailUrl(streamUrlCode: string): string {
    return `https://img.youtube.com/vi/${streamUrlCode}/maxresdefault.jpg`;
  }


}
