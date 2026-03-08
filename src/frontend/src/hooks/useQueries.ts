import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScoreEntry } from "../backend";
import { useActor } from "./useActor";

export function useGetTopScores(mode: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ["topScores", mode],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTopScores(mode, BigInt(10));
      } catch {
        // Network or canister error — return empty list gracefully
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    // Don't retry aggressively on failures
    retry: 1,
    retryDelay: 2000,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      score,
      mode,
    }: { name: string; score: number; mode: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.submitScore(name, BigInt(score), mode);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["topScores", variables.mode],
      });
    },
  });
}
