/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { 
  Trophy, Eye, EyeOff, 
  Layers, 
  Award, 
  Search, 
  Lock, 
  Unlock, 
  Settings, 
  Plus, 
  Save,
  RefreshCw, 
  Trash2,
 
  Download, 
  Upload, 
  RotateCcw,
  Monitor,
  Smartphone, 
  User, 
  GraduationCap, 
  Tag, 
  Compass, 
  Info, 
  CheckCircle, 
  XCircle,
  FileSpreadsheet,
  Users,
  SearchCode,
  Sparkles,
  ChevronRight, ChevronLeft,
  Edit,
  Printer,
 
 
  Calendar,
  Clock,
  CalendarDays,
  Flame,
  LogOut,
  Activity, FileText, Copy, List,
  Tv, Play, Pause, SkipForward, SkipBack, X, Maximize2, Minimize2, Radio, Crown, Zap, MoreVertical, Bell, BellRing, Send, CheckCheck, Megaphone, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentResult, TeamName, CategoryName, TEAMS, CATEGORIES, TEAM_CODES, TEAM_RANGES, TEAM_MALAYALAM, CATEGORY_MALAYALAM, Program, ProgramCategory, normalizeTeamName, getTeamFromChestNumber, getNextChestNumberForTeam } from './types';
import { INITIAL_STUDENTS } from './defaultData';

export interface SiteNotification {
  id: string;
  title: string;
  message: string;
  category: 'result' | 'announcement' | 'general' | 'schedule';
  targetTeam?: string;
  timestamp: string;
  read?: boolean;
}

function ProgramRegistrationForm({ program, students, registrations, onRegister, onUnregister }: { 
  program: Program, 
  students: StudentResult[], 
  registrations: any[], 
  onRegister: (code: string, entryIndex?: number) => void,
  onUnregister: (id: string) => void
}) {
  const [code, setCode] = useState('');
  const [entryIndex, setEntryIndex] = useState<number>(1);
  const [selectedTeam, setSelectedTeam] = useState<TeamName | ''>('');
  
  const progRegs = registrations.filter(r => r.programId === program.id);
  const selectedStudent = code ? students.find(s => s.code.toUpperCase() === code.trim().toUpperCase()) : null;
  
  const teamStudents = selectedTeam ? students.filter(s => s.team === selectedTeam && !s.code.startsWith('TEAM-')) : [];
  
  const handleGeneralTeamRegister = (studentCode: string) => {
     onRegister(studentCode, entryIndex);
  };

  



  return (
    <div className="flex flex-col h-full space-y-3 mt-4 pt-3 border-t border-stone-800">
      {program.category === 'General' ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-amber-500/70">Team</label>
              <select 
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value as TeamName)}
                className="px-3 py-1.5 bg-stone-900 border border-amber-500/20 rounded-lg text-xs text-amber-100 outline-none"
              >
                <option value="">-- Team --</option>
                {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-amber-500/70">
                Entry ({program.maxEntriesPerTeam || 1} allowed)
              </label>
              <select 
                value={entryIndex}
                onChange={(e) => setEntryIndex(Number(e.target.value))}
                className="px-3 py-1.5 bg-stone-900 border border-amber-500/20 rounded-lg text-xs text-amber-100 outline-none"
              >
                {Array.from({ length: Math.max(1, program.maxEntriesPerTeam || 1) }).map((_, i) => (
                  <option key={i+1} value={i+1}>Entry {i+1}</option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedTeam && (
            <div className="flex flex-col gap-1 border border-amber-500/10 rounded-lg p-2 bg-stone-950/50">
               <label className="text-[10px] font-bold text-amber-500/70 uppercase">Add Student to Entry {entryIndex}</label>
               <select
                 className="px-3 py-1.5 bg-stone-900 border border-amber-500/20 rounded-lg text-xs text-amber-100 outline-none"
                 onChange={(e) => {
                    if (e.target.value) {
                       handleGeneralTeamRegister(e.target.value);
                       e.target.value = ''; // reset after selection
                    }
                 }}
               >
                  <option value="">-- Select Student --</option>
                  {teamStudents.map((ts, idx) => (
                    <option key={`${ts.code}-${idx}`} value={ts.code}>{ts.name} ({ts.code})</option>
                  ))}
               </select>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-stretch gap-2">
            <input 
              type="text" 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              placeholder="Chess No."
              className="flex-1 px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-amber-400 focus:border-amber-500 outline-none w-full"
            />
            <button 
              onClick={() => { onRegister(code, entryIndex); setCode(''); }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {selectedStudent && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
              Name: <strong>{selectedStudent.name}</strong> ({selectedStudent.team}, {selectedStudent.category})
            </div>
          )}
          {code && !selectedStudent && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
              Student not found
            </div>
          )}
        </div>
      )}
      
      {progRegs.length > 0 && (
        <div className="mt-3 space-y-2 flex-1 overflow-y-auto max-h-40 pr-1">
          {progRegs.map(reg => {
            const student = students.find(s => s.code.toUpperCase() === reg.studentCode.toUpperCase());
            return (
              <div key={reg.id} className="flex justify-between items-center text-xs bg-stone-950 px-2 py-2 rounded-lg border border-stone-800">
                <div className="flex flex-col">
                  <span className="font-bold text-amber-100">
                    {student?.name || reg.studentCode}
                    {program.category === 'General' && program.maxEntriesPerTeam && program.maxEntriesPerTeam > 1 && (
                       <span className="ml-1 text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded">Entry {reg.entryIndex || 1}</span>
                    )}
                  </span>
                  <span className="text-[10px] text-amber-500/70">{student?.team} - {student?.code}</span>
                </div>
                <button 
                  onClick={() => onUnregister(reg.id)}
                  className="text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-md transition-colors cursor-pointer"
                  title="Remove Registration"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const cleanPDFText = (str: any) => {
  if (str === null || str === undefined) return '';
  const stringified = String(str);
  const normalized = stringified
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '*');
  return normalized.replace(/[^\x20-\x7E]/g, '').trim();
};

export default function App() {
  // --- STATE ---
  const [viewMode, setViewMode] = useState<'pc' | 'phone'>(typeof window !== 'undefined' && window.innerWidth > 768 ? 'pc' : 'phone');
  const [festivalName, setFestivalName] = useState('Sargam Art Fest');
  const [festivalYear, setFestivalYear] = useState('2026-27');

  // Update meta viewport based on viewMode
  useEffect(() => {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    if (viewMode === 'pc') {
      viewport.setAttribute('content', 'width=1024');
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
  }, [viewMode]);
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  const programTeamPoints = useMemo(() => {
    const pts: Record<string, Record<string, number>> = {};
    students.forEach(s => {
      if (s.programResults) {
        s.programResults.forEach(r => {
          const prog = r.programId ? programs.find(p => p.id === r.programId) : programs.find(p => p.name === r.programName && (p.category === s.category || p.category === 'General' || s.category === 'General'));
          if (!prog) return;
          const progId = prog.id;
          if (progId && s.team) {
            const officialTeam = TEAMS.find(t => t.toLowerCase() === s.team.toLowerCase()) || s.team;
            if (!pts[progId]) pts[progId] = {};
            pts[progId][officialTeam] = (pts[progId][officialTeam] || 0) + r.points;
          }
        });
      }
    });
    return pts;
  }, [students, programs]);

  const [registrations, setRegistrations] = useState<{id: string, programId: string, studentCode: string}[]>([]);
  const [songRegistrations, setSongRegistrations] = useState<import('./types').SongRegistration[]>([]);
  const [formProgramName, setFormProgramName] = useState('');
  const [formProgramCode, setFormProgramCode] = useState('');
  const [formProgramType, setFormProgramType] = useState<'Stage' | 'Non-Stage'>('Stage');
  const [formProgramIsSongEvent, setFormProgramIsSongEvent] = useState(false);
  const [formProgramDate, setFormProgramDate] = useState('');
  const [formProgramTime, setFormProgramTime] = useState('');
  const [formProgramCategory, setFormProgramCategory] = useState<'Sub Junior' | 'Senior' | 'Super Senior' | 'General'>('General');
  const [formProgramMaxParticipants, setFormProgramMaxParticipants] = useState<number>(5);
  const [formProgramMaxEntries, setFormProgramMaxEntries] = useState<number>(1);
  const [maxStagePrograms, setMaxStagePrograms] = useState(3);
  const [maxNonStagePrograms, setMaxNonStagePrograms] = useState(3);
  const [categoryLimits, setCategoryLimits] = useState<Record<string, { maxStage: number; maxNonStage: number; maxGeneral?: number }>>({
    'Sub Junior': { maxStage: 3, maxNonStage: 3, maxGeneral: 2 },
    'Senior': { maxStage: 3, maxNonStage: 3, maxGeneral: 2 },
    'Super Senior': { maxStage: 3, maxNonStage: 3, maxGeneral: 2 },
    'General': { maxStage: 2, maxNonStage: 2, maxGeneral: 2 },
  });
  const [activeTab, setActiveTab] = useState<'total' | 'category' | 'top3' | 'program'>('total');
  const [globalSearch, setGlobalSearch] = useState('');
  const [publicSearchView, setPublicSearchView] = useState<'student' | 'program'>('student');
  const [publicProgramSearchQuery, setPublicProgramSearchQuery] = useState('');
  const [publicSelectedProgramId, setPublicSelectedProgramId] = useState('');
  
  // Live Animation Mode State
  const [isLiveAnimationOpen, setIsLiveAnimationOpen] = useState(false);
  const [liveSlideIndex, setLiveSlideIndex] = useState(0);
  const [isLivePaused, setIsLivePaused] = useState(false);
  const [isLiveFullScreen, setIsLiveFullScreen] = useState(false);
  const [isLiveControlsOpen, setIsLiveControlsOpen] = useState(false);
  
  // Admin State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'all_programs' | 'check_publish' | 'active_status' | 'printing'>('dashboard');
  const [adminAllProgramsSearchQuery, setAdminAllProgramsSearchQuery] = useState('');
  const [adminStudentSearchQuery, setAdminStudentSearchQuery] = useState('');
  const [printProgramId, setPrintProgramId] = useState('');
  const [printProgramIds, setPrintProgramIds] = useState<string[]>([]);
  const [regPaperSearchQuery, setRegPaperSearchQuery] = useState('');
  const [regPaperSelectedProgramId, setRegPaperSelectedProgramId] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [systemAdminPassword, setSystemAdminPassword] = useState('admin123');
  const [tempSystemPassword, setTempSystemPassword] = useState('admin123');

  // Team Program Registration State
  const [isTeamProgramRegistrationOpen, setIsTeamProgramRegistrationOpen] = useState(false);
  const [teamRegistrationSelectedTeam, setTeamRegistrationSelectedTeam] = useState<string | null>(null);
  const [teamRegistrationPassword, setTeamRegistrationPassword] = useState('');
  const [teamRegistrationError, setTeamRegistrationError] = useState('');
  const [isTeamRegistrationLoggedIn, setIsTeamRegistrationLoggedIn] = useState(false);
  const [convenerProgramCode, setConvenerProgramCode] = useState('');
  const [convenerStudentCodes, setConvenerStudentCodes] = useState<string[]>([]);
  const [convenerEntryIndex, setConvenerEntryIndex] = useState(1);
  const [convenerSongProgramCode, setConvenerSongProgramCode] = useState('');
  const [convenerSongLine1, setConvenerSongLine1] = useState('');
  const [convenerSongLine2, setConvenerSongLine2] = useState('');

  // Auto populate topic lines when program code or selected team changes
  useEffect(() => {
    if (!convenerSongProgramCode || !teamRegistrationSelectedTeam) {
      setConvenerSongLine1('');
      setConvenerSongLine2('');
      return;
    }
    const p = programs.find(pr => pr.code?.toUpperCase() === convenerSongProgramCode.toUpperCase());
    if (p) {
      const reg1 = songRegistrations.find(r => r.programId === p.id && r.team === teamRegistrationSelectedTeam && r.status !== 'rejected' && (r.entryIndex === 1 || !r.entryIndex));
      const reg2 = songRegistrations.find(r => r.programId === p.id && r.team === teamRegistrationSelectedTeam && r.status !== 'rejected' && r.entryIndex === 2);
      setConvenerSongLine1(reg1 ? reg1.songLine : '');
      setConvenerSongLine2(reg2 ? reg2.songLine : '');
    } else {
      setConvenerSongLine1('');
      setConvenerSongLine2('');
    }
  }, [convenerSongProgramCode, teamRegistrationSelectedTeam, songRegistrations, programs]);
  
  // Clear Confirm State
  const [clearConfirmState, setClearConfirmState] = useState<{isOpen: boolean, action: 'reset' | 'clearStudents' | 'clearPrograms' | 'clearResults' | 'clearNotifications' | null, password: string, error: string}>({
    isOpen: false, action: null, password: '', error: ''
  });
  const [teamPasswords, setTeamPasswords] = useState<Record<string, string>>({
    'Aqeeq': '', 'Tawbaz': '', 'Marjan': '', 'Fyruz': '', 'Yaqoot': ''
  });
  const [tempTeamPasswords, setTempTeamPasswords] = useState<Record<string, string>>({
    'Aqeeq': '', 'Tawbaz': '', 'Marjan': '', 'Fyruz': '', 'Yaqoot': ''
  });
  const [showTeamPasswords, setShowTeamPasswords] = useState<Record<string, boolean>>({});
  const [showSystemPassword, setShowSystemPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Notification State
  const [siteNotifications, setSiteNotifications] = useState<SiteNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Sargam Art Fest 2026 Live Updates! 🏆',
      message: 'Real-time competition results and team scores are available here.',
      category: 'announcement',
      timestamp: 'Just now'
    }
  ]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [showNotifPermissionPrompt, setShowNotifPermissionPrompt] = useState(false);
  const [notifPermissionState, setNotifPermissionState] = useState<string>('default');
  const knownNotifIdsRef = useRef<Set<string> | null>(null);
  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sargam_read_notif_ids') || '[]');
    } catch {
      return [];
    }
  });
  const [clearedNotifIds, setClearedNotifIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sargam_cleared_notif_ids') || '[]');
    } catch {
      return [];
    }
  });

  // Admin Broadcast & OneSignal Push State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'result' | 'announcement' | 'general'>('announcement');
  const [oneSignalRestApiKey, setOneSignalRestApiKey] = useState<string>(() => {
    return localStorage.getItem('sargam_onesignal_key') || ((import.meta as any).env?.VITE_ONESIGNAL_REST_API_KEY as string) || '';
  });
  const [isSendingPush, setIsSendingPush] = useState(false);
  
  // Student Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formTeam, setFormTeam] = useState<TeamName>('Yaqoot');
  const [formCategory, setFormCategory] = useState<CategoryName>('Senior');
  const [formClass, setFormClass] = useState('1');

  // Auto-calculate category based on class
  useEffect(() => {
    const classNum = parseInt(formClass, 10);
    if (!isNaN(classNum)) {
      if (classNum >= 1 && classNum <= 3) {
        setFormCategory('Sub Junior');
      } else if (classNum >= 4 && classNum <= 5) {
        setFormCategory('Senior');
      } else if (classNum >= 6 && classNum <= 8) {
        setFormCategory('Super Senior');
      }
    }
  }, [formClass]);

  const [formEvent, setFormEvent] = useState('');

  // --- CHECK PUBLISH SIMULATOR STATE ---
  const [simRows, setSimRows] = useState<{id: string, programCode: string, selectedProgramId: string | null}[]>(
    Array.from({length: 10}, (_, i) => ({
      id: `sim-${i}`,
      programCode: '',
      selectedProgramId: null
    }))
  );
  const [simPublishedProgramIds, setSimPublishedProgramIds] = useState<string[]>([]);

  // --- NEW RESULT PUBLISHING STATE ---
  const [resultPublishProgramId, setResultPublishProgramId] = useState('');
  const [resultPublishSearchQuery, setResultPublishSearchQuery] = useState('');
  const [programSearchQuery, setProgramSearchQuery] = useState('');
  const [showResultPublishDropdown, setShowResultPublishDropdown] = useState(false);
  const resultPublishDropdownRef = useRef<HTMLDivElement>(null);
  const [resultPublishEntries, setResultPublishEntries] = useState<{id: string, code: string, rank: number, grade: string}[]>([
    { id: 'initial', code: '', rank: 1, grade: 'A' }
  ]);
  
  const [editingCode, setEditingCode] = useState<string | null>(null);
  
  useEffect(() => {
    let prefillCode = '';
    if (editingCode) {
      const studentBeingEdited = students.find(s => s.code === editingCode);
      prefillCode = studentBeingEdited ? (studentBeingEdited.code.startsWith('TEAM-') ? studentBeingEdited.team : studentBeingEdited.code) : editingCode;
    }

    if (!resultPublishProgramId) {
      setResultPublishEntries([{ id: Date.now().toString(), code: prefillCode, rank: 0, grade: '' }]);
      return;
    }
    const selectedProgram = programs.find(p => p.id === resultPublishProgramId);
    if (selectedProgram) {
      const existingEntries: any[] = [];
      students.forEach(s => {
        let res = s.programResults?.find(r => {
          if (r.programId) return r.programId === selectedProgram.id;
          return r.programName === selectedProgram.name && (s.category === selectedProgram.category || selectedProgram.category === 'General' || s.category === 'General');
        });
        if (!res && s.event === selectedProgram.name && (s.category === selectedProgram.category || selectedProgram.category === 'General' || s.category === 'General')) {
          res = { programName: s.event, rank: s.rank, grade: s.grade, points: s.points };
        }
        if (res) {
          existingEntries.push({
            id: Math.random().toString(),
            code: s.code.startsWith('TEAM-') ? s.team : s.code,
            rank: res.rank,
            grade: res.grade
          });
        }
      });

      let finalEntries = [...existingEntries];
      if (prefillCode && !finalEntries.find(e => e.code.toUpperCase() === prefillCode.toUpperCase())) {
         finalEntries.unshift({ id: Date.now().toString(), code: prefillCode, rank: 0, grade: '' });
      }

      if (finalEntries.length > 0) {
        setResultPublishEntries(finalEntries);
      } else {
        setResultPublishEntries([{ id: Date.now().toString(), code: prefillCode, rank: 0, grade: '' }]);
      }
    } else {
      setResultPublishEntries([{ id: Date.now().toString(), code: prefillCode, rank: 0, grade: '' }]);
    }
  }, [resultPublishProgramId, programs, students, editingCode]);

  // Auto-set chest number when team changes for a new student
  useEffect(() => {
    if (!editingCode && adminTab === 'student_details') {
      if (!formCode || getTeamFromChestNumber(formCode) !== formTeam) {
        setFormCode(getNextChestNumberForTeam(formTeam, students));
      }
    }
  }, [formTeam, editingCode, adminTab, students]);

  const [formRank, setFormRank] = useState<number>(1);
  const [formGrade, setFormGrade] = useState('A');
  const [formPoints, setFormPoints] = useState<number>(0);
  const [formResultCategory, setFormResultCategory] = useState<CategoryName>('General');
  const [formResultEntryIndex, setFormResultEntryIndex] = useState<number>(1);
  
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  
  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Modal State for Student info
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isProgramsListModalOpen, setIsProgramsListModalOpen] = useState(false);
    const [programsSearchQuery, setProgramsSearchQuery] = useState('');
    const [scheduleSearchQuery, setScheduleSearchQuery] = useState('');
  const [scheduleSelectedProgramId, setScheduleSelectedProgramId] = useState<string>('');
  const [scheduleProgramCodeInput, setScheduleProgramCodeInput] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [scheduleStage, setScheduleStage] = useState<string>('Stage 1');
  const [scheduleActiveStageTab, setScheduleActiveStageTab] = useState<'all' | 'Stage 1' | 'Stage 2' | 'Non-Stage'>('all');

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelFileInputRef = useRef<HTMLInputElement>(null);
  const programExcelFileInputRef = useRef<HTMLInputElement>(null);
  const studentExcelFileInputRef = useRef<HTMLInputElement>(null);

  // Group Score Editor Modal State
  const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TeamName | null>(null);
  const [groupAdminPassword, setGroupAdminPassword] = useState('');
  const [groupAdminError, setGroupAdminError] = useState('');
  
  // Group modal sub-editor state
  const [isGroupModalAddingStudent, setIsGroupModalAddingStudent] = useState(false);
  const [groupModalEditingStudent, setGroupModalEditingStudent] = useState<StudentResult | null>(null);

  // --- BROWSER / MOBILE BACK BUTTON HISTORY NAVIGATION ---
  const activeStatesRef = useRef({
    clearConfirmState,
    isNotificationModalOpen,
    isGroupEditModalOpen,
    isLiveAnimationOpen,
    isProgramsListModalOpen,
    isScheduleModalOpen,
    isTeamProgramRegistrationOpen,
    isAdminOpen,
    activeTab,
  });

  useEffect(() => {
    activeStatesRef.current = {
      clearConfirmState,
      isNotificationModalOpen,
      isGroupEditModalOpen,
      isLiveAnimationOpen,
      isProgramsListModalOpen,
      isScheduleModalOpen,
      isTeamProgramRegistrationOpen,
      isAdminOpen,
      activeTab,
    };
  }, [
    clearConfirmState.isOpen,
    isNotificationModalOpen,
    isGroupEditModalOpen,
    isLiveAnimationOpen,
    isProgramsListModalOpen,
    isScheduleModalOpen,
    isTeamProgramRegistrationOpen,
    isAdminOpen,
    activeTab,
  ]);

  const openStateKey = useMemo(() => {
    if (clearConfirmState.isOpen) return 'clearConfirm';
    if (isNotificationModalOpen) return 'notificationModal';
    if (isGroupEditModalOpen) return 'groupEditModal';
    if (isLiveAnimationOpen) return 'liveAnimation';
    if (isProgramsListModalOpen) return 'programsListModal';
    if (isScheduleModalOpen) return 'scheduleModal';
    if (isTeamProgramRegistrationOpen) return 'teamProgramRegistrationModal';
    if (isAdminOpen) return 'adminDrawer';
    if (activeTab !== 'total') return `tab-${activeTab}`;
    return 'root';
  }, [
    clearConfirmState.isOpen,
    isNotificationModalOpen,
    isGroupEditModalOpen,
    isLiveAnimationOpen,
    isProgramsListModalOpen,
    isScheduleModalOpen,
    isTeamProgramRegistrationOpen,
    isAdminOpen,
    activeTab,
  ]);

  const getOverlayDepth = (key: string): number => {
    if (key === 'clearConfirm') return 3;
    if (
      key === 'notificationModal' ||
      key === 'groupEditModal' ||
      key === 'liveAnimation' ||
      key === 'programsListModal' ||
      key === 'scheduleModal' ||
      key === 'teamProgramRegistrationModal'
    ) {
      return 2;
    }
    if (key === 'adminDrawer' || key.startsWith('tab-')) {
      return 1;
    }
    return 0; // 'root'
  };

  const isPoppingRef = useRef(false);
  const prevOpenStateKeyRef = useRef('root');

  useEffect(() => {
    // Set initial root state if not present
    if (!window.history.state || !window.history.state.sargamApp) {
      window.history.replaceState({ sargamApp: true, key: 'root' }, '');
    }

    const handlePopState = () => {
      isPoppingRef.current = true;
      const current = activeStatesRef.current;

      if (current.clearConfirmState.isOpen) {
        setClearConfirmState({ isOpen: false, action: null, password: '', error: '' });
        return;
      }
      if (current.isNotificationModalOpen) {
        setIsNotificationModalOpen(false);
        return;
      }
      if (current.isGroupEditModalOpen) {
        setIsGroupEditModalOpen(false);
        return;
      }
      if (current.isLiveAnimationOpen) {
        setIsLiveAnimationOpen(false);
        return;
      }
      if (current.isProgramsListModalOpen) {
        setIsProgramsListModalOpen(false);
        return;
      }
      if (current.isScheduleModalOpen) {
        setIsScheduleModalOpen(false);
        return;
      }
      if (current.isTeamProgramRegistrationOpen) {
        setIsTeamProgramRegistrationOpen(false);
        return;
      }
      if (current.isAdminOpen) {
        setIsAdminOpen(false);
        return;
      }
      if (current.activeTab !== 'total') {
        setActiveTab('total');
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const prevKey = prevOpenStateKeyRef.current;
    const currentKey = openStateKey;

    if (prevKey === currentKey) return;

    const prevDepth = getOverlayDepth(prevKey);
    const currentDepth = getOverlayDepth(currentKey);

    if (isPoppingRef.current) {
      // Popstate caused this state change
      isPoppingRef.current = false;
    } else {
      // User interaction in UI caused this state change
      if (currentDepth > prevDepth) {
        window.history.pushState({ sargamApp: true, key: currentKey }, '');
      } else if (currentDepth < prevDepth) {
        window.history.back();
      } else {
        window.history.replaceState({ sargamApp: true, key: currentKey }, '');
      }
    }

    prevOpenStateKeyRef.current = currentKey;
  }, [openStateKey]);
  
  // Quick inline form state
  const [inlineCode, setInlineCode] = useState('');
  const [inlineName, setInlineName] = useState('');
  const [inlineCategory, setInlineCategory] = useState<CategoryName>('Senior');
  const [inlineClass, setInlineClass] = useState('');
  const [inlineEvent, setInlineEvent] = useState('');
  const [inlineRank, setInlineRank] = useState<number>(1);
  const [inlineGrade, setInlineGrade] = useState('A');
  const [inlinePoints, setInlinePoints] = useState<number>(0);
  // Auto-calculate formPoints
  useEffect(() => {
    let calcCategory = 'General';
    if (adminTab === 'student_details') {
      calcCategory = formCategory;
    } else if (adminTab === 'result_publishing') {
      const selectedProg = programs.find(p => p.name === formEvent);
      calcCategory = selectedProg?.category || 'General';
    }

    let rankPts = 0;
    if (calcCategory === 'General') {
      if (formRank === 1) rankPts = 10;
      else if (formRank === 2) rankPts = 8;
      else if (formRank === 3) rankPts = 6;
    } else {
      if (formRank === 1) rankPts = 5;
      else if (formRank === 2) rankPts = 3;
      else if (formRank === 3) rankPts = 1;
    }
    let gradePts = 0;
    if (formGrade === 'A') gradePts = 5;
    else if (formGrade === 'B') gradePts = 3;
    else if (formGrade === 'C') gradePts = 1;
    
    setFormPoints(rankPts + gradePts);
  }, [formRank, formGrade, formCategory, formEvent, programs, adminTab]);

  // Auto-calculate inlinePoints
  useEffect(() => {
    let rankPts = 0;
    if (inlineCategory === 'General') {
      if (inlineRank === 1) rankPts = 10;
      else if (inlineRank === 2) rankPts = 8;
      else if (inlineRank === 3) rankPts = 6;
    } else {
      if (inlineRank === 1) rankPts = 5;
      else if (inlineRank === 2) rankPts = 3;
      else if (inlineRank === 3) rankPts = 1;
    }
    let gradePts = 0;
    if (inlineGrade === 'A') gradePts = 5;
    else if (inlineGrade === 'B') gradePts = 3;
    else if (inlineGrade === 'C') gradePts = 1;
    
    setInlinePoints(rankPts + gradePts);
  }, [inlineRank, inlineGrade, inlineCategory]);


  const startEditInline = (student: StudentResult) => {
    setGroupModalEditingStudent(student);
    setIsGroupModalAddingStudent(false);
    setInlineCode(student.code);
    setInlineName(student.name);
    setInlineCategory(student.category as CategoryName);
    setInlineClass(student.class);
    setInlineEvent(student.event);
    setInlineRank(student.rank);
    setInlineGrade(student.grade);
    setInlinePoints(student.points);
  };

  const startAddInline = () => {
    setIsGroupModalAddingStudent(true);
    setGroupModalEditingStudent(null);
    setInlineCode('');
    setInlineName('');
    setInlineCategory('Senior');
    setInlineClass('');
    setInlineEvent('');
    setInlineRank(1);
    setInlineGrade('A');
    setInlinePoints(0);
  };

  const handleSaveInlineStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineCode.trim() || !inlineName.trim() || !inlineEvent.trim() || !editingGroup) {
      showToast('Code, Name, and Event are required!', 'error');
      return;
    }

    const newResult: StudentResult = {
      code: inlineCode.trim().toUpperCase(),
      name: inlineName.trim(),
      team: editingGroup,
      category: inlineCategory,
      class: inlineClass.trim() || 'N/A',
      event: inlineEvent.trim(),
      rank: Number(inlineRank) || 1,
      grade: inlineGrade.trim().toUpperCase() || 'A',
      points: Number(inlinePoints) || 0
    };

    let updatedList: StudentResult[] = [];
    const exists = students.some(s => s.code.toUpperCase() === newResult.code);

    if (groupModalEditingStudent) {
      if (groupModalEditingStudent.code.toUpperCase() !== newResult.code && exists) {
        showToast('Another student with this Chess No. already exists!', 'error');
        return;
      }
      updatedList = students.map(s => s.code.toUpperCase() === groupModalEditingStudent.code.toUpperCase() ? newResult : s);
      showToast('Information successfully updated!');
    } else if (exists) {
      showToast('A student with this Chess No. already exists!', 'error');
      return;
    } else {
      updatedList = [...students, newResult];
      showToast('New winner information successfully added!');
    }

    saveAndSetStudents(updatedList);
    setGroupModalEditingStudent(null);
    setIsGroupModalAddingStudent(false);
  };

  const deleteStudentCascading = (codeToDelete: string) => {
    const upperCode = codeToDelete.toUpperCase();
    const updatedStudents = students.filter(s => s.code.toUpperCase() !== upperCode);
    saveAndSetStudents(updatedStudents);

    const updatedRegs = registrations.filter(r => r.studentCode.toUpperCase() !== upperCode);
    if (updatedRegs.length !== registrations.length) {
      saveAndSetRegistrations(updatedRegs);
    }

    if (editingCode === codeToDelete) {
      resetForm();
    }
    if (groupModalEditingStudent && groupModalEditingStudent.code === codeToDelete) {
      setGroupModalEditingStudent(null);
    }
    showToast('Information successfully removed.', 'success');
  };

  const handleDeleteInlineStudent = (codeToDelete: string) => {
    deleteStudentCascading(codeToDelete);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resultPublishDropdownRef.current && !resultPublishDropdownRef.current.contains(event.target as Node)) {
        setShowResultPublishDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- INITIALIZATION ---
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'data', 'festivalData'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.festivalName) setFestivalName(data.festivalName);
        if (data.festivalYear) setFestivalYear(data.festivalYear);
        if (data.adminPassword) {
          setSystemAdminPassword(data.adminPassword);
          setTempSystemPassword(data.adminPassword);
        }
        if (data.teamPasswords) {
          setTeamPasswords(data.teamPasswords);
          setTempTeamPasswords(data.teamPasswords);
        }
        if (data.categoryLimits) {
          setCategoryLimits(data.categoryLimits);
        } else if (data.maxStagePrograms !== undefined || data.maxNonStagePrograms !== undefined) {
          const sLim = data.maxStagePrograms ?? 3;
          const nsLim = data.maxNonStagePrograms ?? 3;
          setCategoryLimits({
            'Sub Junior': { maxStage: sLim, maxNonStage: nsLim },
            'Senior': { maxStage: sLim, maxNonStage: nsLim },
            'Super Senior': { maxStage: sLim, maxNonStage: nsLim },
          });
        }
        if (data.maxStagePrograms) setMaxStagePrograms(data.maxStagePrograms);
        if (data.maxNonStagePrograms) setMaxNonStagePrograms(data.maxNonStagePrograms);
        if (data.programs) setPrograms(data.programs);
        if (data.registrations) setRegistrations(data.registrations);
        if (data.songRegistrations) setSongRegistrations(data.songRegistrations);
        if (data.simPublishedProgramIds) setSimPublishedProgramIds(data.simPublishedProgramIds);
        if (data.printProgramIds) setPrintProgramIds(data.printProgramIds);
        if (data.simRows) setSimRows(data.simRows);
        if (data.siteNotifications && Array.isArray(data.siteNotifications)) {
          const incomingNotifications: SiteNotification[] = data.siteNotifications;
          
          if (knownNotifIdsRef.current === null) {
            // Initial load: store existing notification IDs without spamming popups for old history
            knownNotifIdsRef.current = new Set(incomingNotifications.map(n => n.id));
          } else {
            // Realtime updates: detect newly posted notifications and show native mobile/desktop system notification
            const newItems = incomingNotifications.filter(n => !knownNotifIdsRef.current!.has(n.id));
            if (newItems.length > 0) {
              newItems.forEach(item => {
                knownNotifIdsRef.current!.add(item.id);
                if (!item.targetTeam || isDeviceAuthenticatedForTeam(item.targetTeam)) {
                  triggerDevicePushNotification(item.title, item.message, item.id);
                }
              });
            }
          }

          setSiteNotifications(incomingNotifications);
        }
        if (data.students && data.students.length > 0) {
          const sanitized = data.students.map((s: any) => ({
            ...s,
            team: normalizeTeamName(s.team)
          }));
          setStudents(sanitized);
        } else if (!data.students) {
          setStudents(INITIAL_STUDENTS);
        }
      } else {
        // Initialize if not exists
        setStudents(INITIAL_STUDENTS);
      }
      setIsLoaded(true);
    }, (error) => {
      console.error("Error fetching data:", error);
      setIsLoaded(true);
    });
    
    return () => unsub();
  }, []);

  // Auto-cleanup orphaned registrations and results for programs or students that no longer exist
  useEffect(() => {
    if (!isLoaded) return;

    const validProgIds = new Set(programs.map(p => p.id));
    const validProgNames = new Set(programs.map(p => p.name));
    const validStudentCodes = new Set(students.map(s => s.code.toUpperCase()));

    let studentsChanged = false;
    let registrationsChanged = false;
    let songRegsChanged = false;

    // 1. Clean orphaned registrations (program missing or student missing)
    const cleanedRegs = registrations.filter(r => 
      validProgIds.has(r.programId) && validStudentCodes.has(r.studentCode.toUpperCase())
    );
    if (cleanedRegs.length !== registrations.length) {
      registrationsChanged = true;
    }

    // 2. Clean orphaned songRegistrations
    const cleanedSongRegs = songRegistrations.filter(sr => validProgIds.has(sr.programId));
    if (cleanedSongRegs.length !== songRegistrations.length) {
      songRegsChanged = true;
    }

    // 3. Clean orphaned student results
    const cleanedStudents = students.map(st => {
      let stUpdated = false;

      let filteredResults = st.programResults || [];
      if (filteredResults.length > 0) {
        const remaining = filteredResults.filter(r => {
          if (r.programId) return validProgIds.has(r.programId);
          if (r.programName) return validProgNames.has(r.programName);
          return false;
        });

        if (remaining.length !== filteredResults.length) {
          filteredResults = remaining;
          stUpdated = true;
        }
      }

      let isEventMatchValid = true;
      if (st.event && !validProgNames.has(st.event)) {
        isEventMatchValid = false;
        stUpdated = true;
      }

      if (stUpdated) {
        studentsChanged = true;
        const totalPts = filteredResults.reduce((sum, r) => {
          const prog = r.programId ? programs.find(p => p.id === r.programId) : programs.find(p => p.name === r.programName && (p.category === st.category || p.category === 'General' || st.category === 'General'));
          if (!prog || prog.category === 'General') return sum;
          return sum + (r.points || 0);
        }, 0);

        const updatedStudent: StudentResult = {
          ...st,
          programResults: filteredResults,
          points: totalPts
        };
        if (!isEventMatchValid) {
          updatedStudent.event = '';
          updatedStudent.rank = 0;
          updatedStudent.grade = '';
        }
        return updatedStudent;
      }

      return st;
    });

    if (studentsChanged) {
      saveAndSetStudents(cleanedStudents);
    }
    if (registrationsChanged) {
      saveAndSetRegistrations(cleanedRegs);
    }
    if (songRegsChanged) {
      saveAndSetSongRegistrations(cleanedSongRegs);
    }
  }, [isLoaded, programs, students]);
  
  // Helper to persist to Firestore
  const persistToFirestore = (updates: any) => {
    try {
      const cleanUpdates = JSON.parse(JSON.stringify(updates));
      setDoc(doc(db, 'data', 'festivalData'), cleanUpdates, { merge: true }).catch(console.error);
    } catch (err) {
      console.error("Error saving to firestore:", err);
    }
  };

  const triggerDevicePushNotification = async (title: string, message: string, notifId?: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const isGranted = Notification.permission === 'granted' || localStorage.getItem('sargam_notif_granted') === 'true';
      if (isGranted) {
        const options = {
          body: message,
          icon: '/favicon.ico',
          tag: notifId || `notif-${Date.now()}`
        };

        // Try service worker notification first (required on Mobile Chrome/Android)
        if ('serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg && typeof reg.showNotification === 'function') {
              await reg.showNotification(title, options);
              return;
            }
          } catch (swErr) {
            console.warn("ServiceWorker notification note:", swErr);
          }
        }

        // Fallback to standard Notification constructor if supported by platform
        try {
          const notif = new Notification(title, options);
          notif.onclick = () => {
            window.focus();
            setIsNotificationModalOpen(true);
          };
        } catch (err) {
          console.warn("Native Notification constructor not supported on this platform/device:", err);
        }
      }
    }
  };

  const saveAndSetNotifications = (action: SiteNotification[] | ((prev: SiteNotification[]) => SiteNotification[])) => {
    setSiteNotifications(prev => {
      const updated = typeof action === 'function' ? action(prev) : action;
      persistToFirestore({ siteNotifications: updated });
      return updated;
    });
  };

  const sendOneSignalNotification = async (title: string, message: string, keyOverride?: string) => {
    const apiKey = keyOverride || oneSignalRestApiKey || ((import.meta as any).env?.VITE_ONESIGNAL_REST_API_KEY as string) || '';
    if (!apiKey || !apiKey.trim()) {
      throw new Error("OneSignal REST API Key is missing. Please enter your key in the REST API Key field below.");
    }
    const cleanKey = apiKey.trim();
    const authHeader = cleanKey.startsWith('Basic ') ? cleanKey : `Basic ${cleanKey}`;

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": authHeader
      },
      body: JSON.stringify({
        app_id: "410b6f1d-c0b1-4f07-b30f-9e124e18fec3",
        included_segments: ["Subscribed Users", "Total Subscriptions", "All"],
        headings: { en: title },
        contents: { en: message }
      })
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      const errDetail = Array.isArray(data.errors) 
        ? data.errors.join(', ') 
        : typeof data.errors === 'object' 
          ? JSON.stringify(data.errors) 
          : (data.message || "Failed to send OneSignal push notification");

      if (errDetail.toLowerCase().includes("all included players are not subscribed") || errDetail.toLowerCase().includes("players are not subscribed")) {
        return {
          success: false,
          noSubscribers: true,
          message: "Notification saved in-app! (Note: No active push subscribers found in OneSignal yet)."
        };
      }

      throw new Error(errDetail);
    }
    return {
      success: true,
      recipients: data.recipients || 0,
      data
    };
  };

  const isDeviceAuthenticatedForTeam = (teamName?: string) => {
    if (!teamName || teamName === 'all') return true;
    if (isTeamRegistrationLoggedIn && teamRegistrationSelectedTeam === teamName) {
      return true;
    }
    try {
      if (localStorage.getItem(`sargam_team_authenticated_${teamName}`) === 'true') {
        return true;
      }
    } catch (e) {
      // ignore
    }
    return false;
  };

  const sendBroadcastNotification = (
    title: string,
    message: string,
    category: 'result' | 'announcement' | 'general' = 'announcement',
    targetTeam?: string
  ) => {
    const notifId = `notif-${Date.now()}`;
    const newNotif: SiteNotification = {
      id: notifId,
      title,
      message,
      category,
      targetTeam,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    if (knownNotifIdsRef.current) {
      knownNotifIdsRef.current.add(notifId);
    }

    saveAndSetNotifications(prev => [newNotif, ...prev]);
    if (!targetTeam || isDeviceAuthenticatedForTeam(targetTeam)) {
      triggerDevicePushNotification(title, message, notifId);
    }
  };

  useEffect(() => {
    const isGrantedLocal = localStorage.getItem('sargam_notif_granted') === 'true';
    if (isGrantedLocal) {
      setNotifPermissionState('granted');
      setShowNotifPermissionPrompt(false);
      return;
    }

    if (typeof window !== 'undefined') {
      let currentPerm = 'default';
      if ('Notification' in window) {
        currentPerm = Notification.permission;
      }
      setNotifPermissionState(currentPerm);
      
      if (currentPerm === 'default') {
        const timer = setTimeout(() => {
          setShowNotifPermissionPrompt(true);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        setShowNotifPermissionPrompt(false);
      }
    }
  }, []);

  const handleRequestNotifPermission = async () => {
    localStorage.setItem('sargam_notif_granted', 'true');
    setNotifPermissionState('granted');
    setShowNotifPermissionPrompt(false);

    // 1. Trigger OneSignal permission prompt if SDK is loaded
    if (typeof window !== 'undefined' && (window as any).OneSignalDeferred) {
      (window as any).OneSignalDeferred.push(async (OneSignal: any) => {
        try {
          if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
            await OneSignal.Notifications.requestPermission();
          }
          if (OneSignal.User && OneSignal.User.PushSubscription) {
            await OneSignal.User.PushSubscription.optIn();
          }
        } catch (osErr) {
          console.warn("OneSignal optIn note:", osErr);
        }
      });
    }

    // 2. Trigger native browser notification prompt if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission !== 'granted' && typeof Notification.requestPermission === 'function') {
          const res = Notification.requestPermission((result) => {
            if (result === 'granted') {
              setNotifPermissionState('granted');
            }
          });
          if (res && typeof res.then === 'function') {
            await res;
          }
        }
        if (Notification.permission === 'granted') {
          triggerDevicePushNotification('Sargam Art Fest 2026', 'Notifications activated successfully! You will receive live updates.');
        }
      } catch (err) {
        console.warn("Native Notification request error:", err);
      }
    }
  };

  const activeNotifications = useMemo(() => {
    return siteNotifications.filter(n => {
      if (clearedNotifIds.includes(n.id)) return false;
      if (n.targetTeam && !isDeviceAuthenticatedForTeam(n.targetTeam)) return false;
      return true;
    });
  }, [siteNotifications, clearedNotifIds, isTeamRegistrationLoggedIn, teamRegistrationSelectedTeam]);

  const unreadNotifs = useMemo(() => {
    return activeNotifications.filter(n => !readNotifIds.includes(n.id));
  }, [activeNotifications, readNotifIds]);

  const markNotifAsRead = (id: string) => {
    if (!readNotifIds.includes(id)) {
      const updated = [...readNotifIds, id];
      setReadNotifIds(updated);
      try {
        localStorage.setItem('sargam_read_notif_ids', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const markAllNotifsAsRead = () => {
    const allIds = activeNotifications.map(n => n.id);
    const updated = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem('sargam_read_notif_ids', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllNotifications = () => {
    const idsToClear = activeNotifications.map(n => n.id);
    const updated = Array.from(new Set([...clearedNotifIds, ...idsToClear]));
    setClearedNotifIds(updated);
    try {
      localStorage.setItem('sargam_cleared_notif_ids', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearSingleNotification = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = Array.from(new Set([...clearedNotifIds, id]));
    setClearedNotifIds(updated);
    try {
      localStorage.setItem('sargam_cleared_notif_ids', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const saveAndSetSimPublishedProgramIds = (action: string[] | ((prev: string[]) => string[])) => {
    setSimPublishedProgramIds(prev => {
      const updated = typeof action === 'function' ? action(prev) : action;
      persistToFirestore({ simPublishedProgramIds: updated });
      return updated;
    });
  };

  const saveAndSetPrintProgramIds = (action: string[] | ((prev: string[]) => string[])) => {
    setPrintProgramIds(prev => {
      const updated = typeof action === 'function' ? action(prev) : action;
      persistToFirestore({ printProgramIds: updated });
      return updated;
    });
  };

  const saveAndSetSimRows = (action: typeof simRows | ((prev: typeof simRows) => typeof simRows)) => {
    setSimRows(prev => {
      const updated = typeof action === 'function' ? action(prev) : action;
      persistToFirestore({ simRows: updated });
      return updated;
    });
  };

  // Synchronize simRows selectedProgramId when programs load
  useEffect(() => {
    if (!isLoaded || !programs.length) return;
    setSimRows(prevRows => {
      let changed = false;
      const updated = prevRows.map(r => {
        if (r.programCode) {
          const p = programs.find(prog => prog.code?.toUpperCase() === r.programCode.toUpperCase());
          const newSelectedId = p ? p.id : null;
          if (newSelectedId !== r.selectedProgramId) {
            changed = true;
            return { ...r, selectedProgramId: newSelectedId };
          }
        }
        return r;
      });
      return changed ? updated : prevRows;
    });
  }, [isLoaded, programs]);

  const handleSaveBothTopics = (programId: string, line1: string, line2: string) => {
    const prog = programs.find(p => p.id === programId);
    if (!prog) {
      showToast('Programme not found.', 'error');
      return;
    }

    const t1 = line1.trim();
    const t2 = line2.trim();

    if (!t1 && !t2) {
      showToast('Please enter at least one topic line.', 'error');
      return;
    }

    const norm1 = t1.toLowerCase().replace(/\s+/g, '');
    const norm2 = t2.toLowerCase().replace(/\s+/g, '');

    if (t1 && t2 && norm1 === norm2) {
      showToast('Topic 1 and Topic 2 cannot be identical.', 'error');
      return;
    }

    let updatedList = [...songRegistrations];

    const processTopic = (line: string, entryIdx: number) => {
      if (!line) return true;
      const norm = line.toLowerCase().replace(/\s+/g, '');

      // Check if another team has registered this topic
      const otherTeamReg = updatedList.find(
        r => r.programId === programId && 
             r.status !== 'rejected' && 
             r.team !== teamRegistrationSelectedTeam && 
             r.songLine.trim().toLowerCase().replace(/\s+/g, '') === norm
      );
      if (otherTeamReg) {
        showToast(`Topic "${line}" has already been registered by team ${otherTeamReg.team}!`, 'error');
        return false;
      }

      // Check if current team already has an active registration for this entryIndex
      const existing = updatedList.find(
        r => r.programId === programId && 
             r.team === teamRegistrationSelectedTeam && 
             r.status !== 'rejected' && 
             ((entryIdx === 1 && (!r.entryIndex || r.entryIndex === 1)) || r.entryIndex === entryIdx)
      );

      if (existing) {
        updatedList = updatedList.map(r => r.id === existing.id ? { ...r, songLine: line, entryIndex: entryIdx, registeredAt: Date.now(), status: 'accepted' as const } : r);
      } else {
        const newReg: import('./types').SongRegistration = {
          id: Date.now().toString() + '_' + entryIdx + '_' + Math.random().toString(36).substring(2, 5),
          programId,
          team: teamRegistrationSelectedTeam as string,
          songLine: line,
          entryIndex: entryIdx,
          registeredAt: Date.now(),
          status: 'accepted'
        };
        updatedList.push(newReg);
      }
      return true;
    };

    if (t1) {
      const ok1 = processTopic(t1, 1);
      if (!ok1) return;
    }

    if (t2) {
      const ok2 = processTopic(t2, 2);
      if (!ok2) return;
    }

    saveAndSetSongRegistrations(updatedList);
    showToast('Topics registered successfully!', 'success');
  };

  const handleRegister = (programId: string, studentCode: string, type: 'Stage' | 'Non-Stage', category: ProgramCategory, entryIndex: number = 1) => {
    if (!studentCode.trim()) {
      showToast('Please enter a chess no.', 'error');
      return;
    }
    const student = students.find(s => s.code.toUpperCase() === studentCode.toUpperCase());
    if (!student) {
      showToast('Student not found.', 'error');
      return;
    }
    
    // Category check
    if (category !== 'General' && student.category !== category) {
      showToast(`A ${student.category} student cannot participate in a ${category} programme.`, 'error');
      return;
    }
    
    // Already registered check
    if (registrations.some(r => r.programId === programId && r.studentCode.toUpperCase() === student.code.toUpperCase())) {
      showToast('Student is already registered for this program.', 'error');
      return;
    }
    
    // Limits check per student
    const studentRegs = registrations.filter(r => r.studentCode.toUpperCase() === student.code.toUpperCase());
    const programMap = new Map<string, Program>(programs.map(p => [p.id, p]));
    let stageCount = 0;
    let nonStageCount = 0;
    let generalCount = 0;
    studentRegs.forEach(reg => {
      const p = programMap.get(reg.programId);
      if (p) {
        if (p.category === 'General') {
          generalCount++;
        } else if (p.type === 'Stage') {
          stageCount++;
        } else {
          nonStageCount++;
        }
      }
    });
    
    const thisProgram = programs.find(p => p.id === programId);

    if (category === 'General' || thisProgram?.category === 'General') {
      const generalLimit = categoryLimits['General']?.maxGeneral ?? categoryLimits['General']?.maxStage ?? 2;
      if (generalCount >= generalLimit) {
        showToast(`Student (${student.name || student.code}) has reached maximum limit for General programs (${generalLimit}).`, 'error');
        return;
      }
    } else {
      const studentLimits = categoryLimits[student.category] || {
        maxStage: maxStagePrograms,
        maxNonStage: maxNonStagePrograms,
      };
      
      if (type === 'Stage' && stageCount >= studentLimits.maxStage) {
        showToast(`Student (${student.category}) has reached maximum limit for Stage programs (${studentLimits.maxStage}).`, 'error');
        return;
      }
      if (type === 'Non-Stage' && nonStageCount >= studentLimits.maxNonStage) {
        showToast(`Student (${student.category}) has reached maximum limit for Non-Stage programs (${studentLimits.maxNonStage}).`, 'error');
        return;
      }
    }
    
    // Limits per team
    const teamLimit = (thisProgram?.category === 'General' && thisProgram?.maxParticipantsPerGroup) ? thisProgram.maxParticipantsPerGroup : 2;
    
    const thisProgramRegs = registrations.filter(r => r.programId === programId);
    const thisTeamRegs = thisProgramRegs.filter(r => {
      const st = students.find(s => s.code.toUpperCase() === r.studentCode.toUpperCase());
      const regEntryIndex = (r as any).entryIndex || 1;
      return st?.team === student.team && regEntryIndex === entryIndex;
    });
    if (thisTeamRegs.length >= teamLimit) {
      if (thisProgram?.category === 'General') {
        showToast(`Team ${student.team} Entry ${entryIndex} has reached the limit (${teamLimit}).`, 'error');
      } else {
        showToast(`Team ${student.team} has already reached the maximum limit (${teamLimit}) for this programme.`, 'error');
      }
      return;
    }
    
    const newReg = {
      id: Date.now().toString(),
      programId,
      studentCode: student.code,
      entryIndex
    };
    saveAndSetRegistrations([...registrations, newReg]);
    showToast(`${student.name} registered successfully!`, 'success');
  };
  
  const handleUnregister = (regId: string) => {
    saveAndSetRegistrations(registrations.filter(r => r.id !== regId));
    showToast('Registration removed.', 'success');
  };

  // --- PERSISTENCE HELPER ---
  const saveAndSetStudents = (updatedList: StudentResult[]) => {
    setStudents(updatedList);
    persistToFirestore({ students: updatedList });
  };

  const saveAndSetPrograms = (updatedList: Program[]) => {
    setPrograms(updatedList);
    persistToFirestore({ programs: updatedList });
  };

  const saveAndSetSongRegistrations = (updatedList: import('./types').SongRegistration[]) => {
    setSongRegistrations(updatedList);
    persistToFirestore({ songRegistrations: updatedList });
  };

  const saveAndSetRegistrations = (updatedList: {id: string, programId: string, studentCode: string}[]) => {
    setRegistrations(updatedList);
    persistToFirestore({ registrations: updatedList });
  };
  
  const handleProgramExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Read everything as raw array of arrays
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const newPrograms: Program[] = [];
        
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;
          
          let rawCode = String(row[0] || '').trim();
          let rawName = String(row[1] || '').trim();
          let rawType = String(row[2] || '').trim();
          let rawCategory = String(row[3] || '').trim();
          let rawTopic = String(row[4] || '').trim();
          let rawMaxPart = String(row[5] || '').trim();
          let rawMaxEntries = String(row[6] || '').trim();
          
          if (!rawName) continue;
          
          // Parse Category
          let category: ProgramCategory = 'General';
          const catLower = rawCategory.toLowerCase();
          if (catLower.includes('sub') || catLower.includes('junior')) category = 'Sub Junior';
          else if (catLower.includes('super')) category = 'Super Senior';
          else if (catLower.includes('senior')) category = 'Senior';
          
          // Parse Type
          let type: 'Stage' | 'Non-Stage' = 'Stage';
          if (rawType.toLowerCase().includes('non')) type = 'Non-Stage';
          
          // Topic registration (isSongEvent) - 5th column
          let isSongEvent = false;
          const topicUpper = rawTopic.toUpperCase();
          if (
            topicUpper.includes('T') || 
            topicUpper === 'TRUE' || 
            topicUpper === 'YES' || 
            topicUpper === 'Y' || 
            topicUpper === '1' || 
            rawTopic.includes('-')
          ) {
            isSongEvent = true;
          }
          
          let maxParticipantsPerGroup: number | undefined = undefined;
          let maxEntriesPerTeam: number | undefined = undefined;
          
          if (category === 'General') {
             const parsedPart = parseInt(rawMaxPart, 10);
             if (!isNaN(parsedPart) && parsedPart > 0) {
               maxParticipantsPerGroup = parsedPart;
             } else {
               maxParticipantsPerGroup = 5;
             }
             
             const parsedEnt = parseInt(rawMaxEntries, 10);
             if (!isNaN(parsedEnt) && parsedEnt > 0) {
               maxEntriesPerTeam = parsedEnt;
             } else {
               maxEntriesPerTeam = 1;
             }
          }
          
          newPrograms.push({
            id: Date.now().toString() + '-' + i,
            code: rawCode || undefined,
            name: rawName,
            type,
            category,
            isSongEvent,
            ...(maxParticipantsPerGroup !== undefined ? { maxParticipantsPerGroup } : {}),
            ...(maxEntriesPerTeam !== undefined ? { maxEntriesPerTeam } : {})
          });
        }
        
        if (newPrograms.length > 0) {
           let updatedPrograms = [...programs];
           newPrograms.forEach(np => {
              const existingIdx = updatedPrograms.findIndex(p => 
                (np.code && p.code?.toLowerCase() === np.code.toLowerCase()) || 
                (p.name.toLowerCase() === np.name.toLowerCase() && p.category === np.category)
              );
              if (existingIdx === -1) {
                 updatedPrograms.push(np);
              } else {
                 updatedPrograms[existingIdx] = {
                   ...updatedPrograms[existingIdx],
                   code: np.code || updatedPrograms[existingIdx].code,
                   name: np.name,
                   type: np.type,
                   category: np.category,
                   isSongEvent: np.isSongEvent,
                   ...(np.maxParticipantsPerGroup !== undefined ? { maxParticipantsPerGroup: np.maxParticipantsPerGroup } : {}),
                   ...(np.maxEntriesPerTeam !== undefined ? { maxEntriesPerTeam: np.maxEntriesPerTeam } : {})
                 };
              }
           });
           saveAndSetPrograms(updatedPrograms);
           showToast(`Successfully imported/updated ${newPrograms.length} programs!`, 'success');
        } else {
           showToast('No valid programs found in the file.', 'error');
        }
      } catch (err) {
        console.error("Error parsing excel:", err);
        showToast('Failed to parse Excel file. Ensure it is a valid .xlsx file.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    if (programExcelFileInputRef.current) {
        programExcelFileInputRef.current.value = '';
    }
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProgramName.trim()) {
      showToast('Please enter a competition name', 'error');
      return;
    }
    if (!formProgramCode.trim()) {
      showToast('Please enter a competition code', 'error');
      return;
    }
    const newProgram: Program = {
      id: Date.now().toString(),
      code: formProgramCode.trim(),
      name: formProgramName.trim(),
      type: formProgramType,
      category: formProgramCategory,
      isSongEvent: formProgramIsSongEvent,
      ...(formProgramCategory === 'General' && { 
          maxParticipantsPerGroup: formProgramMaxParticipants,
          maxEntriesPerTeam: formProgramMaxEntries
      })
    };
    saveAndSetPrograms([...programs, newProgram]);
    setFormProgramName('');
    setFormProgramCode('');
    setFormProgramMaxParticipants(5);
    setFormProgramMaxEntries(1);
    setFormProgramIsSongEvent(false);
    showToast('Competition added successfully!', 'success');
  };

  const handleScheduleProgramInputChange = (val: string) => {
    setScheduleProgramCodeInput(val);
    const trimmed = val.trim().toUpperCase();
    if (!trimmed) {
      setScheduleSelectedProgramId('');
      setScheduleDate('');
      setScheduleTime('');
      setScheduleStage('Stage 1');
      return;
    }

    const prog = programs.find(p => 
      (p.code && p.code.toUpperCase() === trimmed) ||
      (p.code && ('P' + p.code.replace(/^P/i, '')).toUpperCase() === trimmed) ||
      p.id.toUpperCase() === trimmed ||
      p.name.toUpperCase() === trimmed ||
      p.name.toUpperCase().includes(trimmed)
    );

    if (prog) {
      setScheduleSelectedProgramId(prog.id);
      setScheduleDate(prog.date || '');
      setScheduleTime(prog.time || '');
      setScheduleStage(prog.stage || 'Stage 1');
    } else {
      setScheduleSelectedProgramId('');
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleSelectedProgramId) {
      showToast('Please enter a valid Programme Code or Name to schedule', 'error');
      return;
    }
    const updatedPrograms = programs.map(p => {
      if (p.id === scheduleSelectedProgramId) {
        return { 
          ...p, 
          date: scheduleDate, 
          time: scheduleTime,
          stage: p.type === 'Stage' ? (scheduleStage || 'Stage 1') : undefined
        };
      }
      return p;
    });
    saveAndSetPrograms(updatedPrograms);
    showToast('Programme schedule updated successfully!', 'success');
  };

  const handleDeleteProgram = (id: string) => {
    const progToDelete = programs.find(p => p.id === id);
    if (!progToDelete) return;

    // 1. Remove program from programs list
    const updatedPrograms = programs.filter(p => p.id !== id);
    saveAndSetPrograms(updatedPrograms);

    // 2. Remove all registrations associated with this program
    const updatedRegs = registrations.filter(r => r.programId !== id);
    if (updatedRegs.length !== registrations.length) {
      saveAndSetRegistrations(updatedRegs);
    }

    // 3. Remove all song registrations associated with this program
    const updatedSongRegs = songRegistrations.filter(r => r.programId !== id);
    if (updatedSongRegs.length !== songRegistrations.length) {
      saveAndSetSongRegistrations(updatedSongRegs);
    }

    // 4. Clean up print & simulator published program selections
    saveAndSetPrintProgramIds(prev => prev.filter(pId => pId !== id));
    saveAndSetSimPublishedProgramIds(prev => prev.filter(pId => pId !== id));

    // 5. Clean up results & points associated with this program from all students
    const updatedStudents = students.map(st => {
      const hasResult = st.programResults?.some(r => {
        if (r.programId) return r.programId === id;
        return r.programName === progToDelete.name && (st.category === progToDelete.category || progToDelete.category === 'General' || st.category === 'General');
      }) || (st.event === progToDelete.name && (st.category === progToDelete.category || progToDelete.category === 'General' || st.category === 'General'));

      if (hasResult) {
        const filteredResults = (st.programResults || []).filter(r => {
          if (r.programId) return r.programId !== id;
          return !(r.programName === progToDelete.name && (st.category === progToDelete.category || progToDelete.category === 'General' || st.category === 'General'));
        });

        const totalPts = filteredResults.reduce((sum, r) => sum + (r.points || 0), 0);
        const isEventMatch = st.event === progToDelete.name && (st.category === progToDelete.category || progToDelete.category === 'General' || st.category === 'General');

        return {
          ...st,
          programResults: filteredResults,
          points: totalPts,
          ...(isEventMatch ? { event: '', rank: 0, grade: '' } : {})
        };
      }
      return st;
    }).filter(st => {
      // Remove dummy TEAM- students if their programResults become empty after deleting this program
      if (st.code.startsWith('TEAM-') && (!st.programResults || st.programResults.length === 0)) {
        return false;
      }
      return true;
    });

    saveAndSetStudents(updatedStudents);
    showToast(`Programme "${progToDelete.name}" deleted along with registrations & results`, 'success');
  };

  // --- TOAST HELPER ---
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- SCORES AND STATS GENERATORS ---
  type PublishContext = 'admin' | 'dashboard' | 'public';

  const calculateStudentPoints = (student: StudentResult, context: PublishContext): number => {
    if (student.code.startsWith('TEAM-') || student.category === 'General') {
      return 0;
    }
    if (!student.programResults || student.programResults.length === 0) {
      if (student.event) {
        const prog = programs.find(p => p.name === student.event);
        if (!prog || prog.category === 'General') return 0;
      }
      return context === 'admin' ? (Number(student.points) || 0) : 0;
    }

    return student.programResults.reduce((sum, r) => {
      const prog = r.programId ? programs.find(p => p.id === r.programId) : programs.find(p => p.name === r.programName && (p.category === student.category || p.category === 'General' || student.category === 'General'));
      if (!prog || prog.category === 'General') {
        return sum; // Do not add missing or General program points to individual personal score
      }

      if (context === 'admin') {
        return sum + (r.points || 0);
      }

      const isPublished = context === 'dashboard' ? prog.isDashboardPublished : prog.isResultPublished;
      if (isPublished) {
        return sum + (r.points || 0);
      }
      return sum;
    }, 0);
  };

  const getTeamScore = (team: TeamName, context: PublishContext = 'admin'): number => {
    return students
      .filter(s => s.team.toLowerCase() === team.toLowerCase())
      .reduce((sum, s) => {
        if (s.code.startsWith('TEAM-') || s.category === 'General') {
          if (!s.programResults) return sum;
          const genPts = s.programResults.reduce((rSum, r) => {
            const prog = r.programId ? programs.find(p => p.id === r.programId) : programs.find(p => p.name === r.programName && (p.category === s.category || p.category === 'General' || s.category === 'General'));
            if (!prog) return rSum;

            if (context === 'admin') return rSum + (r.points || 0);

            const isPublished = context === 'dashboard' ? prog.isDashboardPublished : prog.isResultPublished;
            return isPublished ? rSum + (r.points || 0) : rSum;
          }, 0);
          return sum + genPts;
        }
        return sum + calculateStudentPoints(s, context);
      }, 0);
  };

  const getCategoryRank = (team: TeamName, category: CategoryName, context: PublishContext = 'admin'): number => {
    if (category === 'General') {
      return students
        .filter(s => s.team.toLowerCase() === team.toLowerCase())
        .reduce((sum, s) => {
          if (!s.programResults || s.programResults.length === 0) return sum;
          return sum + s.programResults.reduce((rSum, r) => {
            const prog = r.programId ? programs.find(p => p.id === r.programId) : programs.find(p => p.name === r.programName && (p.category === s.category || p.category === 'General' || s.category === 'General'));
            if (!prog || prog.category !== 'General') return rSum;

            if (context === 'admin') {
              return rSum + (r.points || 0);
            }
            const isPublished = context === 'dashboard' ? prog.isDashboardPublished : prog.isResultPublished;
            return isPublished ? rSum + (r.points || 0) : rSum;
          }, 0);
        }, 0);
    }

    return students
      .filter(s => s.team.toLowerCase() === team.toLowerCase() && s.category === category)
      .reduce((sum, s) => sum + calculateStudentPoints(s, context), 0);
  };

  // --- SEARCH AND ROUTING ---
  const handleGlobalSearch = (val: string) => {
    setGlobalSearch(val);
    if (val.trim() !== '') {
      setActiveTab('program');
      setStudentSearchQuery(val);
    }
  };

  // --- ADMIN FUNCTIONS ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === systemAdminPassword) {
      setIsAdminLoggedIn(true);
      setAdminError('');
      showToast('Admin login successful!', 'success');
    } else {
      setAdminError('Incorrect password! Please try again.');
      showToast('Login failed!', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminPassword('');
    showToast('Admin logged out.');
  };

  // Pre-populate student data for editing
  const startEditStudent = (student: StudentResult) => {
    setEditingCode(student.code);
    setFormCode(student.code);
    setFormName(student.name);
    setFormTeam(student.team as TeamName);
    setFormCategory(student.category as CategoryName);
    setFormClass(student.class);
    setFormEvent(student.event);
    setFormRank(student.rank);
    setFormGrade(student.grade);
    setFormPoints(student.points);
    


    // Switch tab to student details
    setAdminTab('student_details');
    
    // Scroll form into view gently
    setTimeout(() => {
      const adminFormEl = document.getElementById('admin-form-anchor');
      if (adminFormEl) {
        adminFormEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    showToast(`Editing Details for ${student.name}`);
  };

  const startEditResult = (student: StudentResult, prefillEvent?: string, prefillResult?: any) => {
    setEditingCode(student.code);
    setFormCode(student.code);
    setFormName(student.name);
    setFormTeam(student.team as TeamName);
    setFormResultCategory((student.category as CategoryName) || 'General');
    
    if (prefillEvent) {
      const prog = programs.find(p => p.name === prefillEvent);
      if (prog) {
        setResultPublishProgramId(prog.id);
      }
      setFormEvent(prefillEvent);
      if (prefillResult) {
        setFormRank(prefillResult.rank || 0);
        setFormGrade(prefillResult.grade || '');
        setFormPoints(prefillResult.points || 0);
      } else if (student.event === prefillEvent) {
        setFormRank(student.rank || 0);
        setFormGrade(student.grade || '');
        setFormPoints(student.points || 0);
      }
    } else {
      setResultPublishProgramId('');
      setFormEvent('');
      setFormRank(0);
      setFormGrade('');
      setFormPoints(0);
    }
    
    // Switch tab to result publishing
    setAdminTab('result_publishing');
    
    // Scroll form into view gently
    setTimeout(() => {
      const adminFormEl = document.getElementById('admin-form-anchor');
      if (adminFormEl) {
        adminFormEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    showToast(`Publishing Result for ${student.name}`);
  };

  // Reset form
  const resetForm = () => {
    setEditingCode(null);
    setFormCode('');
    setFormName('');
    setFormTeam('Yaqoot');
    setFormCategory('Senior');
    setFormClass('');
    setFormEvent('');
    setFormRank(1);
    setFormGrade('A');
    setFormPoints(0);
    setResultPublishProgramId('');
  };

  const handleStudentExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Read everything as raw array of arrays
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const newStudents: StudentResult[] = [];
        
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;
          
          let rawCode = String(row[0] || '').trim().toUpperCase();
          let rawName = String(row[1] || '').trim();
          let rawClass = String(row[2] || '').trim();
          let rawTeam = String(row[3] || '').trim();
          
          if (!rawCode || !rawName) continue;
          
          let team: TeamName = normalizeTeamName(rawTeam);
          if (!rawTeam) {
            const inferred = getTeamFromChestNumber(rawCode);
            if (inferred) team = inferred;
          }
          
          let category: ProgramCategory = 'General';
          const classNum = parseInt(rawClass, 10);
          if (!isNaN(classNum)) {
            if (classNum >= 1 && classNum <= 3) {
              category = 'Sub Junior';
            } else if (classNum >= 4 && classNum <= 5) {
              category = 'Senior';
            } else if (classNum >= 6 && classNum <= 8) {
              category = 'Super Senior';
            }
          }
          
          newStudents.push({
            code: rawCode,
            name: rawName,
            team: team,
            category: category,
            class: rawClass || 'N/A',
            event: '',
            rank: 0,
            grade: '',
            points: 0,
            programResults: []
          });
        }
        
        let updatedList = [...students];
        let addedCount = 0;
        let skippedCount = 0;
        
        newStudents.forEach(newStud => {
          const exists = updatedList.find(s => s.code === newStud.code);
          if (!exists) {
            updatedList.push(newStud);
            addedCount++;
          } else {
            skippedCount++;
          }
        });
        
        if (addedCount > 0) {
            persistToFirestore({ students: updatedList });
            showToast(`Imported ${addedCount} students successfully.${skippedCount > 0 ? ` Skipped ${skippedCount} duplicates.` : ''}`, 'success');
        } else if (skippedCount > 0) {
            showToast(`No new students added. Skipped ${skippedCount} duplicates.`, 'error');
        } else {
            showToast(`No valid student data found in the Excel file.`, 'error');
        }
        
      } catch (err) {
        console.error("Error parsing excel:", err);
        showToast('Failed to parse Excel file. Ensure it is a valid .xlsx file.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    if (studentExcelFileInputRef.current) {
        studentExcelFileInputRef.current.value = '';
    }
  };

  // Add or update student
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      showToast('Chess No. and Name are required!', 'error');
      return;
    }

    let updatedList: StudentResult[] = [];
    const existingCodeMatch = editingCode ? students.find(s => s.code.toUpperCase() === editingCode.toUpperCase()) : null;
    const existingCodeMatchByForm = students.find(s => s.code.toUpperCase() === formCode.trim().toUpperCase());
    
    if (!editingCode && existingCodeMatchByForm) {
      showToast('A student with this Code already exists!', 'error');
      return;
    }
    
    if (editingCode && existingCodeMatchByForm && existingCodeMatchByForm.code.toUpperCase() !== editingCode.toUpperCase()) {
      showToast('Another student with this Code already exists!', 'error');
      return;
    }

    const existingStudent = existingCodeMatch || existingCodeMatchByForm;

    const newResult: StudentResult = {
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      team: formTeam,
      category: formCategory,
      class: formClass.trim() || 'N/A',
      event: existingStudent?.event || '',
      rank: existingStudent?.rank || 0,
      grade: existingStudent?.grade || '',
      points: existingStudent?.points || 0,
      programResults: existingStudent?.programResults || []
    };

    if (editingCode) {
      // Editing existing student by tracking editingCode
      updatedList = students.map(s => s.code.toUpperCase() === editingCode.toUpperCase() ? newResult : s);
      showToast('Information successfully updated!');
    } else {
      // Create new
      updatedList = [...students, newResult];
      showToast('New student information successfully added!');
    }

    saveAndSetStudents(updatedList);
    resetForm();
  };


  const calculatePoints = (category: string, rank: number, grade: string) => {
    let rankPts = 0;
    if (category === 'General') {
      if (rank === 1) rankPts = 10;
      else if (rank === 2) rankPts = 8;
      else if (rank === 3) rankPts = 6;
    } else {
      if (rank === 1) rankPts = 5;
      else if (rank === 2) rankPts = 3;
      else if (rank === 3) rankPts = 1;
    }
    let gradePts = 0;
    if (grade === 'A') gradePts = 5;
    else if (grade === 'B') gradePts = 3;
    else if (grade === 'C') gradePts = 1;
    return rankPts + gradePts;
  };

  const handlePublishResults = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProgram = programs.find(p => p.id === resultPublishProgramId);
    if (!selectedProgram) {
      showToast('Invalid Programme Code', 'error');
      return;
    }

    let updatedStudents = [...students];
    let processedCodes = new Set<string>();

    for (const entry of resultPublishEntries) {
      if (!entry.code.trim()) continue;
      
      let targetCode = entry.code.trim().toUpperCase();
      let targetName = "";
      let targetTeam = "";
      let targetCategory = "";
      let targetClass = "";

      const progRegs = registrations.filter(r => r.programId === selectedProgram.id);
      const registeredStudentCodes = new Set([
        ...progRegs.map(r => r.studentCode.toUpperCase()),
        ...students.filter(s => s.event === selectedProgram.name && (s.category === selectedProgram.category || selectedProgram.category === 'General' || s.category === 'General')).map(s => s.code.toUpperCase())
      ]);

      if (selectedProgram.category === 'General') {
        let student = students.find(s => s.code.toUpperCase() === targetCode);
        if (student) {
          targetTeam = student.team;
        } else {
          const matchedTeam = TEAMS.find(t => t.toLowerCase() === targetCode.toLowerCase());
          if (matchedTeam) {
            targetTeam = matchedTeam;
          } else {
            showToast(`Student/Team ${entry.code} not found!`, 'error');
            return;
          }
        }
        
        targetCode = `TEAM-${targetTeam}`;
        targetName = targetTeam;
        targetCategory = 'General';
        targetClass = 'N/A';
      } else {
        const student = students.find(s => s.code.toUpperCase() === targetCode);
        if (!student) {
          showToast(`Student with code ${entry.code} not found!`, 'error');
          return;
        }

        if (registeredStudentCodes.size > 0 && !registeredStudentCodes.has(targetCode)) {
          showToast(`Student ${student.name} (${entry.code}) is NOT registered for ${selectedProgram.name}!`, 'error');
          return;
        }

        targetName = student.name;
        targetTeam = student.team;
        targetCategory = student.category;
        targetClass = student.class;
      }

      processedCodes.add(targetCode.toUpperCase());

      let targetRecord = updatedStudents.find(s => s.code.toUpperCase() === targetCode.toUpperCase());
      
      if (!targetRecord) {
        if (selectedProgram.category === 'General') {
          targetRecord = {
            code: targetCode,
            name: targetName,
            team: targetTeam,
            category: 'General',
            class: 'N/A',
            event: 'General Events',
            rank: 0,
            grade: '',
            points: 0,
            programResults: []
          };
          updatedStudents.push(targetRecord);
        } else {
          continue; 
        }
      }

      const pts = calculatePoints(selectedProgram.category, entry.rank, entry.grade);
      const newResult = {
        programId: selectedProgram.id,
        programName: selectedProgram.name,
        rank: entry.rank,
        grade: entry.grade,
        points: pts
      };

      const existingResults = targetRecord.programResults || [];
      const filteredResults = existingResults.filter(r => {
        if (r.programId) return r.programId !== selectedProgram.id;
        return !(r.programName === selectedProgram.name && (targetCategory === selectedProgram.category || selectedProgram.category === 'General' || targetCategory === 'General'));
      });
      filteredResults.push(newResult);

      const totalPts = filteredResults.reduce((sum, r) => sum + r.points, 0);

      const recordIndex = updatedStudents.findIndex(s => s.code.toUpperCase() === targetRecord!.code.toUpperCase());
      updatedStudents[recordIndex] = {
        ...targetRecord,
        programResults: filteredResults,
        points: totalPts,
        ...(targetRecord.event === selectedProgram.name ? { event: '', rank: 0, grade: '' } : {})
      };
    }

    updatedStudents = updatedStudents.map(st => {
      const hasResult = st.programResults?.some(r => {
        if (r.programId) return r.programId === selectedProgram.id;
        return r.programName === selectedProgram.name && (st.category === selectedProgram.category || selectedProgram.category === 'General' || st.category === 'General');
      }) || (st.event === selectedProgram.name && (st.category === selectedProgram.category || selectedProgram.category === 'General' || st.category === 'General'));
      if (hasResult && !processedCodes.has(st.code.toUpperCase())) {
         const filtered = (st.programResults || []).filter(r => {
           if (r.programId) return r.programId !== selectedProgram.id;
           return !(r.programName === selectedProgram.name && (st.category === selectedProgram.category || selectedProgram.category === 'General' || st.category === 'General'));
         });
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === selectedProgram.name ? { rank: 0, grade: '' } : {})
         };
      }
      return st;
    });

    saveAndSetStudents(updatedStudents);
    showToast('Results saved successfully!', 'success');
  };

  const [confirmDeleteProgramId, setConfirmDeleteProgramId] = useState<string | null>(null);
  const [confirmSingleDeleteId, setConfirmSingleDeleteId] = useState<string | null>(null);

  const handleDeleteSingleResult = (studentCode: string, programName: string) => {
    const id = `${studentCode}_${programName}`;
    if (confirmSingleDeleteId !== id) {
      setConfirmSingleDeleteId(id);
      setTimeout(() => setConfirmSingleDeleteId(null), 3000);
      return;
    }
    setConfirmSingleDeleteId(null);
    
    const updatedStudents = students.map(st => {
      if (st.code.toUpperCase() === studentCode.toUpperCase()) {
         const filtered = (st.programResults || []).filter(r => r.programName !== programName);
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === programName ? { rank: 0, grade: '' } : {})
         };
      }
      return st;
    });
    saveAndSetStudents(updatedStudents);
    showToast(`Result deleted for ${studentCode}`, 'success');
  };

  const handleDeleteProgramResults = () => {
    const selectedProgram = programs.find(p => p.id === resultPublishProgramId);
    if (!selectedProgram) {
      showToast('Invalid Programme Code', 'error');
      return;
    }

    if (confirmDeleteProgramId !== selectedProgram.id) {
      setConfirmDeleteProgramId(selectedProgram.id);
      setTimeout(() => setConfirmDeleteProgramId(null), 3000);
      return;
    }

    const updatedStudents = students.map(st => {
      const hasResult = st.programResults?.some(r => {
        if (r.programId) return r.programId === selectedProgram.id;
        return r.programName === selectedProgram.name && (st.category === selectedProgram.category || selectedProgram.category === 'General' || st.category === 'General');
      }) || (st.event === selectedProgram.name && (st.category === selectedProgram.category || selectedProgram.category === 'General' || st.category === 'General'));
      if (hasResult) {
         const filtered = (st.programResults || []).filter(r => {
           if (r.programId) return r.programId !== selectedProgram.id;
           return !(r.programName === selectedProgram.name && (st.category === selectedProgram.category || selectedProgram.category === 'General' || st.category === 'General'));
         });
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === selectedProgram.name ? { rank: 0, grade: '' } : {})
         };
      }
      return st;
    });
    
    const updatedPrograms = programs.map(p => p.id === selectedProgram.id ? { ...p, isResultPublished: false, isDashboardPublished: false } : p);

    saveAndSetStudents(updatedStudents);
    saveAndSetPrograms(updatedPrograms);
    setResultPublishEntries([{ id: Date.now().toString(), code: '', rank: 0, grade: '' }]);
    setConfirmDeleteProgramId(null);
    showToast(`Deleted all results for ${selectedProgram.name}`, 'success');
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = formResultCategory === 'General' ? 'TEAM-' + formTeam + (formResultEntryIndex > 1 ? `-${formResultEntryIndex}` : '') : formCode;

    if (!finalCode.trim() || !formEvent.trim()) {
      showToast('Please provide Code/Team and enter the Event Name!', 'error');
      return;
    }
    
    // Find the student
    let existingStudent = students.find(s => s.code.toUpperCase() === finalCode.trim().toUpperCase());
    
    if (formResultCategory === 'General' && !existingStudent) {
       existingStudent = {
         code: finalCode,
         name: formTeam + ' Group' + (formResultEntryIndex > 1 ? ` ${formResultEntryIndex}` : ''),
         team: formTeam,
         category: 'General',
         class: 'N/A',
         event: 'General Events',
         rank: 0,
         grade: '',
         points: 0,
         programResults: []
       };
    } else if (!existingStudent) {
      showToast('Student not found. Please add them in Student Details first.', 'error');
      return;
    }

    const selectedProgram = programs.find(p => p.name === formEvent.trim());
    
    const newProgramResult: any = {
      programName: formEvent.trim(),
      rank: Number(formRank) || 0,
      grade: formGrade.trim().toUpperCase() || '',
      points: Number(formPoints) || 0
    };
    if (selectedProgram) {
      newProgramResult.programId = selectedProgram.id;
    }

    const existingResults = existingStudent.programResults || [];
    const existingIndex = existingResults.findIndex(r => (r.programId && selectedProgram ? r.programId === selectedProgram.id : r.programName === formEvent.trim()));
    
    let newResultsList;
    if (existingIndex >= 0) {
       newResultsList = [...existingResults];
       newResultsList[existingIndex] = newProgramResult;
    } else {
       newResultsList = [...existingResults, newProgramResult];
    }
    
    const totalPoints = newResultsList.reduce((sum, r) => sum + r.points, 0);

    const updatedResult: StudentResult = {
      ...existingStudent,
      points: totalPoints,
      programResults: newResultsList,
      ...(existingStudent.event === formEvent.trim() ? { event: '', rank: 0, grade: '' } : {})
    };

    let updatedList;
    if (!students.some(s => s.code.toUpperCase() === updatedResult.code.toUpperCase())) {
      updatedList = [...students, updatedResult];
    } else {
      updatedList = students.map(s => s.code.toUpperCase() === updatedResult.code.toUpperCase() ? updatedResult : s);
    }
    saveAndSetStudents(updatedList);
    showToast('Result published successfully!', 'success');
    resetForm();
  };

  // Delete student entry
  const handleDeleteStudent = (codeToDelete: string) => {
    deleteStudentCascading(codeToDelete);
  };

  // Export data as JSON file
  const handleExportData = () => {
    const dataStr = JSON.stringify(students, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sargam_art_fest_data_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data download successful!');
  };

  // Trigger file upload dialog
  const triggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file import
  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const allowedTeams = TEAMS;
        
        let headerRowIndex = -1;
        let colMap: Record<string, number> = {};
        
        // Find header row
        for (let i = 0; i < Math.min(rawData.length, 10); i++) {
          const row = rawData[i];
          if (!row) continue;
          
          const rowStr = row.map(cell => String(cell || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
          
          if (rowStr.some(c => c.includes('name') || c.includes('student')) && 
              (rowStr.some(c => c.includes('code') || c.includes('class') || c.includes('team')))) {
            headerRowIndex = i;
            rowStr.forEach((cell, idx) => {
              if (cell) colMap[cell] = idx;
            });
            break;
          }
        }
        
        const getIdx = (possibleKeys: string[]) => {
          for (const pk of possibleKeys) {
            for (const key in colMap) {
              if (key.includes(pk)) return colMap[key];
            }
          }
          return -1;
        };
        
        const nameIdx = getIdx(['name', 'student']);
        const codeIdx = getIdx(['code', 'chest', 'id', 'admno']);
        const teamIdx = getIdx(['team', 'group', 'house']);
        const classIdx = getIdx(['class', 'grade', 'std']);
        const catIdx = getIdx(['category', 'cat']);
        const eventIdx = getIdx(['event', 'program', 'item']);
        const rankIdx = getIdx(['rank', 'pos']);
        const gradeIdx = getIdx(['grade', 'score']);
        const pointsIdx = getIdx(['point', 'mark']);
        
        const newStudents = [];
        const startIndex = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;
        
        for (let i = startIndex; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;
          
          // If we couldn't find headers, try to guess based on content if it has at least 3 columns
          let rawName = nameIdx >= 0 ? String(row[nameIdx] || '') : String(row[0] || '');
          let rawCode = codeIdx >= 0 ? String(row[codeIdx] || '') : String(row[1] || '');
          let rawTeam = teamIdx >= 0 ? String(row[teamIdx] || '') : String(row[2] || '');
          let rawClass = classIdx >= 0 ? String(row[classIdx] || '') : String(row[3] || '');
          let rawCategory = catIdx >= 0 ? String(row[catIdx] || '') : '';
          let rawEvent = eventIdx >= 0 ? String(row[eventIdx] || '') : '';
          let rawRank = rankIdx >= 0 ? String(row[rankIdx] || '') : '0';
          let rawGrade = gradeIdx >= 0 ? String(row[gradeIdx] || '') : '';
          let rawPoints = pointsIdx >= 0 ? String(row[pointsIdx] || '') : '0';
          
          if (!rawName || rawName.trim() === '') continue;
          
          if (!rawCode) {
            rawCode = `STU-${Math.floor(Math.random() * 10000)}-${i}`;
          }
          
          let classNum = parseInt(rawClass, 10);
          let autoCategory = '';
          if (!isNaN(classNum)) {
            if (classNum >= 1 && classNum <= 3) autoCategory = 'Sub Junior';
            else if (classNum >= 4 && classNum <= 5) autoCategory = 'Senior';
            else if (classNum >= 6 && classNum <= 8) autoCategory = 'Super Senior';
          }
          
          let matchedTeam = normalizeTeamName(rawTeam);
          if (!rawTeam) {
            const inferred = getTeamFromChestNumber(rawCode);
            if (inferred) matchedTeam = inferred;
          }
          
          newStudents.push({
            code: rawCode.trim(),
            name: rawName.trim(),
            team: matchedTeam || 'Unknown',
            category: autoCategory || rawCategory.trim() || 'Unknown',
            class: rawClass.trim(),
            event: rawEvent.trim(),
            rank: parseInt(rawRank, 10) || 0,
            grade: rawGrade.trim(),
            points: parseInt(rawPoints, 10) || 0,
            programResults: []
          });
        }
        
        let jsonData = rawData; // for the error message
        
        if (newStudents.length > 0) {
          let updatedStudents = [...students];
          
          newStudents.forEach(newStudent => {
            const existingIndex = updatedStudents.findIndex(s => s.code.toUpperCase() === newStudent.code.toUpperCase());
            if (existingIndex >= 0) {
               const existing = updatedStudents[existingIndex];
               updatedStudents[existingIndex] = {
                 ...existing,
                 name: newStudent.name || existing.name,
                 team: newStudent.team !== 'Unknown' ? newStudent.team : existing.team,
                 category: newStudent.category !== 'Unknown' ? newStudent.category : existing.category,
                 class: newStudent.class || existing.class,
                 // Only overwrite event/rank/grade/points if the new student actually has them
                 event: newStudent.event || existing.event,
                 rank: newStudent.rank || existing.rank,
                 grade: newStudent.grade || existing.grade,
                 points: newStudent.points || existing.points,
                 programResults: existing.programResults
               };
            } else {
               updatedStudents.push(newStudent as any);
            }
          });

          saveAndSetStudents(updatedStudents);
          showToast(`Successfully imported ${newStudents.length} records!`, 'success');
        } else {
          console.error("Parsed JSON from Excel:", jsonData);
          const sample = jsonData.length > 0 ? JSON.stringify(jsonData.slice(0, 2)) : "Empty sheet";
          showToast(`Error: Could not parse Excel. Data looks like: ${sample.substring(0, 100)}...`, 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to read Excel file!', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          // simple validation of keys
          const isValid = json.every(item => 'code' in item && 'name' in item && 'team' in item && 'points' in item);
          if (isValid) {
            saveAndSetStudents(json);
            showToast('Data upload successful!', 'success');
          } else {
            showToast('Invalid file format!', 'error');
          }
        } else {
          showToast('Data must be a list!', 'error');
        }
      } catch (err) {
        showToast('Failed to read file!', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Reset to original factory defaults
  const handleResetToDefaults = () => {
    setClearConfirmState({ isOpen: true, action: 'reset', password: '', error: '' });
  };

  // Clear all data
  const handleClearAll = () => {
    setClearConfirmState({ isOpen: true, action: 'clearStudents', password: '', error: '' });
  };

  const handleClearAllPrograms = () => {
    setClearConfirmState({ isOpen: true, action: 'clearPrograms', password: '', error: '' });
  };

  const handleClearAllResults = () => {
    setClearConfirmState({ isOpen: true, action: 'clearResults', password: '', error: '' });
  };

  const handleClearAllNotifications = () => {
    setClearConfirmState({ isOpen: true, action: 'clearNotifications', password: '', error: '' });
  };
  
  const executeClearAction = () => {
    if (clearConfirmState.password !== systemAdminPassword) {
      setClearConfirmState(prev => ({ ...prev, error: 'Incorrect password.' }));
      return;
    }
    
    if (clearConfirmState.action === 'clearResults') {
      const updatedStudents = students
        .filter(s => !s.code.startsWith('TEAM-'))
        .map(s => ({
          ...s,
          event: '',
          rank: 0,
          grade: '',
          points: 0,
          programResults: []
        }));
      const updatedPrograms = programs.map(p => ({
        ...p,
        isResultPublished: false,
        isDashboardPublished: false
      }));
      saveAndSetStudents(updatedStudents);
      saveAndSetPrograms(updatedPrograms);
      saveAndSetSimPublishedProgramIds([]);
      showToast('All results cleared.', 'success');
    } else if (clearConfirmState.action === 'reset') {
      saveAndSetStudents(INITIAL_STUDENTS);
      saveAndSetRegistrations([]);
      saveAndSetSongRegistrations([]);
      showToast('Successfully reset to initial data.', 'success');
      resetForm();
    } else if (clearConfirmState.action === 'clearStudents') {
      saveAndSetStudents([]);
      saveAndSetRegistrations([]);
      saveAndSetSongRegistrations([]);
      showToast('All student data & registrations cleared.', 'success');
      resetForm();
    } else if (clearConfirmState.action === 'clearPrograms') {
      saveAndSetPrograms([]);
      saveAndSetRegistrations([]);
      saveAndSetSongRegistrations([]);
      saveAndSetPrintProgramIds([]);
      saveAndSetSimPublishedProgramIds([]);
      const cleanedStudents = students.map(s => ({
        ...s,
        event: '',
        rank: 0,
        grade: '',
        points: 0,
        programResults: []
      })).filter(s => !s.code.startsWith('TEAM-'));
      saveAndSetStudents(cleanedStudents);
      showToast('All programme data, registrations & results cleared.', 'success');
    } else if (clearConfirmState.action === 'clearNotifications') {
      saveAndSetNotifications([]);
      showToast('All notifications cleared from all user devices.', 'success');
    }
    setClearConfirmState({ isOpen: false, action: null, password: '', error: '' });
  };

  // --- DATA SORTED VIEWS ---
  // 1. Team scoring totals ranked desc
  const teamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, 'dashboard')
  })).sort((a, b) => b.score - a.score);

  const adminTeamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, 'admin')
  })).sort((a, b) => b.score - a.score);

  const publicTeamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, 'public')
  })).sort((a, b) => b.score - a.score);

  // 2. Category rankings array
  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'dashboard')
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  const publicCategoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'public')
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  const adminCategoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'admin')
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  // 3. Top 3 students globally
  const globalTopStudents = [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
    .filter(s => s.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const adminTopPerformersList = [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
    .filter(s => s.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  // 3.5 Top 3 students per category
  const topStudentsByCategory = useMemo(() => ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  }), [students]);

  const publicGlobalTopStudents = useMemo(() => [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, 'public') }))
    .filter(s => s.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10), [students]);

  const publicTopStudentsByCategory = useMemo(() => ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'public') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  }), [students]);

  // Memoized slides for Live Presentation Mode
  const liveSlides = useMemo(() => {
    const slides: {
      id: string;
      type: 'header' | 'team_score' | 'category_score' | 'top_overall' | 'top_category';
      duration: number;
      data?: any;
      title: string;
    }[] = [];

    // Phase 1: Header Banner Slide (5 seconds = 5000ms)
    slides.push({
      id: 'header-banner-slide',
      type: 'header',
      duration: 5000,
      title: 'Festival Banner'
    });

    // Phase 2: Team Total Scoring Cards (5 seconds per team = 5000ms each)
    publicTeamScoringList.forEach((team, idx) => {
      slides.push({
        id: `team-${team.name}`,
        type: 'team_score',
        duration: 5000,
        data: {
          team,
          rank: idx + 1,
          allTeams: publicTeamScoringList
        },
        title: `Team Score: ${team.name}`
      });
    });

    // Phase 3: Category Standings Tables (5 seconds per category = 5000ms each)
    publicCategoryRankData.forEach((catData) => {
      slides.push({
        id: `cat-${catData.category}`,
        type: 'category_score',
        duration: 5000,
        data: catData,
        title: `Category: ${catData.category}`
      });
    });

    // Phase 4: Top Individuals (5 seconds per section = 5000ms each)
    if (publicGlobalTopStudents.length > 0) {
      slides.push({
        id: 'top-overall',
        type: 'top_overall',
        duration: 5000,
        data: {
          title: 'TOP INDIVIDUALS',
          students: publicGlobalTopStudents.slice(0, 10)
        },
        title: 'TOP INDIVIDUALS'
      });
    }

    publicTopStudentsByCategory.forEach((catData) => {
      slides.push({
        id: `top-cat-${catData.category}`,
        type: 'top_category',
        duration: 5000,
        data: catData,
        title: `TOP INDIVIDUALS - ${catData.category}`
      });
    });

    return slides;
  }, [publicTeamScoringList, publicCategoryRankData, publicGlobalTopStudents, publicTopStudentsByCategory]);

  // Live Timer Effect
  useEffect(() => {
    if (!isLiveAnimationOpen || isLivePaused || liveSlides.length === 0) return;

    const currentSlide = liveSlides[liveSlideIndex % liveSlides.length];
    const duration = currentSlide?.duration || 2000;

    const timer = setTimeout(() => {
      setLiveSlideIndex((prevIndex) => (prevIndex + 1) % liveSlides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [isLiveAnimationOpen, isLivePaused, liveSlideIndex, liveSlides]);

  // 3.6 Top 3 students per class
  const distinctClasses = useMemo(() => Array.from(new Set(students.map(s => s.class).filter(c => c && c !== 'N/A' && c.trim() !== '')) as Set<string>).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB) && numA.toString() === a.trim() && numB.toString() === b.trim()) {
        return numA - numB;
    }
    return a.localeCompare(b);
  }), [students]);

  const topStudentsByClass = useMemo(() => distinctClasses.map(cls => {
    return {
      className: cls,
      students: students
        .filter(s => s.class === cls && !s.code.startsWith('TEAM-'))
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  }).filter(c => c.students.length > 0), [distinctClasses, students]);

  const publicTopStudentsByClass = useMemo(() => distinctClasses.map(cls => {
    return {
      className: cls,
      students: students
        .filter(s => s.class === cls && !s.code.startsWith('TEAM-'))
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'public') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  }).filter(c => c.students.length > 0), [distinctClasses, students]);

  // 4. Student individual results filter & fast lookup maps
  const registrationsByStudentCode = useMemo(() => {
    const validStudentCodes = new Set(students.map(s => s.code.toUpperCase()));
    const map: Record<string, {id: string, programId: string, studentCode: string}[]> = {};
    registrations.forEach(r => {
      const code = r.studentCode.toUpperCase();
      if (validStudentCodes.has(code)) {
        if (!map[code]) map[code] = [];
        map[code].push(r);
      }
    });
    return map;
  }, [registrations, students]);

  const programsMap = useMemo(() => {
    const byId = new Map<string, Program>();
    const byNameCat = new Map<string, Program>();
    programs.forEach(p => {
      byId.set(p.id, p);
      byNameCat.set(`${p.name}___${p.category}`, p);
    });
    return { byId, byNameCat };
  }, [programs]);

  const teamDummyStudentsMap = useMemo(() => {
    const map: Record<string, StudentResult> = {};
    students.forEach(ts => {
      if (ts.code.startsWith('TEAM-') || ts.category === 'General') {
        map[ts.team.toLowerCase()] = ts;
      }
    });
    return map;
  }, [students]);

  const filteredStudents = useMemo(() => {
    const validStudents = students.filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General');
    if (studentSearchQuery.trim() === '') {
      return validStudents.slice(0, 20);
    }
    const q = studentSearchQuery.toLowerCase();
    return validStudents.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q) ||
      s.event.toLowerCase().includes(q) ||
      s.team.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [students, studentSearchQuery]);

  // Calculate available programs for the result publishing form
  const finalCodeCalc = useMemo(() => formResultCategory === 'General' ? 'TEAM-' + formTeam + (formResultEntryIndex > 1 ? `-${formResultEntryIndex}` : '') : formCode, [formResultCategory, formTeam, formResultEntryIndex, formCode]);
  const existingStudentCalc = students.find(s => s.code.toUpperCase() === finalCodeCalc.trim().toUpperCase());
  const existingProgramIds = existingStudentCalc?.programResults?.map(r => r.programId).filter(Boolean) as string[] || [];
  const existingProgramNames = existingStudentCalc?.programResults?.filter(r => !r.programId).map(r => r.programName) || [];

  // Global memoized data for fast rendering
  const globalProgramsData = useMemo(() => {
    const validStudentCodes = new Set(students.map(s => s.code.toUpperCase()));
    const regCount: Record<string, number> = {};
    registrations.forEach(r => {
      if (validStudentCodes.has(r.studentCode.toUpperCase())) {
        regCount[r.programId] = (regCount[r.programId] || 0) + 1;
      }
    });

    const progScorers: Record<string, { name: string, team: string, points: number, rank: number, class?: string, grade?: string, studentCode: string }[]> = {};
    students.forEach(s => {
      if (s.programResults) {
        s.programResults.forEach(r => {
          if (r.rank > 0 || r.grade || r.points > 0) {
            const progObj = r.programId ? programs.find(p => p.id === r.programId) : programs.find(p => p.name === r.programName && (p.category === s.category || p.category === 'General' || s.category === 'General'));
            const targetProgId = progObj?.id || r.programId;
            if (targetProgId) {
              if (!progScorers[targetProgId]) progScorers[targetProgId] = [];
              const isGen = progObj?.category === 'General' || s.category === 'General' || s.code.startsWith('TEAM-');
              progScorers[targetProgId].push({ 
                name: isGen ? (s.code.startsWith('TEAM-') ? s.name : s.team) : s.name, 
                team: s.team, 
                points: r.points, 
                rank: r.rank,
                class: isGen ? 'N/A' : s.class,
                grade: r.grade,
                studentCode: isGen ? (s.code.startsWith('TEAM-') ? s.code : s.team) : s.code
              });
            }
          }
        });
      }
    });
    
    // Also build a set of published program ids & names globally
    const publishedProgramIds = new Set<string>();
    const publishedProgramNames = new Set<string>();
    students.forEach(st => {
      st.programResults?.forEach(r => {
        if (r.rank > 0 || r.grade) {
          if (r.programId) publishedProgramIds.add(r.programId);
          else publishedProgramNames.add(r.programName);
        }
      });
      if (st.event && (st.rank > 0 || st.grade)) {
        publishedProgramNames.add(st.event);
      }
    });

    return { regCount, progScorers, publishedProgramIds, publishedProgramNames };
  }, [registrations, students]);

  
  let availablePrograms: Program[] = [];
  if (formResultCategory === 'General') {
    const teamRegs = registrations.filter(r => {
      const st = students.find(s => s.code.toUpperCase() === r.studentCode.toUpperCase());
      const regEntryIndex = (r as any).entryIndex || 1;
      return st?.team === formTeam && regEntryIndex === formResultEntryIndex;
    });
    const registeredProgramIds = Array.from(new Set(teamRegs.map(r => r.programId)));
    availablePrograms = programs.filter(p => p.category === 'General' && registeredProgramIds.includes(p.id) && (!(existingProgramIds.includes(p.id) || existingProgramNames.includes(p.name)) || p.name === formEvent));
  } else if (formCode) {
    const studentRegs = registrations.filter(r => r.studentCode.toUpperCase() === formCode.toUpperCase());
    const registeredProgramIds = studentRegs.map(r => r.programId);
    availablePrograms = programs.filter(p => p.category === formResultCategory && registeredProgramIds.includes(p.id) && (!(existingProgramIds.includes(p.id) || existingProgramNames.includes(p.name)) || p.name === formEvent));
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#050302] overflow-hidden">
      {/* --- VIEW MODE TOGGLE --- */}
      {/* --- VIEW MODE TOGGLE --- */}
      {!isLiveAnimationOpen && (
        <div className="print:hidden bg-[#110a04] border-b border-amber-900/30 py-1.5 px-3 sm:px-4 flex flex-shrink-0 justify-between items-center text-xs font-semibold z-[100] w-full shadow-md gap-2">
          {/* Left Side: Reload & LIVE */}
          <div className="flex gap-1.5 sm:gap-2 items-center shrink-0">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-amber-500/80 hover:text-amber-300 hover:bg-amber-500/10 transition-all border border-amber-500/20 text-xs shrink-0 cursor-pointer"
              title="Reload"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload</span>
            </button>
            <button
              id="live-mode-btn"
              onClick={() => {
                setLiveSlideIndex(0);
                setIsLiveControlsOpen(false);
                setIsLiveAnimationOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black transition-all border border-red-400/50 shadow-[0_0_12px_rgba(239,68,68,0.4)] cursor-pointer text-xs shrink-0"
              title="Live Stream View"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Tv className="w-3.5 h-3.5 text-white" />
              <span className="tracking-wide uppercase">LIVE</span>
            </button>
          </div>

          {/* Right Side: Notification Bell (Icon only) + PC View & Phone View */}
          <div className="flex gap-1.5 sm:gap-2 items-center shrink-0">
            {/* NOTIFICATION BELL ICON ONLY - Placed between LIVE and PC View */}
            <button
              onClick={() => {
                setIsNotificationModalOpen(true);
              }}
              className="relative p-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all border border-amber-500/30 cursor-pointer font-bold flex items-center justify-center shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-950 animate-pulse shadow-md">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            <div className="h-4 w-[1px] bg-amber-900/40 mx-0.5"></div>

            <button 
              onClick={() => setViewMode('pc')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all text-xs shrink-0 cursor-pointer ${viewMode === 'pc' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10'}`}
              title="PC View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PC View</span>
              <span className="sm:hidden">PC</span>
            </button>
            <button 
              onClick={() => setViewMode('phone')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all text-xs shrink-0 cursor-pointer ${viewMode === 'phone' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10'}`}
              title="Phone View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone View</span>
              <span className="sm:hidden">Phone</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full relative scroll-smooth">
        <div className={`min-h-full font-sans selection:bg-amber-500/30 text-amber-50 ${
          viewMode === 'phone' 
            ? 'max-w-[480px] mx-auto shadow-2xl outline outline-1 outline-stone-900/30 relative' 
            : 'w-full max-w-full'
        }`}>
          <div id="main-root-container" className="min-h-full max-w-[100vw] overflow-x-clip bg-[#0d0805] text-amber-50 flex flex-col items-center justify-start py-10 px-4 relative">
      
      {/* ADVANCED BACKGROUND DESIGN LAYERS */}
      {/* Layer 1: Traditional cultural ornament lattice overlay */}
      <div className="absolute inset-0 cultural-grid opacity-30 pointer-events-none z-0 transform-gpu"></div>

      {/* Layer 2: Ultra-modern ambient warm light orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none z-0 transform-gpu"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[90vw] h-[90vw] sm:w-[60vw] sm:h-[60vw] bg-[radial-gradient(circle,rgba(139,90,43,0.18)_0%,transparent_70%)] pointer-events-none z-0 transform-gpu"></div>
      <div className="absolute top-[30%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none z-0 transform-gpu"></div>
      
      {/* Layer 3: Floating Golden Dust / Embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 transform-gpu">
        <div className="absolute w-2 h-2 rounded-full bg-amber-400/40 top-1/4 left-1/4 "></div>
        <div className="absolute w-3.5 h-3.5 rounded-full bg-amber-500/30 top-1/3 right-1/4 "></div>
        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-500/50 top-2/3 left-1/3 " style={{ animationDelay: '3s' }}></div>
        <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-400/30 top-3/4 right-1/3 " style={{ animationDelay: '5s' }}></div>
        <div className="absolute w-1 h-1 rounded-full bg-amber-500/60 top-1/2 left-2/3 " style={{ animationDelay: '7s' }}></div>
      </div>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border ${
              toast.type === 'success' 
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800 ' 
                : toast.type === 'info'
                ? 'bg-sky-950/90 text-sky-100 border-sky-800 '
                : 'bg-rose-950/90 text-rose-100 border-rose-800 '
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-sky-400" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN PREMIUM GLASS CARD WRAPPER */}
      <div className="print:border-none print:shadow-none print:bg-transparent w-full max-w-5xl bg-[#1a1511] rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] border border-amber-500/25 overflow-hidden flex flex-col relative z-10">
        
        {/* Glass reflection top-edge highlight */}
        <div className="print:hidden absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent z-30 pointer-events-none"></div>

        {/* Subtle inner gold frame border accent */}
        <div className="print:hidden absolute inset-0 border border-amber-400/10 rounded-3xl pointer-events-none z-20"></div>

        {/* PREMIUM ART FEST HEADER BANNER */}
        <div className="print:hidden relative bg-stone-950 text-amber-50 px-6 pt-10 pb-12 overflow-hidden border-b-2 border-amber-400/40">
          
          {/* User's background image */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: 'url("/background.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.35
            }}
          ></div>
          
          {/* Gradient Overlay for better readability */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#1c1007] via-[#1c1007]/80 to-[#1c1007]/40 pointer-events-none"></div>

          {/* Traditional Decorative Motif Overlay background */}
          <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="absolute top-4 right-4 z-10 text-[10px] text-amber-400/40 font-mono tracking-widest uppercase">
            EST. 2026-27
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Elegant Emblem icon representing {festivalName} */}
            <motion.div 
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] overflow-hidden border-2 border-amber-200 bg-amber-500 w-24 h-24 flex items-center justify-center"
            >
              <img src="/logo.jpg" alt="Festival Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/ffffff/d4af37?text=Logo'; }} />
            </motion.div>

            <motion.h1 
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative z-10 text-3xl md:text-4xl font-extrabold tracking-wider gold-shimmer uppercase flex items-center justify-center gap-3 flex-wrap drop-shadow-xl"
            >
              {festivalName}
              <span className="font-mono bg-amber-400/20 px-3 py-1 rounded-xl text-lg md:text-xl text-amber-300 border border-amber-500/20 normal-case tracking-normal drop-shadow-md ">{festivalYear}</span>
            </motion.h1>
            
            <p className="text-xs text-amber-200/80 mt-3 max-w-md font-light leading-relaxed drop-shadow-md">
              Arts Festival Competition Results and Live Team Scores available here
            </p>
          </div>
        </div>

        {/* FLOATING ACTION PANELS: STUDENT GUIDE & ADMIN GATE */}
        <div className="print:hidden px-6 -mt-6 z-10 w-full max-w-7xl mx-auto">
          <div className="bg-stone-900/95 rounded-2xl shadow-xl border border-amber-500/20 p-3 flex flex-col md:flex-row gap-3">
            <button 
              onClick={() => setIsProgramsListModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20 transition-all rounded-xl text-amber-300 font-semibold text-sm border border-amber-500/20 cursor-pointer"
            >
              <SearchCode className="w-4 h-4 text-amber-400" />
              <span>Programmes</span>
            </button>
            <button 
              id="schedule-btn"
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20 transition-all rounded-xl text-amber-300 font-semibold text-sm border border-amber-500/20 cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>Programme Schedule</span>
            </button>
            
            <button 
              id="toggle-admin-btn"
              onClick={() => {
                setIsAdminOpen(!isAdminOpen);
                if (isAdminOpen) {
                  setAdminPassword('');
                  setAdminError('');
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all rounded-xl font-semibold text-sm border cursor-pointer ${
                isAdminOpen 
                  ? 'bg-amber-400 text-[#1c1007] border-amber-400 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
                  : 'bg-stone-900/40 hover:bg-stone-900/60 text-amber-100 border-amber-500/20'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <Unlock className="w-4 h-4 text-[#1c1007] animate-bounce" />
                  <span>Control Panel</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Manage (Admin)</span>
                </>
              )}
            </button>

            <button 
              onClick={() => setIsTeamProgramRegistrationOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20 transition-all rounded-xl text-amber-300 font-semibold text-sm border border-amber-500/20 cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Programme Registration</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC ADMIN DRAWER SECTION */}
        <AnimatePresence>
          {isAdminOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-stone-950/50 border-b border-amber-500/15"
            >
              <div className="p-6">
                
                {/* 1. Admin login screen */}
                {!isAdminLoggedIn ? (
                  <form onSubmit={handleAdminLogin} className="print:hidden bg-stone-900/90 rounded-2xl border border-amber-500/20 p-5 shadow-xl max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-lg">
                      <Lock className="w-5 h-5 text-amber-50" />
                      <h4>Admin Access</h4>
                    </div>
                    <p className="text-xs text-stone-400/50 mb-4">
                      Login with a password to add and edit scores and student details.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-400 block">Password</label>
                        <input 
                          id="admin-password-input"
                          type="password"
                          placeholder="Enter admin password"
                          value={adminPassword}
                          onChange={(e) => {
                            setAdminPassword(e.target.value);
                            setAdminError('');
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all text-sm font-medium text-amber-100"
                        />
                      </div>
                      {adminError && (
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                          <XCircle className="w-4 h-4" />
                          <span>{adminError}</span>
                        </div>
                      )}
                      <button 
                        id="admin-login-submit"
                        type="submit"
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-amber-950 font-extrabold rounded-xl transition-all shadow-[0_4px_12px_rgba(212,175,55,0.15)] text-sm cursor-pointer"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                ) : (
                  // 2. Main Admin Dashboard Panel
                  <div className="space-y-6">
                    <div className="print:hidden flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
                      <div>
                        <h3>Control Panel (Admin Panel)</h3>
                        <p className="text-xs text-amber-500/70 mt-1">Manage all aspects of the festival</p>
                      </div>
                      <button 
                        id="admin-logout-btn"
                        onClick={handleAdminLogout}
                        className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Admin Tabs */}
                    <div className="print:hidden flex flex-wrap gap-2 border-b border-amber-500/10 pb-3">
                      {[
                        { id: 'dashboard', label: 'Live Dashboard' },
                        { id: 'student_details', label: 'Student Details' },
                        { id: 'result_publishing', label: 'Result Publishing' },
                        { id: 'program_details', label: 'Programmes & Registrations' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' },
                        { id: 'all_programs', label: 'All Programmes' },
                        { id: 'check_publish', label: 'Check Publish' },
                        { id: 'active_status', label: 'Active Status Badges' },
                        { id: 'printing', label: 'Printing' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            if (editingCode) resetForm();
                            setAdminTab(tab.id as any);
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            adminTab === tab.id 
                              ? 'bg-amber-500 text-amber-950 shadow-sm' 
                              : 'bg-stone-800 text-amber-500/60 hover:bg-stone-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="mt-4">
                      {adminTab === 'student_details' && (
                        <div className="print:hidden space-y-4">
                          
                            

                        <form onSubmit={handleSaveStudent} className="bg-stone-900 border border-amber-500/20 p-5 rounded-2xl shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                            <h4 className="text-sm font-bold text-amber-300">
                              {editingCode ? 'Edit Student Details' : 'Add New Student'}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (studentExcelFileInputRef.current) {
                                    studentExcelFileInputRef.current.value = '';
                                    studentExcelFileInputRef.current.click();
                                  }
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20 transition-colors"
                              >
                                <Upload className="w-3 h-3" />
                                Bulk Import Excel
                              </button>
                              <input
                                 type="file"
                                 ref={studentExcelFileInputRef}
                                accept=".xlsx, .xls"
                                onChange={handleStudentExcelImport}
                                className="hidden"
                              />
                              {editingCode && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteStudent(editingCode);
                                    resetForm();
                                  }}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20 flex items-center"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Team Group Codes & Chest Number Ranges Guide */}
                          <div className="bg-stone-950/80 border border-amber-500/20 p-3 rounded-xl space-y-2 text-xs">
                            <p className="font-bold text-amber-300 flex items-center justify-between">
                              <span>🏆 Team Codes & Chest Number Series:</span>
                              <span className="text-[10px] text-stone-400 font-normal">Auto-assigned per team</span>
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                              {TEAMS.map(t => (
                                <button
                                  type="button"
                                  key={t}
                                  onClick={() => setFormTeam(t)}
                                  className={`p-2 rounded-lg border text-center transition-all ${formTeam === t ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/50' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-amber-500/30'}`}
                                >
                                  <p className="font-black text-xs text-amber-400">{t}</p>
                                  <p className="text-[10px] text-amber-200/90 font-mono">Code: {TEAM_CODES[t]}</p>
                                  <p className="text-[10px] text-stone-300 font-mono">{TEAM_RANGES[t].min} - {TEAM_RANGES[t].max}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 md:col-span-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-amber-400 block">Chess No.</label>
                                <button 
                                  type="button"
                                  onClick={() => setFormCode(getNextChestNumberForTeam(formTeam, students))}
                                  className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  ⚡ Auto-Assign ({getNextChestNumberForTeam(formTeam, students)})
                                </button>
                              </div>
                              <input 
                                required
                                type="text"
                                value={formCode}
                                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                                placeholder={`e.g. ${getNextChestNumberForTeam(formTeam, students)}`}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-sm text-amber-100 uppercase"
                              />
                              {formCode && (() => {
                                const detectedTeam = getTeamFromChestNumber(formCode);
                                if (detectedTeam === formTeam) {
                                  return <p className="text-[10px] text-emerald-400 font-medium">✓ Valid Chess No. for {formTeam} ({TEAM_RANGES[formTeam].min} - {TEAM_RANGES[formTeam].max})</p>;
                                } else if (detectedTeam) {
                                  return <p className="text-[10px] text-amber-400/90 font-medium">⚠️ Note: {formCode} is in {detectedTeam}'s series ({TEAM_RANGES[detectedTeam].min} - {TEAM_RANGES[detectedTeam].max}). Recommended series for {formTeam} is {TEAM_RANGES[formTeam].min} - {TEAM_RANGES[formTeam].max}.</p>;
                                } else {
                                  return <p className="text-[10px] text-stone-400 font-medium">Recommended series for {formTeam} is {TEAM_RANGES[formTeam].min} - {TEAM_RANGES[formTeam].max}.</p>;
                                }
                              })()}
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-amber-400 block">Name</label>
                              <input 
                                required
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-sm text-amber-100"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Class</label>
                              <input 
                                required
                                type="number"
                                min="1"
                                max="12"
                                value={formClass}
                                onChange={(e) => setFormClass(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-sm text-amber-100"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Category (Auto)</label>
                              <input 
                                readOnly
                                value={formCategory}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 outline-none text-sm text-amber-100 opacity-80"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-amber-400 block">Team</label>
                              <select 
                                value={formTeam}
                                onChange={(e) => setFormTeam(e.target.value as TeamName)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-sm text-amber-100"
                              >
                                {TEAMS.map(team => (
                                  <option key={team} value={team}>{team}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black rounded-xl transition-colors shadow-md text-sm cursor-pointer mt-4"
                          >
                            Save Student Details
                          </button>
                        </form>
                        </div>
                      )}

                      {adminTab === 'result_publishing' && (
                        <div className="print:hidden bg-stone-900 border border-amber-500/20 p-5 rounded-2xl shadow-sm space-y-6">
                          <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-amber-50" /> Publish Result
                            </h4>
                          </div>

                          <div className="space-y-4">
                            <div className="relative max-w-xs" ref={resultPublishDropdownRef}>
                              <label className="text-xs font-bold text-amber-400 block mb-1">Select Programme</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Type code or name..."
                                  value={resultPublishSearchQuery}
                                  onChange={(e) => {
                                    setResultPublishSearchQuery(e.target.value);
                                    if (!showResultPublishDropdown) setShowResultPublishDropdown(true);
                                    if (e.target.value === '') setResultPublishProgramId('');
                                  }}
                                  onFocus={() => setShowResultPublishDropdown(true)}
                                  className="w-full px-4 py-3 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm font-bold text-amber-100 placeholder-stone-500"
                                />
                                {resultPublishSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setResultPublishSearchQuery('');
                                      setResultPublishProgramId('');
                                      setShowResultPublishDropdown(true);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              
                              {showResultPublishDropdown && (
                                <div className="absolute z-50 w-full mt-1 bg-stone-900 border border-amber-500/20 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                  {programs.filter(p => {
                                    const searchLower = resultPublishSearchQuery.toLowerCase();
                                    return (p.code?.toLowerCase() || '').includes(searchLower) || p.name.toLowerCase().includes(searchLower);
                                  }).map(p => (
                                    <div
                                      key={p.id}
                                      onClick={() => {
                                        setResultPublishProgramId(p.id);
                                        setResultPublishSearchQuery(`${p.code ? `[${p.code}] ` : ''}${p.name}`);
                                        setShowResultPublishDropdown(false);
                                      }}
                                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-stone-800 transition-colors ${resultPublishProgramId === p.id ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-amber-100'}`}
                                    >
                                      {p.code ? <span className="text-amber-500/60 mr-1.5">[{p.code}]</span> : null}
                                      {p.name}
                                    </div>
                                  ))}
                                  {programs.filter(p => {
                                    const searchLower = resultPublishSearchQuery.toLowerCase();
                                    return (p.code?.toLowerCase() || '').includes(searchLower) || p.name.toLowerCase().includes(searchLower);
                                  }).length === 0 && (
                                    <div className="px-4 py-3 text-sm text-stone-500 text-center">No programmes found</div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {(() => {
                              const prog = programs.find(p => p.id === resultPublishProgramId);
                              if (prog) {
                                const progRegs = registrations.filter(r => r.programId === prog.id);
                                const registeredStudents = students.filter(s => {
                                  const isRegInTable = progRegs.some(r => r.studentCode.toUpperCase() === s.code.toUpperCase());
                                  const isRegInField = s.event === prog.name && (s.category === prog.category || prog.category === 'General' || s.category === 'General');
                                  return isRegInTable || isRegInField;
                                });

                                return (
                                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h5 className="text-lg font-black text-amber-300">{prog.name}</h5>
                                        <p className="text-xs font-bold text-amber-50 mt-1">Category: {prog.category} | Type: {prog.type}</p>
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: !p.isResultPublished } : p);
                                            saveAndSetPrograms(updatedPrograms);
                                            showToast(prog.isResultPublished ? 'Result hidden from public search.' : 'Result published to public search.', 'success');
                                          }}
                                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${prog.isResultPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-500 border border-stone-700 hover:bg-stone-700'}`}
                                        >
                                          {prog.isResultPublished ? <><Search className="w-3 h-3"/> Search: ON</> : <><Search className="w-3 h-3"/> Search: OFF</>}
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Registered Participants Banner */}
                                    <div className="mt-4 p-3 bg-stone-950/80 border border-amber-500/20 rounded-xl space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                          <Users className="w-4 h-4 text-amber-400" /> 
                                          Registered Participants ({registeredStudents.length})
                                        </span>
                                      </div>
                                      {registeredStudents.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                                          {registeredStudents.map(st => (
                                            <span key={st.code} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-medium text-amber-200 flex items-center gap-1">
                                              <strong className="text-amber-400 font-mono font-bold">{st.code}</strong> - {st.name} <span className="text-stone-400 text-[10px]">({st.team})</span>
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-amber-300/80 font-medium italic">
                                          {prog.category === 'General' ? 'Team event / General category. Select a registered team or student below.' : '⚠️ No participants registered for this programme yet. Register participants in "Programmes & Registrations" tab.'}
                                        </p>
                                      )}
                                    </div>

                                    <div className="mt-6 space-y-4">
                                      <h6 className="text-sm font-bold text-amber-400 border-b border-amber-500/20 pb-2">Result Entries</h6>
                                      
                                      {resultPublishEntries.map((entry, idx) => (
                                        <div key={entry.id} className="grid grid-cols-12 gap-3 items-end bg-stone-950 p-3 rounded-lg border border-stone-800">
                                          <div className="col-span-4 sm:col-span-3">
                                            <label className="block text-[10px] font-bold text-amber-500/80 mb-1">Rank</label>
                                            <select
                                              value={entry.rank}
                                              onChange={(e) => {
                                                const newEntries = [...resultPublishEntries];
                                                newEntries[idx].rank = Number(e.target.value);
                                                setResultPublishEntries(newEntries);
                                              }}
                                              className="w-full px-2 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs font-bold text-amber-100 outline-none focus:border-amber-400"
                                            >
                                              <option value={1} className="bg-stone-900">1st</option>
                                              <option value={2} className="bg-stone-900">2nd</option>
                                              <option value={3} className="bg-stone-900">3rd</option>
                                              <option value={0} className="bg-stone-900">None</option>
                                            </select>
                                          </div>
                                          <div className="col-span-8 sm:col-span-4">
                                            <label className="block text-[10px] font-bold text-amber-500/80 mb-1">
                                              {prog.category === 'General' ? 'Code / Team (Type or Select)' : 'Participant Code (Type or Select)'}
                                            </label>
                                            <input
                                              type="text"
                                              list={`participant-datalist-${prog.id}`}
                                              value={entry.code}
                                              onChange={(e) => {
                                                const newEntries = [...resultPublishEntries];
                                                newEntries[idx].code = e.target.value.toUpperCase();
                                                setResultPublishEntries(newEntries);
                                              }}
                                              placeholder={prog.category === 'General' ? "Type code or select team..." : "Type or select Chess No. e.g. S101"}
                                              className="w-full px-3 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs font-bold text-amber-100 uppercase outline-none focus:border-amber-400"
                                            />
                                            <datalist id={`participant-datalist-${prog.id}`}>
                                              {prog.category === 'General' && TEAMS.map(team => (
                                                <option key={`team-${team}`} value={team}>{`Team ${team}`}</option>
                                              ))}
                                              {registeredStudents.map(st => (
                                                <option key={st.code} value={st.code}>{`${st.code} - ${st.name} (${st.team})`}</option>
                                              ))}
                                            </datalist>
                                          </div>
                                          <div className="col-span-4 sm:col-span-3 mt-2 sm:mt-0">
                                            <label className="block text-[10px] font-bold text-amber-500/80 mb-1">Grade</label>
                                            <select
                                              value={entry.grade}
                                              onChange={(e) => {
                                                const newEntries = [...resultPublishEntries];
                                                newEntries[idx].grade = e.target.value;
                                                setResultPublishEntries(newEntries);
                                              }}
                                              className="w-full px-2 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs font-bold text-amber-100 outline-none focus:border-amber-400"
                                            >
                                              <option value="A" className="bg-stone-900">A</option>
                                              <option value="B" className="bg-stone-900">B</option>
                                              <option value="C" className="bg-stone-900">C</option>
                                              <option value="" className="bg-stone-900">None</option>
                                            </select>
                                          </div>
                                          <div className="col-span-2 sm:col-span-2 flex justify-center pb-1">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newEntries = resultPublishEntries.filter((_, i) => i !== idx);
                                                setResultPublishEntries(newEntries);
                                              }}
                                              className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                          {entry.code.trim() && (
                                            <div className="col-span-12 mt-1 px-1">
                                              {(() => {
                                                if (prog.category === 'General') {
                                                  let teamStr = "";
                                                  const st = students.find(s => s.code.toUpperCase() === entry.code.trim().toUpperCase());
                                                  if (st) {
                                                    teamStr = st.team;
                                                  } else {
                                                    const validTeams = ['AQEEQ', 'TAWBAZ', 'MARJAN', 'FYRUZ', 'YAQOOT', 'THAWBAZ', 'YAQOOTH', 'FAYROOZ', '100', '200', '300', '400', '500'];
                                                    if (validTeams.includes(entry.code.trim().toUpperCase())) {
                                                      teamStr = entry.code.trim().toUpperCase();
                                                    }
                                                  }
                                                  if (teamStr) return <p className="text-[10px] text-amber-400/80 font-medium">✓ Valid Team/Student: {teamStr}</p>;
                                                  return <p className="text-[10px] text-rose-400/80 font-medium">✕ Invalid Code or Team</p>;
                                                } else {
                                                  const st = students.find(s => s.code.toUpperCase() === entry.code.trim().toUpperCase());
                                                  const isReg = registeredStudents.some(s => s.code.toUpperCase() === entry.code.trim().toUpperCase());
                                                  if (st && isReg) return <p className="text-[10px] text-emerald-400 font-medium">✓ Registered: {st.name} ({st.team})</p>;
                                                  if (st && !isReg) return <p className="text-[10px] text-rose-400 font-medium">✕ Student {st.name} is NOT registered for this programme!</p>;
                                                  return <p className="text-[10px] text-rose-400/80 font-medium">✕ Student not found</p>;
                                                }
                                              })()}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                      
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setResultPublishEntries([
                                            ...resultPublishEntries, 
                                            { id: Date.now().toString(), code: '', rank: 0, grade: '' }
                                          ]);
                                        }}
                                        className="text-xs font-bold text-amber-50 hover:text-amber-400 flex items-center gap-1 cursor-pointer py-2 hover:bg-amber-500/10 rounded-lg transition-colors inline-flex"
                                      >
                                        <Plus className="w-4 h-4" /> Add Another Result
                                      </button>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-amber-500/20 flex gap-3">
                                      <button
                                        type="button"
                                        onClick={handleDeleteProgramResults}
                                        className={`flex-1 py-3 font-black rounded-xl transition-colors shadow-md text-sm border cursor-pointer ${confirmDeleteProgramId === resultPublishProgramId ? 'bg-rose-600 text-white border-rose-500' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'}`}
                                      >
                                        {confirmDeleteProgramId === resultPublishProgramId ? 'Click to Confirm' : 'Delete Result'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handlePublishResults}
                                        className="flex-[2] py-3 bg-amber-600 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-colors shadow-md text-sm cursor-pointer"
                                      >
                                        Save Results
                                      </button>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      )}                      {adminTab === 'program_details' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-8">
                          {/* Header */}
                          <div className="flex items-center justify-between border-b border-amber-500/10 pb-4">
                            <div>
                              <h4 className="text-xl text-amber-300 font-black flex items-center gap-2 mb-1">
                                <Activity className="w-6 h-6" />
                                Programmes & Registrations
                              </h4>
                              <p className="text-amber-500/70 text-sm">Manage programmes, programme limits, and register students.</p>
                            </div>

                          </div>

                          {/* Top Section: Program Limits & Add Program */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Limits */}
                            <div className="md:col-span-1 bg-stone-950 border border-stone-800 p-5 rounded-2xl space-y-4">
                              <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                                <h5 className="font-bold text-amber-400">Participation Limits</h5>
                                <span className="text-[10px] text-amber-500/60 font-medium">Per Category</span>
                              </div>
                              <div className="space-y-3">
                                {(['Sub Junior', 'Senior', 'Super Senior', 'General'] as const).map((cat) => {
                                  const limits = categoryLimits[cat] || { maxStage: 3, maxNonStage: 3, maxGeneral: 2 };
                                  const catMalayalam = CATEGORY_MALAYALAM[cat] || cat;
                                  const isGeneral = cat === 'General';
                                  return (
                                    <div key={cat} className="p-3 bg-stone-900/80 border border-amber-500/15 rounded-xl space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                          {cat}
                                        </span>
                                      </div>
                                      {isGeneral ? (
                                        <div className="space-y-1">
                                          <label className="text-[10px] font-bold text-amber-400/80 block">General Limit</label>
                                          <input 
                                            type="number"
                                            min="1"
                                            value={limits.maxGeneral ?? limits.maxStage ?? 2}
                                            onChange={(e) => {
                                              const val = Math.max(1, Number(e.target.value) || 1);
                                              const updated = {
                                                ...categoryLimits,
                                                'General': { maxStage: val, maxNonStage: val, maxGeneral: val }
                                              };
                                              setCategoryLimits(updated);
                                              persistToFirestore({ categoryLimits: updated, maxStagePrograms: updated['Senior']?.maxStage ?? 3, maxNonStagePrograms: updated['Senior']?.maxNonStage ?? 3 });
                                            }}
                                            className="w-full px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-xs text-amber-100 font-bold"
                                          />
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-amber-400/80 block">Max Stage</label>
                                            <input 
                                              type="number"
                                              min="1"
                                              value={limits.maxStage}
                                              onChange={(e) => {
                                                const val = Math.max(1, Number(e.target.value) || 1);
                                                const updated = {
                                                  ...categoryLimits,
                                                  [cat]: { ...limits, maxStage: val }
                                                };
                                                setCategoryLimits(updated);
                                                persistToFirestore({ categoryLimits: updated, maxStagePrograms: updated['Senior']?.maxStage ?? 3, maxNonStagePrograms: updated['Senior']?.maxNonStage ?? 3 });
                                              }}
                                              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-xs text-amber-100 font-bold"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-amber-400/80 block">Max Non-Stage</label>
                                            <input 
                                              type="number"
                                              min="1"
                                              value={limits.maxNonStage}
                                              onChange={(e) => {
                                                const val = Math.max(1, Number(e.target.value) || 1);
                                                const updated = {
                                                  ...categoryLimits,
                                                  [cat]: { ...limits, maxNonStage: val }
                                                };
                                                setCategoryLimits(updated);
                                                persistToFirestore({ categoryLimits: updated, maxStagePrograms: updated['Senior']?.maxStage ?? 3, maxNonStagePrograms: updated['Senior']?.maxNonStage ?? 3 });
                                              }}
                                              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-xs text-amber-100 font-bold"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                  <p className="text-[11px] text-amber-300 font-medium">Team Limit: Max 2 students per team per programme (General category can be configured during programme creation).</p>
                                </div>
                              </div>
                            </div>

                            {/* Add Program */}
                            <div className="md:col-span-2 bg-stone-950 border border-stone-800 p-5 rounded-2xl">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="font-bold text-amber-400">Add New Programme</h5>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (programExcelFileInputRef.current) {
                                      programExcelFileInputRef.current.value = '';
                                      programExcelFileInputRef.current.click();
                                    }
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20 transition-colors"
                                >
                                  <Upload className="w-3 h-3" />
                                  Bulk Import Excel
                                </button>
                                <input
                                   type="file"
                                   ref={programExcelFileInputRef}
                                  accept=".xlsx, .xls"
                                  onChange={handleProgramExcelImport}
                                  className="hidden"
                                />
                              </div>
                              <form onSubmit={handleAddProgram} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-xs font-bold text-amber-400/80 block mb-1">Programme Code</label>
                                    <input 
                                      required
                                      type="text"
                                      placeholder="e.g. P101"
                                      value={formProgramCode}
                                      onChange={(e) => setFormProgramCode(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 outline-none text-sm text-amber-100"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-amber-400/80 block mb-1">Programme Name</label>
                                    <input 
                                      required
                                      type="text"
                                      placeholder="e.g. Mappilappattu, Oppana"
                                      value={formProgramName}
                                      onChange={(e) => setFormProgramName(e.target.value)}
                                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 outline-none text-sm text-amber-100"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-xs font-bold text-amber-400/80 block mb-1">Category</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['Sub Junior', 'Senior', 'Super Senior', 'General'].map(cat => (
                                        <label key={cat} className={`flex items-center justify-center text-center p-2 rounded-lg border cursor-pointer transition-colors ${formProgramCategory === cat ? 'bg-amber-500/20 border-amber-500 text-stone-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-amber-500/50'}`}>
                                          <input 
                                            type="radio" 
                                            name="programCategorySelection"
                                            value={cat}
                                            checked={formProgramCategory === cat}
                                            onChange={(e) => setFormProgramCategory(e.target.value as 'Sub Junior' | 'Senior' | 'Super Senior' | 'General')}
                                            className="hidden"
                                          />
                                          <span className="text-[11px] font-bold">{cat}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-amber-400/80 block mb-1">Programme Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['Stage', 'Non-Stage'].map(type => (
                                        <label key={type} className={`flex items-center justify-center text-center p-2 rounded-lg border cursor-pointer transition-colors ${formProgramType === type ? 'bg-amber-500/20 border-amber-500 text-stone-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-amber-500/50'}`}>
                                          <input 
                                            type="radio" 
                                            name="programTypeSelection"
                                            value={type}
                                            checked={formProgramType === type}
                                            onChange={(e) => setFormProgramType(e.target.value as 'Stage' | 'Non-Stage')}
                                            className="hidden"
                                          />
                                          <span className="text-[11px] font-bold">{type}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {formProgramCategory === 'General' && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-bold text-amber-400/80 block mb-1">Max Participants per Group</label>
                                      <input 
                                        type="number"
                                        min="1"
                                        value={formProgramMaxParticipants}
                                        onChange={(e) => setFormProgramMaxParticipants(Number(e.target.value))}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 outline-none text-sm text-amber-100"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-bold text-amber-400/80 block mb-1">Max Entries per Team</label>
                                      <input 
                                        type="number"
                                        min="1"
                                        value={formProgramMaxEntries}
                                        onChange={(e) => setFormProgramMaxEntries(Number(e.target.value))}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 outline-none text-sm text-amber-100"
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400 mb-4">
                                    <input
                                      type="checkbox"
                                      checked={formProgramIsSongEvent}
                                      onChange={(e) => setFormProgramIsSongEvent(e.target.checked)}
                                      className="accent-amber-500 w-4 h-4 rounded"
                                    />
                                    <span>Requires Topic Registration? (Topic name / First line)</span>
                                  </label>
                                </div>

                                <button 
                                  type="submit"
                                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-colors text-sm cursor-pointer"
                                >
                                  Add Program
                                </button>
                              </form>
                            </div>
                          </div>

                          {/* Registrations List Section */}
                          <div className="mt-8 pt-6 border-t border-amber-500/10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                              <h5 className="font-bold text-amber-300 text-lg">Programme List & Registrations</h5>
                              <div className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                <input
                                  type="text"
                                  placeholder="Search by code or name..."
                                  value={programSearchQuery}
                                  onChange={(e) => setProgramSearchQuery(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg text-sm text-amber-100 placeholder-stone-600 outline-none transition-colors"
                                />
                              </div>
                            </div>
                            <div className="space-y-8">
                              {['General', 'Super Senior', 'Senior', 'Sub Junior'].map(category => {
                                const categoryPrograms = programs.filter(p => {
                                  if (p.category !== category) return false;
                                  if (!programSearchQuery.trim()) return true;
                                  const searchLower = programSearchQuery.toLowerCase();
                                  return (p.code?.toLowerCase() || '').includes(searchLower) || p.name.toLowerCase().includes(searchLower);
                                });
                                if (categoryPrograms.length === 0) return null;
                                return (
                                  <div key={category} className="bg-stone-950 border border-stone-800 rounded-2xl p-5">
                                    <h4 className="text-lg font-black text-amber-300 mb-4 pb-2 border-b border-amber-500/10">{category} Programmes</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                      {categoryPrograms.map(prog => (
                                        <div key={prog.id} className="bg-stone-900 border border-amber-500/20 rounded-xl p-4 flex flex-col group h-full">
                                          <div className="flex justify-between items-start mb-3">
                                            <div>
                                              <h5 className="font-bold text-amber-100 text-base">
                                                {prog.code && <span className="text-amber-50 mr-1.5">[{prog.code}]</span>}
                                                {prog.name}
                                              </h5>
                                              <div className="flex gap-1.5 items-center flex-wrap mt-1">
                                                <span className="text-[10px] uppercase font-bold text-amber-500/50 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">{prog.type} Event</span>
                                                {prog.category === 'General' && (
                                                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                    Entries: {prog.maxEntriesPerTeam || 1}
                                                  </span>
                                                )}
                                                {prog.category === 'General' && (
                                                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                                    Max/Group: {prog.maxParticipantsPerGroup || 5}
                                                  </span>
                                                )}
                                                {prog.isSongEvent && (
                                                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                                                    <Flame className="w-3 h-3" /> Topic Reg
                                                  </span>
                                                )}
                                                {(prog.date || prog.time) && (
                                                  <span className="text-[10px] font-bold text-amber-300">
                                                    • {prog.date ? new Date(prog.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''} {prog.time ? (() => {
                                                        const [hours, minutes] = prog.time.split(':');
                                                        const h = parseInt(hours, 10);
                                                        return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
                                                      })() : ''}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] bg-stone-950 border border-stone-800 px-2 py-1 rounded text-stone-400 font-bold mr-1">
                                                  Reg: {(globalProgramsData.regCount[prog.id] || 0)}/{(prog.category === 'General' && prog.maxParticipantsPerGroup) ? prog.maxParticipantsPerGroup * 5 : 10}
                                                </span>
                                                <button 
                                                  onClick={() => handleDeleteProgram(prog.id)}
                                                  className="p-1.5 text-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors "
                                                  title="Delete Programme"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                              <div className="flex flex-col items-end gap-1.5 mt-1">

                                                <button 
                                                  onClick={() => {
                                                    const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: !p.isResultPublished } : p);
                                                    saveAndSetPrograms(updatedPrograms);
                                                    showToast(prog.isResultPublished ? 'Result hidden from Home Page.' : 'Result published to Home Page.', 'success');
                                                  }}
                                                  className={`px-2 py-1 rounded-md transition-colors text-[10px] font-bold flex items-center gap-1 ${prog.isResultPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                                  title="Show detailed results in Home Page Search"
                                                >
                                                  <Search className="w-3 h-3" /> Home Page: {prog.isResultPublished ? 'ON' : 'OFF'}
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="mt-auto">
                                            <ProgramRegistrationForm 
                                              program={prog} 
                                              students={students} 
                                              registrations={registrations} 
                                              onRegister={(studentCode, entryIdx) => handleRegister(prog.id, studentCode, prog.type, prog.category, entryIdx)} 
                                              onUnregister={(regId) => handleUnregister(regId)}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                              {programs.length === 0 && (
                                <div className="text-center py-10 border border-dashed border-stone-800 rounded-2xl text-stone-500">
                                  No programmes added yet. Use the form above to add programmes.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {adminTab === 'settings' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-6">
                          <div className="flex items-center gap-2 text-amber-300 font-bold border-b border-amber-500/10 pb-3">
                            <Settings className="w-5 h-5" />
                            <h4>Festival Settings</h4>
                          </div>
                          
                          <div className="space-y-4">
                            {/* View Song Registrations */}
                            <div className="bg-stone-950 p-4 rounded-xl border border-amber-500/20">
                              <h5 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-50" />
                                Registered Topics Overview
                              </h5>
                              {songRegistrations.length === 0 ? (
                                <p className="text-xs text-stone-500 italic">No topics registered yet.</p>
                              ) : (
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                  {songRegistrations.map(reg => {
                                    const p = programs.find(pr => pr.id === reg.programId);
                                    const isRejected = reg.status === 'rejected';
                                    return (
                                      <div key={reg.id} className={`p-3 bg-stone-900 border ${isRejected ? 'border-rose-500/30 bg-rose-950/10' : 'border-emerald-500/20'} rounded-lg flex flex-col gap-1`}>
                                        <div className="flex justify-between items-start gap-2">
                                          <span className="text-xs font-bold text-stone-300">{p?.name || 'Unknown Programme'}</span>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRejected ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                              {isRejected ? 'Rejected' : 'Accepted'}
                                            </span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-amber-500/80 border border-stone-700">
                                              {reg.team}{reg.entryIndex ? ` • Topic ${reg.entryIndex}` : ''}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-end mt-1 gap-2">
                                          <div>
                                            <p className={`text-sm font-medium italic ${isRejected ? 'text-stone-500 line-through' : 'text-amber-50'}`}>"{reg.songLine}"</p>
                                            <p className="text-[9px] text-stone-500 mt-1">
                                              {new Date(reg.registeredAt).toLocaleString()}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              onClick={() => {
                                                const newStatus: 'accepted' | 'rejected' = isRejected ? 'accepted' : 'rejected';
                                                const updated = songRegistrations.map(sr => sr.id === reg.id ? { ...sr, status: newStatus } : sr);
                                                saveAndSetSongRegistrations(updated);
                                                
                                                if (newStatus === 'rejected') {
                                                  showToast(`Topic for ${reg.team} rejected`, 'info');
                                                  const progName = p?.name || 'Program';
                                                  sendBroadcastNotification(
                                                    'Topic Rejected ⚠️',
                                                    `Your topic "${reg.songLine}" registered by team ${reg.team} for programme "${progName}" has been rejected. Please submit a new topic.`,
                                                    'announcement'
                                                  );
                                                } else {
                                                  showToast(`Topic for ${reg.team} accepted`, 'success');
                                                }
                                              }}
                                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                                isRejected
                                                  ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 border-emerald-500/30 hover:text-white'
                                                  : 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 border-rose-500/30 hover:text-white'
                                              }`}
                                              title={isRejected ? "Click to Accept Topic" : "Click to Reject Topic"}
                                            >
                                              {isRejected ? (
                                                <>
                                                  <CheckCircle className="w-3.5 h-3.5" /> Accept
                                                </>
                                              ) : (
                                                <>
                                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                                </>
                                              )}
                                            </button>
                                            <button
                                              onClick={() => {
                                                saveAndSetSongRegistrations(songRegistrations.filter(sr => sr.id !== reg.id));
                                                showToast('Topic deleted', 'success');
                                              }}
                                              className="p-1.5 bg-stone-950 border border-stone-800 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                                              title="Delete Topic"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* OneSignal Live Push Notification Card */}
                            <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-4 shadow-md">
                              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                                <div className="flex items-center gap-2 text-amber-300 font-extrabold">
                                  <Bell className="w-5 h-5 text-amber-400" />
                                  <h5 className="text-sm sm:text-base">OneSignal Live Push Notification Panel</h5>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  App ID: 410b6f1d...
                                </span>
                              </div>
                              <p className="text-xs text-stone-400">
                                Send real-time push notifications to all subscribed mobile and web devices via OneSignal REST API.
                              </p>

                              <div className="space-y-3">
                                {/* OneSignal REST API Key - Secured & Protected (Non-editable) */}
                                <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs font-semibold">
                                  <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                                    <span>OneSignal Authorization Key: Active & Protected</span>
                                  </div>
                                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    🔒 Secured (Read-Only)
                                  </span>
                                </div>

                                {/* Notification Title */}
                                <div>
                                  <label className="text-xs font-bold text-amber-400 block mb-1">Notification Title</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g., Stage 1 Results Published!"
                                    value={broadcastTitle}
                                    onChange={(e) => setBroadcastTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-800 bg-stone-900 focus:border-amber-400 outline-none text-xs text-amber-100"
                                  />
                                </div>

                                {/* Message */}
                                <div>
                                  <label className="text-xs font-bold text-amber-400 block mb-1">Message</label>
                                  <textarea 
                                    rows={2}
                                    placeholder="Enter notification message details..."
                                    value={broadcastMessage}
                                    onChange={(e) => setBroadcastMessage(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-stone-800 bg-stone-900 focus:border-amber-400 outline-none text-xs text-amber-100"
                                  />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-bold text-stone-400">Category:</label>
                                    <select 
                                      value={broadcastCategory}
                                      onChange={(e) => setBroadcastCategory(e.target.value as any)}
                                      className="px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900 text-xs text-amber-200 outline-none"
                                    >
                                      <option value="announcement">📢 Announcement</option>
                                      <option value="result">🏆 Result</option>
                                      <option value="general">📌 General</option>
                                    </select>
                                  </div>

                                  <button
                                    type="button"
                                    disabled={isSendingPush}
                                    onClick={async () => {
                                      if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
                                        showToast('Please enter both Notification Title and Message', 'error');
                                        return;
                                      }

                                      setIsSendingPush(true);
                                      try {
                                        let pushResult: any = null;
                                        if (oneSignalRestApiKey.trim()) {
                                          pushResult = await sendOneSignalNotification(broadcastTitle.trim(), broadcastMessage.trim());
                                        }

                                        sendBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastCategory);
                                        setBroadcastTitle('');
                                        setBroadcastMessage('');

                                        if (pushResult && pushResult.success) {
                                          showToast(`OneSignal push sent to ${pushResult.recipients || 'all'} subscriber(s)!`, 'success');
                                        } else if (pushResult && pushResult.noSubscribers) {
                                          showToast('Notification published in-app! (No active OneSignal push subscribers yet).', 'success');
                                        } else {
                                          showToast('Saved in-app notification. (Enter REST API Key to trigger OneSignal Push)', 'success');
                                        }
                                      } catch (err: any) {
                                        console.error('OneSignal Send Error:', err);
                                        sendBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastCategory);
                                        setBroadcastTitle('');
                                        setBroadcastMessage('');
                                        showToast(`Published in-app! OneSignal note: ${err.message || 'Failed to send'}`, 'error');
                                      } finally {
                                        setIsSendingPush(false);
                                      }
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    {isSendingPush ? 'Sending...' : 'Send Notification'}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1 mt-6">
                              <label className="text-xs font-bold text-amber-400 block">Festival Name</label>
                              <input 
                                type="text"
                                value={festivalName}
                                onChange={(e) => {
                                  setFestivalName(e.target.value);
                                  persistToFirestore({ festivalName: e.target.value });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Year</label>
                              <input 
                                type="text"
                                value={festivalYear}
                                onChange={(e) => {
                                  setFestivalYear(e.target.value);
                                  persistToFirestore({ festivalYear: e.target.value });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                              />
                            </div>
                            
                            <div className="space-y-4 pt-4 border-t border-amber-500/10">
                              <div className="flex items-center gap-2 text-amber-300 font-bold mb-2">
                                <Users className="w-5 h-5" />
                                <h4 className="text-sm font-bold text-amber-300">Groups Passwords</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {TEAMS.map(team => (
                                  <div key={team} className="space-y-1">
                                    <label className="text-xs font-bold text-amber-400 block">{team} Password</label>
                                    <div className="relative">
                                      <input 
                                        type={showTeamPasswords[team] ? "text" : "password"}
                                        value={tempTeamPasswords[team] || ''}
                                        onChange={(e) => setTempTeamPasswords({...tempTeamPasswords, [team]: e.target.value})}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100 pr-10"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setShowTeamPasswords({...showTeamPasswords, [team]: !showTeamPasswords[team]})}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-400"
                                      >
                                        {showTeamPasswords[team] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setTeamPasswords(tempTeamPasswords);
                                  persistToFirestore({ teamPasswords: tempTeamPasswords });
                                  showToast('Group passwords updated successfully.', 'success');
                                }}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold rounded-xl transition-colors"
                              >
                                Save Group Passwords
                              </button>
                            </div>

                            <div className="space-y-1 pt-4 border-t border-amber-500/10">
                              <label className="text-xs font-bold text-amber-400 block">Admin Password</label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <input 
                                    type={showSystemPassword ? "text" : "password"}
                                    value={tempSystemPassword}
                                    onChange={(e) => setTempSystemPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowSystemPassword(!showSystemPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-400"
                                  >
                                    {showSystemPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSystemAdminPassword(tempSystemPassword);
                                    persistToFirestore({ adminPassword: tempSystemPassword });
                                    showToast('Admin password updated successfully.', 'success');
                                  }}
                                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold rounded-xl transition-colors whitespace-nowrap"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-amber-500/10 space-y-4">
                            <div className="flex items-center gap-2 text-amber-300 font-bold mb-2">
                              <Calendar className="w-5 h-5" />
                              <h4 className="text-sm font-bold text-amber-300">Programme Scheduling</h4>
                            </div>
                            
                            <form onSubmit={handleSaveSchedule} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-4">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-amber-400 block">Type Programme Code or Name</label>
                                <div className="relative">
                                  <input 
                                    type="text"
                                    list="schedule-program-datalist"
                                    value={scheduleProgramCodeInput}
                                    onChange={(e) => handleScheduleProgramInputChange(e.target.value)}
                                    placeholder="Type Programme Code (e.g. P001, P002) or Name..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100 font-bold"
                                  />
                                  <datalist id="schedule-program-datalist">
                                    {programs.map(p => (
                                      <option key={p.id} value={p.code ? p.code : p.name}>
                                        {p.code ? `[${p.code}] ` : ''}{p.name} ({p.category} • {p.type})
                                      </option>
                                    ))}
                                  </datalist>
                                </div>

                                {/* Matched program feedback */}
                                {(() => {
                                  if (!scheduleProgramCodeInput.trim()) return null;
                                  const matchedProg = programs.find(p => p.id === scheduleSelectedProgramId);
                                  if (matchedProg) {
                                    return (
                                      <div className="mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center justify-between">
                                        <span>✓ Matched: {matchedProg.code ? `[${matchedProg.code}] ` : ''}{matchedProg.name} ({matchedProg.category} • {matchedProg.type})</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setScheduleProgramCodeInput('');
                                            setScheduleSelectedProgramId('');
                                            setScheduleDate('');
                                            setScheduleTime('');
                                            setScheduleStage('Stage 1');
                                          }}
                                          className="text-stone-400 hover:text-stone-200 text-[10px] underline ml-2 cursor-pointer shrink-0"
                                        >
                                          Clear
                                        </button>
                                      </div>
                                    );
                                  }
                                  return (
                                    <div className="mt-2 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                                      ⚠️ Programme not found. Type a valid Programme Code (e.g. P001, P002) or Name.
                                    </div>
                                  );
                                })()}
                              </div>

                              {(() => {
                                const selectedProg = programs.find(p => p.id === scheduleSelectedProgramId);
                                if (!selectedProg) return null;
                                if (selectedProg.type === 'Stage') {
                                  return (
                                    <div className="space-y-1">
                                      <label className="text-xs font-bold text-amber-400 block">Select Stage</label>
                                      <select 
                                        value={scheduleStage}
                                        onChange={(e) => setScheduleStage(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100 font-bold"
                                      >
                                        <option value="Stage 1">Stage 1</option>
                                        <option value="Stage 2">Stage 2</option>
                                      </select>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="text-xs text-stone-400 italic bg-stone-900/40 p-2.5 rounded-xl border border-stone-800/80">
                                    ℹ️ Non-Stage competition (Stage selection is not required)
                                  </div>
                                );
                              })()}
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-amber-400 block">Date</label>
                                  <input 
                                    type="date"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                                    style={{ colorScheme: 'dark' }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-amber-400 block">Time</label>
                                  <input 
                                    type="time"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                                    style={{ colorScheme: 'dark' }}
                                  />
                                </div>
                              </div>
                              
                              <button 
                                type="submit"
                                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-colors text-sm cursor-pointer"
                              >
                                Save Schedule
                              </button>
                            </form>
                          </div>

                          <div className="pt-4 border-t border-amber-500/10 space-y-4">
                            <h4 className="text-sm font-bold text-amber-300">Data Management</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <button 
                                onClick={handleExportData}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold rounded-xl text-xs transition-colors border border-amber-500/20 cursor-pointer"
                              >
                                <Download className="w-4 h-4 text-amber-400" />
                                <span>Export Data (Download JSON)</span>
                              </button>
                              
                              <button 
                                onClick={triggerImport}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold rounded-xl text-xs transition-colors border border-emerald-500/20 cursor-pointer"
                              >
                                <Upload className="w-4 h-4 text-emerald-400" />
                                <span>Import Data (Upload JSON)</span>
                              </button>



                              {/* Hidden file input for file imports */}
                              <input 
                                type="file" 
                                ref={fileInputRef}
                                accept=".json"
                                onChange={handleFileImport}
                                className="hidden"
                              />


                              <button 
                                onClick={handleResetToDefaults}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold rounded-xl text-xs transition-colors border border-stone-700 cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4 text-stone-400" />
                                <span>Reset to Default Example Data</span>
                              </button>

                              <button 
                                onClick={handleClearAll}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold rounded-xl text-xs transition-colors border border-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                                <span>Clear All Students</span>
                              </button>
                              
                              <button 
                                onClick={handleClearAllPrograms}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold rounded-xl text-xs transition-colors border border-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                                <span>Clear All Programmes</span>
                              </button>
                              
                              <button 
                                onClick={handleClearAllResults}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold rounded-xl text-xs transition-colors border border-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                                <span>Clear All Results</span>
                              </button>

                              <button 
                                onClick={handleClearAllNotifications}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold rounded-xl text-xs transition-colors border border-rose-500/20 cursor-pointer"
                              >
                                <Bell className="w-4 h-4 text-rose-400" />
                                <span>Clear All Notifications</span>
                              </button>
                            </div>
                          </div>

                                                </div>
                      )}

                      {adminTab === 'check_publish' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-amber-500/10 pb-4 mb-4 gap-4">
                            <h4 className="text-xl font-bold flex items-center gap-2 text-amber-300">
                              <CheckCircle className="w-5 h-5" /> Check Publish
                            </h4>
                          </div>
                          <div className="text-stone-400 space-y-6">
                              <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-50" />
                                    Overall Standings (Simulated)
                                  </h3>
                                </div>
                                <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                      <thead className="text-xs uppercase bg-stone-900 text-stone-400 border-b border-stone-800 font-bold">
                                        <tr>
                                          <th className="px-4 py-3 w-16 text-center">Rank</th>
                                          <th className="px-4 py-3">Team</th>
                                          <th className="px-4 py-3 text-center text-amber-400/90">Saved</th>
                                          <th className="px-4 py-3 text-center text-emerald-400/90">Uploaded</th>
                                          <th className="px-4 py-3 text-center text-amber-400 font-extrabold bg-amber-500/10">Simulated</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-stone-800/60 font-medium">
                                        {TEAMS.map(team => {
                                          const savedPoints = getTeamScore(team, 'admin');
                                          const uploadedPoints = getTeamScore(team, 'public');
                                          let simulatedPoints = 0;
                                          simPublishedProgramIds.forEach(progId => {
                                            if (programTeamPoints[progId] && programTeamPoints[progId][team]) {
                                              simulatedPoints += programTeamPoints[progId][team];
                                            }
                                          });
                                          return {
                                            name: team,
                                            savedPoints,
                                            uploadedPoints,
                                            simulatedPoints,
                                          };
                                        }).sort((a, b) => b.simulatedPoints - a.simulatedPoints).map((team, idx) => (
                                          <tr key={team.name} className="hover:bg-stone-900/50 transition-colors">
                                            <td className="px-4 py-3 text-center">
                                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                                                idx === 0 ? 'bg-amber-400 text-amber-950' : 
                                                idx === 1 ? 'bg-stone-300 text-stone-900' : 
                                                idx === 2 ? 'bg-amber-700/80 text-amber-100' : 'text-stone-500'
                                              }`}>
                                                {idx + 1}
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-amber-100 text-sm">
                                              {team.name}
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-amber-300/80">
                                              {team.savedPoints} <span className="text-[10px] font-normal text-stone-500">pts</span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-emerald-400">
                                              {team.uploadedPoints} <span className="text-[10px] font-normal text-stone-500">pts</span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-black text-amber-400 bg-amber-500/5 text-base">
                                              {team.simulatedPoints} <span className="text-xs font-normal text-amber-500/70">pts</span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              {/* Simulator Table */}
                              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 overflow-hidden">
                                <h3 className="text-lg font-black text-amber-300 mb-4 flex items-center gap-2">
                                  <Activity className="w-5 h-5 text-amber-50" />
                                  Simulation Table
                                </h3>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-stone-900 text-stone-400">
                                      <tr>
                                        <th className="px-4 py-3 rounded-tl-xl w-32">Programme Code</th>
                                        <th className="px-4 py-3">Programme Name</th>
                                        <th className="px-4 py-3">Team Points</th>
                                        <th className="px-4 py-3 text-center w-28">Action</th>
                                         <th className="px-4 py-3 rounded-tr-xl text-center w-28">Printing</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-800">
                                      {simRows.map((row, index) => {
                                        const selectedProg = programs.find(p => p.id === row.selectedProgramId);
                                        
                                        // Calculate Team Points for this program
                                        const teamPoints = selectedProg ? (programTeamPoints[selectedProg.id] || {}) : {};

                                        return (
                                          <tr key={row.id} className="hover:bg-stone-900 transition-colors">
                                            <td className="px-4 py-3">
                                              <input
                                                type="text"
                                                value={row.programCode}
                                                placeholder="Code..."
                                                className="bg-stone-900 border border-stone-800 rounded-lg p-2 text-amber-100 outline-none focus:border-amber-500/50 w-24 uppercase font-mono text-xs"
                                                onChange={(e) => {
                                                  const code = e.target.value.toUpperCase();
                                                  const matchedProg = programs.find(p => p.code?.toUpperCase() === code);
                                                  const oldProgId = row.selectedProgramId;
                                                  const newProgId = matchedProg ? matchedProg.id : null;
                                                  
                                                  if (oldProgId && oldProgId !== newProgId) {
                                                    saveAndSetPrintProgramIds(prev => prev.filter(id => id !== oldProgId));
                                                  }

                                                  saveAndSetSimRows(prev => prev.map(r => 
                                                    r.id === row.id 
                                                      ? { ...r, programCode: code, selectedProgramId: newProgId }
                                                      : r
                                                  ));
                                                }}
                                              />
                                            </td>
                                            <td className="px-4 py-3 text-amber-100 font-bold text-xs">
                                              {selectedProg ? selectedProg.name : <span className="text-stone-600 font-normal italic">Enter code...</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                              {selectedProg ? (
                                                <div className="flex flex-wrap gap-2 text-[10px]">
                                                  {Object.entries(teamPoints).map(([t, p]) => (
                                                    <span key={t} className="bg-stone-900 px-2 py-1 rounded text-amber-400 font-bold border border-stone-800">
                                                      {t}: {p}
                                                    </span>
                                                  ))}
                                                  {Object.keys(teamPoints).length === 0 && <span className="text-stone-500 italic">No results</span>}
                                                </div>
                                              ) : (
                                                <span className="text-stone-600">-</span>
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <button
                                                disabled={!selectedProg}
                                                onClick={() => {
                                                  if (selectedProg) {
                                                    const isSimPublished = simPublishedProgramIds.includes(selectedProg.id);
                                                    if (isSimPublished) {
                                                      saveAndSetSimPublishedProgramIds(prev => prev.filter(id => id !== selectedProg.id));
                                                    } else {
                                                      saveAndSetSimPublishedProgramIds(prev => [...prev, selectedProg.id]);
                                                    }
                                                  }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full ${
                                                  !selectedProg 
                                                    ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                    : (selectedProg && simPublishedProgramIds.includes(selectedProg.id))
                                                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                }`}
                                              >
                                                {(selectedProg && simPublishedProgramIds.includes(selectedProg.id)) ? 'Unpublish' : 'Publish'}
                                              </button>
                                            </td>
                                             <td className="px-4 py-3 text-center">
                                               {(() => {
                                                 const isPrintingOn = selectedProg ? printProgramIds.includes(selectedProg.id) : false;
                                                 return (
                                                   <button
                                                     disabled={!selectedProg}
                                                     onClick={() => {
                                                       if (selectedProg) {
                                                         if (isPrintingOn) {
                                                           saveAndSetPrintProgramIds(prev => prev.filter(id => id !== selectedProg.id));
                                                         } else {
                                                           saveAndSetPrintProgramIds(prev => [...prev, selectedProg.id]);
                                                         }
                                                       }
                                                     }}
                                                     className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full flex items-center justify-center gap-1 ${
                                                       !selectedProg 
                                                         ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                         : isPrintingOn
                                                         ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm cursor-pointer'
                                                         : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 cursor-pointer'
                                                     }`}
                                                   >
                                                     <Printer className="w-3.5 h-3.5" />
                                                     <span>{isPrintingOn ? 'Printing ON' : 'Printing OFF'}</span>
                                                   </button>
                                                 );
                                               })()}
                                             </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                          </div>
                        </div>
                      )}
                      
                                            {adminTab === 'active_status' && (
                        <div className="space-y-6">
                          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6">
                            <h3 className="text-lg font-black text-amber-300 mb-2 flex items-center gap-2">
                              <Activity className="w-5 h-5 text-amber-50" />
                              Active Status Badges
                            </h3>
                            <p className="text-xs text-stone-400 mb-6">
                              View and manage all programmes that are currently published or set for printing across the site.
                            </p>

                            {simPublishedProgramIds.length === 0 && printProgramIds.length === 0 ? (
                              <div className="text-center py-12 text-stone-500 text-sm bg-stone-900/50 rounded-xl border border-stone-800/80">
                                No programmes are currently published or active for printing.
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {/* Published Programs */}
                                <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-xl space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-amber-400 flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                      Published Programmes ({simPublishedProgramIds.length})
                                    </span>
                                    {simPublishedProgramIds.length > 0 && (
                                      <button
                                        onClick={() => saveAndSetSimPublishedProgramIds([])}
                                        className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 transition-colors"
                                      >
                                        Unpublish All
                                      </button>
                                    )}
                                  </div>
                                  {simPublishedProgramIds.length === 0 ? (
                                    <p className="text-xs text-stone-500 italic">No published programmes</p>
                                  ) : (
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                      {simPublishedProgramIds.map(id => {
                                        const p = programs.find(prog => prog.id === id);
                                        if (!p) return null;
                                        return (
                                          <span key={id} className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
                                            {p.code ? `[${p.code}] ` : ''}{p.name}
                                            <button
                                              onClick={() => saveAndSetSimPublishedProgramIds(prev => prev.filter(pid => pid !== id))}
                                              className="hover:text-amber-100 ml-1 font-bold text-sm"
                                              title="Unpublish"
                                            >
                                              ✕
                                            </button>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* Printing Enabled Programs */}
                                <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-xl space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-indigo-400 flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                                      Printing Enabled Programmes ({printProgramIds.length})
                                    </span>
                                    {printProgramIds.length > 0 && (
                                      <button
                                        onClick={() => saveAndSetPrintProgramIds([])}
                                        className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 transition-colors"
                                      >
                                        Clear All Printing
                                      </button>
                                    )}
                                  </div>
                                  {printProgramIds.length === 0 ? (
                                    <p className="text-xs text-stone-500 italic">No programmes enabled for printing</p>
                                  ) : (
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                      {printProgramIds.map(id => {
                                        const p = programs.find(prog => prog.id === id);
                                        if (!p) return null;
                                        return (
                                          <span key={id} className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
                                            {p.code ? `[${p.code}] ` : ''}{p.name}
                                            <button
                                              onClick={() => saveAndSetPrintProgramIds(prev => prev.filter(pid => pid !== id))}
                                              className="hover:text-indigo-100 ml-1 font-bold text-sm"
                                              title="Turn Printing OFF"
                                            >
                                              ✕
                                            </button>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {adminTab === 'printing' && (
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 text-black print:p-0 print:border-none print:m-0 print:bg-transparent">
                          <div className="print:hidden mb-6 space-y-4 border-b border-gray-200 pb-4">
                            <h4 className="text-xl font-bold flex items-center gap-2">
                              <Printer className="w-5 h-5" /> Print Results
                            </h4>
                            <div className="flex flex-wrap gap-4 items-center">
                              <label className="font-bold text-sm">Select Programmeme to Add:</label>
                              <input 
                                type="text" 
                                placeholder="Type Code..."
                                onChange={(e) => {
                                   const typedCode = e.target.value.trim().toUpperCase();
                                   const found = programs.find(p => p.code?.toUpperCase() === typedCode);
                                   if (found) {
                                      setPrintProgramId(found.id);
                                   }
                                }}
                                className="border border-gray-300 rounded-xl p-2 text-black bg-white outline-none w-32"
                              />
                              <select
                                value={printProgramId}
                                onChange={(e) => setPrintProgramId(e.target.value)}
                                className="border border-gray-300 rounded-xl p-2 text-black bg-white outline-none flex-1 min-w-[200px]"
                              >
                                <option value="">-- Select a Programme --</option>
                                {programs.map(p => (
                                  <option key={p.id} value={p.id}>{p.code ? `[${p.code}] ` : ''}{p.name} ({p.category})</option>
                                ))}
                              </select>
                              <button 
                                onClick={() => {
                                  if (printProgramId && !printProgramIds.includes(printProgramId)) {
                                    saveAndSetPrintProgramIds([...printProgramIds, printProgramId]);
                                    setPrintProgramId('');
                                  }
                                }}
                                disabled={!printProgramId}
                                className="bg-stone-800 hover:bg-stone-900 disabled:bg-gray-400 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                              >
                                Add
                              </button>
                            </div>

                            {/* Category and Quick Select buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">Quick Add:</span>
                              <button 
                                type="button"
                                onClick={() => {
                                  const allIds = programs.map(p => p.id);
                                  saveAndSetPrintProgramIds(allIds);
                                }}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                              >
                                + Add All Programmes ({programs.length})
                              </button>
                              {Array.from(new Set(programs.map(p => p.category))).map(cat => {
                                if (!cat) return null;
                                const catProgs = programs.filter(p => p.category === cat);
                                if (catProgs.length === 0) return null;
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                      const catIds = catProgs.map(p => p.id);
                                      const updated = Array.from(new Set([...printProgramIds, ...catIds]));
                                      saveAndSetPrintProgramIds(updated);
                                    }}
                                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    + Add {cat} ({catProgs.length})
                                  </button>
                                );
                              })}
                              {printProgramIds.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => saveAndSetPrintProgramIds([])}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-colors ml-auto cursor-pointer"
                                >
                                  Clear Selected ({printProgramIds.length})
                                </button>
                              )}
                            </div>
                            
                            {/* Selected Programs List */}
                            {printProgramIds.length > 0 && (
                              <div className="flex flex-wrap gap-2 py-2">
                                {printProgramIds.map(id => {
                                  const p = programs.find(prog => prog.id === id);
                                  if (!p) return null;
                                  return (
                                    <div key={id} className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-bold">
                                      {p.code ? `[${p.code}] ` : ''}{p.name}
                                      <button 
                                        onClick={() => saveAndSetPrintProgramIds(printProgramIds.filter(pid => pid !== id))}
                                        className="text-gray-500 hover:text-red-500 ml-2"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-4 items-center pt-2">
                              <button 
                                onClick={() => {
                                  if (window.self !== window.top) {
                                    showToast('Please open the app in a new tab to use the Print/PDF feature.', 'error');
                                    return;
                                  }
                                  const originalTitle = document.title;
                                  document.title = `${festivalName} - Results`;
                                  window.print();
                                  setTimeout(() => { document.title = originalTitle; }, 1000);
                                }}
                                disabled={printProgramIds.length === 0}
                                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                              >
                                <Printer className="w-4 h-4" /> Print All
                              </button>
                              <button 
                                onClick={() => {
                                  if (printProgramIds.length === 0) return;
                                  
                                  const doc = new jsPDF('landscape', 'mm', 'a4');
                                  const safeFestName = cleanPDFText(festivalName) || 'Sargam Art Fest';
                                  const safeFestYear = cleanPDFText(festivalYear) || '2026-27';
                                  
                                  const programChunks = [];
                                  for (let i = 0; i < printProgramIds.length; i += 5) {
                                    programChunks.push(printProgramIds.slice(i, i + 5));
                                  }
                                  
                                  programChunks.forEach((chunk, pageIndex) => {
                                    if (pageIndex > 0) {
                                      doc.addPage();
                                    }
                                    
                                    doc.setFontSize(16);
                                    doc.text(safeFestName, 148, 12, { align: 'center' });
                                    doc.setFontSize(11);
                                    doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${safeFestYear}`, 148, 18, { align: 'center' });
                                    
                                    let currentY = 26;
                                    
                                    chunk.forEach(pid => {
                                      const prog = programs.find(p => p.id === pid);
                                      if (!prog) return;
                                      
                                      const winners = (globalProgramsData.progScorers[prog.id] || []).map(sc => ({
                                        studentCode: cleanPDFText(sc.studentCode),
                                        studentName: cleanPDFText(sc.name),
                                        rank: sc.rank,
                                        grade: cleanPDFText(sc.grade),
                                        points: sc.points,
                                        class: cleanPDFText(sc.class),
                                        team: cleanPDFText(sc.team)
                                      }));
                                      
                                      winners.sort((a, b) => {
                                        if (a.rank && b.rank) return a.rank - b.rank;
                                        if (a.rank) return -1;
                                        if (b.rank) return 1;
                                        const gradeOrder: any = { 'A': 1, 'B': 2, 'C': 3 };
                                        return (gradeOrder[a.grade] || 99) - (gradeOrder[b.grade] || 99);
                                      });
                                      
                                      doc.setFontSize(11);
                                      const title = `Programme: ${prog.code ? `[${cleanPDFText(prog.code)}] ` : ''}${cleanPDFText(prog.name)}`;
                                      doc.text(title, 14, currentY);
                                      
                                      doc.setFontSize(9);
                                      doc.text(`Category: ${cleanPDFText(prog.category)}`, 280, currentY, { align: 'right' });
                                      
                                      currentY += 2;
                                      
                                      if (winners.length > 0) {
                                        const tableData = winners.map(w => [
                                          w.rank === 1 ? 'I' : w.rank === 2 ? 'II' : w.rank === 3 ? 'III' : '-',
                                          w.grade || '-',
                                          w.studentCode,
                                          w.studentName,
                                          w.class,
                                          w.team,
                                          w.points
                                        ]);
                                        
                                        autoTable(doc, {
                                          startY: currentY,
                                          head: [['Pos', 'Grade', 'Chess No.', 'Student Name', 'Class', 'Team', 'Pts']],
                                          body: tableData,
                                          theme: 'grid',
                                          headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', fontSize: 9, halign: 'center', cellPadding: 1 },
                                          bodyStyles: { fontSize: 9, cellPadding: 1 },
                                          alternateRowStyles: { fillColor: [230, 230, 230] },
                                          columnStyles: {
                                            0: { halign: 'center', cellWidth: 15 },
                                            1: { halign: 'center', cellWidth: 20 },
                                            2: { halign: 'center', cellWidth: 25 },
                                            3: { halign: 'left' },
                                            4: { halign: 'center', cellWidth: 25 },
                                            5: { halign: 'center', cellWidth: 35 },
                                            6: { halign: 'center', cellWidth: 15 }
                                          },
                                          margin: { left: 14, right: 14 },
                                          pageBreak: 'avoid'
                                        });
                                        currentY = (doc as any).lastAutoTable.finalY + 5;
                                      } else {
                                        doc.setFontSize(9);
                                        doc.text('No results found for this programme.', 148, currentY + 3, { align: 'center' });
                                        currentY += 5;
                                      }
                                    });
                                  });
                                  
                                  const pageCount = (doc.internal as any).getNumberOfPages();
                                  for (let i = 1; i <= pageCount; i++) {
                                    doc.setPage(i);
                                    doc.setFontSize(8);
                                    doc.text(`Page ${i} of ${pageCount}`, 280, 202, { align: 'right' });
                                  }
                                  
                                  doc.save(`${safeFestName}_Results.pdf`);
                                }}
                                disabled={printProgramIds.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" /> Download All as PDF
                              </button>
                              <button 
                                onClick={() => {
                                  const doc = new jsPDF('portrait', 'mm', 'a4');
                                  const safeFestName = cleanPDFText(festivalName) || 'Sargam Art Fest';
                                  const safeFestYear = cleanPDFText(festivalYear) || '2026-27';

                                  doc.setFontSize(22);
                                  doc.text(safeFestName, 105, 18, { align: 'center' });
                                  doc.setFontSize(12);
                                  doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${safeFestYear}`, 105, 26, { align: 'center' });
                                  doc.setFontSize(15);
                                  doc.text('TEAM TOTAL STANDINGS', 105, 36, { align: 'center' });
                                  
                                  const teamSimulatedTotals = TEAMS.map(team => {
                                    let simulatedPoints = 0;
                                    simPublishedProgramIds.forEach(progId => {
                                      if (programTeamPoints[progId] && programTeamPoints[progId][team]) {
                                        simulatedPoints += programTeamPoints[progId][team];
                                      }
                                    });
                                    return {
                                      name: cleanPDFText(team) || team,
                                      simulatedPoints
                                    };
                                  }).sort((a, b) => b.simulatedPoints - a.simulatedPoints);

                                  const tableData = teamSimulatedTotals.map((t, i) => [
                                    i + 1,
                                    t.name,
                                    t.simulatedPoints
                                  ]);

                                  autoTable(doc, {
                                    startY: 44,
                                    head: [['Rank', 'Team Name', 'Total Points']],
                                    body: tableData,
                                    theme: 'grid',
                                    headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 13, cellPadding: 8 },
                                    bodyStyles: { fontSize: 12, cellPadding: 8 },
                                    alternateRowStyles: { fillColor: [230, 230, 230] },
                                    columnStyles: {
                                      0: { halign: 'center', cellWidth: 25 },
                                      1: { halign: 'left' },
                                      2: { halign: 'center', cellWidth: 45, fontStyle: 'bold' }
                                    },
                                    margin: { left: 30, right: 30 }
                                  });

                                  doc.setFontSize(9);
                                  doc.text('Page 1 of 1', 190, 280, { align: 'right' });

                                  doc.save(`${safeFestName}_Team_Totals.pdf`);
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                              >
                                <Trophy className="w-4 h-4" /> Download Team Totals
                              </button>

                              <button 
                                onClick={() => {
                                  const doc = new jsPDF('portrait', 'mm', 'a4');
                                  const safeFestName = cleanPDFText(festivalName) || 'Sargam Art Fest';
                                  const safeFestYear = cleanPDFText(festivalYear) || '2026-27';

                                  doc.setFontSize(16);
                                  doc.text(safeFestName, 105, 12, { align: 'center' });
                                  doc.setFontSize(10);
                                  doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${safeFestYear}`, 105, 17, { align: 'center' });
                                  doc.setFontSize(12);
                                  doc.text('CATEGORY STANDINGS', 105, 23, { align: 'center' });

                                  let currentY = 28;

                                  CATEGORIES.forEach((cat) => {
                                    const ranking = TEAMS.map(team => ({
                                      team: cleanPDFText(team) || team,
                                      total: getCategoryRank(team, cat, 'admin')
                                    })).sort((a, b) => b.total - a.total);

                                    doc.setFontSize(9);
                                    doc.text(`Category: ${cleanPDFText(cat)}`, 20, currentY);

                                    const tableData = ranking.map((r, i) => [
                                      i + 1,
                                      r.team,
                                      `${r.total} pts`
                                    ]);

                                    autoTable(doc, {
                                      startY: currentY + 1.5,
                                      head: [['Rank', 'Team Name', 'Total Points']],
                                      body: tableData,
                                      theme: 'grid',
                                      headStyles: { fillColor: [180, 83, 9], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 8, cellPadding: 1.5 },
                                      bodyStyles: { fontSize: 8, cellPadding: 1.5 },
                                      alternateRowStyles: { fillColor: [230, 230, 230] },
                                      columnStyles: {
                                        0: { halign: 'center', cellWidth: 15 },
                                        1: { halign: 'left' },
                                        2: { halign: 'center', cellWidth: 30, fontStyle: 'bold' }
                                      },
                                      margin: { left: 20, right: 20, top: 5, bottom: 5 },
                                      pageBreak: 'avoid'
                                    });

                                    currentY = (doc as any).lastAutoTable.finalY + 4;
                                  });

                                  doc.setFontSize(8);
                                  doc.text('Page 1 of 1', 190, 285, { align: 'right' });

                                  doc.save(`${safeFestName}_Category_Standings.pdf`);
                                }}
                                className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                              >
                                <Trophy className="w-4 h-4" /> Download Category Standings
                              </button>

                              <button 
                                onClick={() => {
                                  const doc = new jsPDF('portrait', 'mm', 'a4');
                                  const safeFestName = cleanPDFText(festivalName) || 'Sargam Art Fest';
                                  const safeFestYear = cleanPDFText(festivalYear) || '2026-27';

                                  doc.setFontSize(16);
                                  doc.text(safeFestName, 105, 12, { align: 'center' });
                                  doc.setFontSize(10);
                                  doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${safeFestYear}`, 105, 17, { align: 'center' });
                                  doc.setFontSize(12);
                                  doc.text('OVERALL TOP INDIVIDUAL PERFORMERS', 105, 23, { align: 'center' });

                                  const topPerformers = [...students]
                                    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
                                    .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
                                    .filter(s => s.points > 0)
                                    .sort((a, b) => b.points - a.points)
                                    .slice(0, 10);

                                  const tableData = topPerformers.map((s, i) => [
                                    i + 1,
                                    cleanPDFText(s.code),
                                    cleanPDFText(s.name),
                                    cleanPDFText(s.category),
                                    cleanPDFText(s.class),
                                    cleanPDFText(s.team),
                                    `${s.points} pts`
                                  ]);

                                  autoTable(doc, {
                                    startY: 28,
                                    head: [['Rank', 'Chess No.', 'Student Name', 'Category', 'Class', 'Team', 'Total Points']],
                                    body: tableData,
                                    theme: 'grid',
                                    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 9, cellPadding: 3 },
                                    bodyStyles: { fontSize: 8.5, cellPadding: 3 },
                                    alternateRowStyles: { fillColor: [230, 230, 230] },
                                    columnStyles: {
                                      0: { halign: 'center', cellWidth: 15 },
                                      1: { halign: 'center', cellWidth: 25 },
                                      2: { halign: 'left' },
                                      3: { halign: 'center', cellWidth: 30 },
                                      4: { halign: 'center', cellWidth: 20 },
                                      5: { halign: 'center', cellWidth: 30 },
                                      6: { halign: 'center', cellWidth: 25, fontStyle: 'bold' }
                                    },
                                    margin: { left: 15, right: 15, top: 5, bottom: 5 }
                                  });

                                  doc.setFontSize(8);
                                  doc.text('Page 1 of 1', 190, 285, { align: 'right' });

                                  doc.save(`${safeFestName}_Overall_Top_Individuals.pdf`);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                              >
                                <User className="w-4 h-4" /> Download Overall Top Individuals
                              </button>

                              <button 
                                onClick={() => {
                                  const doc = new jsPDF('portrait', 'mm', 'a4');
                                  const safeFestName = cleanPDFText(festivalName) || 'Sargam Art Fest';
                                  const safeFestYear = cleanPDFText(festivalYear) || '2026-27';

                                  doc.setFontSize(16);
                                  doc.text(safeFestName, 105, 12, { align: 'center' });
                                  doc.setFontSize(10);
                                  doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${safeFestYear}`, 105, 17, { align: 'center' });
                                  doc.setFontSize(12);
                                  doc.text('TOP INDIVIDUALS BY CATEGORY', 105, 23, { align: 'center' });

                                  let currentY = 28;

                                  CATEGORIES.forEach((cat) => {
                                    const topInCat = students
                                      .filter(s => s.category === cat && !s.code.startsWith('TEAM-'))
                                      .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
                                      .filter(s => s.points > 0)
                                      .sort((a, b) => b.points - a.points)
                                      .slice(0, 3);

                                    doc.setFontSize(9);
                                    doc.text(`Category: ${cleanPDFText(cat)}`, 15, currentY);

                                    const tableData = topInCat.map((s, i) => [
                                      i + 1,
                                      cleanPDFText(s.code),
                                      cleanPDFText(s.name),
                                      cleanPDFText(s.class),
                                      cleanPDFText(s.team),
                                      `${s.points} pts`
                                    ]);

                                    if (tableData.length === 0) {
                                      tableData.push(['-', '-', 'No scorers yet', '-', '-', '0 pts']);
                                    }

                                    autoTable(doc, {
                                      startY: currentY + 1.5,
                                      head: [['Rank', 'Chess No.', 'Student Name', 'Class', 'Team', 'Points']],
                                      body: tableData,
                                      theme: 'grid',
                                      headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 8, cellPadding: 1.5 },
                                      bodyStyles: { fontSize: 8, cellPadding: 1.5 },
                                      alternateRowStyles: { fillColor: [230, 230, 230] },
                                      columnStyles: {
                                        0: { halign: 'center', cellWidth: 15 },
                                        1: { halign: 'center', cellWidth: 25 },
                                        2: { halign: 'left' },
                                        3: { halign: 'center', cellWidth: 20 },
                                        4: { halign: 'center', cellWidth: 35 },
                                        5: { halign: 'center', cellWidth: 25, fontStyle: 'bold' }
                                      },
                                      margin: { left: 15, right: 15, top: 5, bottom: 5 },
                                      pageBreak: 'avoid'
                                    });

                                    currentY = (doc as any).lastAutoTable.finalY + 4;
                                  });

                                  doc.setFontSize(8);
                                  doc.text('Page 1 of 1', 190, 285, { align: 'right' });

                                  doc.save(`${safeFestName}_Top_Individuals_By_Category.pdf`);
                                }}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                              >
                                <User className="w-4 h-4" /> Download Top Individuals by Category
                              </button>
                            </div>

                            {/* Registration Paper Section */}
                            <div className="mt-8 pt-6 border-t-2 border-gray-200">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <h4 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-indigo-600" /> REGISTRATION PAPER
                                </h4>
                                {programs.length > 0 && (
                                  <button
                                    onClick={() => {
                                      const getProgramRegisteredStudents = (progId: string) => {
                                        const prog = programs.find(p => p.id === progId);
                                        if (!prog) return [];
                                        const progRegs = registrations.filter(r => r.programId === prog.id);
                                        const registered = students.filter(s => {
                                          const isRegInTable = progRegs.some(r => r.studentCode.toUpperCase() === s.code.toUpperCase());
                                          const isRegInField = s.event === prog.name && (s.category === prog.category || prog.category === 'General' || s.category === 'General');
                                          return isRegInTable || isRegInField;
                                        });
                                        return registered.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));
                                      };

                                      const downloadRegistrationPaperPDF = (progsToPrint: Program[]) => {
                                        if (progsToPrint.length === 0) return;
                                        const doc = new jsPDF('portrait', 'mm', 'a4');
                                        const safeFestName = cleanPDFText(festivalName) || 'Sargam Art Fest';
                                        const safeFestYear = cleanPDFText(festivalYear) || '2026-27';

                                        let currentY = 12;

                                        const renderPageHeader = () => {
                                          doc.setFontSize(14);
                                          doc.setFont('helvetica', 'bold');
                                          doc.text(safeFestName, 105, currentY, { align: 'center' });
                                          doc.setFontSize(9);
                                          doc.setFont('helvetica', 'normal');
                                          doc.text(`ARTS FESTIVAL COMPETITION ${safeFestYear} - REGISTRATION PAPER`, 105, currentY + 5, { align: 'center' });
                                          currentY += 9;
                                          doc.setLineWidth(0.4);
                                          doc.line(15, currentY, 195, currentY);
                                          currentY += 6;
                                        };

                                        renderPageHeader();

                                        progsToPrint.forEach((prog) => {
                                          const regStudents = getProgramRegisteredStudents(prog.id);
                                          const rowCount = Math.max(regStudents.length, 1);
                                          const approxProgHeight = 15 + (rowCount + 1) * 7 + 6;

                                          if (currentY + approxProgHeight > 275 && currentY > 30) {
                                            doc.addPage();
                                            currentY = 12;
                                            renderPageHeader();
                                          }

                                          doc.setFontSize(10);
                                          doc.setFont('helvetica', 'bold');
                                          const progCodeStr = prog.code ? `[Code: ${cleanPDFText(prog.code)}] ` : '';
                                          doc.text(`${progCodeStr}${cleanPDFText(prog.name)} (${cleanPDFText(prog.category)})`, 15, currentY);
                                          doc.setFont('helvetica', 'normal');
                                          doc.text(`Participants: ${regStudents.length}`, 195, currentY, { align: 'right' });
                                          currentY += 3;

                                          const tableData = regStudents.map((st, i) => [
                                            '',
                                            i + 1,
                                            cleanPDFText(st.code),
                                            cleanPDFText(st.name),
                                            cleanPDFText(st.class || 'N/A'),
                                            cleanPDFText(st.team),
                                            ''
                                          ]);

                                          if (tableData.length === 0) {
                                            tableData.push(['', '-', '-', 'No registered participants', '-', '-', '']);
                                          }

                                          autoTable(doc, {
                                            startY: currentY,
                                            head: [['Check', 'Sl No', 'Chess No.', 'Student Name', 'Class', 'Team', 'Signature / Remarks']],
                                            body: tableData,
                                            theme: 'grid',
                                            headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 8.5, cellPadding: 2 },
                                            bodyStyles: { fontSize: 8, cellPadding: 2, minCellHeight: 6.5 },
                                            alternateRowStyles: { fillColor: [230, 230, 230] },
                                            columnStyles: {
                                              0: { halign: 'center', cellWidth: 14 },
                                              1: { halign: 'center', cellWidth: 10 },
                                              2: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
                                              3: { halign: 'left' },
                                              4: { halign: 'center', cellWidth: 16 },
                                              5: { halign: 'center', cellWidth: 28 },
                                              6: { halign: 'center', cellWidth: 32 }
                                            },
                                            margin: { left: 15, right: 15, top: 10, bottom: 10 },
                                            didDrawCell: (data) => {
                                              if (data.section === 'body' && data.column.index === 0 && data.row.raw && data.row.raw[1] !== '-') {
                                                const cell = data.cell;
                                                const squareSize = 3.5;
                                                const x = cell.x + (cell.width - squareSize) / 2;
                                                const y = cell.y + (cell.height - squareSize) / 2;
                                                doc.setDrawColor(0, 0, 0);
                                                doc.setLineWidth(0.3);
                                                doc.rect(x, y, squareSize, squareSize);
                                              }
                                            }
                                          });

                                          currentY = (doc as any).lastAutoTable.finalY + 8;
                                        });

                                        const totalPages = (doc as any).internal.getNumberOfPages();
                                        for (let i = 1; i <= totalPages; i++) {
                                          doc.setPage(i);
                                          doc.setFontSize(8);
                                          doc.text(`Page ${i} of ${totalPages}`, 195, 287, { align: 'right' });
                                        }

                                        const fileName = `${cleanPDFText(festivalName)}_All_Registration_Papers.pdf`;
                                        doc.save(fileName);
                                      };

                                      downloadRegistrationPaperPDF(programs);
                                    }}
                                    className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" /> Download All Registration Papers
                                  </button>
                                )}
                              </div>

                              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                                <div className="flex flex-wrap gap-3 items-center">
                                  <label className="font-bold text-sm text-stone-700">Search Programme Code / Name:</label>
                                  <input 
                                    type="text" 
                                    placeholder="Type Code (e.g. 101) or Name..."
                                    value={regPaperSearchQuery}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRegPaperSearchQuery(val);
                                      const found = programs.find(p => p.code?.toUpperCase() === val.trim().toUpperCase());
                                      if (found) {
                                        setRegPaperSelectedProgramId(found.id);
                                      } else if (regPaperSelectedProgramId) {
                                        setRegPaperSelectedProgramId('');
                                      }
                                    }}
                                    className="border border-stone-300 rounded-xl px-3 py-2 text-black bg-white outline-none w-64 shadow-sm text-sm"
                                  />
                                  
                                  <select
                                    value={regPaperSelectedProgramId}
                                    onChange={(e) => {
                                      setRegPaperSelectedProgramId(e.target.value);
                                      const p = programs.find(item => item.id === e.target.value);
                                      if (p && p.code) {
                                        setRegPaperSearchQuery(p.code);
                                      }
                                    }}
                                    className="border border-stone-300 rounded-xl px-3 py-2 text-black bg-white outline-none flex-1 min-w-[200px] shadow-sm text-sm"
                                  >
                                    <option value="">-- Select a Programme --</option>
                                    {programs.map(p => (
                                      <option key={p.id} value={p.id}>{p.code ? `[${p.code}] ` : ''}{p.name} ({p.category})</option>
                                    ))}
                                  </select>

                                  {(regPaperSearchQuery || regPaperSelectedProgramId) && (
                                    <button
                                      onClick={() => {
                                        setRegPaperSearchQuery('');
                                        setRegPaperSelectedProgramId('');
                                      }}
                                      className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                    >
                                      Clear Search
                                    </button>
                                  )}
                                </div>

                                {/* Display Searched / Selected Program(s) */}
                                {(() => {
                                  const getProgramRegisteredStudents = (progId: string) => {
                                    const prog = programs.find(p => p.id === progId);
                                    if (!prog) return [];
                                    const progRegs = registrations.filter(r => r.programId === prog.id);
                                    const registered = students.filter(s => {
                                      const isRegInTable = progRegs.some(r => r.studentCode.toUpperCase() === s.code.toUpperCase());
                                      const isRegInField = s.event === prog.name && (s.category === prog.category || prog.category === 'General' || s.category === 'General');
                                      return isRegInTable || isRegInField;
                                    });
                                    return registered.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));
                                  };

                                  const downloadRegistrationPaperPDF = (progsToPrint: Program[]) => {
                                    if (progsToPrint.length === 0) return;
                                    const doc = new jsPDF('portrait', 'mm', 'a4');
                                    const safeFestName = cleanPDFText(festivalName) || 'Sargam Art Fest';
                                    const safeFestYear = cleanPDFText(festivalYear) || '2026-27';

                                    let currentY = 12;

                                    const renderPageHeader = () => {
                                      doc.setFontSize(14);
                                      doc.setFont('helvetica', 'bold');
                                      doc.text(safeFestName, 105, currentY, { align: 'center' });
                                      doc.setFontSize(9);
                                      doc.setFont('helvetica', 'normal');
                                      doc.text(`ARTS FESTIVAL COMPETITION ${safeFestYear} - REGISTRATION PAPER`, 105, currentY + 5, { align: 'center' });
                                      currentY += 9;
                                      doc.setLineWidth(0.4);
                                      doc.line(15, currentY, 195, currentY);
                                      currentY += 6;
                                    };

                                    renderPageHeader();

                                    progsToPrint.forEach((prog) => {
                                      const regStudents = getProgramRegisteredStudents(prog.id);
                                      const rowCount = Math.max(regStudents.length, 1);
                                      const approxProgHeight = 15 + (rowCount + 1) * 7 + 6;

                                      if (currentY + approxProgHeight > 275 && currentY > 30) {
                                        doc.addPage();
                                        currentY = 12;
                                        renderPageHeader();
                                      }

                                      doc.setFontSize(10);
                                      doc.setFont('helvetica', 'bold');
                                      const progCodeStr = prog.code ? `[Code: ${cleanPDFText(prog.code)}] ` : '';
                                      doc.text(`${progCodeStr}${cleanPDFText(prog.name)} (${cleanPDFText(prog.category)})`, 15, currentY);
                                      doc.setFont('helvetica', 'normal');
                                      doc.text(`Participants: ${regStudents.length}`, 195, currentY, { align: 'right' });
                                      currentY += 3;

                                      const tableData = regStudents.map((st, i) => [
                                        '',
                                        i + 1,
                                        cleanPDFText(st.code),
                                        cleanPDFText(st.name),
                                        cleanPDFText(st.class || 'N/A'),
                                        cleanPDFText(st.team),
                                        ''
                                      ]);

                                      if (tableData.length === 0) {
                                        tableData.push(['', '-', '-', 'No registered participants', '-', '-', '']);
                                      }

                                      autoTable(doc, {
                                        startY: currentY,
                                        head: [['Check', 'Sl No', 'Chess No.', 'Student Name', 'Class', 'Team', 'Signature / Remarks']],
                                        body: tableData,
                                        theme: 'grid',
                                        headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 8.5, cellPadding: 2 },
                                        bodyStyles: { fontSize: 8, cellPadding: 2, minCellHeight: 6.5 },
                                        alternateRowStyles: { fillColor: [230, 230, 230] },
                                        columnStyles: {
                                          0: { halign: 'center', cellWidth: 14 },
                                          1: { halign: 'center', cellWidth: 10 },
                                          2: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
                                          3: { halign: 'left' },
                                          4: { halign: 'center', cellWidth: 16 },
                                          5: { halign: 'center', cellWidth: 28 },
                                          6: { halign: 'center', cellWidth: 32 }
                                        },
                                        margin: { left: 15, right: 15, top: 10, bottom: 10 },
                                        didDrawCell: (data) => {
                                          if (data.section === 'body' && data.column.index === 0 && data.row.raw && data.row.raw[1] !== '-') {
                                            const cell = data.cell;
                                            const squareSize = 3.5;
                                            const x = cell.x + (cell.width - squareSize) / 2;
                                            const y = cell.y + (cell.height - squareSize) / 2;
                                            doc.setDrawColor(0, 0, 0);
                                            doc.setLineWidth(0.3);
                                            doc.rect(x, y, squareSize, squareSize);
                                          }
                                        }
                                      });

                                      currentY = (doc as any).lastAutoTable.finalY + 8;
                                    });

                                    const totalPages = (doc as any).internal.getNumberOfPages();
                                    for (let i = 1; i <= totalPages; i++) {
                                      doc.setPage(i);
                                      doc.setFontSize(8);
                                      doc.text(`Page ${i} of ${totalPages}`, 195, 287, { align: 'right' });
                                    }

                                    const fileName = progsToPrint.length === 1 
                                      ? `${cleanPDFText(festivalName)}_Registration_Paper_${cleanPDFText(progsToPrint[0].code || progsToPrint[0].name)}.pdf`
                                      : `${cleanPDFText(festivalName)}_Registration_Papers.pdf`;

                                    doc.save(fileName);
                                  };

                                  let matchingPrograms: Program[] = [];
                                  if (regPaperSelectedProgramId) {
                                    const p = programs.find(item => item.id === regPaperSelectedProgramId);
                                    if (p) matchingPrograms = [p];
                                  } else if (regPaperSearchQuery.trim()) {
                                    const q = regPaperSearchQuery.trim().toLowerCase();
                                    matchingPrograms = programs.filter(p => p.code?.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
                                  }

                                  if (matchingPrograms.length === 0) {
                                    return (
                                      <div className="text-sm text-stone-500 italic p-4 bg-white rounded-xl border border-stone-200 text-center">
                                        Type a programme code or select a programme above to view its Registration Paper & chess numbers.
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="space-y-4">
                                      {matchingPrograms.map(prog => {
                                        const regStudents = getProgramRegisteredStudents(prog.id);
                                        return (
                                          <div key={prog.id} className="bg-white border border-stone-300 rounded-xl p-4 shadow-sm space-y-3">
                                            {/* Header with Programme Code and Name */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="bg-indigo-700 text-white font-bold text-sm px-2.5 py-1 rounded-md">
                                                  {prog.code ? `[${prog.code}]` : 'CODE'}
                                                </span>
                                                <h5 className="font-bold text-lg text-stone-900">{prog.name}</h5>
                                                <span className="text-xs bg-stone-100 border border-stone-300 px-2.5 py-0.5 rounded text-stone-600 font-semibold">
                                                  {prog.category}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-stone-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                                                  Registered: {regStudents.length}
                                                </span>
                                                <button
                                                  onClick={() => downloadRegistrationPaperPDF([prog])}
                                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                                >
                                                  <Download className="w-3.5 h-3.5" /> Download Registration Paper (PDF)
                                                </button>
                                              </div>
                                            </div>

                                            {/* Registered Chess Numbers with Small Squares */}
                                            <div>
                                              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                                                Registered Chess Numbers ({regStudents.length}):
                                              </div>
                                              {regStudents.length === 0 ? (
                                                <div className="text-xs text-stone-400 italic">No registered students found for this programme.</div>
                                              ) : (
                                                <div className="flex flex-wrap gap-2.5">
                                                  {regStudents.map(st => (
                                                    <div 
                                                      key={st.id} 
                                                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/50 border-2 border-stone-700 rounded-lg font-mono text-sm font-bold text-stone-900 shadow-2xs"
                                                    >
                                                      <span className="w-4 h-4 border-2 border-stone-900 bg-white rounded-xs inline-block flex-shrink-0" title="Check Box"></span>
                                                      <span>{st.code}</span>
                                                      <span className="text-xs text-stone-600 font-sans font-normal">({st.team})</span>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                          
                          {/* Printable area */}
                          {printProgramIds.length > 0 && (
                            <div className="print-container bg-white text-black print:m-0 print:p-0 w-full">
                              {(() => {
                                const programChunks = [];
                                for (let i = 0; i < printProgramIds.length; i += 5) {
                                  programChunks.push(printProgramIds.slice(i, i + 5));
                                }
                                
                                return programChunks.map((chunk, pageIndex) => (
                                  <div key={pageIndex} className={`w-full flex flex-col min-h-[95vh] ${pageIndex > 0 ? 'print-page-break mt-16 print:mt-0' : ''}`}>
                                     {/* Single Page Header */}
                                     <div className="text-center mb-8 pt-4 hidden print:block">
                                        <h1 className="text-3xl font-extrabold uppercase tracking-wide">{festivalName}</h1>
                                        <h2 className="text-lg font-bold mt-1 text-gray-700">ARTS FESTIVAL COMPETITION RESULTS {festivalYear}</h2>
                                     </div>
                                     
                                     <div className="flex-1">
                                      {chunk.map((pid) => {
                                        const prog = programs.find(p => p.id === pid);
                                        if (!prog) return null;
                                        
                                        const winners = (globalProgramsData.progScorers[prog.id] || []).map(sc => ({
                                          studentCode: sc.studentCode,
                                          studentName: sc.name,
                                          rank: sc.rank,
                                          grade: sc.grade,
                                          points: sc.points,
                                          class: sc.class,
                                          team: sc.team
                                        }));
                                        
                                        winners.sort((a, b) => {
                                          if (a.rank && b.rank) return a.rank - b.rank;
                                          if (a.rank) return -1;
                                          if (b.rank) return 1;
                                          const gradeOrder: any = { 'A': 1, 'B': 2, 'C': 3 };
                                          return (gradeOrder[a.grade] || 99) - (gradeOrder[b.grade] || 99);
                                        });
                                
                                        return (
                                          <div key={pid} className="mb-10 w-full" style={{ pageBreakInside: 'avoid' }}>
                                             <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4 px-1">
                                                <h3 className="text-2xl font-bold">Programme: <span className="font-extrabold">{prog.code ? `[${prog.code}] ` : ''}{prog.name}</span></h3>
                                                <div className="font-bold text-lg">Category: {prog.category}</div>
                                             </div>
                                             
                                             {winners.length > 0 ? (
                                               <table className="w-full text-left border-collapse border-2 border-black mb-4">
                                                 <thead>
                                                   <tr className="bg-gray-100">
                                                     <th className="border border-black p-4 w-16 text-center font-bold text-lg">Pos</th>
                                                     <th className="border border-black p-4 w-16 text-center font-bold text-lg">Grade</th>
                                                     <th className="border border-black p-4 w-24 text-center font-bold text-lg">Chess No.</th>
                                                     <th className="border border-black p-4 text-lg">Student Name</th>
                                                     <th className="border border-black p-4 w-24 text-center text-lg">Class</th>
                                                     <th className="border border-black p-4 w-32 text-center text-lg">Team</th>
                                                     <th className="border border-black p-4 w-16 text-center text-lg">Pts</th>
                                                   </tr>
                                                 </thead>
                                                 <tbody>
                                                   {winners.map((w, i) => (
                                                     <tr key={i} className={`hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-200 print-zebra-even' : 'bg-white'}`}>
                                                       <td className="border border-black p-4 font-bold text-xl text-center">
                                                         {w.rank === 1 ? 'I' : w.rank === 2 ? 'II' : w.rank === 3 ? 'III' : '-'}
                                                       </td>
                                                       <td className="border border-black p-4 font-bold text-xl text-center">
                                                         {w.grade || '-'}
                                                       </td>
                                                       <td className="border border-black p-4 font-bold text-xl text-center">
                                                         {w.studentCode}
                                                       </td>
                                                       <td className="border border-black p-4 font-bold text-xl">{w.studentName}</td>
                                                       <td className="border border-black p-4 text-center font-semibold text-lg">{w.class}</td>
                                                       <td className="border border-black p-4 text-center font-semibold text-lg">{w.team}</td>
                                                       <td className="border border-black p-4 text-center font-bold text-xl">{w.points}</td>
                                                     </tr>
                                                   ))}
                                                 </tbody>
                                               </table>
                                             ) : (
                                               <div className="text-center font-bold text-gray-500 py-6 print:hidden">No results found for this programme.</div>
                                             )}
                                          </div>
                                        );
                                      })}
                                     </div>
                                     
                                     {/* Single Page Footer */}
                                     <div className="mt-auto pt-4 flex justify-between px-4 text-sm font-semibold text-gray-500 border-t border-gray-300 hidden print:flex">
                                        <div>Generated by AI Studio</div>
                                        <div>Page {pageIndex + 1} of {programChunks.length}</div>
                                     </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          )}
                        </div>
                      )}

                      {adminTab === 'all_programs' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-4 overflow-x-auto">
                          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-amber-500/10 pb-3 gap-4">
                            <h4 className="text-amber-300 font-bold flex items-center gap-2">
                              <List className="w-5 h-5" /> All Programmes Overview
                            </h4>
                            <div className="relative w-full md:w-72">
                              <input 
                                type="text" 
                                placeholder="Search by code or name..." 
                                value={adminAllProgramsSearchQuery}
                                onChange={(e) => setAdminAllProgramsSearchQuery(e.target.value)}
                                className="w-full bg-stone-950 border border-amber-500/30 rounded-xl py-2 pl-9 pr-4 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                              />
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            </div>
                          </div>
                            
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                              <tr className="border-b border-stone-800 text-stone-400">
                                <th className="p-3 font-bold">Code</th>
                                <th className="p-3 font-bold">Programme Name</th>
                                <th className="p-3 font-bold">Category</th>
                                <th className="p-3 font-bold text-center">Participants</th>
                                <th className="p-3 font-bold">Point Scorers</th>
                                <th className="p-3 font-bold">Team Points</th>
                                <th className="p-3 font-bold text-center">Public Dashboard</th>
                                <th className="p-3 font-bold text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {programs.filter(prog => 
                                !adminAllProgramsSearchQuery || 
                                prog.name.toLowerCase().includes(adminAllProgramsSearchQuery.toLowerCase()) || 
                                (prog.code && prog.code.toLowerCase().includes(adminAllProgramsSearchQuery.toLowerCase()))
                              ).map(prog => {
                                const participantsCount = globalProgramsData.regCount[prog.id] || 0;
                                const scorers = globalProgramsData.progScorers[prog.id] || [];
                                const teamPoints: Record<string, number> = {};
                                scorers.forEach(sc => {
                                  teamPoints[sc.team] = (teamPoints[sc.team] || 0) + sc.points;
                                });
                                
                                return (
                                  <tr key={prog.id} className="border-b border-stone-800/50 hover:bg-stone-800/20 transition-colors">
                                    <td className="p-3 font-mono text-amber-500/60">{prog.code || '-'}</td>
                                    <td className="p-3 font-bold text-amber-100">{prog.name}</td>
                                    <td className="p-3 text-stone-300">{prog.category}</td>
                                    <td className="p-3 text-stone-300 text-center font-bold bg-stone-800/30">{participantsCount}</td>
                                    <td className="p-3">
                                      <div className="flex flex-col gap-1 text-[11px]">
                                        {scorers.map((sc, i) => (
                                          <span key={i} className="text-amber-100/90 whitespace-nowrap">
                                            {prog.category === 'General' ? sc.team : `${sc.name} (${sc.team})`} - <span className="text-amber-400 font-bold">{sc.points}pts</span>
                                          </span>
                                        ))}
                                        {scorers.length === 0 && <span className="text-stone-500 italic">None</span>}
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <div className="flex flex-col gap-1 text-xs">
                                        {Object.entries(teamPoints).map(([team, pts]) => (
                                          <span key={team} className="text-amber-300 whitespace-nowrap">
                                            {team}: <span className="font-bold">{pts}pts</span>
                                          </span>
                                        ))}
                                        {Object.keys(teamPoints).length === 0 && <span className="text-stone-500 italic">-</span>}
                                      </div>
                                    </td>
                                    <td className="p-3 text-center">
                                      <button
                                        onClick={() => {
                                          const nextState = !prog.isResultPublished;
                                          const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: nextState, isDashboardPublished: nextState } : p);
                                          saveAndSetPrograms(updatedPrograms);
                                          if (nextState) {
                                            sendBroadcastNotification(
                                              `🏆 Result Published: ${prog.name}`,
                                              `Official result for ${prog.category} - ${prog.name} has been published! Check the results section now.`,
                                              'result'
                                            );
                                          }
                                          showToast(nextState ? 'Published' : 'Unpublished', 'success');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${prog.isResultPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                      >
                                        {prog.isResultPublished ? 'Unpublish' : 'Publish'}
                                      </button>
                                    </td>
                                    <td className="p-3 text-center">
                                      {prog.isResultPublished ? (
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">Published</span>
                                      ) : (
                                        <span className="bg-stone-800 text-stone-400 px-2 py-1 rounded text-[10px] font-bold border border-stone-700">Unpublished</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {adminTab === 'student_list' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/10 pb-4 gap-4">
                            <h4 className="text-amber-300 font-bold flex items-center gap-2 text-lg">
                              <Users className="w-5 h-5" />
                              All Students ({students.filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General').length})
                            </h4>
                            <div className="relative min-w-[280px]">
                              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50" />
                              <input
                                type="text"
                                placeholder="Search by Chess No. or Name..."
                                value={adminStudentSearchQuery}
                                onChange={(e) => setAdminStudentSearchQuery(e.target.value)}
                                className="w-full bg-stone-950 border border-amber-500/30 rounded-xl pl-9 pr-8 py-2 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                              />
                              {adminStudentSearchQuery && (
                                <button
                                  onClick={() => setAdminStudentSearchQuery('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-200 text-xs font-bold bg-stone-800 hover:bg-stone-700 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-8">
                            {students.length === 0 ? (
                              <div className="text-center p-6 text-amber-500/50 bg-stone-950/30 rounded-xl border border-stone-800">
                                No students added yet.
                              </div>
                            ) : (() => {
                              const { publishedProgramIds, publishedProgramNames } = globalProgramsData;
                              const sq = adminStudentSearchQuery.trim().toLowerCase();
                              const allFilteredStudents = students.filter(s => {
                                if (s.code.startsWith('TEAM-') || s.category === 'General') return false;
                                if (!sq) return true;
                                return s.name.toLowerCase().includes(sq) || s.code.toLowerCase().includes(sq);
                              });

                              if (allFilteredStudents.length === 0) {
                                return (
                                  <div className="text-center p-8 text-amber-500/60 bg-stone-950/30 rounded-xl border border-stone-800">
                                    No students found matching "{adminStudentSearchQuery}".
                                  </div>
                                );
                              }

                              return (
                                <>
                              {TEAMS.map(team => {
                                const teamStudents = allFilteredStudents.filter(s => s.team === team);
                                if (teamStudents.length === 0) return null;
                                
                                return (
                                  <div key={team} className="space-y-3">
                                    <h5 className="font-black text-lg text-amber-400 border-b border-amber-500/20 pb-2 flex items-center justify-between">
                                      <span>{team}</span>
                                      <span className="text-sm font-bold text-amber-500/60 bg-amber-500/10 px-3 py-1 rounded-full">{teamStudents.length} Students</span>
                                    </h5>
                                    <div className="overflow-x-auto bg-stone-950/30 rounded-xl border border-stone-800">
                                      <table className="w-full text-left text-sm text-amber-100/80 border-collapse">
                                        <thead className="text-xs text-amber-500/70 bg-stone-950 border-b border-stone-800">
                                          <tr>
                                            <th className="p-3">Name & Chess No.</th>
                                            <th className="p-3">Class</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3" colSpan={2}>Programmes & Results</th>
                                            <th className="p-3">Total Points</th>
                                            <th className="p-3 text-right">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {teamStudents.map((s, idx) => (
                                            <tr key={s.id || `${s.code}-${idx}`} className="hover:bg-amber-500/5 transition-colors group border-b border-stone-800/50 last:border-0">
                                              <td className="p-3">
                                                <div className="font-bold text-stone-400">{s.name}</div>
                                                <div className="text-xs font-mono text-amber-500/60">{s.code}</div>
                                              </td>
                                              <td className="p-3">
                                                <div className="text-xs text-amber-500/80">Class {s.class}</div>
                                              </td>
                                              <td className="p-3">
                                                {s.category}
                                              </td>
                                              <td className="p-3" colSpan={2}>
                                                {(() => {
                                                  const stRegs = registrations.filter(r => r.studentCode.toUpperCase() === s.code.toUpperCase());
                                                  const registeredProgramNames = stRegs.map(reg => programs.find(p => p.id === reg.programId)?.name).filter(Boolean);
                                                  const resultNames = s.programResults?.map(r => r.programName) || [];
                                                  
                                                  // Top level result if exists and not in programResults
                                                  if (s.event && !resultNames.includes(s.event)) {
                                                    resultNames.push(s.event);
                                                  }

                                                  const allEvents = Array.from(new Set([...registeredProgramNames, ...resultNames])) as string[];
                                                  
                                                  if (allEvents.length === 0) {
                                                    return <span className="text-stone-600 text-[10px] italic">No programmes</span>;
                                                  }
                                                  
                                                  return (
                                                    <div className="flex flex-col gap-1.5">
                                                      {allEvents.map((eventName, i) => {
                                                        let result = s.programResults?.find(r => r.programName === eventName);
                                                        // Fallback to top-level if matches
                                                        if (!result && s.event === eventName) {
                                                           result = { programName: s.event, rank: s.rank, grade: s.grade, points: s.points };
                                                        }
                                                        if (!result) {
                                                          const progObj = programs.find(p => p.name === eventName);
                                                          if (progObj?.category === 'General') {
                                                            const teamDummy = students.find(ts => (ts.code.startsWith('TEAM-') || ts.category === 'General') && ts.team.toLowerCase() === s.team.toLowerCase());
                                                            const teamRes = teamDummy?.programResults?.find(r => r.programName === eventName || r.programId === progObj.id);
                                                            if (teamRes) {
                                                              result = teamRes;
                                                            }
                                                          }
                                                        }
                                                        
                                                        let isPublished = false;
                                                        let progId = result?.programId;
                                                        if (!progId) {
                                                          const reg = stRegs.find(r => programs.find(p => p.id === r.programId)?.name === eventName);
                                                          if (reg) {
                                                            progId = reg.programId;
                                                          } else {
                                                            const prog = programs.find(p => p.name === eventName && (p.category === s.category || p.category === 'General'));
                                                            if (prog) progId = prog.id;
                                                          }
                                                        }
                                                        if (progId) {
                                                          const p = programs.find(p => p.id === progId);
                                                          if (p?.isResultPublished) {
                                                            isPublished = true;
                                                          }
                                                        }
                                                        if (!isPublished) {
                                                          const p2 = programs.find(p => p.name === eventName && (p.category === s.category || p.category === 'General'));
                                                          if (p2?.isResultPublished) {
                                                            isPublished = true;
                                                          }
                                                        }

                                                        return (
                                                          <div key={i} className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs text-amber-200/80">{eventName}</span>
                                                            {result && (result.rank > 0 || result.grade) ? (
                                                              <div className="flex items-center gap-1.5">
                                                                {result.rank > 0 && <span className="bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-amber-500/20">Rank {result.rank}</span>}
                                                                {result.grade && <span className="bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-emerald-500/20">{result.grade}</span>}
                                                                <span className="bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-blue-500/20">{result.points || 0} Pts</span>
                                                              </div>
                                                            ) : (
                                                              isPublished ? (
                                                                <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-rose-500/20">Nil</span>
                                                              ) : (
                                                                <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-stone-700">Registered</span>
                                                              )
                                                            )}
                                                            <div className="flex items-center gap-1 ml-auto">
                                                              <button 
                                                                onClick={() => startEditResult(s, eventName, result)}
                                                                className="p-1 hover:bg-amber-500/20 text-amber-500/50 hover:text-amber-400 rounded transition-colors flex items-center gap-1"
                                                                title="Edit this Result"
                                                              >
                                                                <Edit className="w-3 h-3" />
                                                              </button>
                                                              <button 
                                                                onClick={() => handleDeleteSingleResult(s.code, eventName)}
                                                                className={`p-1 rounded transition-colors flex items-center gap-1 ${confirmSingleDeleteId === `${s.code}_${eventName}` ? 'bg-rose-500 text-white' : 'hover:bg-rose-500/20 text-rose-500/50 hover:text-rose-400'}`}
                                                                title={confirmSingleDeleteId === `${s.code}_${eventName}` ? "Click to Confirm" : "Delete this Result"}
                                                              >
                                                                <Trash2 className="w-3 h-3" />
                                                              </button>
                                                            </div>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  );
                                                })()}
                                              </td>
                                              <td className="p-3 font-bold text-amber-300">
                                                {s.points}
                                              </td>
                                              <td className="p-3 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                  <button 
                                                    onClick={() => startEditStudent(s)}
                                                    className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors border border-amber-500/20 flex items-center"
                                                    title="Edit Details"
                                                  >
                                                    <User className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button 
                                                    onClick={() => startEditResult(s)}
                                                    className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20 flex items-center"
                                                    title="Edit Result"
                                                  >
                                                    <Trophy className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button 
                                                    onClick={() => handleDeleteStudent(s.code)}
                                                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20 flex items-center"
                                                    title="Delete"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              })}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {adminTab === 'dashboard' && (
                        <div className="space-y-8">


                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-6">
                              {/* Overall Standings 2 */}
                              <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-50" />
                                    Overall Standings (All Saved)
                                  </h3>

                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">All Saved Points</h4>
                                    <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">All Saved Results</span>
                                  </div>
                                  <div className="space-y-2">
                                    {adminTeamScoringList.map((team, idx) => (
                                      <div key={team.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-50' : 'text-stone-600'}`}>{idx + 1}</span>
                                          <span className={`text-sm font-bold ${idx === 0 ? 'text-stone-400' : 'text-stone-400'}`}>{team.name}</span>
                                        </div>
                                        <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{team.score}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Category Leaders */}
                            <div className="lg:col-span-2 bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-50" />
                                Category Standings
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {adminCategoryRankData.map(catData => (
                                  <div key={catData.category} className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                    <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                      <h4 className="font-bold text-amber-100">{catData.category}</h4>
                                      <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">{catData.malayalam}</span>
                                    </div>
                                    <div className="space-y-2">
                                      {catData.ranking.map((team, idx) => (
                                        <div key={team.team} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-50' : 'text-stone-600'}`}>{idx + 1}</span>
                                            <span className={`text-sm font-bold ${idx === 0 ? 'text-stone-400' : 'text-stone-400'}`}>{team.team}</span>
                                          </div>
                                          <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{team.total}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>


                          </div>


                          {/* Overall Top Individuals */}
                          <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                            <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                              <Award className="w-5 h-5 text-amber-50" />
                              Overall Top Individuals
                            </h3>
                            <div className="space-y-4">
                              {globalTopStudents.map((student, idx) => (
                                <div key={student.id || `${student.code}-${idx}`} className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-500 text-amber-950' : 'bg-stone-800 text-stone-400'}`}>
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-bold text-amber-100 leading-tight">{student.name}</h4>
                                      <p className="text-[10px] text-amber-500/70 font-bold">{student.team} • {student.category}</p>
                                    </div>
                                  </div>
                                  <div className="text-base font-black text-amber-400">
                                    {student.points}
                                  </div>
                                </div>
                              ))}
                              {globalTopStudents.length === 0 && (
                                <p className="text-sm text-stone-500 text-center py-4">No individual data yet</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Top Individuals By Category */}
                          {topStudentsByCategory.some(c => c.students.length > 0) && (
                            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-50" />
                                Top Individuals By Category
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {topStudentsByCategory.map((catData) => (
                                  <div key={catData.category} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col">
                                    <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                      <h4 className="font-black text-amber-100">{catData.category}</h4>
                                      <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">{catData.malayalam}</span>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                      {catData.students.map((student, idx) => (
                                        <div key={student.id || `${student.code}-${idx}`} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-50' : 'text-stone-600'}`}>{idx + 1}</span>
                                            <div>
                                              <div className={`text-sm font-bold leading-tight ${idx === 0 ? 'text-stone-400' : 'text-stone-400'}`}>{student.name}</div>
                                              <div className="text-[9px] text-stone-500">{student.team}</div>
                                            </div>
                                          </div>
                                          <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{student.points}</span>
                                        </div>
                                      ))}
                                      {catData.students.length === 0 && (
                                        <div className="text-center py-4 text-xs text-stone-500 italic">No data</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Top By Class */}
                          {topStudentsByClass.length > 0 && (
                            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-50" />
                                Top Students By Class
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {topStudentsByClass.map((classData) => (
                                  <div key={classData.className} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col">
                                    <h4 className="font-black text-amber-100 mb-3 text-center border-b border-stone-800 pb-2">Class {classData.className}</h4>
                                    <div className="space-y-2 flex-1">
                                      {classData.students.map((student, idx) => (
                                        <div key={student.id || `${student.code}-${idx}`} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-50' : 'text-stone-600'}`}>{idx + 1}</span>
                                            <div>
                                              <div className={`text-sm font-bold leading-tight ${idx === 0 ? 'text-stone-400' : 'text-stone-400'}`}>{student.name}</div>
                                              <div className="text-[9px] text-stone-500">{student.team}</div>
                                            </div>
                                          </div>
                                          <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{student.points}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CORE TAB NAVIGATIONS --- */}
        <div className="print:hidden px-2 sm:px-6 py-3 sm:py-4 bg-stone-900/50 border-b border-amber-500/15 relative">
          
          {/* Glass reflection top-edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent z-10 pointer-events-none"></div>

          <div className="grid grid-cols-4 bg-stone-950/80 p-1 rounded-2xl gap-1 border border-amber-500/15 shadow-inner relative overflow-hidden">
            
            {/* Inner tab container glass reflection top-edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent z-20 pointer-events-none"></div>
            
            {/* Tab 1: Total Scoring */}
            <button 
              id="tab-total-btn"
              onClick={() => setActiveTab('total')}
              className={`w-full min-h-[58px] sm:min-h-[64px] flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative z-10 text-center ${
                activeTab === 'total' 
                  ? 'bg-amber-400 text-amber-950 font-extrabold shadow-[0_4px_12px_rgba(212,175,55,0.25)]' 
                  : 'text-amber-300/60 hover:text-stone-300 hover:bg-stone-900/40'
              }`}
            >
              <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 shrink-0 transition-colors ${activeTab === 'total' ? 'text-amber-950' : 'text-amber-500/70'}`} />
              <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold leading-tight tracking-tight text-center">Total</span>
            </button>

            {/* Tab 2: Category Ratings */}
            <button 
              id="tab-category-btn"
              onClick={() => setActiveTab('category')}
              className={`w-full min-h-[58px] sm:min-h-[64px] flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative z-10 text-center ${
                activeTab === 'category' 
                  ? 'bg-amber-400 text-amber-950 font-extrabold shadow-[0_4px_12px_rgba(212,175,55,0.25)]' 
                  : 'text-amber-300/60 hover:text-stone-300 hover:bg-stone-900/40'
              }`}
            >
              <Layers className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 shrink-0 transition-colors ${activeTab === 'category' ? 'text-amber-950' : 'text-amber-500/70'}`} />
              <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold leading-tight tracking-tight text-center">Category</span>
            </button>

            {/* Tab 3: Top Students achievements */}
            <button 
              id="tab-top3-btn"
              onClick={() => setActiveTab('top3')}
              className={`w-full min-h-[58px] sm:min-h-[64px] flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative z-10 text-center ${
                activeTab === 'top3' 
                  ? 'bg-amber-400 text-amber-950 font-extrabold shadow-[0_4px_12px_rgba(212,175,55,0.25)]' 
                  : 'text-amber-300/60 hover:text-stone-300 hover:bg-stone-900/40'
              }`}
            >
              <Award className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 shrink-0 transition-colors ${activeTab === 'top3' ? 'text-amber-950' : 'text-amber-500/70'}`} />
              <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold leading-tight tracking-tight text-center">Top Individuals</span>
            </button>

            {/* Tab 4: All Results Program Search */}
            <button 
              id="tab-program-btn"
              onClick={() => setActiveTab('program')}
              className={`w-full min-h-[58px] sm:min-h-[64px] flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative z-10 text-center ${
                activeTab === 'program' 
                  ? 'bg-amber-400 text-amber-950 font-extrabold shadow-[0_4px_12px_rgba(212,175,55,0.25)]' 
                  : 'text-amber-300/60 hover:text-stone-300 hover:bg-stone-900/40'
              }`}
            >
              <SearchCode className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 shrink-0 transition-colors ${activeTab === 'program' ? 'text-amber-950' : 'text-amber-500/70'}`} />
              <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold leading-tight tracking-tight text-center">Search Results</span>
            </button>
          </div>
        </div>

        {/* --- DYNAMIC TAB CONTENT --- */}
        <div className="px-6 py-6 flex-1 w-full flex flex-col">
          {activeTab === 'total' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
            {publicTeamScoringList.map((item, index) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-stone-900/60 border border-amber-500/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-md hover:border-amber-500/40 transition-all h-full"
              >
                <div className="font-extrabold text-xl text-amber-50 mb-2">
                  {item.name}
                </div>
                <div className="text-3xl font-black text-amber-300 mb-4 tracking-tight">
                  {item.score} <span className="text-[12px] font-bold text-amber-500/60 uppercase">pts</span>
                </div>

              </motion.div>
            ))}
          </div>
          )}



          {activeTab === 'category' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {publicCategoryRankData.map((catData, catIndex) => (
                <motion.div
                  key={catData.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="bg-stone-900/60 border border-amber-500/20 rounded-2xl p-5 flex flex-col shadow-md h-full"
                >
                  <div className="text-center mb-6 border-b border-amber-500/10 pb-3">
                    <h3 className="text-xl font-black text-amber-300">{catData.category}</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    {catData.ranking.map((teamRank, rankIndex) => (
                      <div key={teamRank.team} className="flex items-center justify-between bg-stone-950/50 p-3 rounded-xl border border-amber-500/10 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className={`absolute top-0 left-0 w-1 h-full ${rankIndex === 0 ? 'bg-amber-400' : rankIndex === 1 ? 'bg-stone-300' : rankIndex === 2 ? 'bg-amber-700' : 'bg-stone-800'}`}></div>
                        <div className="flex items-center gap-3 pl-2">
                          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-black ${rankIndex === 0 ? 'bg-amber-400 text-amber-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : rankIndex === 1 ? 'bg-stone-300 text-amber-950' : rankIndex === 2 ? 'bg-amber-700 text-amber-100' : 'bg-stone-800 text-stone-500'}`}>
                            {rankIndex + 1}
                          </div>
                          <div>
                            <div className="font-bold text-amber-100 text-sm">{teamRank.team}</div>
                          </div>
                        </div>
                        <div className="font-black text-lg text-amber-300 text-right">
                          {teamRank.total} <span className="text-[10px] text-amber-500/60 font-bold uppercase block -mt-1">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'top3' && (
            <div className="flex flex-col gap-10 w-full">
              <div>
                <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Top Individuals By Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {publicTopStudentsByCategory.map((catData, catIndex) => (
                <motion.div
                  key={catData.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="bg-stone-900/60 border border-amber-500/20 rounded-2xl p-5 flex flex-col shadow-md h-full"
                >
                  <div className="text-center mb-6 border-b border-amber-500/10 pb-3">
                    <h3 className="text-xl font-black text-amber-300">{catData.category}</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    {catData.students.length > 0 ? catData.students.map((student, rankIndex) => (
                      <div key={student.id || `${student.code}-${rankIndex}`} className="flex items-center justify-between bg-stone-950/50 p-3 rounded-xl border border-amber-500/10 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className={`absolute top-0 left-0 w-1 h-full ${rankIndex === 0 ? 'bg-amber-400' : rankIndex === 1 ? 'bg-stone-300' : rankIndex === 2 ? 'bg-amber-700' : 'bg-stone-800'}`}></div>
                        <div className="flex items-center gap-3 pl-2">
                          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-black ${rankIndex === 0 ? 'bg-amber-400 text-amber-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : rankIndex === 1 ? 'bg-stone-300 text-amber-950' : rankIndex === 2 ? 'bg-amber-700 text-amber-100' : 'bg-stone-800 text-stone-500'}`}>
                            {rankIndex + 1}
                          </div>
                          <div>
                            <div className="font-bold text-amber-100 text-sm leading-tight">{student.name}</div>
                            <div className="text-[10px] text-amber-500/70 font-medium mt-0.5">{student.team} • {student.code}</div>
                          </div>
                        </div>
                        <div className="font-black text-lg text-amber-300 text-right">
                          {student.points} <span className="text-[10px] text-amber-500/60 font-bold uppercase block -mt-1">pts</span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-6 text-xs text-amber-50/40 border border-dashed border-amber-500/10 rounded-xl">
                        No results published yet
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
                </div>
              </div>


            </div>
          )}

          {activeTab === 'program' && (
            <div className="w-full max-w-5xl mx-auto space-y-6">
              <div className="bg-stone-900/60 border border-amber-500/20 rounded-2xl p-6 shadow-md">
                
                {/* Search Type Selector (Student View vs Program Table View) */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-amber-500/15 pb-5">
                  <div>
                    <h3 className="text-xl font-black text-amber-300">Search Results & Programme Tables</h3>
                    <p className="text-sm text-amber-500/60">Search student individual results or view full programme result tables</p>
                  </div>

                  <div className="flex bg-stone-950 p-1 rounded-xl border border-amber-500/20 shadow-inner">
                    <button
                      onClick={() => setPublicSearchView('student')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        publicSearchView === 'student'
                          ? 'bg-amber-400 text-amber-950 shadow-md font-extrabold'
                          : 'text-amber-300/70 hover:text-amber-100 hover:bg-stone-900'
                      }`}
                    >
                      <User className="w-4 h-4" /> Student Search
                    </button>
                    <button
                      onClick={() => setPublicSearchView('program')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        publicSearchView === 'program'
                          ? 'bg-amber-400 text-amber-950 shadow-md font-extrabold'
                          : 'text-amber-300/70 hover:text-amber-100 hover:bg-stone-900'
                      }`}
                    >
                      <FileText className="w-4 h-4" /> Programme Result Table
                    </button>
                  </div>
                </div>

                {/* --- VIEW MODE 1: STUDENT SEARCH --- */}
                {publicSearchView === 'student' && (
                  <div className="space-y-6">
                    <div className="relative w-full">
                      <input 
                        type="text" 
                        placeholder="Search student by name, chess no., team..." 
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        className="w-full bg-stone-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-4 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 shadow-inner"
                      />
                      <SearchCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                    </div>
                    <div className="flex justify-between items-center text-xs text-amber-500/70 px-1">
                      <span>{studentSearchQuery.trim() ? `Found ${filteredStudents.length} student(s)` : `Showing top ${filteredStudents.length} students. Type above to search...`}</span>
                    </div>

                    <div className="space-y-4">
                      {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => {
                        const studentRegs = registrationsByStudentCode[student.code.toUpperCase()] || [];
                        const registeredPrograms = studentRegs
                          .map(reg => programsMap.byId.get(reg.programId))
                          .filter(Boolean) as Program[];
                        
                        const displayPrograms: { id: string, code?: string, name: string, type: string, category: string, result: any, isRegistered: boolean }[] = [];
                        const seenNames = new Set<string>();

                        registeredPrograms.forEach(p => {
                          seenNames.add(p.name);
                          if (p.isResultPublished || p.isDashboardPublished) {
                            let res = student.programResults?.find(r => r.programId ? r.programId === p.id : (r.programName === p.name && (student.category === p.category || p.category === 'General')));
                            if (!res && p.category === 'General') {
                              const teamDummy = teamDummyStudentsMap[student.team.toLowerCase()];
                              const teamRes = teamDummy?.programResults?.find(r => r.programId === p.id || r.programName === p.name);
                              if (teamRes) {
                                res = teamRes;
                              }
                            }
                            displayPrograms.push({
                              id: p.id,
                              code: p.code,
                              name: p.name,
                              type: p.type,
                              category: p.category,
                              result: res,
                              isRegistered: true
                            });
                          }
                        });

                        (student.programResults || []).forEach(r => {
                          if (!seenNames.has(r.programName)) {
                            seenNames.add(r.programName);
                            const p = r.programId ? programsMap.byId.get(r.programId) : (programsMap.byNameCat.get(`${r.programName}___${student.category}`) || programsMap.byNameCat.get(`${r.programName}___General`));
                            if (p && (p.isResultPublished || p.isDashboardPublished)) {
                              displayPrograms.push({
                                id: p.id,
                                code: p.code,
                                name: r.programName,
                                type: p.type,
                                category: p.category,
                                result: r,
                                isRegistered: false
                              });
                            }
                          }
                        });

                        return (
                          <motion.div 
                            key={student.id || `${student.code}-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-stone-950/50 border border-amber-500/10 rounded-xl p-5 hover:border-amber-500/30 transition-all flex flex-col md:flex-row gap-6 shadow-sm"
                          >
                            {/* Student Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="bg-amber-400 text-amber-950 font-black px-2.5 py-1 rounded text-sm">{student.code}</span>
                                <h4 className="text-lg font-bold text-amber-100">{student.name}</h4>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-stone-900/50 p-2 rounded-lg border border-stone-800">
                                  <span className="text-stone-500 text-[10px] uppercase font-bold block mb-0.5">Team</span>
                                  <span className="text-amber-300 font-medium">{student.team}</span>
                                </div>
                                <div className="bg-stone-900/50 p-2 rounded-lg border border-stone-800">
                                  <span className="text-stone-500 text-[10px] uppercase font-bold block mb-0.5">Category</span>
                                  <span className="text-amber-300 font-medium">{student.category}</span>
                                </div>
                                <div className="bg-stone-900/50 p-2 rounded-lg border border-stone-800">
                                  <span className="text-stone-500 text-[10px] uppercase font-bold block mb-0.5">Class</span>
                                  <span className="text-amber-300 font-medium">{student.class}</span>
                                </div>
                                <div className="bg-stone-900/50 p-2 rounded-lg border border-stone-800">
                                  <span className="text-stone-500 text-[10px] uppercase font-bold block mb-0.5">Overall Marks / Points</span>
                                  <span className="text-emerald-400 font-bold">{calculateStudentPoints(student, 'public')} pts {student.grade && `• Grade ${student.grade}`} {student.rank > 0 && `• Rank ${student.rank}`}</span>
                                </div>
                              </div>
                            </div>

                            {/* Programs List */}
                            <div className="flex-1 md:border-l md:border-amber-500/10 md:pl-6">
                              <h5 className="text-sm font-bold text-amber-500/80 mb-3 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> 
                                Participated Programmes ({displayPrograms.length})
                              </h5>
                              {displayPrograms.length > 0 ? (
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                  {displayPrograms.map(prog => {
                                    const progResult = prog.result;
                                    return (
                                    <div key={prog.id} className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 flex justify-between items-center">
                                      <div>
                                        <div className="text-sm font-bold text-stone-400">
                                          {prog.code && <span className="text-amber-50 mr-1.5">[{prog.code}]</span>}
                                          {prog.name}
                                        </div>
                                        <div className="text-[10px] text-stone-400">{prog.type} • {prog.category}</div>
                                      </div>
                                      {progResult && ((progResult.points && progResult.points > 0) || progResult.grade || (progResult.rank && progResult.rank > 0)) ? (
                                        <div className="flex flex-col items-end">
                                          <div className="text-xs font-black text-emerald-400">{progResult.points} pts</div>
                                          {(progResult.grade || (progResult.rank && progResult.rank > 0)) && (
                                            <div className="text-[9px] text-stone-400 mt-0.5">
                                              {progResult.grade && `Grade ${progResult.grade}`}
                                              {progResult.grade && progResult.rank > 0 && ' • '}
                                              {progResult.rank > 0 && `Rank ${progResult.rank}`}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-xs font-bold text-stone-500 bg-stone-950/60 px-2.5 py-1 rounded-md border border-stone-800">
                                          Nil
                                        </div>
                                      )}
                                    </div>
                                  )})}
                                </div>
                              ) : (
                                <div className="text-center py-6 border border-dashed border-stone-800 rounded-xl text-stone-500 text-xs">
                                  No programmes registered yet
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      }) : (
                        <div className="text-center py-12 border border-dashed border-amber-500/20 rounded-2xl">
                          <SearchCode className="w-8 h-8 text-amber-500/30 mx-auto mb-3" />
                          <p className="text-amber-500/60 font-medium">No students found matching your search.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- VIEW MODE 2: PROGRAMME RESULT TABLE VIEW --- */}
                {publicSearchView === 'program' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Search Bar for Programme Code / Name */}
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Type Programme Code (e.g. 101) or Name..." 
                          value={publicProgramSearchQuery}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPublicProgramSearchQuery(val);
                            const found = programs.find(p => p.code?.toUpperCase() === val.trim().toUpperCase());
                            if (found) {
                              setPublicSelectedProgramId(found.id);
                            } else if (publicSelectedProgramId) {
                              setPublicSelectedProgramId('');
                            }
                          }}
                          className="w-full bg-stone-950 border border-amber-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 shadow-inner"
                        />
                        <SearchCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                      </div>

                      {/* Dropdown Selector */}
                      <div className="flex gap-2">
                        <select
                          value={publicSelectedProgramId}
                          onChange={(e) => {
                            setPublicSelectedProgramId(e.target.value);
                            const p = programs.find(item => item.id === e.target.value);
                            if (p && p.code) {
                              setPublicProgramSearchQuery(p.code);
                            }
                          }}
                          className="w-full bg-stone-950 border border-amber-500/30 rounded-xl py-2.5 px-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400 cursor-pointer shadow-inner"
                        >
                          <option value="">-- Select a Programme --</option>
                          {programs.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.code ? `[${p.code}] ` : ''}{p.name} ({p.category})
                            </option>
                          ))}
                        </select>

                        {(publicProgramSearchQuery || publicSelectedProgramId) && (
                          <button
                            onClick={() => {
                              setPublicProgramSearchQuery('');
                              setPublicSelectedProgramId('');
                            }}
                            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap border border-stone-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Programme Table Results Area */}
                    {(() => {
                      let matchingPrograms: Program[] = [];
                      if (publicSelectedProgramId) {
                        const p = programs.find(item => item.id === publicSelectedProgramId);
                        if (p) matchingPrograms = [p];
                      } else if (publicProgramSearchQuery.trim()) {
                        const q = publicProgramSearchQuery.trim().toLowerCase();
                        matchingPrograms = programs.filter(p => 
                          (p.code && p.code.toLowerCase().includes(q)) || 
                          p.name.toLowerCase().includes(q)
                        );
                      } else {
                        // Show all published programmes by default if no filter
                        matchingPrograms = programs.filter(p => p.isResultPublished || p.isDashboardPublished);
                      }

                      if (matchingPrograms.length === 0) {
                        return (
                          <div className="text-center py-12 border border-dashed border-amber-500/20 rounded-2xl bg-stone-950/30">
                            <SearchCode className="w-8 h-8 text-amber-500/30 mx-auto mb-3" />
                            <p className="text-amber-500/60 font-medium">No programmes found matching your search.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-8">
                          {matchingPrograms.map(prog => {
                            const winners = (globalProgramsData.progScorers[prog.id] || []).map(sc => ({
                              studentCode: sc.studentCode,
                              studentName: sc.name,
                              rank: sc.rank,
                              grade: sc.grade,
                              points: sc.points,
                              class: sc.class,
                              team: sc.team
                            }));

                            winners.sort((a, b) => {
                              if (a.rank && b.rank) return a.rank - b.rank;
                              if (a.rank) return -1;
                              if (b.rank) return 1;
                              const gradeOrder: any = { 'A': 1, 'B': 2, 'C': 3 };
                              return (gradeOrder[a.grade] || 99) - (gradeOrder[b.grade] || 99);
                            });

                            return (
                              <div key={prog.id} className="bg-stone-950/80 border border-amber-500/20 rounded-2xl p-5 shadow-lg space-y-4">
                                {/* Program Table Header */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/15 pb-4">
                                  <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="bg-amber-400 text-amber-950 font-black text-sm px-3 py-1 rounded-lg shadow-sm">
                                      {prog.code ? `[Code: ${prog.code}]` : 'CODE'}
                                    </span>
                                    <h4 className="text-xl font-extrabold text-amber-100">{prog.name}</h4>
                                    <span className="text-xs bg-stone-900 border border-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-md">
                                      {prog.category}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                                      Participants / Scorers: {winners.length}
                                    </span>
                                  </div>
                                </div>

                                {/* Table Display in App's Native Dark Aesthetic */}
                                {winners.length > 0 ? (
                                  <div className="overflow-x-auto rounded-xl border border-amber-500/15 bg-stone-900/60 shadow-inner">
                                    <table className="w-full text-left border-collapse text-sm">
                                      <thead>
                                        <tr className="bg-stone-950 text-amber-300 font-bold uppercase text-xs border-b border-amber-500/20">
                                          <th className="p-3 text-center w-16">Pos</th>
                                          <th className="p-3 text-center w-16">Grade</th>
                                          <th className="p-3 text-center w-28">Chess No.</th>
                                          <th className="p-3">Student Name</th>
                                          <th className="p-3 text-center w-20">Class</th>
                                          <th className="p-3 text-center w-32">Team</th>
                                          <th className="p-3 text-center w-20">Pts</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-stone-800/80">
                                        {winners.map((w, i) => (
                                          <tr key={i} className="hover:bg-amber-500/5 transition-colors">
                                            <td className="p-3 text-center font-black">
                                              {w.rank === 1 ? (
                                                <span className="bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded shadow-xs">I</span>
                                              ) : w.rank === 2 ? (
                                                <span className="bg-stone-300 text-stone-950 font-black px-2.5 py-0.5 rounded">II</span>
                                              ) : w.rank === 3 ? (
                                                <span className="bg-amber-700 text-amber-100 font-black px-2.5 py-0.5 rounded">III</span>
                                              ) : (
                                                <span className="text-stone-500">-</span>
                                              )}
                                            </td>
                                            <td className="p-3 text-center font-bold">
                                              {w.grade === 'A' ? (
                                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-bold">A</span>
                                              ) : w.grade === 'B' ? (
                                                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-xs font-bold">B</span>
                                              ) : w.grade === 'C' ? (
                                                <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-xs font-bold">C</span>
                                              ) : (
                                                <span className="text-stone-500">-</span>
                                              )}
                                            </td>
                                            <td className="p-3 text-center font-mono font-extrabold text-amber-300">
                                              {w.studentCode}
                                            </td>
                                            <td className="p-3 font-bold text-amber-100">
                                              {w.studentName}
                                            </td>
                                            <td className="p-3 text-center text-stone-400 font-medium">
                                              {w.class || 'N/A'}
                                            </td>
                                            <td className="p-3 text-center">
                                              <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold px-2.5 py-1 rounded-lg text-xs">
                                                {w.team}
                                              </span>
                                            </td>
                                            <td className="p-3 text-center font-black text-amber-300">
                                              {w.points}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-center py-8 bg-stone-950/40 border border-dashed border-amber-500/10 rounded-xl text-amber-500/50 text-sm italic">
                                    No published results found for this programme yet.
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER STATEMENT --- */}
        <div className="bg-stone-950 text-amber-200/80 text-center py-4 px-6 text-xs border-t border-stone-900 flex flex-col items-center gap-1">
          <p className="font-semibold tracking-wide">
            © {festivalYear} {festivalName}. All rights reserved to Sargam Committee.
          </p>
          <p className="text-[10px] text-amber-400/60 font-light">
            Crafted with cultural pride & elegant design
          </p>
        </div>

      </div>

      </div>

      {/* --- CLEAR CONFIRM MODAL --- */}
      <AnimatePresence>
        {clearConfirmState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setClearConfirmState({ isOpen: false, action: null, password: '', error: '' })}
              className="absolute inset-0 bg-stone-950/95"
            ></motion.div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm bg-stone-900 rounded-3xl p-6 shadow-2xl border border-rose-500/30 text-amber-50"
            >
              <div className="flex items-center gap-3 mb-4 text-rose-400 font-extrabold text-xl">
                <Trash2 className="w-6 h-6" />
                <h3>Confirm Action</h3>
              </div>
              
              <p className="text-sm text-amber-300 mb-6 font-medium">
                {clearConfirmState.action === 'reset' && "Are you sure you want to reset to the default example data? This will overwrite current students."}
                {clearConfirmState.action === 'clearStudents' && "Are you sure you want to clear all students? This action cannot be undone."}
                {clearConfirmState.action === 'clearPrograms' && "Are you sure you want to clear all programmes and registrations? This action cannot be undone."}
                {clearConfirmState.action === 'clearResults' && "Are you sure you want to clear all programme results? This action cannot be undone."}
                {clearConfirmState.action === 'clearNotifications' && "Are you sure you want to clear all notifications from all user devices? This action cannot be undone."}
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-400/80 block">Admin Password Required</label>
                  <input 
                    type="password"
                    placeholder="Enter admin password"
                    value={clearConfirmState.password}
                    onChange={(e) => setClearConfirmState(prev => ({ ...prev, password: e.target.value, error: '' }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                    autoFocus
                  />
                  {clearConfirmState.error && (
                    <p className="text-[10px] text-rose-400 font-bold mt-1">{clearConfirmState.error}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setClearConfirmState({ isOpen: false, action: null, password: '', error: '' })}
                    className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeClearAction}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-rose-950 font-black rounded-xl transition-colors text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TEAM PROGRAM REGISTRATION MODAL --- */}
      <AnimatePresence>
        {isTeamProgramRegistrationOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsTeamProgramRegistrationOpen(false);
                setTeamRegistrationSelectedTeam(null);
                setTeamRegistrationPassword('');
                setTeamRegistrationError('');
                setIsTeamRegistrationLoggedIn(false);
              }}
              className="absolute inset-0 bg-stone-950/95"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-stone-900 rounded-3xl p-6 shadow-2xl border border-amber-500/20 text-amber-50 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => {
                  setIsTeamProgramRegistrationOpen(false);
                  setTeamRegistrationSelectedTeam(null);
                  setTeamRegistrationPassword('');
                  setTeamRegistrationError('');
                  setIsTeamRegistrationLoggedIn(false);
                }}
                className="absolute top-4 right-4 text-amber-400 hover:text-stone-400 p-1 bg-stone-950 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 text-amber-400 font-extrabold text-xl">
                <Users className="w-7 h-7 text-amber-50" />
                <h3>Programme Registration</h3>
              </div>

              {!teamRegistrationSelectedTeam ? (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-amber-200/80 mb-4">Select your team to continue:</p>
                  {TEAMS.map((team) => (
                    <button
                      key={team}
                      onClick={() => setTeamRegistrationSelectedTeam(team)}
                      className="w-full py-3 px-4 bg-stone-950 hover:bg-amber-500/10 text-amber-100 font-bold rounded-xl border border-stone-800 hover:border-amber-500/50 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span>{team}</span>
                      <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-50 transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={() => {
                        if (isTeamRegistrationLoggedIn) {
                          setIsTeamRegistrationLoggedIn(false);
                        } else {
                          setTeamRegistrationSelectedTeam(null);
                          setTeamRegistrationPassword('');
                          setTeamRegistrationError('');
                        }
                      }}
                      className="text-stone-400 hover:text-amber-400 transition-colors p-1"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="text-lg font-bold text-amber-300">{teamRegistrationSelectedTeam} Login</h4>
                  </div>
                  
                  {!isTeamRegistrationLoggedIn ? (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!teamRegistrationPassword) {
                        setTeamRegistrationError('Please enter the password');
                        return;
                      }
                      
                      const expectedPassword = teamPasswords[teamRegistrationSelectedTeam || ''];
                      if (teamRegistrationPassword !== expectedPassword) {
                        setTeamRegistrationError('Invalid password. Please try again.');
                        return;
                      }
                      
                      setIsTeamRegistrationLoggedIn(true);
                      if (teamRegistrationSelectedTeam) {
                        try {
                          localStorage.setItem(`sargam_team_authenticated_${teamRegistrationSelectedTeam}`, 'true');
                        } catch (err) {
                          console.error(err);
                        }
                      }
                      setConvenerProgramCode('');
                      setConvenerStudentCodes([]);
                      showToast(`Logged in as ${teamRegistrationSelectedTeam}`, 'success');
                    }}>
                      <div className="space-y-1 mb-4">
                        <label className="text-xs font-bold text-amber-400/80 block">Password</label>
                        <input 
                          type="password"
                          placeholder="Enter team password"
                          value={teamRegistrationPassword}
                          onChange={(e) => {
                            setTeamRegistrationPassword(e.target.value);
                            setTeamRegistrationError('');
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                          autoFocus
                        />
                        {teamRegistrationError && (
                          <p className="text-[10px] text-rose-400 font-bold mt-1">{teamRegistrationError}</p>
                        )}
                      </div>
                      
                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-colors text-sm cursor-pointer"
                      >
                        Login
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {(() => {
                        const typedProgCode = convenerProgramCode.trim().toUpperCase();
                        const activeProg = typedProgCode ? programs.find(pr => pr.code?.toUpperCase() === typedProgCode) : null;
                        const dynamicMaxSlots = activeProg ? (activeProg.maxParticipantsPerGroup || (activeProg.category === 'General' ? 5 : 2)) : 2;

                        return (
                          <>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Programme Code</label>
                              <input
                                type="text"
                                value={convenerProgramCode}
                                onChange={(e) => setConvenerProgramCode(e.target.value.toUpperCase())}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 text-sm text-amber-100 uppercase focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none font-mono"
                                placeholder="e.g. P001"
                              />
                              {activeProg && (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1.5 gap-1.5 text-xs">
                                  <span className="text-amber-50 font-semibold">{activeProg.name} <span className="text-amber-400">({activeProg.category})</span></span>
                                  <div className="flex items-center gap-2">
                                    {activeProg.category === 'General' && activeProg.maxEntriesPerTeam && (
                                      <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                        Team Entries Allowed: {activeProg.maxEntriesPerTeam}
                                      </span>
                                    )}
                                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                      Max Allowed: {dynamicMaxSlots} Participant(s)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {activeProg && activeProg.category === 'General' && (
                              <div className="space-y-1 pt-1">
                                <label className="text-xs font-bold text-amber-400 block">Select Team Entry Slot</label>
                                <select 
                                  value={convenerEntryIndex}
                                  onChange={(e) => setConvenerEntryIndex(Number(e.target.value))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 text-sm text-amber-100 outline-none"
                                >
                                  {Array.from({ length: Math.max(1, activeProg.maxEntriesPerTeam || 1) }).map((_, i) => (
                                    <option key={i+1} value={i+1}>Entry Slot {i+1}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            
                            <div className="space-y-2 pt-1">
                              <label className="text-xs font-bold text-amber-400 flex items-center justify-between">
                                <span>Chess No.(s)</span>
                                <span className="text-[11px] font-normal text-stone-400">({dynamicMaxSlots} input field{dynamicMaxSlots > 1 ? 's' : ''})</span>
                              </label>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Array.from({ length: dynamicMaxSlots }).map((_, idx) => {
                                  const codeVal = convenerStudentCodes[idx] || '';
                                  const matchedStudent = students.find(st => st.code.toUpperCase() === codeVal.trim().toUpperCase());

                                  return (
                                    <div key={idx} className="space-y-1">
                                      <label className="text-[11px] font-bold text-amber-400/80 block">
                                        Chess No. {idx + 1} {idx > 0 ? '(Optional)' : ''}
                                      </label>
                                      <input
                                        type="text"
                                        value={codeVal}
                                        onChange={(e) => {
                                          const val = e.target.value.toUpperCase();
                                          setConvenerStudentCodes(prev => {
                                            const next = [...prev];
                                            next[idx] = val;
                                            return next;
                                          });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl border border-amber-500/20 bg-stone-950 text-sm text-amber-100 uppercase focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none font-mono"
                                        placeholder={`e.g. S00${idx + 1}`}
                                      />
                                      {codeVal && matchedStudent ? (
                                        <p className="text-[11px] text-emerald-400 font-bold mt-1">
                                          ✓ {matchedStudent.name} <span className="text-[10px] text-stone-400 font-normal">({matchedStudent.class})</span>
                                        </p>
                                      ) : codeVal ? (
                                        <p className="text-[11px] text-rose-400 font-medium mt-1">Student not found</p>
                                      ) : null}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                 const p = activeProg || programs.find(pr => pr.code?.toUpperCase() === convenerProgramCode.trim().toUpperCase());
                                 if (!p) { showToast('Invalid Programme Code', 'error'); return; }

                                 const slotCount = p.maxParticipantsPerGroup || (p.category === 'General' ? 2 : 2);
                                 const enteredCodes = Array.from({ length: slotCount })
                                   .map((_, idx) => (convenerStudentCodes[idx] || '').trim().toUpperCase())
                                   .filter(Boolean);

                                 if (enteredCodes.length === 0) {
                                   showToast('Please enter at least one Chess No.', 'error');
                                   return;
                                 }

                                 const uniqueCodes = new Set(enteredCodes);
                                 if (uniqueCodes.size < enteredCodes.length) {
                                   showToast('Duplicate chess numbers entered. Each student must be unique.', 'error');
                                   return;
                                 }

                                 let updatedRegs = [...registrations];
                                 const successNames: string[] = [];

                                 for (const stCode of enteredCodes) {
                                   const s = students.find(st => st.code.toUpperCase() === stCode);
                                   if (!s) {
                                     showToast(`Chess No. ${stCode} not found.`, 'error');
                                     return;
                                   }

                                   if (s.team !== teamRegistrationSelectedTeam) {
                                     showToast(`Student ${s.name} (${stCode}) does not belong to ${teamRegistrationSelectedTeam}`, 'error');
                                     return;
                                   }

                                   if (p.category !== 'General' && s.category !== p.category) {
                                     showToast(`Student ${s.name} (${s.category}) cannot participate in ${p.category} programme.`, 'error');
                                     return;
                                   }

                                   if (updatedRegs.some(r => r.programId === p.id && r.studentCode.toUpperCase() === s.code.toUpperCase())) {
                                     showToast(`Student ${s.name} is already registered for ${p.name}.`, 'error');
                                     return;
                                   }

                                   const studentRegs = updatedRegs.filter(r => r.studentCode.toUpperCase() === s.code.toUpperCase());
                                   const programMap = new Map<string, Program>(programs.map(pr => [pr.id, pr]));
                                   let stageCount = 0;
                                   let nonStageCount = 0;
                                   let generalCount = 0;
                                   studentRegs.forEach(reg => {
                                     const pr = programMap.get(reg.programId);
                                     if (pr) {
                                       if (pr.category === 'General') {
                                         generalCount++;
                                       } else if (pr.type === 'Stage') {
                                         stageCount++;
                                       } else {
                                         nonStageCount++;
                                       }
                                     }
                                   });

                                   if (p.category === 'General') {
                                     const generalLimit = categoryLimits['General']?.maxGeneral ?? categoryLimits['General']?.maxStage ?? 2;
                                     if (generalCount >= generalLimit) {
                                       showToast(`Student ${s.name} has reached max General programme limit (${generalLimit}).`, 'error');
                                       return;
                                     }
                                   } else {
                                     const studentLimits = categoryLimits[s.category] || {
                                       maxStage: maxStagePrograms,
                                       maxNonStage: maxNonStagePrograms,
                                     };

                                     if (p.type === 'Stage' && stageCount >= studentLimits.maxStage) {
                                       showToast(`Student ${s.name} (${s.category}) has reached max Stage limit (${studentLimits.maxStage}).`, 'error');
                                       return;
                                     }
                                     if (p.type === 'Non-Stage' && nonStageCount >= studentLimits.maxNonStage) {
                                       showToast(`Student ${s.name} (${s.category}) has reached max Non-Stage limit (${studentLimits.maxNonStage}).`, 'error');
                                       return;
                                     }
                                   }

                                   const teamLimit = p.maxParticipantsPerGroup || (p.category === 'General' ? 5 : 2);
                                   const currentTargetEntryIndex = p.category === 'General' ? convenerEntryIndex : 1;
                                   const thisProgRegs = updatedRegs.filter(r => r.programId === p.id);
                                   const thisTeamRegs = thisProgRegs.filter(r => {
                                     const st = students.find(stud => stud.code.toUpperCase() === r.studentCode.toUpperCase());
                                     return st?.team === s.team;
                                   });

                                   if (thisTeamRegs.length >= teamLimit) {
                                     showToast(`Team ${s.team} has reached maximum limit (${teamLimit}) for ${p.name}.`, 'error');
                                     return;
                                   }

                                   const newReg = {
                                     id: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
                                     programId: p.id,
                                     studentCode: s.code,
                                     entryIndex: currentTargetEntryIndex
                                   };
                                   updatedRegs.push(newReg);
                                   successNames.push(s.name);
                                 }

                                 if (successNames.length > 0) {
                                   saveAndSetRegistrations(updatedRegs);
                                   showToast(`Registered successfully: ${successNames.join(', ')}`, 'success');
                                   setConvenerStudentCodes([]);
                                 }
                              }}
                              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-colors text-sm cursor-pointer"
                            >
                              Register Student(s)
                            </button>
                          </>
                        );
                      })()}

                      {/* Display registered programs for this team - FILTERED BY TYPED PROGRAM CODE */}
                      <div className="mt-4 p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                        {(() => {
                          const typedCode = convenerProgramCode.trim().toUpperCase();
                          const currentProgram = typedCode ? programs.find(p => p.code?.toUpperCase() === typedCode) : null;

                          const matchingRegs = registrations.map(reg => {
                            const pr = programs.find(p => p.id === reg.programId);
                            const st = students.find(s => s.code.toUpperCase() === reg.studentCode.toUpperCase());
                            return { reg, pr, st };
                          }).filter(item => {
                            if (!item.st || item.st.team !== teamRegistrationSelectedTeam) return false;
                            if (currentProgram) return item.pr?.id === currentProgram.id;
                            if (typedCode) return item.pr?.code?.toUpperCase() === typedCode;
                            return false; // If no program code entered, do not show all
                          });

                          return (
                            <>
                              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                  <CheckCircle className="w-4 h-4 text-amber-400" />
                                  {currentProgram ? `Registered Students - ${currentProgram.name} [${currentProgram.code}]` : 'Registered Students for Programme'}
                                </span>
                                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                  {matchingRegs.length}
                                </span>
                              </div>

                              {!typedCode ? (
                                <p className="text-xs text-stone-500 italic py-1">Type a Programme Code above to view registered students for that programme.</p>
                              ) : !currentProgram ? (
                                <p className="text-xs text-amber-500/70 italic py-1">Programme code "{typedCode}" not found.</p>
                              ) : matchingRegs.length === 0 ? (
                                <p className="text-xs text-stone-500 italic py-1">No students registered yet for {currentProgram.name} in {teamRegistrationSelectedTeam}.</p>
                              ) : (
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                  {matchingRegs.map(({ reg, pr, st }) => (
                                    <div key={reg.id} className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg flex items-center justify-between">
                                      <div>
                                        <p className="text-xs font-bold text-amber-200">
                                          <span className="font-mono text-amber-400 font-extrabold">[{pr?.code || 'N/A'}]</span> {pr?.name || 'Programme'}
                                        </p>
                                        <p className="text-xs text-stone-300 font-medium mt-0.5">
                                          <span className="font-mono text-amber-300 font-bold">{st?.code}</span> - {st?.name} <span className="text-[10px] text-stone-500">({st?.category})</span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                    <div className="pt-6 mt-6 border-t border-amber-500/20 space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Flame className="w-5 h-5 text-amber-50" />
                        <h4 className="text-md font-bold text-amber-300">Topic Registration</h4>
                      </div>
                      <p className="text-xs text-stone-400">
                        First-come, first-serve. Enter the Programme Code, then enter Topic 1 and Topic 2 for your participants. If another team registers a topic first, it cannot be selected.
                      </p>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-400 block">Programme Code (Topic Events)</label>
                        <input
                          type="text"
                          value={convenerSongProgramCode}
                          onChange={(e) => setConvenerSongProgramCode(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 text-sm text-amber-100 uppercase focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none font-bold"
                          placeholder="e.g. P002"
                        />
                        {(() => {
                           const p = programs.find(pr => pr.code?.toUpperCase() === convenerSongProgramCode);
                           if (p && !p.isSongEvent) return <p className="text-xs text-rose-400 font-bold mt-1">Not a topic registration event.</p>;
                           return p ? <p className="text-xs text-amber-400 font-bold mt-1">{p.name} ({p.category})</p> : null;
                        })()}
                      </div>

                      {/* Two columns for Topic 1 and Topic 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-stone-950/80 rounded-xl border border-amber-500/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-amber-300">Topic 1 (Participant 1)</label>
                            {(() => {
                              const p = programs.find(pr => pr.code?.toUpperCase() === convenerSongProgramCode);
                              const reg1 = songRegistrations.find(r => r.programId === p?.id && r.team === teamRegistrationSelectedTeam && r.status !== 'rejected' && (r.entryIndex === 1 || !r.entryIndex));
                              return reg1 ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Registered</span> : null;
                            })()}
                          </div>
                          <input
                            type="text"
                            value={convenerSongLine1}
                            onChange={(e) => setConvenerSongLine1(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-amber-500/20 bg-stone-900 text-xs text-amber-100 focus:border-amber-400 outline-none"
                            placeholder="Type topic for Entry 1..."
                          />
                        </div>

                        <div className="p-3 bg-stone-950/80 rounded-xl border border-amber-500/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-amber-300">Topic 2 (Participant 2)</label>
                            {(() => {
                              const p = programs.find(pr => pr.code?.toUpperCase() === convenerSongProgramCode);
                              const reg2 = songRegistrations.find(r => r.programId === p?.id && r.team === teamRegistrationSelectedTeam && r.status !== 'rejected' && r.entryIndex === 2);
                              return reg2 ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Registered</span> : null;
                            })()}
                          </div>
                          <input
                            type="text"
                            value={convenerSongLine2}
                            onChange={(e) => setConvenerSongLine2(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-amber-500/20 bg-stone-900 text-xs text-amber-100 focus:border-amber-400 outline-none"
                            placeholder="Type topic for Entry 2..."
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const p = programs.find(pr => pr.code?.toUpperCase() === convenerSongProgramCode);
                          if (!p) { showToast('Invalid Programme Code', 'error'); return; }
                          if (!p.isSongEvent) { showToast('This programme does not require topic registration.', 'error'); return; }
                          
                          handleSaveBothTopics(p.id, convenerSongLine1, convenerSongLine2);
                        }}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl transition-colors text-sm cursor-pointer shadow-lg shadow-amber-500/10"
                      >
                        Register Topics
                      </button>

                      {/* Display registered topics for this team */}
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-bold text-amber-300">Registered Topics for {teamRegistrationSelectedTeam}:</p>
                        {songRegistrations.filter(r => r.team === teamRegistrationSelectedTeam && r.status !== 'rejected').map(r => {
                          const p = programs.find(pr => pr.id === r.programId);
                          const entryLabel = `Topic ${r.entryIndex || 1}`;
                          return (
                            <div key={r.id} className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex justify-between items-center gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {entryLabel}
                                  </span>
                                  <p className="text-[11px] font-bold text-amber-500/80">
                                    {p?.code ? `[${p.code}] ` : ''}{p?.name || 'Unknown Programme'}
                                  </p>
                                </div>
                                <p className="text-xs text-amber-100 font-bold mt-1">"{r.songLine}"</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PROGRAMS LIST MODAL --- */}
      <AnimatePresence>
        {isProgramsListModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProgramsListModalOpen(false)}
              className="absolute inset-0 bg-stone-950/95"
            ></motion.div>
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-stone-900 rounded-3xl shadow-2xl border border-amber-500/20 text-amber-50"
            >
              <div className="p-6 pb-4 border-b border-amber-500/20 shrink-0">
                <button 
                  onClick={() => setIsProgramsListModalOpen(false)}
                  className="absolute top-4 right-4 text-amber-400 hover:text-stone-400 p-1 bg-stone-950 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-2 text-amber-400 font-extrabold text-xl">
                  <SearchCode className="w-6 h-6 text-amber-50" />
                  <h3>Programmes List</h3>
                </div>
                <p className="text-xs text-amber-200/80 mb-4">View and search through all registered programmes.</p>

                <div className="relative">
                  <input 
                    type="text" 
                    value={programsSearchQuery}
                    onChange={(e) => setProgramsSearchQuery(e.target.value)}
                    placeholder="Search by code or name..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-amber-500/20 rounded-xl text-sm text-amber-100 placeholder-stone-500 focus:border-amber-500/50 outline-none"
                  />
                  <Search className="w-4 h-4 text-amber-500/50 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-3">
                {(() => {
                  const query = programsSearchQuery.trim().toLowerCase();
                  const filteredPrograms = programs.filter(p => 
                    (p.name && p.name.toLowerCase().includes(query)) || 
                    (p.code && p.code.toLowerCase().includes(query))
                  );
                  
                  if (filteredPrograms.length === 0) {
                    return (
                      <div className="text-center py-10 opacity-60">
                        <p className="text-sm">No programmes found.</p>
                      </div>
                    );
                  }

                  return filteredPrograms.map((p, index) => (
                    <div key={p.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex justify-between items-center gap-4">
                      <div>
                        <p className="text-amber-100 font-bold text-lg mb-1 flex items-center gap-2">
                          {p.code ? `${p.code}. ` : ''}{p.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {p.isSongEvent && <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1"><Flame className="w-3 h-3" /> Topic</span>}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-stone-400">{p.category}</span>
                        <span className="text-[10px] text-stone-500">{p.type}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PROGRAM SCHEDULE MODAL --- */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute inset-0 bg-stone-950/95"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-stone-900 rounded-3xl shadow-2xl border border-amber-500/20 text-amber-50"
            >
              <div className="p-6 pb-4 border-b border-amber-500/20 shrink-0">
                <button 
                  id="close-schedule-modal"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="absolute top-6 right-6 text-amber-400 hover:text-stone-400 p-1 bg-stone-950 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4 text-amber-400 font-extrabold text-xl">
                  <CalendarDays className="w-7 h-7 text-amber-50" />
                  <h3>Programme Schedule</h3>
                </div>
                
                <div className="relative">
                  <input 
                    type="text" 
                    value={scheduleSearchQuery}
                    onChange={(e) => setScheduleSearchQuery(e.target.value)}
                    placeholder="Search schedule by code or name..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-amber-500/20 rounded-xl text-sm text-amber-100 placeholder-stone-500 focus:border-amber-500/50 outline-none"
                  />
                  <Search className="w-4 h-4 text-amber-500/50 absolute left-3.5 top-3" />
                </div>

                {/* Stage Filter Tabs */}
                {(() => {
                  const query = scheduleSearchQuery.trim().toLowerCase();
                  const scheduledPrograms = programs.filter(p => p.date || p.time);
                  const filtered = scheduledPrograms.filter(p => 
                    (p.name && p.name.toLowerCase().includes(query)) || 
                    (p.code && p.code.toLowerCase().includes(query))
                  );
                  const s1Count = filtered.filter(p => p.type === 'Stage' && (p.stage === 'Stage 1' || !p.stage)).length;
                  const s2Count = filtered.filter(p => p.type === 'Stage' && p.stage === 'Stage 2').length;
                  const nsCount = filtered.filter(p => p.type === 'Non-Stage').length;

                  if (scheduledPrograms.length === 0) return null;

                  return (
                    <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-amber-500/20 mt-3 overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => setScheduleActiveStageTab('all')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          scheduleActiveStageTab === 'all' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        All ({filtered.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleActiveStageTab('Stage 1')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          scheduleActiveStageTab === 'Stage 1' 
                            ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40' 
                            : 'text-stone-400 hover:text-amber-300'
                        }`}
                      >
                        Stage 1 ({s1Count})
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleActiveStageTab('Stage 2')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          scheduleActiveStageTab === 'Stage 2' 
                            ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' 
                            : 'text-stone-400 hover:text-emerald-300'
                        }`}
                      >
                        Stage 2 ({s2Count})
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleActiveStageTab('Non-Stage')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          scheduleActiveStageTab === 'Non-Stage' 
                            ? 'bg-stone-800 text-stone-200 border border-stone-700' 
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        Non-Stage ({nsCount})
                      </button>
                    </div>
                  );
                })()}
              </div>

              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                {(() => {
                  const query = scheduleSearchQuery.trim().toLowerCase();
                  const scheduledPrograms = programs.filter(p => p.date || p.time);
                  const filteredPrograms = scheduledPrograms.filter(p => 
                    (p.name && p.name.toLowerCase().includes(query)) || 
                    (p.code && p.code.toLowerCase().includes(query))
                  );
                  
                  if (scheduledPrograms.length === 0) {
                    return (
                      <div className="text-center py-10 opacity-60">
                        <CalendarDays className="w-12 h-12 text-amber-500/30 mx-auto mb-3" />
                        <p className="text-amber-200/80 font-bold">No programmes scheduled yet.</p>
                        <p className="text-xs text-stone-400 mt-1">Admin will set the dates and times soon.</p>
                      </div>
                    );
                  }
                  
                  if (filteredPrograms.length === 0) {
                    return (
                      <div className="text-center py-10 opacity-60">
                        <p className="text-sm">No scheduled programmes found matching your search.</p>
                      </div>
                    );
                  }

                  const sortByDateTime = (a: Program, b: Program) => {
                    const dateA = a.date || '';
                    const dateB = b.date || '';
                    if (dateA !== dateB) return dateA.localeCompare(dateB);
                    const timeA = a.time || '';
                    const timeB = b.time || '';
                    return timeA.localeCompare(timeB);
                  };

                  const stage1Programs = filteredPrograms
                    .filter(p => p.type === 'Stage' && (p.stage === 'Stage 1' || !p.stage))
                    .sort(sortByDateTime);

                  const stage2Programs = filteredPrograms
                    .filter(p => p.type === 'Stage' && p.stage === 'Stage 2')
                    .sort(sortByDateTime);

                  const nonStagePrograms = filteredPrograms
                    .filter(p => p.type === 'Non-Stage')
                    .sort(sortByDateTime);

                  const renderCard = (p: Program) => {
                    const stg = p.type === 'Stage' ? (p.stage || 'Stage 1') : 'Non-Stage';
                    const badgeColor = stg === 'Stage 1'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : stg === 'Stage 2'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-stone-800 text-stone-400 border-stone-700';

                    return (
                      <div key={p.id} className="bg-stone-950/60 p-3.5 rounded-2xl border border-amber-500/10 hover:border-amber-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-bold text-amber-300 text-base">
                              {p.code && <span className="text-amber-50 mr-1.5">[{p.code}]</span>}
                              {p.name}
                            </p>
                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${badgeColor}`}>
                              {stg}
                            </span>
                          </div>
                          <div className="flex gap-2 text-xs font-bold text-amber-500/60 uppercase">
                            <span>{p.category}</span>
                            <span className="opacity-50">•</span>
                            <span>{p.type} Event</span>
                          </div>
                        </div>
                        <div className="flex gap-4 sm:flex-col sm:gap-1 text-xs sm:text-sm font-bold text-amber-100 shrink-0">
                          {p.date && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-500/70" />
                              <span>{new Date(p.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                          {p.time && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-500/70" />
                              <span>
                                {(() => {
                                  const [hours, minutes] = p.time.split(':');
                                  const h = parseInt(hours, 10);
                                  const ampm = h >= 12 ? 'PM' : 'AM';
                                  const h12 = h % 12 || 12;
                                  return `${h12}:${minutes} ${ampm}`;
                                })()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {/* Stage 1 Section */}
                      {(scheduleActiveStageTab === 'all' || scheduleActiveStageTab === 'Stage 1') && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-amber-950/40 px-4 py-2.5 rounded-xl border border-amber-500/30">
                            <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                              <span>Stage 1</span>
                            </div>
                            <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                              {stage1Programs.length} Programmes
                            </span>
                          </div>
                          {stage1Programs.length > 0 ? (
                            <div className="space-y-2.5">
                              {stage1Programs.map(renderCard)}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-xs text-stone-500 bg-stone-950/40 rounded-xl border border-stone-800">
                              No programmes scheduled on Stage 1 yet.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Stage 2 Section */}
                      {(scheduleActiveStageTab === 'all' || scheduleActiveStageTab === 'Stage 2') && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-500/30">
                            <div className="flex items-center gap-2 font-black text-emerald-300 text-sm">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>Stage 2</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                              {stage2Programs.length} Programmes
                            </span>
                          </div>
                          {stage2Programs.length > 0 ? (
                            <div className="space-y-2.5">
                              {stage2Programs.map(renderCard)}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-xs text-stone-500 bg-stone-950/40 rounded-xl border border-stone-800">
                              No programmes scheduled on Stage 2 yet.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Non-Stage Section */}
                      {(scheduleActiveStageTab === 'all' || scheduleActiveStageTab === 'Non-Stage') && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-stone-900 px-4 py-2.5 rounded-xl border border-stone-700">
                            <div className="flex items-center gap-2 font-black text-stone-300 text-sm">
                              <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                              <span>Non-Stage Events</span>
                            </div>
                            <span className="text-xs font-bold text-stone-400 bg-stone-950 px-2.5 py-0.5 rounded-md border border-stone-800">
                              {nonStagePrograms.length} Programmes
                            </span>
                          </div>
                          {nonStagePrograms.length > 0 ? (
                            <div className="space-y-2.5">
                              {nonStagePrograms.map(renderCard)}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-xs text-stone-500 bg-stone-950/40 rounded-xl border border-stone-800">
                              No Non-Stage programmes scheduled yet.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="p-4 border-t border-amber-500/15 shrink-0 flex justify-end">
                <button 
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="py-2.5 px-6 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-extrabold rounded-xl text-xs transition-all shadow-[0_4px_12px_rgba(212,175,55,0.2)] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* --- GROUP SCORES & RESULTS EDITOR MODAL --- */}
        {isGroupEditModalOpen && editingGroup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsGroupEditModalOpen(false);
                setGroupModalEditingStudent(null);
                setIsGroupModalAddingStudent(false);
              }}
              className="absolute inset-0 bg-stone-950/95"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-stone-900 border border-amber-500/20 rounded-3xl p-6 shadow-2xl z-50 text-amber-50 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => {
                  setIsGroupEditModalOpen(false);
                  setGroupModalEditingStudent(null);
                  setIsGroupModalAddingStudent(false);
                }}
                className="absolute top-4 right-4 text-amber-400 hover:text-stone-400 p-1 bg-stone-950 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 text-amber-400 font-extrabold text-xl">
                <Settings className="w-7 h-7 text-amber-50 animate-spin-slow" />
                <h3>Group Score Manager: {editingGroup}</h3>
              </div>

              {!isAdminLoggedIn ? (
                // PASSWORD PROTECTION SCREEN inside Group Modal
                <div className="space-y-4 py-4">
                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex gap-3 text-sm text-stone-400">
                    <Lock className="w-5 h-5 text-amber-50 shrink-0 mt-0.5" />
                    <p>Enter the admin password to edit the points and details of this group.</p>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (groupAdminPassword === 'admin123') {
                      setIsAdminLoggedIn(true);
                      setGroupAdminPassword('');
                      setGroupAdminError('');
                      showToast('Admin login successful!', 'success');
                    } else {
                      setGroupAdminError('Incorrect password! Please try again.');
                      showToast('Login failed!', 'error');
                    }
                  }} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-amber-400 mb-1.5">Admin password</label>
                      <input 
                        type="password" 
                        value={groupAdminPassword}
                        onChange={(e) => setGroupAdminPassword(e.target.value)}
                        placeholder="Enter password (admin123)"
                        className="w-full px-4 py-3 bg-stone-950/80 border border-amber-500/25 rounded-xl text-amber-50 placeholder-white/30 outline-none focus:border-amber-400"
                        autoFocus
                      />
                      {groupAdminError && <p className="text-rose-400 text-xs mt-1">{groupAdminError}</p>}
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-extrabold rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(212,175,55,0.2)] cursor-pointer"
                    >
                      Unlock (Unlock)
                    </button>
                  </form>
                </div>
              ) : (
                // REAL MANAGEMENT SCREEN
                <div className="space-y-4">
                  <div className="bg-stone-950/60 border border-amber-500/10 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-400/70 font-bold uppercase tracking-wider">Team Total Score</div>
                      <div className="text-3xl font-black text-stone-400 mt-1">{getTeamScore(editingGroup)} <span className="text-xs font-bold text-amber-500/70">Point</span></div>
                    </div>
                    
                    {!isGroupModalAddingStudent && !groupModalEditingStudent && (
                      <button 
                        onClick={startAddInline}
                        className="py-2 px-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add new result</span>
                      </button>
                    )}
                  </div>

                  {/* Inline Adding / Editing Sub-form */}
                  {(isGroupModalAddingStudent || groupModalEditingStudent) && (
                    <motion.form 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSaveInlineStudent}
                      className="bg-stone-950/50 border border-amber-500/20 p-4 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-amber-500/10 pb-2 mb-2">
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span>{groupModalEditingStudent ? 'Edit details' : 'Add new result'}</span>
                        </span>
                        <button 
                          type="button"
                          onClick={() => {
                            setIsGroupModalAddingStudent(false);
                            setGroupModalEditingStudent(null);
                          }}
                          className="text-xs text-stone-400 hover:text-amber-400 transition-colors"
                        >
                          Cancel (Cancel)
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Chess No.</label>
                          <input 
                            type="text" 
                            value={inlineCode}
                            onChange={(e) => setInlineCode(e.target.value)}
                            placeholder="S101, J205"
                            className="w-full px-3 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs text-amber-50 placeholder-white/20 outline-none focus:border-amber-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Student's Name</label>
                          <input 
                            type="text" 
                            value={inlineName}
                            onChange={(e) => setInlineName(e.target.value)}
                            placeholder="Enter name"
                            className="w-full px-3 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs text-amber-50 placeholder-white/20 outline-none focus:border-amber-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Category</label>
                          <select 
                            value={inlineCategory}
                            onChange={(e) => setInlineCategory(e.target.value as CategoryName)}
                            className="w-full px-2.5 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs text-amber-100 outline-none focus:border-amber-400"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat} className="bg-stone-900 text-amber-100">{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Class</label>
                          <input 
                            type="text" 
                            value={inlineClass}
                            onChange={(e) => setInlineClass(e.target.value)}
                            placeholder="12, 10"
                            className="w-full px-2.5 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs text-amber-50 placeholder-white/20 outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Event</label>
                          <input 
                            type="text" 
                            value={inlineEvent}
                            onChange={(e) => setInlineEvent(e.target.value)}
                            placeholder="Drawing, etc."
                            className="w-full px-2.5 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs text-amber-50 placeholder-white/20 outline-none focus:border-amber-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Rank</label>
                          <select 
                            value={inlineRank}
                            onChange={(e) => setInlineRank(Number(e.target.value))}
                            className="w-full px-2.5 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs text-amber-100 outline-none focus:border-amber-400"
                          >
                            <option value={1} className="bg-stone-900 text-amber-100">1st Rank</option>
                            <option value={2} className="bg-stone-900 text-amber-100">2nd Rank</option>
                            <option value={3} className="bg-stone-900 text-amber-100">3rd Rank</option>
                            <option value={0} className="bg-stone-900 text-amber-100">No Chance</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Grade</label>
                          <select 
                            value={inlineGrade}
                            onChange={(e) => setInlineGrade(e.target.value)}
                            className="w-full px-2.5 py-2 bg-stone-900 border border-amber-500/15 rounded-lg text-xs text-amber-100 outline-none focus:border-amber-400"
                          >
                            <option value="A" className="bg-stone-900 text-amber-100">A</option>
                            <option value="B" className="bg-stone-900 text-amber-100">B</option>
                            <option value="C" className="bg-stone-900 text-amber-100">C</option>
                            <option value="" className="bg-stone-900 text-amber-100">No Grade</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400/80 mb-1">Points (Auto)</label>
                          <input 
                            readOnly
                            type="number" 
                            value={inlinePoints}
                            className="w-full px-2.5 py-2 bg-stone-950 border border-amber-500/15 rounded-lg text-xs text-amber-50 outline-none opacity-80"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Results (Save Results)</span>
                      </button>
                    </motion.form>
                  )}

                  {/* Scrollable list of students belonging to this team */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-amber-400/95 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-50" />
                      <span>Students' Points & Results ({students.filter(s => s.team === editingGroup && !s.code.startsWith('TEAM-') && s.category !== 'General').length} Count)</span>
                    </h4>

                    <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                      {students.filter(s => s.team === editingGroup && !s.code.startsWith('TEAM-') && s.category !== 'General').length === 0 ? (
                        <div className="text-center py-8 text-xs text-stone-500 border border-dashed border-amber-500/10 rounded-2xl">
                          No results added to this group yet.
                        </div>
                      ) : (
                        students
                          .filter(s => s.team === editingGroup && !s.code.startsWith('TEAM-') && s.category !== 'General')
                          .map((student, idx) => (
                            <div 
                              key={student.id || `${student.code}-${idx}`}
                              className="bg-stone-950/40 hover:bg-stone-950/60 border border-amber-500/10 p-3.5 rounded-2xl flex items-center justify-between gap-3 group transition-all"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-amber-400/15 text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-500/10">{student.code}</span>
                                  <span className="font-bold text-sm text-amber-100">{student.name}</span>
                                </div>
                                <div className="text-[11px] text-amber-400/60 mt-1 flex items-center gap-3">
                                  <span>Event: <strong>{student.event}</strong></span>
                                  <span>Grade: <strong>{student.grade}</strong></span>
                                  <span>Rank: <strong>{student.rank}</strong></span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                  <div className="text-base font-extrabold text-stone-400">{student.points} <span className="text-[10px] text-amber-500/60 font-bold">pts</span></div>
                                </div>

                                <div className="flex items-center gap-1">
                                  {/* Quick Edit */}
                                  <button 
                                    onClick={() => startEditInline(student)}
                                    className="p-1.5 hover:bg-amber-400/10 text-stone-400 hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Delete */}
                                  <button 
                                    onClick={() => handleDeleteInlineStudent(student.code)}
                                    className="p-1.5 hover:bg-rose-500/10 text-stone-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-500/15 flex justify-end">
                    <button 
                      onClick={() => {
                        setIsGroupEditModalOpen(false);
                        setGroupModalEditingStudent(null);
                        setIsGroupModalAddingStudent(false);
                      }}
                      className="py-2.5 px-6 bg-stone-950 hover:bg-stone-800 text-amber-100 font-bold rounded-xl text-xs border border-amber-500/10 transition-colors cursor-pointer"
                    >
                      Done (Done)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* LIVE ANIMATION PRESENTATION MODE */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isLiveAnimationOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[200] bg-stone-950 text-amber-50 flex flex-col justify-between p-2 sm:p-3 md:p-4 select-none overflow-y-auto"
          >
            {/* Dynamic Animated Background Aura */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-stone-900 to-stone-950 animate-pulse"></div>
            <div 
              className="absolute inset-0 z-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: 'url("/background.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>

            {/* TOP RIGHT 3-DOTS TOGGLE BUTTON */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40">
              <button
                onClick={() => setIsLiveControlsOpen(prev => !prev)}
                className={`p-2 sm:p-2.5 rounded-full border backdrop-blur-md shadow-xl transition-all cursor-pointer flex items-center justify-center ${
                  isLiveControlsOpen 
                    ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                    : 'bg-stone-900/80 hover:bg-stone-800 text-amber-300 border-amber-500/40 shadow-lg'
                }`}
                title={isLiveControlsOpen ? "Hide Controls" : "Show Controls"}
              >
                <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* TOP HEADER CONTROLS BAR (Collapsible via 3-dots button) */}
            <AnimatePresence>
              {isLiveControlsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-30 flex items-center justify-between gap-2 sm:gap-4 bg-stone-900/95 border border-amber-500/30 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl backdrop-blur-xl shadow-2xl mr-12 sm:mr-14 mb-2"
                >
                  {/* Left: Live Indicator & Slide Title */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-red-600/20 text-red-400 border border-red-500/40 px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      <Radio className="w-3.5 h-3.5" />
                      <span>LIVE</span>
                    </div>

                    <div className="hidden sm:block">
                      <h2 className="text-xs sm:text-sm font-black text-amber-200 tracking-wide">
                        {festivalName} • {festivalYear}
                      </h2>
                      <p className="text-[10px] text-amber-400/60 font-bold">
                        {liveSlides[liveSlideIndex % liveSlides.length]?.title || 'Live Animation Mode'}
                      </p>
                    </div>
                  </div>

                  {/* Center: Slide Progress Timeline */}
                  <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:flex flex-col items-center gap-1">
                    <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-amber-500/20 relative">
                      <motion.div 
                        key={liveSlideIndex}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ 
                          duration: (liveSlides[liveSlideIndex % liveSlides.length]?.duration || 2000) / 1000, 
                          ease: "linear" 
                        }}
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400/80">
                      SLIDE {((liveSlideIndex % liveSlides.length) + 1)} / {liveSlides.length}
                    </span>
                  </div>

                  {/* Right Controls: Prev, Pause/Play, Next, Fullscreen, Close */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button 
                      onClick={() => setLiveSlideIndex(prev => (prev - 1 + liveSlides.length) % liveSlides.length)}
                      className="p-1.5 sm:p-2 bg-stone-950 hover:bg-stone-800 text-amber-300 rounded-xl border border-amber-500/20 transition-all cursor-pointer"
                      title="Previous Slide"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => setIsLivePaused(!isLivePaused)}
                      className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer font-bold flex items-center gap-1 text-xs px-2.5 sm:px-3 ${
                        isLivePaused 
                          ? 'bg-amber-500 text-amber-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
                          : 'bg-stone-950 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {isLivePaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isLivePaused ? 'RESUME' : 'PAUSE'}</span>
                    </button>

                    <button 
                      onClick={() => setLiveSlideIndex(prev => (prev + 1) % liveSlides.length)}
                      className="p-1.5 sm:p-2 bg-stone-950 hover:bg-stone-800 text-amber-300 rounded-xl border border-amber-500/20 transition-all cursor-pointer"
                      title="Next Slide"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen().catch(() => {});
                          setIsLiveFullScreen(true);
                        } else {
                          document.exitFullscreen().catch(() => {});
                          setIsLiveFullScreen(false);
                        }
                      }}
                      className="p-1.5 sm:p-2 bg-stone-950 hover:bg-stone-800 text-amber-300 rounded-xl border border-amber-500/20 transition-all cursor-pointer hidden sm:block"
                      title="Toggle Fullscreen"
                    >
                      {isLiveFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    <button 
                      onClick={() => {
                        setIsLiveAnimationOpen(false);
                        if (document.fullscreenElement) {
                          document.exitFullscreen().catch(() => {});
                        }
                      }}
                      className="p-1.5 sm:p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-xl border border-red-500/40 transition-all cursor-pointer ml-0.5"
                      title="Exit Live Mode"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MAIN ANIMATED SLIDE DISPLAY AREA */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-1 sm:my-2 overflow-hidden px-2 w-full min-h-0">
              <AnimatePresence mode="wait">
                {(() => {
                  const currentSlide = liveSlides[liveSlideIndex % liveSlides.length];
                  if (!currentSlide) return null;

                  // -------------------------------------------------------------
                  // SLIDE TYPE 1: HEADER BANNER
                  // Strictly NO tabs! Clean festival emblem, logo, titles, background
                  // -------------------------------------------------------------
                  if (currentSlide.type === 'header') {
                    return (
                      <motion.div 
                        key={`header-${liveSlideIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { duration: 0.5, delay: 0.5, ease: "easeInOut" }
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.95,
                          transition: { duration: 0.6, ease: "easeInOut" }
                        }}
                        className="m-auto w-full max-w-4xl bg-stone-900/90 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.25)] relative overflow-hidden flex flex-col items-center text-center"
                      >
                        {/* Inner Decorative Background */}
                        <div 
                          className="absolute inset-0 opacity-25 z-0 pointer-events-none"
                          style={{
                            backgroundImage: 'url("/background.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/90 to-stone-950/70 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center">
                          {/* Festival Emblem Logo */}
                          <div className="mb-4 sm:mb-6 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] overflow-hidden border-4 border-amber-300 bg-amber-500 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                            <img 
                              src="/logo.jpg" 
                              alt="Festival Logo" 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/ffffff/d4af37?text=Logo'; }} 
                            />
                          </div>

                          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider gold-shimmer uppercase drop-shadow-2xl mb-3 sm:mb-4">
                            {festivalName}
                          </h1>

                          <div className="inline-block bg-gradient-to-r from-amber-500 to-rose-500 text-amber-950 font-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-xl sm:text-3xl md:text-4xl shadow-xl border border-amber-300">
                            إن شاء الله
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // -------------------------------------------------------------
                  // SLIDE TYPE 2: TEAM TOTAL SCORE
                  // Shows heading "TEAM TOTAL" and single column with team points & name
                  // -------------------------------------------------------------
                  if (currentSlide.type === 'team_score') {
                    const { team } = currentSlide.data;
                    return (
                      <motion.div 
                        key={`team-${team.name}-${liveSlideIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { duration: 0.5, delay: 0.5, ease: "easeInOut" }
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.95,
                          transition: { duration: 0.6, ease: "easeInOut" }
                        }}
                        className="m-auto w-full max-w-3xl bg-stone-900/95 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col items-center justify-center text-center gap-6 sm:gap-8"
                      >
                        {/* Heading */}
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-300 tracking-wider uppercase border-b-2 border-amber-500/30 pb-3 sm:pb-4 w-full">
                          TEAM TOTAL
                        </h2>

                        {/* Single Column: Points and Team Name */}
                        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-2 sm:py-4">
                          <div className="text-6xl sm:text-8xl md:text-9xl font-black text-amber-400 gold-shimmer tracking-tight">
                            {team.score}
                          </div>
                          <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-amber-100 uppercase tracking-wider">
                            {team.name}
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // -------------------------------------------------------------
                  // SLIDE TYPE 3: CATEGORY SCORE TABLES
                  // Shows heading with ONLY the category name, and table below
                  // -------------------------------------------------------------
                  if (currentSlide.type === 'category_score') {
                    const catData = currentSlide.data;
                    return (
                      <motion.div 
                        key={`cat-${catData.category}-${liveSlideIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { duration: 0.5, delay: 0.5, ease: "easeInOut" }
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.95,
                          transition: { duration: 0.6, ease: "easeInOut" }
                        }}
                        className="m-auto w-full max-w-4xl bg-stone-900/95 border-2 border-amber-500/40 rounded-3xl p-3 sm:p-5 md:p-6 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col items-center justify-center text-center gap-3 sm:gap-4"
                      >
                        {/* Heading: ONLY Category Name */}
                        <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-amber-300 tracking-wider uppercase border-b-2 border-amber-500/30 pb-2 sm:pb-3 w-full text-center">
                          {catData.category}
                        </h2>

                        {/* Standings Table in Columns */}
                        <div className="w-full bg-stone-950 rounded-2xl border border-amber-500/20 overflow-x-auto shadow-inner">
                          <table className="w-full text-left border-collapse min-w-[280px]">
                            <thead className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs sm:text-base font-black uppercase tracking-wider">
                              <tr>
                                <th className="px-2 sm:px-6 py-2 sm:py-3 w-14 sm:w-24 text-center">Rank</th>
                                <th className="px-2 sm:px-6 py-2 sm:py-3">Team Name</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right w-24 sm:w-36 whitespace-nowrap">Points</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800 font-bold text-sm sm:text-base">
                              {catData.ranking.map((team: any, idx: number) => (
                                <tr 
                                  key={team.team}
                                  className={idx === 0 ? 'bg-amber-500/15 text-amber-200' : 'text-stone-300 hover:bg-stone-900/50'}
                                >
                                  <td className="px-2 sm:px-6 py-2 sm:py-3 text-center w-14 sm:w-24">
                                    <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-black ${
                                      idx === 0 ? 'bg-amber-400 text-amber-950 shadow-md' :
                                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                                      idx === 2 ? 'bg-amber-800 text-amber-100' :
                                      'bg-stone-800 text-stone-400'
                                    }`}>
                                      #{idx + 1}
                                    </span>
                                  </td>
                                  <td className="px-2 sm:px-6 py-2 sm:py-3">
                                    <span className="text-amber-100 font-black text-base sm:text-lg uppercase tracking-wide block">{team.team}</span>
                                  </td>
                                  <td className="px-3 sm:px-6 py-2 sm:py-3 text-right w-24 sm:w-36 whitespace-nowrap">
                                    <span className="font-black text-amber-300 text-lg sm:text-xl drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] block">
                                      {team.total}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    );
                  }

                  // -------------------------------------------------------------
                  // SLIDE TYPE 4 & 5: TOP INDIVIDUALS (OVERALL OR PER CATEGORY)
                  // Table layout with Rank, Name, Points - Compact mobile design to fit 10 rows
                  // -------------------------------------------------------------
                  if (currentSlide.type === 'top_overall' || currentSlide.type === 'top_category') {
                    const isOverall = currentSlide.type === 'top_overall';
                    const rawStudents = isOverall ? currentSlide.data.students : currentSlide.data.students || [];
                    const studentsList = rawStudents.slice(0, 10);
                    const title = isOverall ? 'TOP INDIVIDUALS' : `TOP INDIVIDUALS - ${currentSlide.data.category}`;

                    return (
                      <motion.div 
                        key={`top-${currentSlide.id}-${liveSlideIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { duration: 0.5, delay: 0.5, ease: "easeInOut" }
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.95,
                          transition: { duration: 0.6, ease: "easeInOut" }
                        }}
                        className="m-auto w-full max-w-4xl bg-stone-900/95 border-2 border-amber-500/40 rounded-2xl p-2 sm:p-3 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col items-center justify-center text-center gap-1 sm:gap-1.5"
                      >
                        {/* Heading: Top Individuals Title */}
                        <h2 className="text-sm sm:text-base md:text-xl font-black text-amber-300 tracking-wider uppercase border-b border-amber-500/30 pb-0.5 sm:pb-1 w-full text-center">
                          {title}
                        </h2>

                        {/* Top Students Table */}
                        <div className="w-full bg-stone-950 rounded-lg border border-amber-500/20 overflow-hidden shadow-inner">
                          <table className="w-full text-left border-collapse min-w-[260px]">
                            <thead className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[9px] sm:text-[11px] font-black uppercase tracking-wider">
                              <tr>
                                <th className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 w-8 sm:w-12 text-center">Rank</th>
                                <th className="px-1.5 sm:px-2.5 py-0.5 sm:py-1">Name</th>
                                <th className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-right w-16 sm:w-24 whitespace-nowrap">Points</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800/80 font-bold text-xs">
                              {studentsList.map((student: any, idx: number) => (
                                <tr 
                                  key={student.id || `${student.code}-${idx}`}
                                  className={idx === 0 ? 'bg-amber-500/15 text-amber-200' : 'text-stone-300 hover:bg-stone-900/50'}
                                >
                                  <td className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-center w-8 sm:w-12">
                                    <span className={`inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[9px] sm:text-[10px] font-black ${
                                      idx === 0 ? 'bg-amber-400 text-amber-950 shadow-md' :
                                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                                      idx === 2 ? 'bg-amber-800 text-amber-100' :
                                      'bg-stone-800 text-stone-400'
                                    }`}>
                                      #{idx + 1}
                                    </span>
                                  </td>
                                  <td className="px-1.5 sm:px-2.5 py-0.5 sm:py-1">
                                    <span className="text-amber-100 font-black text-[11px] sm:text-xs uppercase tracking-wide block leading-tight">{student.name}</span>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-amber-400/80 block leading-tight">
                                      Team: {student.team} {student.code ? `• Chest No: ${student.code}` : ''}
                                    </span>
                                  </td>
                                  <td className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-right w-16 sm:w-24 whitespace-nowrap">
                                    <span className="font-black text-amber-300 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] block">
                                      {student.points}
                                    </span>
                                  </td>
                                </tr>
                              ))}

                              {studentsList.length === 0 && (
                                <tr>
                                  <td colSpan={3} className="py-2 text-center text-stone-500 italic text-xs">
                                    No data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    );
                  }

                  return null;
                })()}
              </AnimatePresence>
            </div>

            {/* BOTTOM BROADCAST FOOTER - REMOVED PER USER REQUEST */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NOTIFICATION HISTORY MODAL --- */}
      <AnimatePresence>
        {isNotificationModalOpen && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-stone-900 border-2 border-amber-500/40 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-[0_0_60px_rgba(212,175,55,0.3)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-stone-950 border-b border-amber-500/20 flex items-center justify-between relative">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-amber-300 text-base sm:text-lg flex items-center gap-2">
                      Notifications
                    </h3>
                    <p className="text-[11px] text-stone-400 font-medium">
                      Live announcements and competition results
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Permission Banner if not allowed */}
              {notifPermissionState !== 'granted' && (
                <div className="bg-amber-950/80 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
                  <span className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
                    <BellRing className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                    Push notifications are inactive
                  </span>
                  <button 
                    onClick={handleRequestNotifPermission}
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-lg text-[11px] transition-all cursor-pointer shadow-sm"
                  >
                    Allow Notifications
                  </button>
                </div>
              )}

              {/* List */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {activeNotifications.length > 0 ? (
                  activeNotifications.map((notif) => {
                    const isRead = readNotifIds.includes(notif.id);
                    return (
                      <div 
                        key={notif.id}
                        onClick={() => markNotifAsRead(notif.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                          isRead 
                            ? 'bg-stone-950/60 border-stone-800/80 text-stone-300' 
                            : 'bg-amber-500/10 border-amber-500/40 text-amber-50 shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              notif.category === 'result' 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : notif.category === 'announcement'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            }`}>
                              {notif.category === 'result' ? '🏆 Result' : notif.category === 'announcement' ? '📢 Announcement' : '📌 General'}
                            </span>
                            {notif.targetTeam && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                🎯 {notif.targetTeam}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-400 font-medium">
                              {notif.timestamp}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => clearSingleNotification(notif.id, e)}
                              className="p-1 rounded-full text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                              title="Remove from this phone"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-extrabold text-sm text-amber-200 mb-1 leading-snug pr-4">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed font-normal">
                          {notif.message}
                        </p>
                        {!isRead && (
                          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-stone-500 space-y-2">
                    <Bell className="w-8 h-8 mx-auto text-stone-600 opacity-50" />
                    <p className="text-sm italic">No notifications yet</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-stone-950 border-t border-amber-500/20 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium text-[11px]">
                  Total {activeNotifications.length} notifications
                </span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={markAllNotifsAsRead}
                    className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer text-[11px]"
                  >
                    Mark all as read
                  </button>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer text-[11px]"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- OFFICIAL ANDROID NOTIFICATION PERMISSION DIALOG --- */}
      <AnimatePresence>
        {showNotifPermissionPrompt && notifPermissionState !== 'granted' && (
          <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 10 }}
              className="bg-[#212226] border border-stone-700/60 rounded-[28px] p-6 max-w-sm w-full shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-center space-y-4 relative overflow-hidden"
            >
              {/* Android App / Feature Icon Badge */}
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-sm">
                <BellRing className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-amber-100 leading-snug">
                  Allow "Sargam Art Fest 2026" to send you notifications?
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-normal">
                  Get instant updates on competition results, live announcements, and team scores directly on your device.
                </p>
              </div>

              {/* Android Style Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRequestNotifPermission}
                  className="w-full py-3 px-5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Allow
                </button>
                <button
                  onClick={() => setShowNotifPermissionPrompt(false)}
                  className="w-full py-3 px-5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 font-medium text-xs sm:text-sm transition-all border border-stone-700/50 cursor-pointer"
                >
                  Don't allow
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
      </div>
      </div>
        );
}
