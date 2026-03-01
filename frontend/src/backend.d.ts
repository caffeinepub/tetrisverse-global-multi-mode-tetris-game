import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ScoreEntry {
    score: bigint;
    timestamp: Time;
    playerName: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMission(mode: string, id: bigint, description: string, goal: bigint, reward: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllScores(mode: string): Promise<Array<ScoreEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMissionReward(mode: string, id: bigint): Promise<string>;
    getTopScores(mode: string, limit: bigint): Promise<Array<ScoreEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isMissionCompleted(mode: string, id: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitScore(name: string, score: bigint, mode: string): Promise<void>;
    updateMissionProgress(mode: string, id: bigint, progress: bigint): Promise<boolean>;
}
