import { defineStore } from 'pinia'
import axiosInstance from '../api/network';
import type {Game} from "./game-store.ts";
import type {User} from "./user-store.ts";


export interface TournamentDetailInterface {
    id: number;
    name: string;
    game_type: string;
    start_date: string;
    end_date: string | null;
    status: number;
    winner: User
    winner_point: number;
}

export interface TournamentCreateInterface {
    name: string;
    users_ids: number[];
}

export interface TournamentResultRecordBodyInterface {
    game: {
        author_score: number;
        rival_score: number;
    }
}

export interface TournamentCreateResponseInterface {
    id: number;
}


export const useTournamentOrganizerStore = defineStore('tournament-organizer-store', {
    state: () => {
        return {
            isLoadingCreate: false,
            isLoading: false,
            isLoadingFinish: false,
        }
    },

    actions: {

        async createTournamentOrganizer(body: TournamentCreateInterface) {
            this.isLoadingCreate = true;
            try {
                const res = await axiosInstance.post<TournamentCreateResponseInterface>('/tournaments/', body);
                return res.data.id;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.isLoadingCreate = false;
            }
        },
        async recordGameResult(game_id: number, tournament_id: number, body: TournamentResultRecordBodyInterface) {
            this.isLoading = true;
            try {
                const res = await axiosInstance.post<Game>(`/tournaments/approve/${game_id}/${tournament_id}/`, body);
                return res.data;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.isLoading = false;
            }
            return null;
        },
        async finishTournament(id: number): Promise<TournamentDetailInterface | undefined> {
            this.isLoadingFinish = true;
            try {
                const res = await axiosInstance.post<TournamentDetailInterface>(`/tournaments/finish/${id}/`);
                return res.data;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.isLoadingFinish = false;
            }
        }
    }
})