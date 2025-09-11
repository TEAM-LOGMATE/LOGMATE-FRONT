import { create } from 'zustand';
import type { Folder, Team } from './type';

interface FolderState {
  folders: Folder[];    // 개인 스페이스
  teamFolders: Team[];  // 팀 스페이스
  setFolders: (updater: Folder[] | ((prev: Folder[]) => Folder[])) => void;
  setTeamFolders: (updater: Team[] | ((prev: Team[]) => Team[])) => void;
  clearFolders: () => void;
}

export const useFolderStore = create<FolderState>((set) => ({
  folders: [],
  teamFolders: [],
  setFolders: (updater) =>
    set((state) => ({
      folders: typeof updater === 'function'
        ? (updater as (prev: Folder[]) => Folder[])(state.folders)
        : updater,
    })),
  setTeamFolders: (updater) =>
    set((state) => ({
      teamFolders: typeof updater === 'function'
        ? (updater as (prev: Team[]) => Team[])(state.teamFolders)
        : updater,
    })),
  clearFolders: () => set({ folders: [], teamFolders: [] }),
}));
