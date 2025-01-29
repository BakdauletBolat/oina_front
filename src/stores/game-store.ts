import { defineStore } from 'pinia'
import axiosInstance from '../api/network';
import {getFromCache, setToCache} from "../plugins/cache.ts";


interface RequestCreateInterface {
    rival_id: number;
    game_type: string;
}

interface ResultInterface {
    game: {
        author_score: number;
        rival_score: number;
    }
}

interface ApproveResultInterface {
    result: ResultInterface | null;
    action_type: string;
}

interface Author {
    id: number;
    username: string;
    photo_url: string;
    first_name: string;
    last_name: string;
}

export interface Game {
    id: number;
    author: Author;
    rival: Author;
    created_at: string;
    started_at: string | null;
    author_approved_at: string | null;
    rival_approved_at: string | null;
    finished_at: string | null;
    game_type: string;
    result: {
        offered_user_id: number;
        to_approve_user_id: number;
        game: {
            author_score: number;
            rival_score: number;
        }
    } | null;
    winner: Author | null;
    loser: Author | null;
    status: number;
}

interface GameListResponse {
    results: Game[];
}

export const useGameStore = defineStore('game-store', {
    state: () => {
        return {
            isLoadingRequestCreate: false,
            isLoadingListGames: false,
            isLoadingGame: false,
            games: [] as Game[],
            myGames: [] as Game[],
            game: null as Game | null,
            showResultOfferComponent: false,
            isLoadingGameStart: false,
        }
    },
    actions: {
        async create(body: RequestCreateInterface) {
            return axiosInstance.post(`/games/request/`, body)
        },
        async startGame() {
            this.isLoadingGameStart = true;
            try {
                const res = await axiosInstance.get<Game>(`/games/${this.game!.id}/start/`);
                this.game = res.data;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.isLoadingGameStart = false
            }
            
        },
        async approveResult(id: number, body: ApproveResultInterface) {
            return axiosInstance.post(`/games/${id}/approve/`, body)
        },
        async loadGame(id: number) {
            this.isLoadingGame = true;
            try {
                const res = await axiosInstance.get<Game>(`/games/${id}/`)
                this.game = res.data;
            }
            catch (error) {
                console.log(error)
            }
            finally {
                this.isLoadingGame = false;
            }
        },
        async loadGames() {
            this.isLoadingListGames = true;
            try {

                const games = getFromCache('main-screen-games')
                if (games) {
                    this.games = games;
                }

                const res = await axiosInstance.get<GameListResponse>('/games/');
                this.games = res.data.results;

                setToCache('main-screen-games', res.data.results);
            }
            catch (error) {

            }finally {
                this.isLoadingListGames = false;
            }
        },
        async loadMyGames() {
            this.isLoadingListGames = true;
            try {

                const games = getFromCache('my-screen-games')
                if (games) {
                    this.myGames = games;
                }

                const res = await axiosInstance.get<GameListResponse>('/games/user-games');
                this.myGames = res.data.results;

                setToCache('my-screen-games', res.data.results);
            }
            catch (error) {

            }finally {
                this.isLoadingListGames = false;
            }
        },
        toggleResultOffer() {
            this.showResultOfferComponent = !this.showResultOfferComponent;
        },
        isApproveUser(id?: number) {
            if (id == null || this.game!.result!.to_approve_user_id == null) {
                return false;
            }
            return this.game?.result?.to_approve_user_id === id;
        },
        isOfferedUser(id?: number) {
            if (id == null || this.game?.result?.offered_user_id == null) {
                return false;
            }
            return this.game?.result?.offered_user_id === id;
        },
        getOfferedUser(): Author | null {
            if (this.game?.author.id == this.game?.result?.offered_user_id) {
                return this.game!.author;
            }
            else if (this.game?.rival.id == this.game?.result?.offered_user_id) {
                return this.game!.rival;
            }
            return null
        }
    }
})