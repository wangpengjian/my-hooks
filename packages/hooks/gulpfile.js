const commonConfig = require('../../gulpfile.js')
const gulp = require('gulp')
const fg = require('fast-glob')
const fs = require('fs')
const fse = require('fs-extra')
const gm = require('gray-matter')

function generateDesc(mdPath) {
  if (!fs.existsSync(mdPath)) {
    return
  }

  const mdFile = fs.readFileSync(mdPath, 'utf-8')
  const { content } = gm(mdFile)
  const description = ((content.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || '').trim()
  return description
}

// hooks/src/**/index.md */
async function generateMetaData() {
  const metaData = {
    function: []
  }

  const hooks = fg.sync('src/use*', {
    onlyDirectories: true
  }).map(hook => hook.replace('src/', ''))

  await Promise.allSettled(
    hooks.map(async hook => {
      const description = await generateDesc(`src/${hook}/index.md`)

      return {
        name: hook,
        description
      }
    })
  ).then(res => {
    metaData.function = res.map(item => {
      if (item.status === 'fulfilled') {
        return item.value
      }

      return null
    })
  })

  return metaData
}

gulp.task('generateMetaData', async () => {
  const metaData = await generateMetaData()
  await fse.writeJSON('metadata.json', metaData, {
    spaces: 2
  })
})

exports.default = gulp.series(commonConfig.default, 'generateMetaData')
