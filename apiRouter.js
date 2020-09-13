/**
 * Emulates Weltmeister PHP backend
 */
const path = require('path');

const glob = require('glob');
const express = require('express');
const router = express.Router();

const __fileRoot = path.join(__dirname, './dist/');

router.get('/glob.php', async (req, res) => {
    const {query} = req;

    if (query.hasOwnProperty('glob')) {
        let globParams = query.glob;
        if (!Array.isArray(globParams)) {
            globParams = [globParams];
        }

        const files = [];
        for (const i in globParams) {
            const matches = glob.sync(path.join(__fileRoot, globParams[i]));

            matches.forEach(match => {
                files.push(match.replace(__fileRoot, ''));
            });
        }

        res.send(files);
    } else {
        res.send();
    }
});

router.get('/browse.php', (req, res) => {
    const {query} = req;

    if (query.hasOwnProperty('dir') && query.hasOwnProperty('type')) {
        const searchDir = path.join(__fileRoot, query.dir);

        let type = '';

        switch (query.type) {
            case 'scripts':
                type = '*.js';
                break;
            case 'images':
                type = '*.{png,gif,jpg,jpeg}';
                break;
        }

        const dirs = glob.sync(`${searchDir}/*/`);
        const files = glob.sync(`${searchDir}/${type}`);

        res.send({
            parent: query.dir.length > 0 ? query.dir.slice(0, query.dir.lastIndexOf('/')) : false,
            dirs: dirs.map(dir => dir.replace(__fileRoot, '').replace(/\/$/, '')),
            files: files.map(file => file.replace(__fileRoot, ''))
        });
    } else {
        res.send();
    }
});

router.post('/save.php', (req, res) => {
    console.log(req);

    res.send();
});

module.exports = router;
