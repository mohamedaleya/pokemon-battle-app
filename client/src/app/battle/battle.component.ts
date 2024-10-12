import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon, Team } from '../types/pokemon';

interface BattleAction {
  attacker: string;
  defender: string;
  damage: number;
}

interface RoundLog {
  roundNumber: number;
  actions: BattleAction[];
  team1: Pokemon[];
  team2: Pokemon[];
  winner: string | null;
  winningPokemon: Pokemon | null;
}

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css'],
})
export class BattleComponent implements OnInit {
  @ViewChild('battleLogs') battleLogsRef!: ElementRef;

  allTeams: Team[] = [];
  selectedTeam1: string = '';
  selectedTeam2: string = '';
  team1: Pokemon[] = [];
  team2: Pokemon[] = [];
  team1Name: string = '';
  team2Name: string = '';
  currentPokemon1: Pokemon | null = null;
  currentPokemon2: Pokemon | null = null;
  currentRound: number = 1;
  winner: string | null = null;
  winningPokemon: Pokemon | null = null;
  isBattleReady: boolean = false;
  isTeamsSelected: boolean = false;
  battleActions: BattleAction[] = [];
  roundLogs: RoundLog[] = [];
  isLastRound: boolean = false;

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllTeams();
  }

  fetchAllTeams() {
    this.pokemonService.getTeams().subscribe(
      (teams: Team[]) => {
        this.allTeams = teams;
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }

  onTeamSelect() {
    this.isTeamsSelected =
      this.selectedTeam1 !== '' && this.selectedTeam2 !== '';
  }

  startBattle() {
    if (this.selectedTeam1 && this.selectedTeam2) {
      this.isBattleReady = true;
      this.loadTeamPokemons(this.selectedTeam1, this.selectedTeam2);
    } else {
      console.error('Please select two teams.');
    }
  }

  loadTeamPokemons(team1Id: string, team2Id: string) {
    this.pokemonService.getTeamById(team1Id).subscribe(
      (team1Data) => {
        this.team1 = team1Data.pokemons.map((p: Pokemon) => ({
          ...p,
          isKO: false,
        }));
        this.team1Name = team1Data.team.name;
        this.currentPokemon1 = this.team1[0];
        this.initializeRoundLog();
      },
      (error) => console.error('Error loading Team 1:', error)
    );

    this.pokemonService.getTeamById(team2Id).subscribe(
      (team2Data) => {
        this.team2 = team2Data.pokemons.map((p: Pokemon) => ({
          ...p,
          isKO: false,
        }));
        this.team2Name = team2Data.team.name;
        this.currentPokemon2 = this.team2[0];
        this.initializeRoundLog();
      },
      (error) => console.error('Error loading Team 2:', error)
    );
  }

  initializeRoundLog() {
    if (
      this.team1.length > 0 &&
      this.team2.length > 0 &&
      this.roundLogs.length === 0
    ) {
      this.roundLogs.push({
        roundNumber: 1,
        actions: [],
        team1: JSON.parse(JSON.stringify(this.team1)),
        team2: JSON.parse(JSON.stringify(this.team2)),
        winner: null,
        winningPokemon: null,
      });
      this.currentRound = 1;
    }
  }

  getHealthPercentage(pokemon: Pokemon | null): number {
    if (!pokemon) {
      return 0;
    }
    return Math.max(0, Math.min(100, pokemon.life));
  }

  getHealthColor(pokemon: Pokemon | null): string {
    if (!pokemon) return 'gray';
    if (pokemon.life > 50) return 'green';
    if (pokemon.life > 0) return 'red';
    return 'gray';
  }

  battleRound() {
    if (!this.currentPokemon1 || !this.currentPokemon2) {
      return;
    }

    this.battleActions = [];

    // Truncate roundLogs to the currentRound to remove any future logs
    this.roundLogs = this.roundLogs.slice(0, this.currentRound);

    this.pokemonService
      .getTypeFactor(this.currentPokemon1.type, this.currentPokemon2.type)
      .subscribe((response) => {
        const typeFactor1 = response.factor;

        this.pokemonService
          .getTypeFactor(this.currentPokemon2!.type, this.currentPokemon1!.type)
          .subscribe((response2) => {
            const typeFactor2 = response2.factor;

            const damage1 = Math.round(
              this.currentPokemon1!.power * typeFactor1
            );
            const damage2 = Math.round(
              this.currentPokemon2!.power * typeFactor2
            );

            this.currentPokemon2!.life -= damage1;
            this.currentPokemon1!.life -= damage2;

            // Ensure life doesn't go below 0
            this.currentPokemon1!.life = Math.max(
              0,
              this.currentPokemon1!.life
            );
            this.currentPokemon2!.life = Math.max(
              0,
              this.currentPokemon2!.life
            );

            // Record battle actions
            this.battleActions.push(
              {
                attacker: this.currentPokemon1!.name,
                defender: this.currentPokemon2!.name,
                damage: damage1,
              },
              {
                attacker: this.currentPokemon2!.name,
                defender: this.currentPokemon1!.name,
                damage: damage2,
              }
            );

            if (this.currentPokemon1!.life <= 0) {
              this.currentPokemon1!.isKO = true;
              this.switchPokemon(this.team1, 1);
            }
            if (this.currentPokemon2!.life <= 0) {
              this.currentPokemon2!.isKO = true;
              this.switchPokemon(this.team2, 2);
            }

            this.checkForWinner();

            // Increment currentRound after processing the battle
            this.currentRound++;

            // Push the new RoundLog
            this.roundLogs.push({
              roundNumber: this.currentRound,
              actions: [...this.battleActions],
              team1: JSON.parse(JSON.stringify(this.team1)),
              team2: JSON.parse(JSON.stringify(this.team2)),
              winner: this.winner,
              winningPokemon: this.winningPokemon,
            });

            this.isLastRound = !!this.winner;

            if (this.winner) {
              setTimeout(() => {
                this.scrollToBattleLogs();
              });
            }
          });
      });
  }

  previousRound() {
    if (this.currentRound > 1) {
      // Ensure we don't go below Round 1
      this.currentRound--;
      const previousRound = this.roundLogs[this.currentRound - 1];
      this.restoreRound(previousRound);
    }
  }

  nextRound() {
    if (this.currentRound < this.roundLogs.length) {
      // Ensure we don't exceed existing logs
      this.currentRound++;
      const nextRound = this.roundLogs[this.currentRound - 1];
      this.restoreRound(nextRound);
    }
  }

  restoreRound(round: RoundLog) {
    this.team1 = JSON.parse(JSON.stringify(round.team1));
    this.team2 = JSON.parse(JSON.stringify(round.team2));
    this.currentPokemon1 = this.team1.find((p) => !p.isKO) || null;
    this.currentPokemon2 = this.team2.find((p) => !p.isKO) || null;
    this.battleActions = [...round.actions];
    this.winner = round.winner;
    this.winningPokemon = round.winningPokemon;
    this.isLastRound = this.currentRound === this.roundLogs.length;
  }

  switchPokemon(team: Pokemon[], teamNumber: number) {
    const nextPokemon = team.find((p) => !p.isKO);
    if (nextPokemon) {
      if (teamNumber === 1) {
        this.currentPokemon1 = nextPokemon;
      } else {
        this.currentPokemon2 = nextPokemon;
      }
    }
  }

  checkForWinner() {
    if (this.team1.every((p) => p.isKO)) {
      this.winner = 'Team 2 Wins! - ' + this.team2Name;
      this.winningPokemon = this.team2.find((p) => !p.isKO) || null;
    } else if (this.team2.every((p) => p.isKO)) {
      this.winner = 'Team 1 Wins! - ' + this.team1Name;
      this.winningPokemon = this.team1.find((p) => !p.isKO) || null;
    }
  }

  isWinningPokemon(pokemon: Pokemon): boolean {
    return this.winningPokemon !== null && pokemon === this.winningPokemon;
  }

  startNewBattle() {
    this.isBattleReady = false;
    this.currentRound = 1;
    this.winner = null;
    this.winningPokemon = null;
    this.team1 = [];
    this.team2 = [];
    this.currentPokemon1 = null;
    this.currentPokemon2 = null;
    this.selectedTeam1 = '';
    this.selectedTeam2 = '';
    this.battleActions = [];
    this.roundLogs = [];
    this.isLastRound = false;

    this.router.navigate(['/battle']);
  }

  scrollToBattleLogs() {
    if (this.battleLogsRef) {
      this.battleLogsRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
