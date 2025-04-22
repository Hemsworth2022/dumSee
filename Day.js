import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Box, Typography
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import dayjs from './timeUtils'; // use extended dayjs

const ServerTimeDialog = ({ open, onClose }) => {
  const [timePickers, setTimePickers] = useState([dayjs.utc()]);

  const handleAddTimePicker = () => {
    setTimePickers([...timePickers, dayjs.utc()]);
  };

  const handleRemoveTimePicker = (index) => {
    setTimePickers(timePickers.filter((_, i) => i !== index));
  };

  const handleTimeChange = (newValue, index) => {
    const newTimes = [...timePickers];
    newTimes[index] = newValue.utc(); // Store time in UTC
    setTimePickers(newTimes);
  };

  const handleSave = () => {
    const serverTimes = timePickers.map((time) => time.utc().format('HH:mm:ss'));
    console.log('Server Times:', serverTimes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Times (UTC)</DialogTitle>
      <DialogContent>
        {timePickers.map((time, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TimePicker
              label={`Time ${index + 1}`}
              value={time}
              onChange={(newVal) => handleTimeChange(newVal, index)}
              ampm={false}
              views={['hours', 'minutes']}
            />
            <IconButton onClick={() => handleRemoveTimePicker(index)} sx={{ ml: 1 }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddTimePicker}>
          Add Time
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServerTimeDialog;
