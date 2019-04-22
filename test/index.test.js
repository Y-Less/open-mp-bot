const nock = require('nock')
const myProbotApp = require('..')
const { Probot } = require('probot')

const bodyIn = {
  action: 'opened',
  issue: {
    number: 1,
    user: {
      login: 'someuser',
    },
    title: '[CLIENT] [serVER] bUg   ',
  },
  repository: {
    name: 'testing-things',
    owner: {
      login: 'someuser',
    },
  },
};

const bodyOut = {
  title: '[serVER] bUg',
  labels: [ 'Client' ],
};

nock.disableNetConnect();

describe('My Probot app', () => {
  let probot;

  beforeEach(() => {
    probot = new Probot({});

    // Load our app into probot
    const app = probot.load(myProbotApp);

    // just return a test token
    app.app = () => 'test';
  });

  test('creates a comment when an issue is opened', async () => {
    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
      });

    // Test that a comment is posted
    nock('https://api.github.com')
      .patch('/repos/someuser/testing-things/issues/1', (body) => {
        expect(body).toMatchObject(bodyOut);
        return true;
      })
      .reply(200);

    // Receive a webhook event
    await probot.receive({
      name: 'issues',
      payload: bodyIn,
    });
  });
});

