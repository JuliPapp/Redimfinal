import { projectId } from './supabase/info';

// Base URL para el servidor Edge Function
// IMPORTANTE: El nombre de la función en Supabase es 'make-server-636f4a29'
const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29`;


// Helper para construir URLs de API
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
}

// URLs específicas de la API
export const API_URLS = {
  // Auth
  profile: () => getApiUrl('auth/profile'),
  signup: () => getApiUrl('auth/signup'),
  initAdmin: () => getApiUrl('auth/init-admin'),
  
  // Check-ins
  checkins: () => getApiUrl('checkins'),
  checkinsStats: () => getApiUrl('checkins-stats'),
  discipleCheckins: (discipleId: string) => getApiUrl(`checkins/${discipleId}`),
  discipleCheckIns: (discipleId: string) => getApiUrl(`checkins/${discipleId}`),
  changeMode: () => getApiUrl('change-mode'),
  
  // Conversational Check-in
  startConversation: () => getApiUrl('checkin/start-conversation'),
  sendMessage: (conversationId: string) => getApiUrl(`checkin/conversation/${conversationId}`),
  analyzeConversation: (conversationId: string) => getApiUrl(`checkin/analyze/${conversationId}`),
  
  // Community
  myLeader: () => getApiUrl('my-leader'),
  requestInfo: () => getApiUrl('request-info'),
  acceptRequest: () => getApiUrl('accept-request'),
  rejectRequest: () => getApiUrl('reject-request'),
  
  // Leader
  disciples: () => getApiUrl('disciples'),
  pendingRequests: () => getApiUrl('pending-requests'),
  availableDisciples: () => getApiUrl('available-disciples'),
  leaderStats: () => getApiUrl('leader-stats'),
  assignDisciple: () => getApiUrl('assign-disciple'),
  unassignDisciple: () => getApiUrl('unassign-disciple'),
  leaderNotes: (discipleId: string) => getApiUrl(`leader-notes/${discipleId}`),
  discipleInfo: (discipleId: string) => getApiUrl(`disciple-info/${discipleId}`),
  
  // Meetings
  timeSlots: () => getApiUrl('time-slots'),
  leaderTimeSlots: (leaderId: string) => getApiUrl(`leader-time-slots/${leaderId}`),
  meetings: () => getApiUrl('meetings'),
  deleteTimeSlot: (slotId: string) => getApiUrl(`time-slots/${slotId}`),
  requestMeeting: () => getApiUrl('request-meeting'),
  confirmMeeting: (meetingId: string) => getApiUrl(`meetings/${meetingId}/confirm`),
  cancelMeeting: (meetingId: string) => getApiUrl(`meetings/${meetingId}/cancel`),
  cancelConfirmedMeeting: (meetingId: string) => getApiUrl(`meetings/${meetingId}/cancel-confirmed`),
  requestReschedule: (meetingId: string) => getApiUrl(`meetings/${meetingId}/request-reschedule`),
  approveReschedule: (meetingId: string) => getApiUrl(`meetings/${meetingId}/approve-reschedule`),
  rejectReschedule: (meetingId: string) => getApiUrl(`meetings/${meetingId}/reject-reschedule`),
  
  // Library
  library: () => getApiUrl('library'),
  updateLibraryResource: (id: string) => getApiUrl(`library/${id}`),
  deleteLibraryResource: (id: string) => getApiUrl(`library/${id}`),
  
  // Admin
  assistantStatus: () => getApiUrl('admin/assistant-status'),
  adminFiles: () => getApiUrl('admin/files'),
  uploadPdf: () => getApiUrl('admin/upload-pdf'),
  deleteFile: (fileId: string) => getApiUrl(`admin/files/${fileId}`),
  
  // Disciple Profile
  discipleProfile: () => getApiUrl('disciple-profile'),
  updateDiscipleProfile: () => getApiUrl('disciple-profile'),
  
  // Module Configuration
  moduleConfig: () => getApiUrl('module-config'),
  saveModuleConfig: () => getApiUrl('module-config'),
};
