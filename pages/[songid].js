import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

import { makeStyles, withStyles,  createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import theme from "../styles/theme"

const SongInfo = ({songjson, songfeaturesjson}) => {
  const classes = useStyles();

   return (
    <div>

      <Head>
        <title>Spotify Track Finder</title>
      </Head>

      <ThemeProvider theme={theme}>
      <CssBaseline/>
        <br/>

        <Typography variant="h3" align="center">Spotify Track Finder</Typography>

        <br/>

        <Box className={classes.root}>
        <Paper variant="outlined" className ={classes.root}>
          <Grid container direction={"row"}>

          <Grid item>
            <img width="80%" src={songjson.album.images[0].url}/>
          </Grid>

          <Grid item>

            <Grid className = {classes.info} container direction={"column"}>

              <Grid item>

              <Typography variant="h5" component="h2" align="center">{songjson.name}</Typography>
              <Typography variant="h6" color="textSecondary" align="center">by {songjson.artists[0].name}</Typography>

              <Divider/>

              </Grid>

              <Grid item>
                <br/>
                <Typography variant="h6" align="center">Spotify Popularity: {songjson.popularity}/100</Typography>
                <LinearProgress variant="determinate" value={songjson.popularity} />
              </Grid>
              <Grid item>
                <br/>
                <Typography variant="h6" align="center">Danceability: {Math.round(songfeaturesjson.danceability*100)}/100</Typography>
                <LinearProgress variant="determinate" value={songfeaturesjson.danceability*100} />
              </Grid>
              <Grid item>
                <br/>
                <Typography variant="h6" align="center">Energy: {Math.round(songfeaturesjson.energy*100)}/100</Typography>
                <LinearProgress variant="determinate" value={songfeaturesjson.energy*100} />
              </Grid>
              <Grid item>
                <br/>
                <Typography variant="h6" align="center">Valence: {Math.round(songfeaturesjson.valence*100)}/100</Typography>
                <LinearProgress variant="determinate" value={songfeaturesjson.valence*100} />
              </Grid>

            </Grid>

          </Grid>

          </Grid>
      </Paper>
      </Box>

      </ThemeProvider>

    </div>
   )

}

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


SongInfo.getInitialProps = async ({query}) => {

  const token = await tokenGetter();

  const song = await fetch('https://api.spotify.com/v1/tracks/' + query.songid, {
    method: "GET",
    headers: [
      ["Content-Type", "application/json"],
      ["Authorization", "Bearer " + token]
    ]
  })

  const songjson = await song.json()

  const songfeatures = await fetch('https://api.spotify.com/v1/audio-features/' + query.songid, {
    method: "GET",
    headers: [
      ["Content-Type", "application/json"],
      ["Authorization", "Bearer " + token]
    ]
  })
  const songfeaturesjson= await songfeatures.json()
  return {songjson, songfeaturesjson}
}

const useStyles = makeStyles({
     root: {
       padding: theme.spacing(3),
       display: "flex",
       justifyContent: "center",
       minWidth: "75%"
     },

     info: {
       marginTop: "33%",
      minWidth: "75%"
     }

   });

export default SongInfo;
