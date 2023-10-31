import axios from 'axios'

export async function refreshToken(globals) {
  try {
    const result = await axios.get(
      'https://login.microsoftonline.com/common/oauth2/authorize?client_id=c3728513-e7f6-497b-b319-619aa86f5b50&nonce=30c3ed81-6a97-4d3e-9b25-214be8e6e048&redirect_uri=https%3A%2F%2Fmy.epitech.eu%2Findex.html&response_type=id_token&state=fragment%3Dy%252F2023',
      {
        headers: {
          cookie: process.env.COOKIE
        }
      }
    )

    let hash = result.request._redirectable._options.hash
    let hashes = hash.split('&')
    globals.token = hashes[0].split('=')[1]
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
