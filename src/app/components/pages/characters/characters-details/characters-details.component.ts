import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {take, tap} from 'rxjs/operators';
import {DataService} from '@shared/services/data.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-characters-details',
  template: `
    <main>
      <div class="bg">
        <section class="character_details">
          <app-characters-card [character]="character$ | async"></app-characters-card>
        </section>
      </div>
    </main>
  `,
  styleUrls: ['./characters-details.component.scss']
})
export class CharactersDetailsComponent implements OnInit {
  characterId: string | undefined;
  character$: Observable<any> | undefined;

  constructor(private route: ActivatedRoute, private dataSvc: DataService) {
    this.route.params.pipe(
      take(1),
      tap(({id}) => this.character$ = this.dataSvc.getDetails(id))
    ).subscribe();
  }

  ngOnInit(): void {
  }


}
