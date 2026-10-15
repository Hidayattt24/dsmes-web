"use client";

import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function Portal({ children }: { readonly children: React.ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  return mounted ? createPortal(children, document.body) : null;
}
