import { execSync } from 'child_process'

try {
    execSync('npx kill-port 4000', { stdio: 'ignore' })
} catch {
    // port already free
}

import './server.js'
