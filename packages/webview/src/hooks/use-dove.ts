import { useCallback, useEffect } from "react";
import { Dove } from "shared";

const vscode = window.acquireVsCodeApi();

export const dove = new Dove(vscode.postMessage);
export const useReceiveDoveMsg = (
  msgType: any,
  callback: (data?: any) => any
) => {
  useEffect(() => {
    const key = dove.subscribe(msgType, callback);
    return () => dove.unSubscribe(key);
  }, []);
};
export const useDove = () => {
  const messageEvent = useCallback(
    (event: { data: any }) => dove.receiveMessage(event.data),
    []
  );
  useEffect(() => {
    window.addEventListener("message", messageEvent);
    return () => {
      window.removeEventListener("message", messageEvent);
    };
  }, []);
};
