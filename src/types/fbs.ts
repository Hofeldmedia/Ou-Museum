export type FbsConferenceStatus = 'projected-2026' | 'current' | 'independent';

export type FbsConferenceId =
  | 'acc'
  | 'american'
  | 'big-12'
  | 'big-ten'
  | 'cusa'
  | 'independents'
  | 'mac'
  | 'mountain-west'
  | 'pac-12'
  | 'sec'
  | 'sun-belt';

export type FbsSchool = {
  id: string;
  name: string;
  shortName: string;
  conferenceId: FbsConferenceId;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  logoUrl?: string;
  logoPath?: string;
  stadiumName?: string;
  notes?: string;
};

export type FbsConference = {
  id: FbsConferenceId;
  name: string;
  shortName: string;
  status: FbsConferenceStatus;
  description: string;
  memberSchoolIds: string[];
  colorToken: string;
  logoPath?: string;
};
