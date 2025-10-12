console.log('Testing...'); import('../dist/theme.mjs').then(m => console.log('Keys:', Object.keys(m))).catch(e => console.error(e))
