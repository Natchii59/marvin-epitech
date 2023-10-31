import Pushover from 'node-pushover'

export const push = new Pushover({
  token: process.env.PUSHOVER_TOKEN,
  user: process.env.PUSHOVER_USER
})
