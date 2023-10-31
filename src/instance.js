import { config } from 'dotenv'
config()

import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://api.epitest.eu'
})
