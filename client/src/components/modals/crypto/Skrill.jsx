import React, { Fragment } from "react";
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import { makeStyles } from '@material-ui/core';

//assets
import qr from '../../../assets/qr.png';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 25,
        padding: '1rem',
        [theme.breakpoints.down('xs')]: {
            padding: 0,
            margin: 10,
        },
    },
    inputs: {
        display: 'flex',
        flexDirection: 'column',
        height: '10rem',
        justifyContent: 'space-around',
        marginTop: '25px',
        '& > div': {
            transform: 'skew(-15deg)',
            '& label': {
                color: '#fff',
            },
            '& label.Mui-focused': {
                color: '#4e7afd',
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#4e7afd',
            },
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#212549',
                },
                '&:hover fieldset': {
                    borderColor: '#212549',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#4e7afd',
                },
            },
            '& > div > input': {
                transform: 'skew(15deg)',
            }
        },
        '& > div > div': {
            background: '#14172c !important',
        }
    },
    value: {
        position: 'relative',
        width: '100%',
        '& > div': {
            width: '100%',
            '& > div': {
                background: '#14172c !important'
            },
            '& > div > input': {
                transform: 'skew(15deg)',
                width: '70%',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }
        },
        Depvalue: {
            position: 'relative',
            width: '75%',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
            '& > div': {
                width: '100%',
                '& > div': {
                    background: '#14172c !important'
                },
                '& > div > input': {
                    transform: 'skew(15deg)',
                    width: '70%',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }
            },
            '& button': {
                color: 'white',
                backgroundColor: '#527cff !important',
                position: 'absolute',
                right: 0,
                top: '0.65rem',
                width: '6rem',
            }
        },
        '& button': {
            color: 'white',
            backgroundColor: '#527cff !important',
            position: 'absolute',
            right: 0,
            top: '0.65rem',
            width: '6rem',
        }
    },
    withdraw: {
        color: 'white',
        backgroundColor: '#527cff !important',
        width: '100%',
        marginTop: '1rem',
        transform: 'skew(-15deg)',
        height: '3rem',
    },
    qr: {
        position: 'absolute',
        width: 140,
        marginRight: '1rem',
        right: 0,
        top: 0,
        background: 'white',
        borderRadius: 5,
        padding: '0.5rem',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    }
}));


const Skrill = ({ deposit }) => {

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            {deposit ? (
                <Fragment>
                    <Box>
                        Send your desired amount of Skrill to the following address.<br />
                        You will be credited after 5 minutes.
                        </Box>
                    <Box className={classes.inputs} style={{ height: 'auto', flexDirection: 'row', justifyContent: 'left' }}>
                        <Box className={classes.Depvalue}>
                            <TextField
                                label="Amount (Min. $1.00)"
                                variant="outlined"
                                color="#4F79FD"
                                value="0x7bf3a8F2E8d1EDe07aF342a6B16009B3899f0489"
                            />
                            <Button>COPY</Button>
                        </Box>
                        <img className={classes.qr} src={qr} alt="qr" />
                    </Box>
                </Fragment>
            ) : (
                    <Fragment>
                        <Box>
                            Withdraw your desired amount of Skrill to the following address.<br />
                            You will be credited after 5 minutes.
                        </Box>
                        <Box className={classes.inputs}>
                            <TextField
                                label="Your Bitcoin Address"
                                variant="outlined"
                                color="#4F79FD"
                            />
                            <Box className={classes.value}>
                                <TextField
                                    label="Amount (Min. $1.00)"
                                    variant="outlined"
                                    color="#4F79FD"
                                />
                                <Button>MAX</Button>
                            </Box>
                        </Box>

                        <Button className={classes.withdraw}>Request Withdrawal</Button>
                    </Fragment>
                )}
        </Box>
    );
};

export default Skrill;