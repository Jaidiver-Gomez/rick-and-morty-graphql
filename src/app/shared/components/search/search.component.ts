import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {DataService} from '@shared/services/data.service';
import {debounceTime, distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {Character} from "@shared/models/data.interface";

@Component({
  selector: 'app-search',
  template: `
    <section class="search__container">
      <div class="search__name">
        <label for="searchName"> Search by name....</label>
        <div class="search-container">
          <input type="text" class="search__input" placeholder="Search by name...." [formControl]="search"
                 (keydown)="onChange($event.key)">
          <button (click)="onClear()">Clear</button>
        </div>
      </div>
      <ng-container *ngIf="!(characters| async)?.length">
        <h1 class="title">Search return no results</h1>
        <img src="assets/images/search_no_results.jpg" alt="404" width="300"/>
      </ng-container>
    </section>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {

  search = new FormControl('');
  private destroy$ = new Subject<unknown>();

  constructor(private dataSvc: DataService) {
    this.onSearch();
  }

  get characters(): Observable<Character[]> {
    return this.dataSvc.characters;
  }

  onChange(key: string) {
    if (key === 'Backspace') {
      this.characters
        .pipe(takeUntil(this.destroy$))
        .subscribe(characters => {
        if (characters?.length) {
          return;
        }
        this.search.valueChanges.pipe(
          map(search => search?.toLowerCase().trim()),
          debounceTime(300),
          filter(search => search === ''),
          tap(()=> this.onClear()),
          takeUntil(this.destroy$)
        ).subscribe();
      });
    }
  }

  onClear(): void {
    this.search.reset();
    this.dataSvc.getDataApi();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private onSearch(): void {
    this.search.valueChanges.pipe(
      map(search => search?.toLowerCase().trim()),
      debounceTime(300),
      distinctUntilChanged(),
      filter(search => search !== '' && search?.length > 3),
      tap(search => this.dataSvc.filterData(search)),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
