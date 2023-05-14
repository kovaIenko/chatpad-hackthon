import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import {useHotkeys, useLocalStorage} from "@mantine/hooks";
import {Notifications} from "@mantine/notifications";
import {
    createHashHistory,
    ReactLocation,
    Router,
} from "@tanstack/react-location";
import {ChatRoute} from "../routes/ChatRoute";
import {IndexRoute} from "../routes/IndexRoute";
import {Login} from "../routes/Login";
import {Layout} from "./Layout";
import {useEffect, useState} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import axios from "axios";

const history = createHashHistory();
const location = new ReactLocation({history});

export type Message = {
    msg: string;
    me?: boolean;
    img: string | undefined;
    _id: string;
};

type User = {
    apiKey: string;
    avatar: string;
    createdAt: string;
    queries: string;
    uid: string;
    updatedAt: string;
    username: string;
    _id: string;
};
const fetchChats = async (authToken: string | null) => {
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
        return response.data.chats;
    } catch (error) {
        console.error(error);
    }
};

export function App() {
    const navigate = useNavigate()
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [chatLoading, setChatloading] = useState(true);
    const [auth, setAuth] = useLocalStorage<string | undefined>(
        {
            key: "auth",
            getInitialValueInEffect: false,
        }
    );

    function chatNotAvailable() {
        fetchChats(auth)
            .then(
                function (response) {
                    changeChat(response[0].chatId)
                }
            )
    }

    function changeChat(chatId: string) {
        navigate("/chats/" + chatId)
    }

    function addMessage(msg: Message) {
        setMessages((prev) => [...prev, msg]);
    }

    function toggleLoading(value: boolean) {
        setLoading(value);
    }

    function handleAuth(value: any) {
        setMessages([]);
        setAuth(value);
    }

    function handlelogout() {
        setAuth(undefined);
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "mantine-color-scheme",
        defaultValue: prefersDark ? "dark" : "light",
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    return (
        <Router location={location} routes={[]}>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <Routes>
                    <Route path="/" element={!auth ? <Navigate to="/login"/> : <IndexRoute/>}> </Route>
                    <Route path="/login"
                           element={!auth ? <Login handleAuth={handleAuth}/> : <Navigate to="/"/>}> </Route>
                    <Route path="/chats/:chatId"
                           element={!auth ? <Navigate to="/login"/> : <ChatRoute chatNotAvailable={chatNotAvailable}/>}> </Route>
                </Routes>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    withCSSVariables
                    theme={{
                        colorScheme,
                        primaryColor: "teal",
                        globalStyles: (theme) => ({
                            body: {
                                backgroundColor:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.dark[9]
                                        : theme.colors.gray[0],
                            },
                        }),
                        components: {
                            Modal: {
                                defaultProps: {
                                    padding: "xl",
                                },
                                styles: {
                                    title: {
                                        fontSize: "1.2rem",
                                        fontWeight: 600,
                                    },
                                },
                            },
                            ModalRoot: {
                                defaultProps: {
                                    centered: true,
                                },
                            },
                            Overlay: {
                                defaultProps: {
                                    opacity: 0.6,
                                    blur: 6,
                                },
                            },
                            // Input: {
                            //   defaultProps: {
                            //     variant: "filled",
                            //   },
                            // },
                            InputWrapper: {
                                styles: {
                                    label: {
                                        marginBottom: 4,
                                    },
                                },
                            },
                            Code: {
                                styles: (theme) => ({
                                    root: {
                                        fontSize: theme.fontSizes.sm,
                                        backgroundColor:
                                            theme.colorScheme == "dark"
                                                ? theme.colors.dark[7]
                                                : theme.colors.gray[1],
                                    },
                                }),
                            },
                        },
                    }}
                >
                    {!auth ? <Navigate to="/login"/> : <Layout/>}
                    <Notifications/>
                </MantineProvider>
            </ColorSchemeProvider>
        </Router>
    );
}