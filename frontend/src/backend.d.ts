import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScoreEntry {
    score: bigint;
    timestamp: Time;
    playerName: string;
}
export type Time = bigint;
export interface backendInterface {
    addMission(mode: string, id: bigint, description: string, goal: bigint, reward: string): Promise<void>;
    getAllScores(mode: string): Promise<Array<ScoreEntry>>;
    getMissionReward(mode: string, id: bigint): Promise<string>;
    getTopScores(mode: string, limit: bigint): Promise<Array<ScoreEntry>>;
    isMissionCompleted(mode: string, id: bigint): Promise<boolean>;
    submitScore(name: string, score: bigint, mode: string): Promise<void>;
    updateMissionProgress(mode: string, id: bigint, progress: bigint): Promise<boolean>;
}
