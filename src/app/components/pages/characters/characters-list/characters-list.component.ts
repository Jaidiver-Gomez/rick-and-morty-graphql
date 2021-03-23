import { Component, OnInit } from '@angular/core';
import {DataService} from '@shared/services/data.service';
import {LocalStorageService} from '@shared/services/local-storage.service';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent {
  characters$ = this.dataSvc.characters;

  constructor(
    private dataSvc: DataService,
    private localStorageSvc: LocalStorageService
  ) { }
}
