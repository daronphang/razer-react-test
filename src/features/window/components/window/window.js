import styles from "./window.module.scss";
import { useSelector } from "react-redux";

export default function Window() {
  const title = useSelector((state) => state.window.value);
  return (
    <div className={styles.thxWindow} id="thx-window">
      <div className={styles.title} id="thx-window-title">
        {title}
      </div>
    </div>
  );
}
