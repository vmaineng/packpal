
import { useState, useCallback, useRef } from "react";
import { fetchVotes, submitVote, getBrowserFingerprint } from "../lib/api";
import type { VoteMap } from "../lib/api";

export type UserVotes = Record<string, "accurate" | "inaccurate">; // app_id → vote

interface UseVotesReturn {
  voteMap: VoteMap;
  userVotes: UserVotes;
  loadVotes: (countryCode: string) => Promise<void>;
  castVote: (appId: string, appName: string, countryCode: string, type: "accurate" | "inaccurate") => Promise<void>;
  isLoading: boolean;
}

export function useVotes(): UseVotesReturn {
  const [voteMap, setVoteMap] = useState<VoteMap>({});
  const [userVotes, setUserVotes] = useState<UserVotes>({});
  const [isLoading, setIsLoading] = useState(false);
  const loadedCountries = useRef<Set<string>>(new Set());

  const loadVotes = useCallback(async (countryCode: string) => {
    // Don't re-fetch if already loaded for this country
    if (loadedCountries.current.has(countryCode)) return;
    setIsLoading(true);
    try {
      const data = await fetchVotes(countryCode);
      setVoteMap((prev) => ({ ...prev, ...data }));
      loadedCountries.current.add(countryCode);
    } catch {
      // Non-fatal — votes are additive info, not blocking
    } finally {
      setIsLoading(false);
    }
  }, []);

  const castVote = useCallback(
    async (appId: string, _appName: string, countryCode: string, type: "accurate" | "inaccurate") => {
      const fp = getBrowserFingerprint();

      // Optimistic update
      setVoteMap((prev) => {
        const current = prev[appId] ?? { accurate: 0, inaccurate: 0, score: 50 };
        const accurate = current.accurate + (type === "accurate" ? 1 : 0);
        const inaccurate = current.inaccurate + (type === "inaccurate" ? 1 : 0);
        const total = accurate + inaccurate;
        return {
          ...prev,
          [appId]: {
            accurate,
            inaccurate,
            score: total > 0 ? Math.round((accurate / total) * 100) : 50,
          },
        };
      });
      setUserVotes((prev) => ({ ...prev, [appId]: type }));

      // Persist
      try {
        const result = await submitVote(appId, countryCode, type, fp);
        if (result.success && result.counts) {
          const a = result.counts.accurate_count;
          const b = result.counts.inaccurate_count;
          const total = a + b;
          setVoteMap((prev) => ({
            ...prev,
            [appId]: {
              accurate: a,
              inaccurate: b,
              score: total > 0 ? Math.round((a / total) * 100) : 50,
            },
          }));
        }
      } catch {
        // Rollback optimistic update on failure
        setVoteMap((prev) => {
          const current = prev[appId] ?? { accurate: 0, inaccurate: 0, score: 50 };
          const accurate = current.accurate - (type === "accurate" ? 1 : 0);
          const inaccurate = current.inaccurate - (type === "inaccurate" ? 1 : 0);
          const total = Math.max(0, accurate + inaccurate);
          return {
            ...prev,
            [appId]: {
              accurate: Math.max(0, accurate),
              inaccurate: Math.max(0, inaccurate),
              score: total > 0 ? Math.round((Math.max(0, accurate) / total) * 100) : 50,
            },
          };
        });
        setUserVotes((prev) => {
          const next = { ...prev };
          delete next[appId];
          return next;
        });
      }
    },
    []
  );

  return { voteMap, userVotes, loadVotes, castVote, isLoading };
}
