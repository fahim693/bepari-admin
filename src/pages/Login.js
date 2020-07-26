import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Layout from '../components/Layout';
import Axios from 'axios';
import config from '../config';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" target='_blank' href="https://beparibhai.com/">
                BEPARI - Bhai Jitsen
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();
    const [creds, setCreds] = useState({
        phone: '',
        password: ''
    })

    const handleLogin = (e) => {
        e.preventDefault();
        Axios.post(config.base_url + '/admin/signin', creds)
            .then(res => {
                if (res.data.code === 200) {
                    localStorage.setItem('token', JSON.stringify(res.data.data.token))
                    props.history.push('/')
                } else if (res.data.success === false) {
                    alert(res.data.msg)
                }
            })
    }

    const handleOnChange = (e) => {
        setCreds({
            ...creds,
            [e.target.name]: e.target.value
        })
    }
    return (
        <Layout page='login'>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <br />
                    <img src='/admin/bepari-logo.png' alt='logo' style={{ height: 60 }} />
                    <form onSubmit={handleLogin} className={classes.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            value={creds.phone}
                            onChange={handleOnChange}
                            label="Phone Number"
                            name="phone"
                            autoComplete="phone"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            value={creds.password}
                            onChange={handleOnChange}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </Layout>
    );
}