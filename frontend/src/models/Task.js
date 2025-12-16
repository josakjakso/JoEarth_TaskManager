/**
 * @typedef {'to_do' | 'in_progess' | 'waiting' | 'done' } ProgressStatus
 * @typedef {'low' | 'medium' | 'high'} PriorityStatus
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {ProgressStatus} status
 * @property {PriorityStatus} priority
 * @property {string} assignedTo
 * @property {string} createdBy
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} startDate
 * @property {string|null} dueDate
 */
