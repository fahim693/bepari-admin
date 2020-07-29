import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Layout from '../components/Layout';
import { Typography, TablePagination, Button } from '@material-ui/core';
import Axios from 'axios';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css'
import config from '../config';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function Orders(props) {
    const classes = useStyles();
    const [data, setData] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [confirmAlert, setConfirmAlert] = useState(false)
    const [swalert, setSwalert] = useState({
        title: '',
        type: 'error',
        show: false
    })

    useEffect(() => {
        const func = () => {
            Axios.get(config.base_url + '/admin/orders', {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem('token'))
                }
            }).then(res => {
                if (res.data.success) {
                    setData(res.data.data)
                } else if (!res.data.success && res.data.code === 401) {
                    alert(res.data.msg)
                    props.history.push('/login')
                }
            })
        }
        func();
    }, [props.history, swalert.show, confirmAlert])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSold = () => {
        Axios.post(config.base_url + '/admin/confirm-order', {
            id: localStorage.getItem('id')
        }, {
            headers: {
                Authorization: JSON.parse(localStorage.getItem('token'))
            }
        }).then(res => {
            if (res.data.success) {
                localStorage.removeItem('id')
                setSwalert({
                    show: true,
                    title: res.data.msg,
                    type: 'success'
                })
            } else {
                localStorage.removeItem('id')
            }
        })
    }

    return (
        <Layout>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h4' component='h1'>
                    Orders
                </Typography>
                <Button onClick={()=> props.history.push('/create-order')} color='primary' variant='contained'>Create Order</Button>
            </div>
            <br />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Advance Amount</TableCell>
                            <TableCell>Delivery Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell component="th" scope="row">
                                    {row.orderId}
                                </TableCell>
                                <TableCell>
                                    {row.customerName}
                                </TableCell>
                                <TableCell>
                                    {row.phone}
                                </TableCell>
                                <TableCell>
                                    {row.address1},{row.zone}
                                </TableCell>
                                <TableCell>
                                    {row.grandTotal}
                                </TableCell>
                                <TableCell>
                                    {row.advanceAmount}
                                </TableCell>
                                <TableCell>
                                    {
                                        row.deliveryStatus === 0 ?
                                            <span style={{ fontWeight: 'bold', color: '#FFA000' }}>Ordered</span> :
                                            row.deliveryStatus === 1 ?
                                                <span style={{ fontWeight: 'bold', color: '#2BBBAD' }}>Confirmed</span> :
                                                row.deliveryStatus === 2 ?
                                                    <span style={{ fontWeight: 'bold', color: '#33b5e5' }}>Shipped</span> :
                                                    row.deliveryStatus === 3 ?
                                                        <span style={{ fontWeight: 'bold', color: '#00695c' }}>Delivered</span> : ''

                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        !row.paymentStatus ?
                                            <Button onClick={() => {
                                                localStorage.setItem('id', row.orderId)
                                                setConfirmAlert(true)
                                            }} color='primary' variant='contained'>
                                                Paid
                                            </Button> :
                                            <Button color='primary' disabled variant='contained'>
                                                Paid
                                            </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <SweetAlert
                show={confirmAlert}
                title="Are You Sure?"
                type='info'
                showCancelButton={true}
                confirmButtonText="Yes"
                onCancel={() => setConfirmAlert(false)}
                onConfirm={() => {
                    setConfirmAlert(false)
                    handleSold();
                }}
            />
            <SweetAlert
                show={swalert.show}
                title={swalert.title}
                type={swalert.type}
                onConfirm={() => setSwalert({ show: false })}
            />
        </Layout >
    );
}
