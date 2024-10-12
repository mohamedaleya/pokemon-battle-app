import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PokemonService, Pokemon } from '../../services/pokemon.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-edit',
  templateUrl: './pokemon-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PokemonEditComponent {
  @Input() pokemon!: Pokemon;
  @Output() save: EventEmitter<Pokemon> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  editedPokemon!: Pokemon;

  ngOnInit(): void {
    this.editedPokemon = { ...this.pokemon };
  }

  onSave(): void {
    this.save.emit(this.editedPokemon);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
