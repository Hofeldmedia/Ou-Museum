import { conferenceMembership } from './conferenceMembership';
import { schoolRegistry } from './schoolRegistry';
import type { ConferenceEra, ConferenceSchool } from '../types/content';
import { getSchoolLogo } from '../utils/getSchoolLogo';

const schoolContext: Record<string, { note: string; ouContext: string }> = {
  oklahoma: {
    note: 'The anchor program in this learning path.',
    ouContext: 'OU’s conference moves frame the whole activity.',
  },
  kansas: {
    note: 'A long-running Plains conference member.',
    ouContext: 'Kansas shared OU’s regional league identity for decades.',
  },
  'kansas-state': {
    note: 'A familiar Big Eight and Big 12 opponent.',
    ouContext: 'K-State became a notable Big 12-era challenge for OU.',
  },
  missouri: {
    note: 'A bridge between Plains and Midwest football cultures.',
    ouContext: 'Missouri links OU’s Big Eight past with later SEC geography.',
  },
  nebraska: {
    note: 'One of the defining football powers of the old Big Eight.',
    ouContext: 'OU-Nebraska helped give the Big Eight national weight.',
  },
  'iowa-state': {
    note: 'A steady member across the conference lineage.',
    ouContext: 'Iowa State shows continuity from Big Six roots through the modern Big 12.',
  },
  colorado: {
    note: 'Expanded the league’s mountain-west reach.',
    ouContext: 'Colorado added geography and football depth to OU’s conference world.',
  },
  'oklahoma-state': {
    note: 'OU’s in-state conference rival.',
    ouContext: 'Bedlam gave OU’s league schedule a local centerpiece.',
  },
  texas: {
    note: 'A national brand central to Big 12 and SEC history.',
    ouContext: 'The Red River rivalry became a conference game in both the Big 12 and SEC eras.',
  },
  'texas-am': {
    note: 'A major Texas football institution.',
    ouContext: 'Texas A&M connects OU’s Big 12 past with the SEC footprint.',
  },
  'texas-tech': {
    note: 'A West Texas member of the original Big 12.',
    ouContext: 'Texas Tech broadened OU’s regular trips into Texas.',
  },
  baylor: {
    note: 'A private Texas school in the Big 12 mix.',
    ouContext: 'Baylor became part of OU’s southern conference schedule.',
  },
  byu: {
    note: 'A western expansion addition in the modern Big 12.',
    ouContext: 'BYU shows how far the Big 12 stretched after OU’s departure approached.',
  },
  ucf: {
    note: 'A Florida-based addition in the conference’s expansion phase.',
    ouContext: 'UCF pushed the Big 12 map deep into the Southeast.',
  },
  cincinnati: {
    note: 'An Ohio addition in the league’s modern reset.',
    ouContext: 'Cincinnati reflected the Big 12’s effort to rebuild after realignment losses.',
  },
  houston: {
    note: 'A Texas addition that deepened the conference’s presence in the state.',
    ouContext: 'Houston kept the league tied to Texas recruiting and media territory.',
  },
  'west-virginia': {
    note: 'An eastern outpost in the modern Big 12.',
    ouContext: 'West Virginia showed how the Big 12 stretched eastward in the realignment era.',
  },
  tcu: {
    note: 'A Fort Worth program woven into the modern Big 12.',
    ouContext: 'TCU became part of OU’s later conference geography in Texas.',
  },
  alabama: {
    note: 'A modern standard for football dynasties.',
    ouContext: 'Alabama represents the elite SEC benchmark OU now shares.',
  },
  arkansas: {
    note: 'A regional neighbor with Southwest roots.',
    ouContext: 'Arkansas adds nearby SEC geography for OU.',
  },
  auburn: {
    note: 'A tradition-rich SEC football school.',
    ouContext: 'Auburn gives OU another national-profile SEC opponent.',
  },
  florida: {
    note: 'A major SEC brand from the eastern footprint.',
    ouContext: 'Florida shows how far OU’s conference geography now reaches.',
  },
  georgia: {
    note: 'A recent national-title power.',
    ouContext: 'Georgia reflects the SEC’s championship-level competition.',
  },
  kentucky: {
    note: 'A longtime SEC institution.',
    ouContext: 'Kentucky adds eastern tradition to OU’s new league map.',
  },
  lsu: {
    note: 'A powerful Gulf Coast football brand.',
    ouContext: 'LSU gives OU a high-profile SEC measuring stick.',
  },
  'mississippi-state': {
    note: 'A longstanding SEC member.',
    ouContext: 'Mississippi State is part of the deeper SEC schedule.',
  },
  'ole-miss': {
    note: 'A historic SEC program from Mississippi.',
    ouContext: 'Ole Miss adds another tradition-heavy venue to OU’s SEC era.',
  },
  'south-carolina': {
    note: 'An eastern SEC member with a passionate fan base.',
    ouContext: 'South Carolina shows the breadth of OU’s new conference map.',
  },
  tennessee: {
    note: 'A classic SEC football name.',
    ouContext: 'Tennessee connects OU to another storied tradition.',
  },
  vanderbilt: {
    note: 'A private university and charter SEC member.',
    ouContext: 'Vanderbilt highlights the SEC’s institutional range.',
  },
};

export const conferenceEras: ConferenceEra[] = conferenceMembership.map((snapshot, index, allSnapshots) => {
  const duplicates = snapshot.schoolIds.filter((schoolId, schoolIndex) => snapshot.schoolIds.indexOf(schoolId) !== schoolIndex);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate school ids found in snapshot ${snapshot.id}: ${duplicates.join(', ')}`);
  }

  const previousSchoolIds = snapshot.previousSnapshotId
    ? new Set(allSnapshots.find((entry) => entry.id === snapshot.previousSnapshotId)?.schoolIds ?? [])
    : new Set<string>();
  const currentSchoolIds = new Set(snapshot.schoolIds);

  const addedSchoolIds = snapshot.schoolIds.filter((schoolId) => !previousSchoolIds.has(schoolId));
  const removedSchoolIds = Array.from(previousSchoolIds).filter((schoolId) => !currentSchoolIds.has(schoolId));

  const schools = snapshot.schoolIds.map((schoolId): ConferenceSchool => {
    const school = schoolRegistry.find((entry) => entry.id === schoolId);
    if (!school) {
      throw new Error(`Missing school registry entry for ${schoolId}`);
    }
    if (!Number.isFinite(school.latitude) || !Number.isFinite(school.longitude)) {
      throw new Error(`Invalid latitude/longitude for ${schoolId} in snapshot ${snapshot.id}`);
    }

    const context = schoolContext[schoolId] ?? {
      note: `${school.name} appears in this conference snapshot.`,
      ouContext: `This school helps illustrate how ${snapshot.conference} membership changed around OU.`,
    };
    const logo = getSchoolLogo(snapshot.id, school.id, school.name, school.espnId);

    return {
      ...school,
      isOU: Boolean(school.isOU),
      note: context.note,
      ouContext: context.ouContext,
      logo,
    };
  });

  return {
    id: snapshot.id,
    label: snapshot.label,
    conference: snapshot.conference,
    eraName: snapshot.label,
    years: snapshot.years,
    description: snapshot.description,
    changeSummary: snapshot.changeSummary,
    previousSnapshotId: snapshot.previousSnapshotId,
    nextSnapshotId: snapshot.nextSnapshotId ?? allSnapshots[index + 1]?.id,
    schools,
    schoolIds: snapshot.schoolIds,
    addedSchoolIds,
    removedSchoolIds,
    accent: snapshot.accent,
  };
});

export const earlyContextCards = [
  { title: 'Early Context', body: 'Before the Big Six label, OU’s conference story developed through earlier Missouri Valley structures. This is context, not a main gameplay era.' },
  { title: 'Southwest Frame', body: 'Texas schools came from Southwest Conference history before joining OU in the Big 12. This frames realignment rather than OU membership.' },
];
