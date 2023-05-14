import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    MediaQuery,
    Select,
    SimpleGrid,
    Skeleton,
    Stack,
    Textarea,
} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {nanoid} from "nanoid";
import {KeyboardEvent, useEffect, useRef, useState, type ChangeEvent} from "react";
import {AiOutlineSend} from "react-icons/ai";
import {MessageItem} from "../components/MessageItem";
import {db, Message} from "../db";
import {useChatId} from "../hooks/useChatId";
import {config} from "../utils/config";
// import {
//   createChatCompletion,
//   createStreamChatCompletion,
// } from "../utils/openai";

import axios from "axios";

import {useParams} from 'react-router-dom';
import {AuthPropType} from "./Login";

export type ChatNotAvailablePropType = {
    chatNotAvailable: () => void;
};

var canGetMessages = true;

export function ChatRoute({ chatNotAvailable }: ChatNotAvailablePropType) {

    //console.log("we are here:")

    const {chatId} = useParams();
    const auth = localStorage.getItem("accessToken");
    const [messages, setMessages] = useState<Message[]>([]);

    console.log("we opened chat and its id " + chatId)

    const fetchData = async (authToken: string | null) => {
        if (!chatId || !authToken) return [];
        try {
            
            if (canGetMessages){
                canGetMessages = false
            axios.get(`http://localhost:3001/api/messages/get?chatId=${chatId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then(
                    function (response) {
                        canGetMessages = true;
                        setMessages(response.data.messages);
                    }
                ).catch(
                function (error) {
                    console.log('Show error notification!')
                    chatNotAvailable()
                    canGetMessages = true;
                    return Promise.reject(error)
                }
            )
            ;
            }
            //console.log(response.data.messages)
            // setMessages(response.data.messages);
        } catch (error) {
            console.error(error);
        }
    };
    const useLiveQueryVar = (chatId: any, authToken: any) => {
        console.log("try to get messages by chatId")
        useEffect(() => {
                fetchData(auth);
        }, [chatId]);

        // return messages;
    };


    useLiveQueryVar(chatId, auth);
    // const [messages, setMessages] = useLiveQueryVar(chatId, auth);

    console.log(messages)

    const userMessages = messages
        ?.filter((messages) => messages.role === "user")
        .map((message) => message.content) || [];

    console.log(userMessages)
    console.log("we are finally here")
    const [userMsgIndex, setUserMsgIndex] = useState(0);
    const [content, setContent] = useState("");
    const [contentDraft, setContentDraft] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // const chat = useLiveQuery(async () => {
    //   if (!chatId) return null;
    //   return db.chats.get(chatId);
    // }, [chatId]);

    const [writingCharacter, setWritingCharacter] = useState<string | null>(null);
    const [writingTone, setWritingTone] = useState<string | null>(null);
    const [writingStyle, setWritingStyle] = useState<string | null>(null);
    const [writingFormat, setWritingFormat] = useState<string | null>(null);

    // const getSystemMessage = () => {
    //   const message: string[] = [];
    //   if (writingCharacter) message.push(`You are ${writingCharacter}.`);
    //   if (writingTone) message.push(`Respond in ${writingTone} tone.`);
    //   if (writingStyle) message.push(`Respond in ${writingStyle} style.`);
    //   if (writingFormat) message.push(writingFormat);
    //   if (message.length === 0)
    //     message.push(
    //       "You are ChatGPT, a large language model trained by OpenAI."
    //     );
    //   return message.join(" ");
    // };

    const submit = async () => {
        if (submitting) return;

        if (!chatId) {
            notifications.show({
                title: "Error",
                color: "red",
                message: "chatId is not defined. Please create a chat to get started.",
            });
            return;
        }

        // if (!apiKey) {
        //   notifications.show({
        //     title: "Error",
        //     color: "red",
        //     message: "OpenAI API Key is not defined. Please set your API Key",
        //   });
        //   return;
        // }

        try {
            setSubmitting(true);

            const network_user_message = {
                messageId: nanoid(),
                chatId: chatId,
                content: content,
                role: "user",
                createdAt: new Date(),
            }
            const user_message: Message = {
                id: "",
                chatId: chatId,
                content: content,
                role: "user",
                createdAt: new Date(),
            }

            messages.push(user_message)
            setMessages(messages)

            console.log(user_message)
            await axios.post(`http://localhost:3001/api/messages/save`,
                {message: network_user_message},
                {
                    headers: {
                        Authorization: `Bearer ${auth}`,
                    },
                });

            setContent("");
            fetchData(auth);

            var history = (messages ?? []).map((message) => ({
                role: message.role,
                content: message.content,
            }));

            console.log(history)
//    const answer = await axios.post(`http://localhost:3001/api/bot`, 
//    history, 
//  {
//    headers: {
//      Authorization: `Bearer ${auth}`,
//    },
//  });


            // await createStreamChatCompletion(
            //   apiKey,
            //   [
            //     {
            //       role: "system",
            //       content: getSystemMessage(),
            //     },
            //     ...,
            //     { role: "user", content },
            //   ],
            //   chatId,
            //   messageId
            // );


            //   const bot_message = {
            //     messageId: nanoid(),
            //     chatId: chatId,
            //     content: answer,
            //     role: "assistant",
            //      createdAt: new Date(),
            //  }


            //  console.log

            //   await axios.post(`http://localhost:3001/api/messages/save`,
            //   {data: { message: bot_message }},
            // {
            //   headers: {
            //     Authorization: `Bearer ${auth}`,
            //   },
            // });

            setSubmitting(false);

            //   if (chat?.description === "New Chat") {
            //     const messages = await db.messages
            //       .where({ chatId })
            //       .sortBy("createdAt");
            //     const createChatDescription = await createChatCompletion(apiKey, [
            //       {
            //         role: "system",
            //         content: getSystemMessage(),
            //       },
            //       ...(messages ?? []).map((message) => ({
            //         role: message.role,
            //         content: message.content,
            //       })),
            //       {
            //         role: "user",
            //         content:
            //           "What would be a short and relevant title for this chat ? You must strictly answer with only the title, no other text is allowed.",
            //       },
            //     ]);
            //     const chatDescription =
            //       createChatDescription.data.choices[0].message?.content;

            //     if (createChatDescription.data.usage) {
            //       await db.chats.where({ id: chatId }).modify((chat) => {
            //         chat.description = chatDescription ?? "New Chat";
            //         if (chat.totalTokens) {
            //           chat.totalTokens +=
            //             createChatDescription.data.usage!.total_tokens;
            //         } else {
            //           chat.totalTokens = createChatDescription.data.usage!.total_tokens;
            //         }
            //       });
            //     }
            //   }
        } catch (error: any) {
            if (error.toJSON().message === "Network Error") {
                notifications.show({
                    title: "Error",
                    color: "red",
                    message: "No internet connection.",
                });
            }
            const message = error.response?.data?.error?.message;
            if (message) {
                notifications.show({
                    title: "Error",
                    color: "red",
                    message,
                });
            }
        } finally {
            setSubmitting(false);
        }

    };

    const onUserMsgToggle = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        const {selectionStart, selectionEnd} = event.currentTarget;
        if (
            !["ArrowUp", "ArrowDown"].includes(event.code) ||
            selectionStart !== selectionEnd ||
            (event.code === "ArrowUp" && selectionStart !== 0) ||
            (event.code === "ArrowDown" &&
                selectionStart !== event.currentTarget.value.length)
        ) {
            // do nothing
            return;
        }
        event.preventDefault();

        const newMsgIndex = userMsgIndex + (event.code === "ArrowUp" ? 1 : -1);
        const allMessages = [contentDraft, ...Array.from(userMessages).reverse()];

        if (newMsgIndex < 0 || newMsgIndex >= allMessages.length) {
            // index out of range, do nothing
            return;
        }
        setContent(allMessages.at(newMsgIndex) || "");
        setUserMsgIndex(newMsgIndex);
    };

    const onContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.currentTarget;
        setContent(value);
        setContentDraft(value);
        setUserMsgIndex(0);
    };

    if (!chatId) return null;

    return (
        <>
            <Container pt="xl" pb={100}>
                <Stack spacing="xs">
                    {messages?.map((message) => (
                        <MessageItem key={message.messageId} message={message}/>
                    ))}
                </Stack>
                {submitting && (
                    <Card withBorder mt="xs">
                        <Skeleton height={8} radius="xl"/>
                        <Skeleton height={8} mt={6} radius="xl"/>
                        <Skeleton height={8} mt={6} radius="xl"/>
                        <Skeleton height={8} mt={6} radius="xl"/>
                        <Skeleton height={8} mt={6} width="70%" radius="xl"/>
                    </Card>
                )}
            </Container>
            <Box
                py="lg"
                sx={(theme) => ({
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    [`@media (min-width: ${theme.breakpoints.md})`]: {
                        left: 300,
                    },
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[9]
                            : theme.colors.gray[0],
                })}
            >
                <Container>
                    {messages?.length === 0 && (
                        <SimpleGrid
                            mb="sm"
                            spacing="xs"
                            breakpoints={[
                                {minWidth: "sm", cols: 4},
                                {maxWidth: "sm", cols: 2},
                            ]}
                        >
                            <Select
                                value={writingCharacter}
                                onChange={setWritingCharacter}
                                data={config.writingCharacters}
                                placeholder="Character"
                                variant="filled"
                                searchable
                                clearable
                                sx={{flex: 1}}
                            />
                            <Select
                                value={writingTone}
                                onChange={setWritingTone}
                                data={config.writingTones}
                                placeholder="Tone"
                                variant="filled"
                                searchable
                                clearable
                                sx={{flex: 1}}
                            />
                            <Select
                                value={writingStyle}
                                onChange={setWritingStyle}
                                data={config.writingStyles}
                                placeholder="Style"
                                variant="filled"
                                searchable
                                clearable
                                sx={{flex: 1}}
                            />
                            <Select
                                value={writingFormat}
                                onChange={setWritingFormat}
                                data={config.writingFormats}
                                placeholder="Format"
                                variant="filled"
                                searchable
                                clearable
                                sx={{flex: 1}}
                            />
                        </SimpleGrid>
                    )}
                    <Flex gap="sm">
                        <Textarea
                            key={chatId}
                            sx={{flex: 1}}
                            placeholder="Your message here..."
                            autosize
                            autoFocus
                            disabled={submitting}
                            minRows={1}
                            maxRows={5}
                            value={content}
                            onChange={onContentChange}
                            onKeyDown={async (event) => {
                    
                                
                                if (event.code === "Enter" && !event.shiftKey && content) {
                                    event.preventDefault();
                                    submit();
                                    setUserMsgIndex(0);
                                }
                                if (event.code === "ArrowUp") {
                                    onUserMsgToggle(event);
                                }
                                if (event.code === "ArrowDown") {
                                    onUserMsgToggle(event);
                                }
                            }}
                        />
                        <MediaQuery largerThan="sm" styles={{display: "none"}}>
                            <Button
                                h="auto"
                                onClick={() => {
                                    if (content) {
                                        submit();
                                    }
                                }}
                            >
                                <AiOutlineSend/>
                            </Button>
                        </MediaQuery>
                    </Flex>
                </Container>
            </Box>
        </>
    );
}
