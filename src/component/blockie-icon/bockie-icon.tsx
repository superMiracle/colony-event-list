import React from 'react'
import Blockies from 'react-blockies';
import styles from './bockie-icon.module.css';

export interface Icon {
  address: string
}

export const BlockieIcon = (props: Icon) => {
  return (
    <div className={styles.wrapper}>
      <Blockies seed={props.address} className={styles.round}/>
    </div>
  )
}
