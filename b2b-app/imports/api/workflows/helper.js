import { Jobs, Tasks } from '/imports/api/workflows/schema'
import Listings from '/imports/api/listings/schema'

export const getTask = async (id) => {
  const task = await Tasks.findOneAsync(id)
  if (!task) return null
  return task
}

export const getJob = async (id) => {
  const job = await Jobs.findOneAsync(id)
  if (!job) return null
  return job
}
