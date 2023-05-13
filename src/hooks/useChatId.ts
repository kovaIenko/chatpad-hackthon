import { useLocation } from "react-router-dom";

export function useChatId() {
  const location = useLocation();
  //console.log(location.pathname)
  const match = location.pathname.match(/\/chats\/(\d+)/);
  return match?.[1];
}
