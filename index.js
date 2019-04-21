/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = (robot) => {
  robot.on('issues.opened', async (context) => {
    const config = await context.config('autolabel.yml')
    const issue = await context.github.issues.get(context.issue())
    const title = issue.data.title.toLowerCase();

    for (const l of config.labels) {
      if (title.startsWith('[' + l.toLowerCase() + ']')) {
        return context.github.issues.update(context.issue({
          title: title.substr(l.length + 2).trim(),
          labels: [ l ],
        }));
      }
    }
    return context.github.issues.update(context.issue({
      title: '[NO LABEL] ' + title,
      labels: [ 'NO LABEL' ],
    }));
  });
}

