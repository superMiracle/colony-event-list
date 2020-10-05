import React, { useState, useEffect } from "react";
import { BlockieIcon } from "../blockie-icon";
import styles from "./event.module.css";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface IEvent {
  type: string;
  avatar: string;
  values: string[];
  date: Date;
}

export interface EventProps {
  data: IEvent;
}

export const Event = (props: EventProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <BlockieIcon address="Jeremy" />
      </div>
      <div className={styles.copy}>
        <div className={styles.text}>
          {props.data.type == "ColonyInitialised" ? (
            <span>Congratulations! It's a beautiful baby colony!</span>
          ) : null}

          {props.data.type == "PayoutClaimed" ? (
            <span>
              User <span className={styles.bold}>{props.data.values[0]}</span>{" "}
              claimed{" "}
              <span className={styles.bold}>
                {props.data.values[1]}
                {props.data.values[2]}
              </span>{" "}
              payout from pot{" "}
              <span className={styles.bold}>{props.data.values[3]}</span>.
            </span>
          ) : null}

          {props.data.type == "DomainAdded" ? (
            <span>
              Domain <span className={styles.bold}>{props.data.values[0]}</span>{" "}
              added.
            </span>
          ) : null}

          {props.data.type == "ColonyRoleSet" ? (
            <span>
              <span className={styles.bold}>{props.data.values[0]}</span> role
              assigned to user{" "}
              <span className={styles.bold}>{props.data.values[1]}</span> in
              domain <span className={styles.bold}>{props.data.values[2]}</span>
              .
            </span>
          ) : null}
        </div>
        <div className={styles.date}>
          {props.data.date.getDay() + " " + months[props.data.date.getMonth()]}
        </div>
      </div>
    </div>
  );
};
