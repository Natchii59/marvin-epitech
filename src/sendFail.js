import { instance } from './instance.js'
import { push } from './pusher.js'

export async function sendFail(globals, lastProject) {
  try {
    const resultDetails = await instance.get(
      `/me/details/${globals.testRunId}`,
      {
        headers: {
          Authorization: `Bearer ${globals.token}`
        }
      }
    )

    console.log(resultDetails.data.skills[0])

    let failedSkillName
    if (resultDetails.data.skills[0].BreakdownSkillReport) {
      const failedSkill = resultDetails.data.skills.find(
        skill => !skill.BreakdownSkillReport.breakdown.passed
      )
      if (!failedSkill) return
      failedSkillName = failedSkill.BreakdownSkillReport.name
    } else {
      const failedSkill = resultDetails.data.skills.find(
        skill => !skill.FullSkillReport.tests.some(t => !t.passed)
      )
      if (!failedSkill) return
      failedSkillName = failedSkill.FullSkillReport.name
    }

    const commentFailed = resultDetails.data.externalItems[0].comment
    const beginIndex = commentFailed.indexOf(
      `====================\n ${failedSkillName}\n====================`
    )
    const endIndex = commentFailed.indexOf(`${failedSkillName}: FAILURE`)
    const commentFailedTrimmed = commentFailed.substring(beginIndex, endIndex)

    push.send(
      `${lastProject.project.assignmentName}`,
      `${failedSkillName} failed!\n${commentFailedTrimmed}`,
      function (err) {
        if (err) return console.error(err)
      }
    )
  } catch (err) {
    if (err?.response?.status === 401) {
      await refreshToken(globals)
      await sendFail(globals, lastProject)
    } else {
      console.error(err)
      process.exit(1)
    }
  }
}
