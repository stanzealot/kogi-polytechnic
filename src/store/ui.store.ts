import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  uploadResultOpen: boolean;
  allocateCoursesOpen: boolean;
  allocateOtherSchoolsOpen: boolean;
  downloadTemplateOpen: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setUploadResultOpen: (open: boolean) => void;
  setAllocateCoursesOpen: (open: boolean) => void;
  setAllocateOtherSchoolsOpen: (open: boolean) => void;
  setDownloadTemplateOpen: (open: boolean) => void;
  closeAllDrawers: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  uploadResultOpen: false,
  allocateCoursesOpen: false,
  allocateOtherSchoolsOpen: false,
  downloadTemplateOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  setUploadResultOpen: (open) => set({ uploadResultOpen: open }),
  setAllocateCoursesOpen: (open) => set({ allocateCoursesOpen: open }),
  setAllocateOtherSchoolsOpen: (open) => set({ allocateOtherSchoolsOpen: open }),
  setDownloadTemplateOpen: (open) => set({ downloadTemplateOpen: open }),
  closeAllDrawers: () => set({
    uploadResultOpen: false,
    allocateCoursesOpen: false,
    allocateOtherSchoolsOpen: false,
    downloadTemplateOpen: false,
  }),
}));
