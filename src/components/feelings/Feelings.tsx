import { addPostFeeling, toggleFeelingModal } from '@shared/libs/redux-toolkit/reducers/modal/modal.reducer';
import { feelingsList } from '@shared/services/utils/static.data';
import { useAppDispatch } from '@shared/hooks/use-app-dispatch';
import { useAppSelector } from '@shared/hooks/use-app-selector';
import '@components/feelings/Feelings.scss';

const Feelings = () => {
  const { feelingsIsOpen } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const selectFeeling = (feeling) => {
    dispatch(addPostFeeling({ feeling }));
    dispatch(toggleFeelingModal(!feelingsIsOpen));
  };

  return (
    <div className="feelings-container">
      <div className="feelings-container-picker">
        <p>Feelings</p>
        <hr />
        <ul className="feelings-container-picker-list">
          {feelingsList.map((feeling) => (
            <li
              data-testid="feelings-item"
              className="feelings-container-picker-list-item"
              key={feeling.index}
              onClick={() => selectFeeling(feeling)}
            >
              <img src={feeling.image} alt="" /> <span>{feeling.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Feelings;
