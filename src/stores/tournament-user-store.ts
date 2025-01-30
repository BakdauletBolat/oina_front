import { defineStore } from 'pinia'
import axiosInstance from '../api/network';
import type {Game} from "./game-store.ts";
import type {User} from "./user-store.ts";


export interface TournamentListInterface {
    id: number;
    name: string;
    game_type: string;
    start_date: string;
    end_date: string | null;
    status: number;
    organizer: User;
}

export interface TournamentUserStatInterface {
    points: number;
    wins: number;
    losses: number;
    draws: number;
    goals_scored: number;
    goals_conceded: number;
    user: User
    diff_goals: number;
}

export interface TournamentDetailInterface extends TournamentListInterface {
    tournament_games: Game[];
    stats: TournamentUserStatInterface[]
}

interface TournamentResponseInterface {
    results: TournamentListInterface[];
    next: string | null;
}

export const useTournamentUserStore = defineStore('tournament-user-store', {
    state: () => {
        return {
            isLoadingList: false,
            isLoading: false,
            isFinished: false,
            tournament: null as TournamentDetailInterface | null,
            tournaments: null as TournamentResponseInterface | null,
        }
    },
    actions: {
        async loadTournamentList() {
            console.log('Loading Tournament List');
            this.isLoadingList = true;
            try {
                const res = await axiosInstance.get<TournamentResponseInterface>(`/tournaments/list/`);
                this.tournaments = res.data;
                if (res.data.next == null) {
                    this.isFinished = true;
                }
            }
            catch (error) {
                console.log(error);
                this.isFinished = true;
            }
            finally {
                this.isLoadingList = false;
            }
        },
        async loadTournament(id: number) {
            this.isLoading = true;
            try {
                const res = await axiosInstance.get<TournamentDetailInterface>(`/tournaments/${id}/`);
                this.tournament = res.data;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.isLoading = false;
            }
        }
    }
})