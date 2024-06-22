import styles from "./toolbar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addListener } from "@reduxjs/toolkit";

import { ReactComponent as ArrowUpSvg } from "src/assets/images/icon_arrow_up.svg";
import { ReactComponent as ArrowDownSvg } from "src/assets/images/icon_arrow_down.svg";
import { ReactComponent as DeleteSvg } from "src/assets/images/icon_delete.svg";
import { ReactComponent as EditSvg } from "src/assets/images/icon_edit.svg";
import { ReactComponent as PlusSvg } from "src/assets/images/icon_plus.svg";
import {
  appendItemAndUpdateCurrentProfile,
  moveDownItem,
  moveUpItem,
} from "src/features/profile/redux/profileSlice";
import { useEffect, useState } from "react";
import useAxiosRequest from "src/shared/hooks/useAxiosRequest";

export default function Toolbar({ handleToolbarActions }) {
  const [disableUp, setDisableUp] = useState(false);
  const [disableDown, setDisableDown] = useState(false);
  const [_1, _2, triggerReq] = useAxiosRequest(
    "POST",
    "https://jsonplaceholder.typicode.com/posts"
  );

  // Redux state.
  const dispatch = useDispatch();
  const curProfile = useSelector((state) => state.profile.curProfile);

  // Subscribe to redux changes.

  // Bonus: Call dummy API and pass profile items after 3s timeout.
  // Reset if a change is made within 3s using closures.
  const bonusReq = () => {
    let prevTimeoutId = null;
    return (payload) => {
      if (prevTimeoutId) {
        clearTimeout(prevTimeoutId);
      }
      prevTimeoutId = setTimeout(() => {
        triggerReq(payload);
      }, 3000);
    };
  };

  // Check if need to disable arrow buttons.
  const handleArrowsVisibility = (profile) => {
    const idx = profile.items.findIndex((v) => v.id === profile.curProfile.id);
    if (idx === 0) {
      setDisableUp(true);
      setDisableDown(false);
    } else if (idx === profile.items.length - 1) {
      setDisableUp(false);
      setDisableDown(true);
    } else {
      setDisableUp(false);
      setDisableDown(false);
    }
  };

  useEffect(() => {
    const handleBonusReq = bonusReq();
    const unsubscribe = dispatch(
      addListener({
        predicate: (action) => {
          if (action.type.includes("profile")) return true;
          return false;
        },
        effect: (action, listenerApi) => {
          const profile = listenerApi.getState().profile;

          // For all actions, to check for arrow visibility.
          handleArrowsVisibility(profile);

          if (action.type.includes("setCurProfile")) return;

          // Update local storage for all actions.
          localStorage.setItem("profileItems", JSON.stringify(profile.items));

          // Store profile items through API.
          handleBonusReq(profile.items);
        },
      })
    );
    return () => unsubscribe();
  }, []);

  // Button functions.
  const createItemSentinel = () => {
    return {
      id: new Date().getUTCMilliseconds(), // For testing between 1-999
      name: "New Profile",
      icon: "custom",
    };
  };

  const handleOnClickUp = () => {
    handleToolbarActions(null);
    dispatch(moveUpItem());
  };
  const handleOnClickDown = () => {
    handleToolbarActions(null);
    dispatch(moveDownItem());
  };

  const handleOnClickEdit = () => {
    handleToolbarActions("EDIT");
  };

  const handleOnClickDel = () => {
    handleToolbarActions("DELETE");
  };

  const handleOnClickAdd = () => {
    handleToolbarActions(null);
    dispatch(appendItemAndUpdateCurrentProfile(createItemSentinel()));
  };

  return (
    <div id="toolbar" className={styles.toolbar}>
      <button
        id="toolbar-btn-move-up-profile"
        disabled={disableUp}
        className={`${styles.btn} ${disableUp ? styles.disabled : ""}`}
        onClick={handleOnClickUp}
      >
        <ArrowUpSvg id="toolbar-btn-arrow-up-icon" className={styles.svgIcon} />
      </button>
      <button
        id="toolbar-btn--move-profile-down"
        disabled={disableDown}
        className={`${styles.btn} ${disableDown ? styles.disabled : ""}`}
        onClick={handleOnClickDown}
      >
        <ArrowDownSvg
          id="toolbar-btn-arrow-down-icon"
          className={styles.svgIcon}
        />
      </button>
      <div className={styles.flexSpacer}></div>
      {curProfile.id > 0 && (
        <button
          id="toolbar-btn-delete-profile"
          className={styles.btn}
          onClick={handleOnClickDel}
        >
          <DeleteSvg id="toolbar-btn-delete-icon" className={styles.svgIcon} />
        </button>
      )}
      {curProfile.id > 0 && (
        <button
          id="toolbar-btn-edit-profile"
          className={styles.btn}
          onClick={handleOnClickEdit}
        >
          <EditSvg id="toolbar-btn-edit-icon" className={styles.svgIcon} />
        </button>
      )}

      <button
        id="toolbar-btn-add-profile"
        className={styles.btn}
        onClick={handleOnClickAdd}
      >
        <PlusSvg id="toolbar-btn-plus-icon" className={styles.svgIcon} />
      </button>
    </div>
  );
}
