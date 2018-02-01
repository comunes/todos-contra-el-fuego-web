// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(size) {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export const randomUsername = () => makeid(7);

export const randomPassword = () => randomUsername();

export const randomEmail = () => `${randomUsername()}@example.com`;

export const goHome = (client) => {
  client.url(process.env.ROOT_URL);
  client.waitForVisible('#react-root', 10000);
  expect(client.isVisible('#react-root')).toBe(true);
  client.waitUntil(() => client.isVisible('.pg-loading-center-middle') === false, 5000);
  client.waitUntil(() => client.isVisible('.pg-loading-center-middle') === false, 5000);
  // Close alert
  if (client.isVisible('.bert-content')) {
    client.click('.bert-content');
  }
  if (client.isVisible('#acceptCookies')) {
    client.click('#acceptCookies');
  }
};
