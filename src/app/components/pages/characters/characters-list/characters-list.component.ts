import {Component, HostListener, Inject} from '@angular/core';
import {DataService} from '@shared/services/data.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent {
  characters$ = this.dataSvc.characters;
  showButtonScrollingUp = false;

  private scrollHeight = 830;
  private pageNum = 1;

  constructor(
    private dataSvc: DataService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const yOffset = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;

    this.showButtonScrollingUp = (yOffset || scrollTop) > this.scrollHeight;
  }

  onScrollTop() {
    this.document.documentElement.scrollTop = 0;
  }

  onScrollDown(arrowDownPress?: boolean) {
    if (arrowDownPress) {
      this.document.documentElement.scrollTop = this.document.documentElement.scrollTop + 600;
    }
    this.dataSvc.getCharactersByPages(this.pageNum++);
    console.log('ok');
  }
}
