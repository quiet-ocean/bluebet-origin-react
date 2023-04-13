import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Button, Box, Typography } from "@material-ui/core"
export const BreadCrumbs = () => {
    return (
        // <Breadcrumbs />
        <Box style={{ padding: '16px 0px' }}>
            <Breadcrumbs
                style={{
                    textTransform: 'capitalize',
                    color: '#fff',
                    backgroundColor: '#252A42',
                    fontWeight: 200,
                    padding: '8px 12px',
                    borderRadius: 5,
                }}
            >
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <span style={{ color: '#9F9F9F' }}>Home</span>;
                </Link>
                <Typography>Crash</Typography>
            </Breadcrumbs>
        </Box>
    )
}