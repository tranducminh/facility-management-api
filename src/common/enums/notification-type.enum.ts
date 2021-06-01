export enum NotificationType {
  NEW_REQUEST = 'new-request',
  APPROVED_REQUEST = 'approved-request',
  REJECTED_REQUEST = 'rejected-request',
  INPROCESS_REQUEST = 'inprocess-request',
  COMPLETED_REQUEST = 'completed-request',
  UNCOMPLETED_REQUEST = 'uncompleted-request',

  ASSIGNED_TASK = 'assigned-task',
  STARTED_TASK = 'started-task',
  REJECTED_TASK = 'rejected-task',
  COMPLETED_TASK = 'completed-task',
  UNCOMPLETED_TASK = 'uncompleted-task',
  CANCELED_TASK = 'canceled-task',

  NEW_ROOM = 'new-room',
  PENDING_ROOM = 'pending-room',

  NEW_FACILITY_OWNER = 'new-facility-owner',
  REMOVED_FACILITY_OWNER = 'removed-facility-owner',
  UPDATED_FACILITY_INFO = 'updated-facility-info',

  UPDATED_PROFILE = 'updated-profile',
}
