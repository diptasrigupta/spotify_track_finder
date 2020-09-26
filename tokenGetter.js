const SpotifyWebApi = require('spotify-web-api-node');

async function tokenGetter(){
  const clientId = "d2c1cebaccaa440db11b68ee60e7cdc2"
  const clientSecret = "74d2346a88de4059bccfa3b340a7a2ce"

  const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
  });
  const tokengetter = await spotifyApi.clientCredentialsGrant()
  return tokengetter.body.access_token
}

export default tokenGetter
