import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./deleteWindow.module.scss";
import { deleteItemAndUpdateCurrentProfile } from "src/features/profile/redux/profileSlice";
import { smartFloat } from "src/shared/utils";

export default function DeleteWindow({ anchorId }) {
  const dispatch = useDispatch();
  const curProfile = useSelector((state) => state.profile.curProfile);

  useEffect(() => {
    smartFloat(anchorId, "delete-profile-window");
  }, []);

  return (
    <div className={styles.wrapper} id="delete-profile-window">
      <div className={styles.title}>DELETE EQ</div>
      <div className={styles.subtitle}>{curProfile.name}</div>
      <button
        id="delete-profile-btn"
        className={styles.btn}
        onClick={() => dispatch(deleteItemAndUpdateCurrentProfile())}
      >
        DELETE
      </button>
    </div>
  );
}
