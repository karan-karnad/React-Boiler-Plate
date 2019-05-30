import React from 'react';
import Button from '@material-ui/core/Button';
const styles = {width: '100%',height:'40px'};
export function ActionButton(props){
    return(
        <Button style={styles} variant='contained' color='primary' disabled={props.disabled} fullWidth={true} size='large' onClick={props.onClick}>{props.name}</Button>
    )
}
