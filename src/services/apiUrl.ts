/* eslint-disable no-console */
// eslint-disable-next-line import/no-mutable-exports
let API_URL = 'http://localhost:3300';
if (process.env.NODE_ENV === 'production') {
    API_URL = 'https://bloggy2020.herokuapp.com';
}
console.log(`API url is ${API_URL}`);
console.log(process.env);
export default API_URL;
