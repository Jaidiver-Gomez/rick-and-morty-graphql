import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {BehaviorSubject, Observable} from 'rxjs';
import {find, mergeMap, pluck, take, tap, withLatestFrom} from 'rxjs/operators';
import {Character, DataResponse, Episode} from '@shared/models/data.interface';
import {LocalStorageService} from '@shared/services/local-storage.service';

const query = gql`
    {
      episodes{
        results{
          name,
          episode
        }
      },
      characters{
        results {
          id,
          name,
          status,
          species,
          gender,
          image,
          origin {
            name
          },
          location{
            name
          }
        }
      }
    }
  `;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private episodeSubject = new BehaviorSubject<Episode[]>([]);
  private episode$: Observable<Episode[]> = this.episodeSubject.asObservable();
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  private characters$: Observable<Character[]> = this.charactersSubject.asObservable();

  constructor(
    private apolloSvc: Apollo,
    private localStorageSvc: LocalStorageService
  ) {
    this.getDataApi();
  }

  getDetails(id: number) {
    return this.characters$.pipe(
      mergeMap((characters: Character[]) => characters),
      find((character: Character) => character?.id === id)
    );
  }

  get episodes(): Observable<Episode[]> {
    return this.episode$;
  }

  get characters(): Observable<Character[]> {
    return this.characters$;
  }

  getCharactersByPages(pageNumber: number): void {
    const queryByPage = gql`
    {
      characters(page:${pageNumber}){
        results {
          id,
          name,
          status,
          species,
          gender,
          image,
          origin {
            name
          },
          location{
            name
          }
        }
      }
    }`;
    this.apolloSvc.watchQuery<any>({
      query: queryByPage
    }).valueChanges.pipe(
      take(1),
      pluck('data', 'characters'),
      withLatestFrom(this.characters$),
      tap(([apiResponse, characters]) => {
        this.parseCharacterData([...characters, ...apiResponse.results]);
      })
    ).subscribe();
  }

  private getDataApi() {
    this.apolloSvc.watchQuery<DataResponse>({
      query
    }).valueChanges.pipe(
      take(1),
      tap(({data}) => {
        const {characters, episodes} = data;
        this.parseCharacterData(characters.results);
        this.episodeSubject.next(episodes.results);
      })
    ).subscribe();
  }

  private parseCharacterData(characters: Character[]): void {
    const currentFavs: Character[] = this.localStorageSvc.getFavoritesCharacters();
    const newData = characters.map(character => {
      const found = !!currentFavs?.find((characterFav: Character) => characterFav.id === character.id);
      return {...character, isFavorite: found};
    });
    this.charactersSubject.next(newData);
  }
}
