/**
 * @typedef {'To_do' | 'In_Progess' | 'Waiting' | 'Done' } ProgressStatus
 * @typedef {'Low' | 'Medium' | 'High'} PriorityStatus
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
