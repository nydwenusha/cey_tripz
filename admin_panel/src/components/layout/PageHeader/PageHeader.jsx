import { Cancel, Save } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import './PageHeader.scss'

function PageHeader({props}) {
    return (
    
        <Card className="edit-header">
            <CardContent>
                <Box className="header-content">
                    <Typography variant="h5" className="page-title">
                        {props.title}
                    </Typography>
                    <Box className="header-actions">
                        <Button
                            startIcon={<Cancel />}
                            onClick={props.cancel}
                            variant="outlined"
                            className="cancel-button"

                            
                        >
                            {props.cancelButtonText}
                        </Button>
                        
                        <Button
                            startIcon={<Save />}
                            onClick={props.submit}
                            variant="contained"
                            className="save-button"
                        >
                            {props.saveButtonText}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default PageHeader