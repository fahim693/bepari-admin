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

export default function Sellers() {
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
            Axios.get(config.base_url + '/admin/sellers', {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem('token'))
                }
            }).then(res => {
                if (res.data.success) {
                    setData(res.data.data)
                } else {
                    alert(res.data.msg)
                }
            })
        }
        func();
    }, [swalert.show, confirmAlert])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSold = () => {
        Axios.post(config.base_url + '/admin/approve-seller', {
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
            <Typography variant='h4' component="h2">
                Sellers
            </Typography>
            <br />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Approval</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell component="th" scope="row">
                                    {row.businessName}
                                </TableCell>
                                <TableCell>
                                    {row.contactNumber}
                                </TableCell>
                                <TableCell>
                                    {row.email}
                                </TableCell>
                                <TableCell>
                                    {
                                        row.isVerified === false ?
                                            <div style={{ color: '#bf1f1f' }}>
                                                Pending
                                            </div> :
                                            <div style={{ color: '#29a81b' }}>
                                                Approved
                                            </div>
                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        row.isVerified === false ?
                                            <Button onClick={() => {
                                                localStorage.setItem('id', row.id)
                                                setConfirmAlert(true)
                                            }} color='primary' variant='contained'>
                                                Approve
                                            </Button> :
                                            <Button color='primary' disabled variant='contained'>
                                                Approved
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
