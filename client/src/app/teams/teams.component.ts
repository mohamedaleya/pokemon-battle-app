import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent {
  teams: any[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams() {
    this.pokemonService.getTeams().subscribe(
      (data) => {
        this.teams = data;
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }
}
