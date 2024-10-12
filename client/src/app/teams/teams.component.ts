import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  loading: boolean = false;

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

  addNewTeam() {
    this.loading = true;
    this.pokemonService.addTeam().subscribe(
      (data) => {
        console.log('New team created:', data);
        this.loadTeams();
        this.loading = false;
      },
      (error) => {
        console.error('Error adding team:', error);
        this.loading = false;
      }
    );
  }
}
