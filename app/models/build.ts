export type Build = {
  id: string; // GUID (UUID as string)
  name: string;
  date_listed?: string | null; // DateTime — usually returned as an ISO string
  date_sold?: string | null; // optional if not sold yet
  user_id: string; // FK — user’s GUID or auth id
  sold_price?: number | null; // could be null if not sold yet
};
