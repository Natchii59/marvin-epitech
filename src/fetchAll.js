import { instance } from './instance.js'
import { push } from './pusher.js'
import { refreshToken } from './refreshToken.js'
import { sendFail } from './sendFail.js'

export async function fetchAll(globals) {
  try {
    const result = await instance.get('/me/2023', {
      headers: {
        Authorization: `Bearer ${globals.token}`
      }
    })

    const lastProject = result.data[result.data.length - 1]

    if (globals.testRunId === lastProject.results.testRunId) return

    globals.testRunId = lastProject.results.testRunId

    const failedIndex = Object.values(lastProject.results.skills).findIndex(
      skill => !skill.passed
    )

    if (failedIndex === -1) {
      push.send(
        `${lastProject.project.assignmentName}`,
        'All tests passed!',
        function (err) {
          if (err) return console.error(err)
        }
      )
    } else {
      await sendFail(globals, lastProject)
    }
  } catch (err) {
    if (err?.response?.status === 401) {
      await refreshToken(globals)
      await fetchAll(globals)
    } else {
      console.error(err)
      process.exit(1)
    }
  }
}
