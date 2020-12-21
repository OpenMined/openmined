import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Text } from '@chakra-ui/react';

export default ({ time: initialTime }) => {
  initialTime = initialTime.unix();

  const [time, setTime] = useState(dayjs().unix());

  useEffect(() => {
    if (!time) return;

    const intervalId = setInterval(() => {
      if (time + 1 <= initialTime) {
        setTime(time + 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time, initialTime]);

  const timestamp = initialTime - time;

  if (timestamp <= 0) return <Text as="span">Times up!</Text>;

  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - hours * 60;
  const seconds = timestamp % 60;

  const timeString = [];

  if (hours !== 0) {
    timeString.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes !== 0) {
    timeString.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  if (seconds !== 0) {
    timeString.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  }

  return <Text as="span">{timeString.join(', ')}</Text>;
};
