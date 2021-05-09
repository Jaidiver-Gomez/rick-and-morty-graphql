import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, find, mergeMap, pluck, take, tap, withLatestFrom} from 'rxjs/operators';
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

  get episodes(): Observable<Episode[]> {
    return this.episode$;
  }

  get characters(): Observable<Character[]> {
    return this.characters$;
  }

  getDetails(id: number) {
    return this.characters$.pipe(
      mergeMap((characters: Character[]) => characters),
      find((character: Character) => character?.id === id)
    );
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
        this.parseCharactersData([...characters, ...apiResponse.results]);
      })
    ).subscribe();
  }

  filterData(valueToSearch: string): void {
    const QUERY_BY_NAME = gql`
      query ($name:String) {
        characters(filter: {name: $name}){
          info{
            count
          }
          results {
            id
            name
            status
            species
            gender
            image
          }
        }
      }
    `;

    this.apolloSvc.watchQuery<any>(
      {
        query: QUERY_BY_NAME,
        variables: {
          name: valueToSearch
        }
      })
      .valueChanges
      .pipe(
        take(1),
        pluck('data', 'characters'),
        tap((apiResponse) => this.parseCharactersData([...apiResponse.results])),
        catchError(error => {
          console.warn(error.message);
          this.charactersSubject.next([]);
          return of(error);
        })
      )
      .subscribe();

  }

  getDataApi() {
    this.apolloSvc.watchQuery<DataResponse>({
      query
    }).valueChanges.pipe(
      take(1),
      tap(({data}) => {
        const {characters, episodes} = data;
        this.parseCharactersData(characters.results);
        this.episodeSubject.next(episodes.results);
      })
    ).subscribe();
  }

  private parseCharactersData(characters: Character[]): void {
    const currentFavs: Character[] = this.localStorageSvc.getFavoritesCharacters();
    const newData = characters.map(character => {
      const found = !!currentFavs?.find((characterFav: Character) => characterFav.id === character.id);
      return {...character, isFavorite: found};
    });
    this.charactersSubject.next(newData);
  }
}
