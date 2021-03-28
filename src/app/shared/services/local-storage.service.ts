import {Injectable} from '@angular/core';
import {Character} from '@shared/models/data.interface';
import {BehaviorSubject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

const MY_FAVORITES = 'myFavorites';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private charactersFavSubject = new BehaviorSubject<Character[]>([]);
  private charactersFav$ = this.charactersFavSubject.asObservable();

  constructor(private toastrSvc: ToastrService) {
    this.initialStorage();
  }

  get charactersFav() {
    return this.charactersFav$;
  }

  getFavoritesCharacters(): Character[] {
    try {
      const characterFavs: Character[] = JSON.parse(localStorage.getItem(MY_FAVORITES) as string);
      if (characterFavs) {
        this.charactersFavSubject.next(characterFavs);
        return characterFavs;
      }
      return [];

    } catch (error) {
      console.error('Error getting favorites from local storage', error);
      return [];
    }
  }

  addOrRemoveFavorite(character: Character): void {
    const {id} = character;
    const currentFavs = this.getFavoritesCharacters();
    const found = !!currentFavs?.find((fav: Character) => fav.id === id);

    if (found) {
      this.removeFromFavorite(currentFavs, id);
    } else {
      this.addToFavorite(currentFavs, character);
    }
  }

  clearState() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error cleaning local storage', error);
    }
  }

  private addToFavorite(currentFavs: Character[], character: Character): void {
    try {
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...currentFavs, character]));
      this.charactersFavSubject.next([...currentFavs, character]);
      this.toastrSvc.success(`${character.name} added to favorites`,'RickAndMortyApp');
    } catch (error) {
      this.toastrSvc.error(`Error saving favorites from local storage ${error}`,'RickAndMortyApp');
    }
  }

  private removeFromFavorite(currentFavs: Character[], id: number): void {
    try {
      const characters = currentFavs.filter((character: Character) => {
        if(character.id === id){
          this.toastrSvc.warning(`${character.name} removing from favorites`,'RickAndMortyApp');
        }
        return character.id !== id;
      });
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
      this.charactersFavSubject.next([...characters]);
    } catch (error) {
      this.toastrSvc.error(`Error removing favorites from local storage ${error}`,'RickAndMortyApp');
    }
  }

  private initialStorage(): void {
    if (!JSON.parse(localStorage.getItem(MY_FAVORITES) as string)) {
      localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
    }
    this.getFavoritesCharacters();
  }
}
