import { create } from 'zustand';
import type { Folder, Team } from './type';

type SortOrder = 'newest' | 'oldest';

interface FolderState {
  folders: Folder[];        // 개인 스페이스
  teamFolders: Team[];      // 팀 스페이스
  personalSortOrder: SortOrder;
  teamSortOrder: SortOrder;
  teamBoardSortOrder: SortOrder; // 팀 보드 정렬 추가
  setPersonalSortOrder: (order: SortOrder) => void;
  setTeamSortOrder: (order: SortOrder) => void;
  setTeamBoardSortOrder: (order: SortOrder) => void; // setter 추가
  setFolders: (updater: Folder[] | ((prev: Folder[]) => Folder[])) => void;
  setTeamFolders: (updater: Team[] | ((prev: Team[]) => Team[])) => void;
  clearFolders: () => void;
}

// 정렬 공통 함수
const sortByOrder = <T extends { createdAt?: string; updatedAt?: string }>(
  data: T[],
  order: SortOrder
) =>
  [...data].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  teamFolders: [],
  personalSortOrder: 'newest', // 개인 기본 정렬
  teamSortOrder: 'newest',     // 팀 기본 정렬
  teamBoardSortOrder: 'newest', // 팀 보드 기본 정렬

  // 개인 정렬 변경
  setPersonalSortOrder: (order) => {
    set({ personalSortOrder: order });
    set((state) => ({
      folders: sortByOrder(state.folders, order),
    }));
  },

  // 팀 정렬 변경
  setTeamSortOrder: (order) => {
    set({ teamSortOrder: order });
    set((state) => ({
      teamFolders: sortByOrder(state.teamFolders, order),
    }));
  },

  // 팀 보드 정렬 변경
  setTeamBoardSortOrder: (order) => {
    set({ teamBoardSortOrder: order });
  },

  // 개인 폴더 set
  setFolders: (updater) => {
    set((state) => {
      const next =
        typeof updater === 'function'
          ? (updater as (prev: Folder[]) => Folder[])(state.folders)
          : updater;
      return {
        folders: sortByOrder(next, state.personalSortOrder),
      };
    });
  },

  // 팀 폴더 set
  setTeamFolders: (updater) => {
    set((state) => {
      const next =
        typeof updater === 'function'
          ? (updater as (prev: Team[]) => Team[])(state.teamFolders)
          : updater;
      return {
        teamFolders: sortByOrder(next, state.teamSortOrder),
      };
    });
  },

  // 전체 초기화
  clearFolders: () => set({ folders: [], teamFolders: [] }),
}));
