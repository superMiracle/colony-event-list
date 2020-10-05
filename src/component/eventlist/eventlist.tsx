import React, { useState, useEffect } from "react";
import styles from "./eventlist.module.css";
import { createColonyClient, getEventLogs } from "../../helpers/apiHelpers";
import { Event } from "../event";

export interface EventListProps {
  eventList: object[];
}

export const EventList = (props: EventListProps) => {
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const client = await createColonyClient();
      const eventLogs = await getEventLogs(client);
      setEvents(eventLogs);
    };

    fetchEvents();
  }, []);

  return (
    <div className={styles.wrapper}>
      {events.map((event: any) => {
        return <Event data={event} />;
      })}
    </div>
  );
};
