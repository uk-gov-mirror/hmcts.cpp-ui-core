export interface ListingNote {
  id: string;
  date: string;
  courtRoomId: string;
  note: string;
}

export interface ListingNotes {
  notes: ListingNote[];
  publishStatusMessage?: string;
}
