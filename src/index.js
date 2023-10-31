import { fetchAll } from './fetchAll.js'

const globals = {
  testRunId: null,
  token: null
}

async function main() {
  setInterval(async () => {
    await fetchAll(globals)
  }, 1000 * 60)
}

main()
