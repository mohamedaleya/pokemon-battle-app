import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { TeamsComponent } from './teams/teams.component';
import { BattleComponent } from './battle/battle.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonListComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'battle', component: BattleComponent },
];
