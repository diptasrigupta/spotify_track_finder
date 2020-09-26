
let encodedData = "ZDJjMWNlYmFjY2FhNDQwZGIxMWI2OGVlNjBlN2NkYzI6NzRkMjM0NmE4OGRlNDA1OWJjY2ZhM2IzNDBhN2EyY2U"
const fetch = require("node-fetch");

export default async function getAuthToken() {
  const data = await fetch("https://accounts.spotify.com/api/token", {
  body: "grant_type=client_credentials",
  headers: {
    Authorization: "Basic " + encodedData,
    "Content-Type": "application/x-www-form-urlencoded"
  },
  method: "POST"
})

  const datajson = await data.json()

  return(datajson.access_token)

    }
