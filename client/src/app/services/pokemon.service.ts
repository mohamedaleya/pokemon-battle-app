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
  private apiUrl = '/api/pokemon';

  constructor(private http: HttpClient) {}

  getAllPokemon(): Observable<Pokemon[]> {
    return this.http
      .get<Pokemon[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    const url = `${this.apiUrl}/${pokemon.id}`;
    return this.http
      .put<Pokemon>(url, pokemon)
      .pipe(catchError(this.handleError));
  }

  getPokemonById(id: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Pokemon>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
