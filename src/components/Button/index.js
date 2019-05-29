import React from 'react';
import Button from '@material-ui/core/Button';
const styles = {width: '100%',height:'40px'};
export function ActionButton(props){
    return(
        <Button style={styles} variant='contained' color='primary' fullWidth={true} size='large' onClick={props.onClick}>Add a meeting</Button>
    )
}
