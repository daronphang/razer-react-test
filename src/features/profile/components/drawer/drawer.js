import ProfileItem from "../profileItem/profileItem";
import styles from "./drawer.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { shallowEqual } from "react-redux";
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
import DeleteWindow from "../deleteWindow/deleteWindow";
import useAxiosRequest from "src/shared/hooks/useAxiosRequest";

export default function Drawer() {
  const [disableUp, setDisableUp] = useState(false);
  const [disableDown, setDisableDown] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [_1, _2, triggerReq] = useAxiosRequest(
    "POST",
    "https://jsonplaceholder.typicode.com/posts"
  );

  // Redux state.
  const dispatch = useDispatch();
  const curProfile = useSelector((state) => state.profile.curProfile);

  const handleResetStates = () => {
    setIsEditable(false);
    setIsDeletable(false);
  };

  const selectItems = (state) => state.profile.items;
  const selectProfileItems = createSelector(selectItems, (items) =>
    items.map((item, idx) => (
      <ProfileItem
        key={item.id}
        item={item}
        activeItemId={curProfile.id}
        isEditable={isEditable}
        handleResetStates={handleResetStates}
      />
    ))
  );
  const profileItems = useSelector(selectProfileItems, shallowEqual);

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

  const scrollToDrawerBottom = () => {
    setTimeout(() => {
      const el = document.getElementById("drawer");
      el.scrollTop = el.scrollHeight;
    });
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

          handleBonusReq(profile.items);

          if (action.type.includes("appendItem")) {
            scrollToDrawerBottom();
          }
        },
      })
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Additional event listeners.
    const handleKeyUp = (e) => {
      if (e.key === "Enter" || e.key === "Escape") {
        handleResetStates();
      }
    };

    const handleClick = (e) => {
      const el = e.target;
      // If clickedEl already has a click handler, to skip.
      if (el.id.includes("toolbar-btn")) return;
      else if (el.parentElement && el.parentElement.id.includes("toolbar-btn"))
        return;
      else if (el.id.includes("profile-item")) return;
      else if (el.id === "delete-profile-window") return;
      handleResetStates();
    };

    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Button functions.
  const createItemSentinel = () => {
    return {
      id: new Date().getUTCMilliseconds(),
      name: "New Profile",
      icon: "custom",
    };
  };

  const handleOnClickUp = () => {
    setIsEditable(false);
    setIsDeletable(false);
    dispatch(moveUpItem());
  };
  const handleOnClickDown = () => {
    setIsEditable(false);
    setIsDeletable(false);
    dispatch(moveDownItem());
  };

  const handleOnClickEdit = () => {
    setIsEditable(true);
    setIsDeletable(false);
  };

  const handleOnClickDel = () => {
    setIsEditable(false);
    setIsDeletable(true);
  };

  const handleOnClickAdd = () => {
    setIsEditable(false);
    setIsDeletable(false);
    dispatch(appendItemAndUpdateCurrentProfile(createItemSentinel()));
  };

  return (
    <>
      <div className={styles.drawer} id="drawer">
        {profileItems}
      </div>
      <div id="toolbar" className={styles.toolbar}>
        <button
          id="toolbar-btn-move-up-profile"
          disabled={disableUp}
          className={`${styles.btn} ${disableUp ? styles.disabled : ""}`}
          onClick={handleOnClickUp}
        >
          <ArrowUpSvg
            id="toolbar-btn-arrow-up-icon"
            className={styles.svgIcon}
          />
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
        {curProfile.id > 4 && (
          <button
            id="toolbar-btn-delete-profile"
            className={styles.btn}
            onClick={handleOnClickDel}
          >
            <DeleteSvg
              id="toolbar-btn-delete-icon"
              className={styles.svgIcon}
            />
          </button>
        )}
        {curProfile.id > 4 && (
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
      {isDeletable && <DeleteWindow anchorId="toolbar-btn-delete-profile" />}
    </>
  );
}
