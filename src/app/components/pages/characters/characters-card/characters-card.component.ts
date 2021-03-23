import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Character} from '@shared/models/data.interface';
import {LocalStorageService} from '@shared/services/local-storage.service';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersCardComponent {
  @Input() character: Character | undefined;


  constructor(private localStorageSvc: LocalStorageService) {
  }

  toggleFavorite(): void {
    if (this.character) {
      this.getIcon();
      this.character.isFavorite = !this.character.isFavorite;
      this.localStorageSvc.addOrRemoveFavorite(this.character);
    }
  }

  getIcon = (): string => this.character?.isFavorite ? 'heart-solid.svg' : 'heart.svg';
}
