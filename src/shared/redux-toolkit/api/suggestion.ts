import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@shared/services/api/user/user.service';
import { Utils } from '@shared/services/utils/utils.service';

const getUserSuggestions = createAsyncThunk('user/getSuggestions', async (name, { dispatch }) => {
  try {
    const response = await userService.getUserSuggestions();
    return response.data;
  } catch (error) {
    Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
  }
});

export { getUserSuggestions };
