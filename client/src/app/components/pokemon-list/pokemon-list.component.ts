import { Component, OnInit } from '@angular/core';
import { PokemonService, Pokemon } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { PokemonEditComponent } from '../pokemon-edit/pokemon-edit.component'; // We'll create this component
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  standalone: true,
  imports: [CommonModule, PokemonEditComponent],
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  errorMessage: string = '';

  constructor(
    private pokemonService: PokemonService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchPokemon();
  }

  fetchPokemon(): void {
    this.pokemonService.getAllPokemon().subscribe(
      (data) => {
        this.pokemonList = data;
      },
      (error) => {
        console.error('Error fetching Pokémon:', error);
        this.errorMessage = 'There was an error fetching the Pokémon data.';
      }
    );
  }
  openEditModal(pokemon: Pokemon): void {
    const modalRef = this.modalService.open(PokemonEditComponent);
    modalRef.componentInstance.pokemon = pokemon;

    modalRef.componentInstance.save.subscribe((updatedPokemon: Pokemon) => {
      this.updatePokemon(updatedPokemon);
      modalRef.close();
    });

    modalRef.componentInstance.cancel.subscribe(() => {
      modalRef.close();
    });
  }

  updatePokemon(pokemon: Pokemon): void {
    this.pokemonService.updatePokemon(pokemon).subscribe(
      (updatedPokemon) => {
        // Update the local list
        const index = this.pokemonList.findIndex(
          (p) => p.id === updatedPokemon.id
        );
        if (index !== -1) {
          this.pokemonList[index] = updatedPokemon;
        }
      },
      (error) => {
        console.error('Error updating Pokémon:', error);
        this.errorMessage = 'There was an error updating the Pokémon.';
      }
    );
  }
}
