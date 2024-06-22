import styles from "./profileItem.module.scss";
import { useDispatch } from "react-redux";

import { ReactComponent as DefaultSvg } from "src/assets/images/profile_sel_default.svg";
import { ReactComponent as GameSvg } from "src/assets/images/profile_sel_game.svg";
import { ReactComponent as MovieSvg } from "src/assets/images/profile_sel_movie.svg";
import { ReactComponent as MusicSvg } from "src/assets/images/profile_sel_music.svg";
import { ReactComponent as CustomSvg } from "src/assets/images/profile_sel_custom.svg";
import { useState } from "react";
import {
  editItemAndUpdateCurrentProfile,
  setCurProfile,
} from "../../redux/profileSlice";
import { updateTitle } from "src/features/window/redux/windowSlice";

export default function ProfileItem({
  item,
  activeItemId,
  isEditable,
  handleResetStates,
}) {
  const [title, setTitle] = useState(item.name);
  const [SvgIcon] = useState(() => {
    switch (item.icon) {
      case "default":
        return DefaultSvg;
      case "movie":
        return MovieSvg;
      case "game":
        return GameSvg;
      case "music":
        return MusicSvg;
      default:
        return CustomSvg;
    }
  });

  // Redux.
  const dispatch = useDispatch();

  const handleClickItem = () => {
    if (activeItemId === item.id) return;
    dispatch(setCurProfile(item));
    dispatch(updateTitle(item.name));
    handleResetStates();
  };

  const handleTitleChange = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
    dispatch(updateTitle(e.target.value));
  };

  const handleBlur = (e) => {
    e.preventDefault();
    if (!e.target.value) {
      dispatch(updateTitle(item.name));
      setTitle(item.name);
    } else if (e.target.value === item.name) {
      return;
    } else {
      const updatedItem = JSON.parse(JSON.stringify(item));
      updatedItem.name = e.target.value;
      dispatch(editItemAndUpdateCurrentProfile(updatedItem));
    }
  };

  return (
    <div
      className={styles.profileItem}
      id={`profile-item-${item.id}`}
      onClick={handleClickItem}
    >
      <SvgIcon
        className={`${styles.svgIcon} ${
          activeItemId === item.id ? styles.active : ""
        }`}
      />
      <div
        className={`${styles.title} ${
          activeItemId === item.id ? styles.active : ""
        }`}
      >
        <div
          id="profile-item-name"
          className={`${styles.text} ${
            !isEditable || activeItemId !== item.id
              ? styles.visible
              : styles.hidden
          }`}
        >
          {title}
        </div>
        <input
          className={
            isEditable && activeItemId === item.id
              ? styles.visible
              : styles.hidden
          }
          id="profile-item-name-input"
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
        ></input>
      </div>
    </div>
  );
}
