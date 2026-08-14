export type UserRole = "USER" | "ADMIN";

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  emailVerified: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  displayName: string | null;
  bio: string | null;
  themeColor: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  user: PublicUser;
  accessToken: string;
}

export type DivisionKey =
  | "BRONZE_III"
  | "BRONZE_II"
  | "BRONZE_I"
  | "PRATA_III"
  | "PRATA_II"
  | "PRATA_I"
  | "OURO_III"
  | "OURO_II"
  | "OURO_I"
  | "PLATINA_III"
  | "PLATINA_II"
  | "PLATINA_I"
  | "DIAMANTE_III"
  | "DIAMANTE_II"
  | "DIAMANTE_I"
  | "MESTRE";

export interface RankedSeason {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string | null;
}

export interface RankedProfileData {
  season: RankedSeason;
  profile: {
    rating: number;
    division: DivisionKey;
    divisionLabel: string;
    wins: number;
    losses: number;
    bestRating: number;
  };
}

export interface RankedStatsData {
  season: RankedSeason;
  profile: RankedProfileData["profile"] & {
    rank: number;
    totalMatches: number;
    winRate: number;
    currentStreak: { direction: "win" | "loss" | "none"; count: number };
  };
}

export interface RankedLeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  rating: number;
  division: DivisionKey;
  divisionLabel: string;
  wins: number;
  losses: number;
}

export interface RankedLeaderboardData {
  season: Pick<RankedSeason, "id" | "name">;
  top: RankedLeaderboardEntry[];
  user: RankedLeaderboardEntry;
}

export interface RankedPresenceData {
  playersOnline: number;
  playersInQueue: number;
}

export interface RankedMatchHistoryEntry {
  matchId: string;
  status: "IN_PROGRESS" | "FINISHED" | "ABANDONED";
  result: "win" | "loss" | "abandoned" | "in_progress";
  myRatingDelta: number | null;
  opponent: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  startedAt: string;
  finishedAt: string | null;
}

export interface RankedMatchesData {
  season: Pick<RankedSeason, "id" | "name">;
  matches: RankedMatchHistoryEntry[];
}

export interface GameSummary {
  id: string;
  score: number;
  startedAt: string;
  finishedAt: string | null;
  roundsPlayed: number;
  totalRounds: number;
}

export interface GameCreateData {
  id: string;
  userId: string;
  score: number;
  startedAt: string;
  finishedAt: string | null;
}

export interface NextRoundData {
  roundNumber: number;
  totalRounds: number;
  location: { id: string; imageUrl: string | null };
}

export interface RoundResultData {
  round: {
    roundNumber: number;
    distanceMeters: number;
    score: number;
    guess: { latitude: number; longitude: number };
    correct: { latitude: number; longitude: number };
  };
  game: {
    id: string;
    score: number;
    finishedAt: string | null;
    roundsPlayed: number;
    totalRounds: number;
  };
}

export interface GameRoundDetail {
  id: string;
  gameId: string;
  locationId: string;
  roundNumber: number;
  guessLatitude: string;
  guessLongitude: string;
  distanceMeters: string;
  score: number;
  createdAt: string;
  location: {
    id: string;
    name: string;
    imageUrl: string | null;
    latitude: string;
    longitude: string;
  };
}

export interface GameData {
  id: string;
  userId: string;
  score: number;
  startedAt: string;
  finishedAt: string | null;
  rounds: GameRoundDetail[];
}

export type DailyState = "not_started" | "in_progress" | "submitted";

export interface DailyCurrentData {
  id: string;
  startsAt: string;
  endsAt: string;
  timeLimitSeconds: number;
  windowRemainingSeconds: number;
  location: { id: string; name: string; imageUrl: string | null };
  status:
    | { state: "not_started" }
    | {
        state: "in_progress";
        attemptId: string;
        startedAt: string;
        remainingSeconds: number;
      }
    | {
        state: "submitted";
        attemptId: string;
        score: number;
        distanceMeters: number;
        submittedAt: string;
        guess: { latitude: number; longitude: number };
        correct: { latitude: number; longitude: number };
      };
}

export interface DailyStartData {
  attemptId: string;
  startedAt: string;
  timeLimitSeconds: number;
  remainingSeconds: number;
}

export interface DailySubmitData {
  score: number;
  distanceMeters: number;
  submittedAt: string;
  guess: { latitude: number; longitude: number };
  correct: { latitude: number; longitude: number };
  challenge: { id: string; endsAt: string };
}

export interface DailyLeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  score: number;
  distanceMeters: number;
  submittedAt: string;
}

export interface DailyLeaderboardData {
  challenge: { id: string; endsAt: string };
  top: DailyLeaderboardEntry[];
  user: {
    rank: number;
    userId: string;
    score: number;
    distanceMeters: number;
    submittedAt: string;
  } | null;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export type SeasonStatus = "PREVIEW" | "ACTIVE" | "ENDED";

export interface AdminSeason {
  id: string;
  name: string;
  status: SeasonStatus;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
}

export type AdminSeasonCreateInput = {
  name?: string;
};

export interface AdminLocation {
  id: string;
  name: string;
  description: string | null;
  latitude: string;
  longitude: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  createdAt: string;
}

export interface RankedMatchState {
  match: {
    id: string;
    seasonId: string;
    status: "IN_PROGRESS" | "FINISHED" | "ABANDONED";
    roundNumber: number;
    multiplier: number;
    myHealth: number;
    opponentHealth: number;
    winnerId: string | null;
    myRatingDelta: number | null;
    opponentRatingDelta: number | null;
    startedAt: string;
    finishedAt: string | null;
  };
  me: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  opponent: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    rating: number | null;
    division: DivisionKey | null;
    divisionLabel: string | null;
  };
  currentRound: {
    roundNumber: number;
    multiplier: number;
    deadline: string;
    timeRemainingSeconds: number;
    location: { id: string; imageUrl: string | null };
    myAnswered: boolean;
    opponentAnswered: boolean;
  };
  lastResult: RankedRoundResult | null;
  history: RankedRoundResult[];
}

export interface RankedRoundResult {
  roundNumber: number;
  multiplier: number;
  myScore: number;
  opponentScore: number;
  myDistanceMeters: number | null;
  opponentDistanceMeters: number | null;
  myDamage: number;
  opponentDamage: number;
  resolvedAt: string | null;
}