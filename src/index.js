import { fetchAll } from './fetchAll.js'

const globals = {
  testRunId: null,
  token: null
}

async function main() {
  await fetchAll(globals)

  setInterval(async () => {
    await fetchAll(globals)
  }, 60000)
}

main()
