/**
 * Emulates Weltmeister PHP backend
 */
const fs = require('fs');
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
    const dirParam = req.param('dir') || '';
    const type = req.param('type');

    const types = {
        scripts: ['.js'],
        images: ['.png', '.gif', '.jpg', '.jpeg']
    };

    const result = {
        parent: dirParam.length > 0 ? dirParam.substring(0, dirParam.lastIndexOf('/')) : false,
        dirs: [],
        files: []
    };

    const filter = type && types.hasOwnProperty(type) ? types[type] : false;

    const searchDir = path.join(__fileRoot, dirParam);

    fs.readdir(searchDir, (err, files) => {
        if (err) console.error(err);

        for (const i in files) {
            const stats = fs.statSync(path.join(searchDir, files[i]));

            if (stats.isDirectory()) {
                result.dirs.push(path.join(dirParam, files[i]));
            } else if (stats.isFile()) {
                if (filter) {
                    if (filter.indexOf(path.extname(files[i])) !== -1) {
                        result.files.push(path.join(dirParam, files[i]));
                    }
                } else {
                    result.files.push(path.join(dirParam, files[i]));
                }
            }
        }

        res.send(result);
    });
});

router.post('/save.php', (req, res) => {
    const leveldata = req.body.data;
    const levelpath = req.body.path;

    if (leveldata && levelpath && /\.js$/.test(levelpath)) {
        fs.writeFile(path.join(__fileRoot, levelpath), leveldata, err => {
            if (err) {
                res.send({
                    error: 2,
                    msg: err
                });
            } else {
                res.send({
                    error: 0
                });
            }
        });
    } else {
        res.send({
            error: 1,
            msg: 'No data or path specified'
        });
    }
});

module.exports = router;
