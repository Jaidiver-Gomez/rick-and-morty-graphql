import { Component, OnInit } from '@angular/core';
import {Character, Episode} from '@shared/models/data.interface';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  episodesList: Episode[] | undefined;
  charactersList: Character[] | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
