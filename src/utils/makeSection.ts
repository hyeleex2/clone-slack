import { IChat, IDM } from "@typings/db";
import dayjs from "dayjs";

export default function makeSection(chatList: IDM[] | IChat[]) {
  const sections: { [key: string]: IDM[] | IChat[] } = {};
  chatList.forEach((chat: IDM | IChat) => {
    const monthDate = dayjs(chat.createdAt).format("YYYY-MM-DD");
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });

  return sections;
}
