import Head from 'next/head'
import React from 'react'
import Link from 'next/link'


import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';


import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import CssBaseline from "@material-ui/core/CssBaseline";

import { makeStyles, withStyles,  createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import theme from "../styles/theme"

const SpotifyWebApi = require('spotify-web-api-node');

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

export default function Home({genres, token}) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(genres);
  const [right, setRight] = React.useState([]);
  const [tracks, setTracks] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleSubmission = () => {
    const genrequery = right.join(",")
    const tracks = fetch('https://api.spotify.com/v1/recommendations?market=US&seed_genres=' + genrequery, {
            method: "GET",
            headers: [
              ["Content-Type", "application/json"],
              ["Authorization", "Bearer " + token],
            ]
          }).then((tracks) => tracks.json())
          .then( (tracksjson) => setTracks(tracksjson.tracks))
  }

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        title={title}
        subheader={`${items.length} items`}
        titleTypographyProps={{variant:'h6'}}
        style={{ textAlign: 'center' }}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = value;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  color="primary"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}

                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return(
    <div>
      <Head>
        <title>Spotify Track Finder</title>
      </Head>

      <body>
      <ThemeProvider theme={theme}>
      <CssBaseline/>
        <br/>

        <Typography variant="h3" align="center">Spotify Track Finder</Typography>
        <Typography color="textSecondary" variant="h5" align="center">Check off upto 5 genres to receive track recommendations</Typography>

        <br/>

        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
          <Grid item>{customList('Genres', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                color="primary"
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedRight}
                disabled={right.length >= 5 || leftChecked.length === 0 || leftChecked.length > (5- right.length)}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.button}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Chosen Genres', right)}</Grid>
        </Grid>

        <br/>

        <Grid container justify="center">
          <Button color="primary" variant="contained" size="large" onClick={handleSubmission} disabled={right.length === 0}>SUBMIT</Button>
        </Grid>

        <br/>

        <Box m={4}>
        <Grid container spacing="3" direction={"row"}>
        {
          tracks.map((track) =>(

            <Grid item xs="4">
              <Card>

                  <CardMedia image={track.album.images[0].url} className={classes.media} style={{height: 0, paddingTop: '56.25%'}} />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2" align="center">{track.name}</Typography>
                    <Typography variant="body2" color="textSecondary" align="center">by {track.artists[0].name}</Typography>
                    </CardContent>
                    <CardActions>

                    <Grid container justify="center">
                      <Link href={{ pathname: '/[songid]', query: { songid: 'track.id', }}} as={"/" + track.id}>
                            <Button>LEARN MORE</Button>
                      </Link>
                    </Grid>

                    </CardActions>

              </Card>

            </Grid>
          ))}
        </Grid>
        </Box>

      </ThemeProvider>

      </body>
    </div>
  );
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

Home.getInitialProps = async() => {
  const token = await tokenGetter();

  const gen = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      method: "GET",
      headers: [
        ["Content-Type", "application/json"],
        ["Authorization", "Bearer " + token]
      ]
    })

    const genjson = await gen.json()
    const genres = await genjson.genres

  return {genres, token}
}
