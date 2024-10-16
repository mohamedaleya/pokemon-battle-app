import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Pokemon {
  id: string;
  name: string;
  image: string;
  power: number;
  life: number;
  typeName: string;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  getAllPokemon(): Observable<Pokemon[]> {
    return this.http
      .get<Pokemon[]>('/api/pokemon')
      .pipe(catchError(this.handleError));
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    const url = `/api/pokemon/${pokemon.id}`;
    return this.http
      .put<Pokemon>(url, pokemon)
      .pipe(catchError(this.handleError));
  }

  getPokemonById(id: string): Observable<Pokemon> {
    const url = `/api/pokemon/${id}`;
    return this.http.get<Pokemon>(url).pipe(catchError(this.handleError));
  }

  addTeam(): Observable<any> {
    return this.http.post(`api/teams`, {});
  }

  getTeams(): Observable<any> {
    return this.http.get(`/api/teams`);
  }

  getTeamById(teamId: string): Observable<any> {
    return this.http.get(`/api/team/${teamId}`);
  }

  getTypeFactor(type1: string, type2: string): Observable<any> {
    return this.http.get(`/api/type-factor/${type1}/${type2}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
