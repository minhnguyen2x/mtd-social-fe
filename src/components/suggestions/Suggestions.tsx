import Avatar from '@components/avatar/Avatar';
import { Button } from '@shared/components/button/button';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@shared/hooks/use-app-selector';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import { useNavigate } from 'react-router-dom';
import '@components/suggestions/Suggestions.scss';
import { Utils } from '@shared/services/utils/utils.service';
import { FollowersUtils } from '@shared/services/utils/followers-utils.service';
import { filter } from 'lodash';
import { addToSuggestions } from '@shared/libs/redux-toolkit/reducers/suggestions/suggestions.reducer';

const Suggestions = () => {
  const { suggestions } = useAppSelector((state) => state);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const followUser = async (user) => {
    try {
      FollowersUtils.followUser(user, dispatch);
      const result = filter(users, (data) => data?._id !== user?._id);
      setUsers(result);
      dispatch(addToSuggestions({ users: result, isLoading: false }));
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    setUsers(suggestions?.users);
  }, [suggestions, users]);

  return (
    <div className="suggestions-list-container" data-testid="suggestions-container">
      <div className="suggestions-header">
        <div className="title-text">Suggestions</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {users?.map((user) => (
            <div data-testid="suggestions-item" className="suggestions-item" key={user?._id}>
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user?.profilePicture}
              />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button
                  label="Follow"
                  className="button follow"
                  disabled={false}
                  handleClick={() => followUser(user)}
                />
              </div>
            </div>
          ))}
        </div>
        {users.length > 8 && (
          <div className="view-more" onClick={() => navigate('/app/social/people')}>
            View More
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
