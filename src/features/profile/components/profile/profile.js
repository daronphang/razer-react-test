import Drawer from "../drawer/drawer";
import styles from "./profile.module.scss";

export default function Profile() {
  return (
    <div className={styles.thxProfile} id="thx-profile">
      <div className={styles.title} id="thx-profile-title">
        PROFILE LIST
      </div>
      <Drawer />
    </div>
  );
}
