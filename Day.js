import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Box
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import dayjs from './timeUtils'; // uses dayjs.extend(utc)

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
    newTimes[index] = newValue.utc(); // Store as UTC
    setTimePickers(newTimes);
  };

  const handleSave = () => {
    const serverTimes = timePickers.map((time) => time.utc().format('HH:mm:ss'));
    console.log('Server Times:', serverTimes);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Select Times (UTC)</DialogTitle>
        <DialogContent>
          {timePickers.map((time, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimePicker
                label={`Time ${index + 1}`}
                value={dayjs(time).local()} // convert for display
                onChange={(newVal) => handleTimeChange(newVal, index)}
                ampm={false}
                views={['hours', 'minutes']}
                disablePortal
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        options: {
                          boundary: 'viewport',
                        },
                      },
                    ],
                  },
                }}
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
    </LocalizationProvider>
  );
};

export default ServerTimeDialog;
