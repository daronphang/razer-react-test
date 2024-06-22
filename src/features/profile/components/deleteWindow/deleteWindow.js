import { useDispatch, useSelector } from "react-redux";
import styles from "./deleteWindow.module.scss";
import { deleteItemAndUpdateCurrentProfile } from "../../redux/profileSlice";
import { useEffect } from "react";
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
        className={styles.btn}
        onClick={() => dispatch(deleteItemAndUpdateCurrentProfile())}
      >
        DELETE
      </button>
    </div>
  );
}
