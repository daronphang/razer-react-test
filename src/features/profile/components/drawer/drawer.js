import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { shallowEqual } from "react-redux";
import { addListener } from "@reduxjs/toolkit";

import styles from "./drawer.module.scss";
import DeleteWindow from "../deleteWindow/deleteWindow";
import Toolbar from "../toolbar/toolbar";
import ProfileItem from "../profileItem/profileItem";

export default function Drawer() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redux state.
  const dispatch = useDispatch();

  // Memoize profile items.
  const selectItems = (state) => state.profile.items;
  const selectProfileItems = createSelector(selectItems, (items) =>
    items.map((item, idx) => (
      <ProfileItem key={item.id} item={item} isEditing={isEditing} />
    ))
  );
  const profileItems = useSelector(selectProfileItems, shallowEqual);

  const scrollToDrawerBottom = () => {
    setTimeout(() => {
      const el = document.getElementById("drawer");
      el.scrollTop = el.scrollHeight;
    });
  };

  // Subscribe to redux changes.
  useEffect(() => {
    const unsubscribe = dispatch(
      addListener({
        predicate: (action) => {
          if (action.type.includes("profile")) {
            return true;
          }
          return false;
        },
        effect: (action, listenerApi) => {
          if (action.type === "profile/appendItemAndUpdateCurrentProfile") {
            scrollToDrawerBottom();
          } else if (action.type === "profile/setCurProfile") {
            // New profile has been selected; to reset states.
            handleToolbarActions(null);
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
        handleToolbarActions(null);
      }
    };

    const handleClick = (e) => {
      const el = e.target;
      // If clickedEl already has a click handler, to skip.
      if (
        el.id.includes("toolbar-btn") ||
        (el.parentElement && el.parentElement.id.includes("toolbar-btn")) ||
        el.id.includes("profile-item") ||
        el.id === "delete-profile-window"
      ) {
        return;
      }
      // If user clicks anywhere else, to reset current state.
      // This includes deleting an item when clicking the button in deleteWindow.
      handleToolbarActions(null);
    };

    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleToolbarActions = (action) => {
    // Reset all states whenever an action is dispatched by toolbar.
    setIsEditing(false);
    setIsDeleting(false);

    switch (action) {
      case "EDIT":
        setIsEditing(true);
        break;
      case "DELETE":
        setIsDeleting(true);
        break;
    }
  };

  return (
    <>
      <div className={styles.drawer} id="drawer">
        {profileItems}
      </div>
      <Toolbar handleToolbarActions={handleToolbarActions} />
      {isDeleting && <DeleteWindow anchorId="toolbar-btn-delete-profile" />}
    </>
  );
}
