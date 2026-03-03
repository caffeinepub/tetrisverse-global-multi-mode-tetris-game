import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScoreEntry } from "../backend";
import { useActor } from "./useActor";

export function useGetTopScores(mode: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ["topScores", mode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores(mode, BigInt(10));
    },
    enabled: !!actor && !isFetching,
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
