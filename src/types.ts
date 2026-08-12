/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentResult {
  code: string;       // S101, 101, etc.
  name: string;       // Aisha Fathima, etc.
  team: string;       // Aqeeq, Tawbaz, Marjan, Fyruz, Yaqoot
  category: string;   // Sub Junior, Senior, Super Senior
  class: string;      // 1, 2, 3, etc.
  event: string;      // Music, Drawing, etc.
  rank: number;       // 1, 2, 3, etc.
  grade: string;      // A, B+, B, A+, etc.
  points: number;     // numeric points (e.g. 95)
  programResults?: {
    programId?: string;
    programName: string;
    rank: number;
    grade: string;
    points: number;
  }[];
}

export type TeamName = 'Aqeeq' | 'Tawbaz' | 'Marjan' | 'Fyruz' | 'Yaqoot';
export type CategoryName = 'Sub Junior' | 'Senior' | 'Super Senior' | 'General';

export const TEAMS: TeamName[] = ['Yaqoot', 'Aqeeq', 'Tawbaz', 'Fyruz', 'Marjan'];
export const CATEGORIES: CategoryName[] = ['Sub Junior', 'Senior', 'Super Senior', 'General'];

export const TEAM_CODES: Record<TeamName, number> = {
  Yaqoot: 100,
  Aqeeq: 200,
  Tawbaz: 300,
  Fyruz: 400,
  Marjan: 500
};

export const TEAM_RANGES: Record<TeamName, { min: number; max: number; label: string }> = {
  Yaqoot: { min: 100, max: 199, label: '100 Series (100 - 199)' },
  Aqeeq: { min: 200, max: 299, label: '200 Series (200 - 299)' },
  Tawbaz: { min: 300, max: 399, label: '300 Series (300 - 399)' },
  Fyruz: { min: 400, max: 499, label: '400 Series (400 - 499)' },
  Marjan: { min: 500, max: 599, label: '500 Series (500 - 599)' }
};

export function normalizeTeamName(rawTeam: string): TeamName {
  if (!rawTeam) return 'Yaqoot';
  const t = rawTeam.trim().toLowerCase();
  if (t.includes('yaqoot') || t.includes('yaqooth') || t === '100' || t.startsWith('10')) return 'Yaqoot';
  if (t.includes('aqeeq') || t === '200' || t.startsWith('20')) return 'Aqeeq';
  if (t.includes('tawbaz') || t.includes('thawbaz') || t === '300' || t.startsWith('30')) return 'Tawbaz';
  if (t.includes('fyruz') || t.includes('fayrooz') || t.includes('fairouz') || t === '400' || t.startsWith('40')) return 'Fyruz';
  if (t.includes('marjan') || t === '500' || t.startsWith('50')) return 'Marjan';
  return 'Yaqoot';
}

export function getTeamFromChestNumber(code: string | number): TeamName | null {
  const num = parseInt(String(code).replace(/\D/g, ''), 10);
  if (isNaN(num)) return null;
  if (num >= 100 && num <= 199) return 'Yaqoot';
  if (num >= 200 && num <= 299) return 'Aqeeq';
  if (num >= 300 && num <= 399) return 'Tawbaz';
  if (num >= 400 && num <= 499) return 'Fyruz';
  if (num >= 500 && num <= 599) return 'Marjan';
  return null;
}

export function getNextChestNumberForTeam(team: TeamName, existingStudents: { code: string; team?: string }[]): string {
  const range = TEAM_RANGES[team];
  if (!range) return '101';
  
  const usedNumbers = new Set<number>();
  existingStudents.forEach(s => {
    const num = parseInt(String(s.code).replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= range.min && num <= range.max) {
      usedNumbers.add(num);
    }
  });

  for (let n = range.min + 1; n <= range.max; n++) {
    if (!usedNumbers.has(n)) {
      return String(n);
    }
  }
  if (!usedNumbers.has(range.min)) return String(range.min);
  return String(range.min + 1);
}

// Team and category display names
export const TEAM_MALAYALAM: Record<TeamName, string> = {
  Yaqoot: 'Yaqoot (100)',
  Aqeeq: 'Aqeeq (200)',
  Tawbaz: 'Tawbaz (300)',
  Fyruz: 'Fyruz (400)',
  Marjan: 'Marjan (500)'
};

export const CATEGORY_MALAYALAM: Record<CategoryName, string> = {
  'Sub Junior': 'Sub Junior',
  'Senior': 'Senior',
  'Super Senior': 'Super Senior',
  'General': 'General'
};

export type ProgramCategory = 'Sub Junior' | 'Senior' | 'Super Senior' | 'General';

export interface Program {
  id: string;
  code?: string;
  name: string;
  type: 'Stage' | 'Non-Stage';
  category: ProgramCategory;
  maxParticipantsPerGroup?: number;
  maxEntriesPerTeam?: number;
  date?: string;
  time?: string;
  stage?: string;
  isResultPublished?: boolean;
  isDashboardPublished?: boolean;
  isSongEvent?: boolean;
}

export interface SongRegistration {
  id: string;
  programId: string;
  team: string;
  songLine: string;
  registeredAt: number;
  entryIndex?: number;
  status?: 'accepted' | 'rejected';
}

