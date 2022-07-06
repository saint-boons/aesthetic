const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
})
const logger = require('@modules/logger')

module.exports = (client) => {
    rl.on('line', (input) => {
        switch (input) {
            case 'deploy':
                try {
                    require('@modules/deploy-commands.js')(client)
                } catch (err) {
                    logger.error(err)
                }
                return
            default:
                return
        }
    });
}