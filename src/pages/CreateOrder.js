import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Layout from '../components/Layout';
import Axios from 'axios';
import config from '../config';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(2, 1, 1, 0),
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function CreateOrder(props) {
    const classes = useStyles();
    const [products, setProducts] = useState([])
    const [creds, setCreds] = useState({
        phone: '',
        product: '',
        quantity: '',
        address1: '',
        address2: '',
        zone: 'Dhaka North',
    })
    const [swalert, setSwalert] = useState({
        title: '',
        type: 'error',
        show: false
    })
    const [date, selectedDate] = useState({
        deliveryDate1: new Date(),
        deliveryDate2: new Date(),
    })

    const handleDateChange = (e, name) => {
        selectedDate({
            ...date,
            [name]: e
        })
    }

    useEffect(() => {
        const func = () => {
            Axios.get(config.base_url + '/product/livestock?offset=admin', {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem('token'))
                }
            }).then(res => {
                if (res.data.success) {
                    console.log(res.data.data);
                    setProducts(res.data.data)
                } else {
                    alert(res.data.msg)
                }
            })
        }
        func();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post(config.base_url + '/admin/create-order', {
            ...creds, ...date
        }, {
            headers: {
                Authorization: JSON.parse(localStorage.getItem('token'))
            }
        })
            .then(res => {
                console.log(res.data);
                if (res.data.success) {
                    setSwalert({
                        show: true,
                        title: res.data.msg,
                        type: 'success'
                    })
                } else {
                    setSwalert({
                        show: true,
                        title: "Something went wrong!",
                        type: 'error'
                    })
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
        <Layout>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <br />
                    <Typography variant='h4' component='h1'>
                        Create Order
                    </Typography>
                    <form onSubmit={handleSubmit} className={classes.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            value={creds.phone}
                            onChange={handleOnChange}
                            label="Customer Phone"
                            name="phone"
                            autoComplete="phone"
                        />
                        <FormControl variant="outlined" required fullWidth className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Product</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name='product'
                                value={creds.product}
                                onChange={handleOnChange}
                                label="Product*"
                            >
                                {
                                    products.map((item, idx) => {
                                        if (item.isOrdered === 0) {
                                            return (
                                                <MenuItem key={idx} value={item.productMetaId}>{item.name}</MenuItem>
                                            )
                                        }
                                        return ''
                                    })
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            value={creds.quantity}
                            onChange={handleOnChange}
                            name="quantity"
                            label="Quantity"
                            type="number"
                            id="quantity"
                            autoComplete="quantity"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            value={creds.address1}
                            onChange={handleOnChange}
                            name="address1"
                            label="Address 1"
                            id="address1"
                            autoComplete="address"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            value={creds.address2}
                            onChange={handleOnChange}
                            name="address2"
                            label="Address 2"
                            id="address2"
                            autoComplete="address"
                        />
                        <FormControl variant="outlined" required fullWidth className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Zone</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name='zone'
                                value={creds.zone}
                                onChange={handleOnChange}
                                label="Zone*"
                            >
                                <MenuItem value='Dhaka North'>Dhaka North</MenuItem>
                                <MenuItem value='Dhaka South'>Dhaka South</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" fullWidth className={classes.formControl}>
                            <MuiPickersUtilsProvider utils={MomentUtils} >
                                <KeyboardDatePicker
                                    clearable
                                    required
                                    label="Delivery Date 1"
                                    disablePast
                                    value={date.deliveryDate1}
                                    variant='inline'
                                    KeyboardButtonProps
                                    onChange={date => handleDateChange(date, 'deliveryDate1')}
                                    inputVariant="outlined"
                                    format="MM/DD/YYYY"
                                    PopoverProps={{
                                        anchorOrigin: { horizontal: "left", vertical: "bottom" },
                                        transformOrigin: { horizontal: "left", vertical: "top" },
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                        <FormControl variant="outlined" fullWidth className={classes.formControl}>
                            <MuiPickersUtilsProvider utils={MomentUtils} >
                                <KeyboardDatePicker
                                    clearable
                                    required
                                    disablePast
                                    label="Delivery Date 2"
                                    value={date.deliveryDate2}
                                    variant='inline'
                                    KeyboardButtonProps
                                    onChange={date => handleDateChange(date, 'deliveryDate2')}
                                    inputVariant="outlined"
                                    format="MM/DD/YYYY"
                                    PopoverProps={{
                                        anchorOrigin: { horizontal: "left", vertical: "bottom" },
                                        transformOrigin: { horizontal: "left", vertical: "top" },
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
                <SweetAlert
                    show={swalert.show}
                    title={swalert.title}
                    type={swalert.type}
                    onConfirm={() => {
                        if(swalert.type === 'error'){
                            setSwalert({ show: false })
                        } else{
                            setSwalert({ show: false })
                            props.history.push('/orders')
                        }
                    }}
                />
            </Container>
        </Layout>
    );
}