import { ActionIcon, Flex, Menu } from "@mantine/core";
import { IconDotsVertical, IconMessages } from "@tabler/icons-react";
import { useMemo } from "react";
import { Chat, db } from "../db";
import { useChatId } from "../hooks/useChatId";
import { DeleteChatModal } from "./DeleteChatModal";
import { EditChatModal } from "./EditChatModal";
import { MainLink } from "./MainLink";
import axios from "axios"; 
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from 'react-router-dom';

export function Chats({ search }: { search: string }) {
  const { chatId } = useParams();

  // const chats = useLiveQuery(() =>
  //   db.chats.orderBy("createdAt").reverse().toArray()
  // );

  var auth = localStorage.getItem("accessToken");
  var email = localStorage.getItem("email");

  var location = useLocation();

  const useLiveQueryVar = (chatId: any, authToken: any) => {
    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(() => {
      const fetchData = async () => {
        //console.log("try to get chats")
        if (!authToken) {
          return [];
        }
        try {
          const response = await axios.get(`http://localhost:3001/api/chats/getall`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setChats(response.data.chats);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, [location, chatId]);
  
    return chats;
  };

  const chats = useLiveQueryVar(chatId, auth);
 
  //console.log(chats)
  const filteredChats = useMemo(
    () =>
      (chats ?? []).filter((chat) => {
        if (!search) return true;
        return chat.description.toLowerCase().includes(search);
      }),
    [chats, search]
  );

  return (
    <>
      {filteredChats.map((chat) => (
        <Flex
          key={chat.chatId}
          className={chatId === chat.chatId ? "active" : undefined}
          sx={(theme) => ({
            marginTop: 1,
            "&:hover, &.active": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[1],
            },
          })}
        >
          <Link to={`/chats/${chat.chatId}`} style={{ flex: 1 }}>
            <MainLink
              icon={<IconMessages size="1rem" />}
              color="teal"
              chat={chat}
              label={chat.description}
            />
          </Link>
          <Menu shadow="md" width={200} keepMounted>
            <Menu.Target>
              <ActionIcon sx={{ height: "auto" }}>
                <IconDotsVertical size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <EditChatModal chat={chat}>
                <Menu.Item>Edit</Menu.Item>
              </EditChatModal>
              <DeleteChatModal chat={chat}>
                <Menu.Item>Delete</Menu.Item>
              </DeleteChatModal>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      ))}
    </>
  );
}
