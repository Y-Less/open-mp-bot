module.exports = (robot) => {
  robot.on('issues.opened', async (context) => {
    const config = await context.config('autolabel.yml')
    const title = context.payload.issue.title.toLowerCase();

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

