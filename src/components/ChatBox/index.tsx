import {
  ChatArea,
  Form,
  MentionsTextarea,
  SendButton,
  Toolbox,
  EachMention,
} from "@components/ChatBox/styles";
import { IUser, IUserWithOnline } from "@typings/db";
import fetcher from "@utils/fetcher";
import autosize from "autosize";
import gravatar from "gravatar";
import React, {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Mention, SuggestionDataItem } from "react-mentions";
import { useParams } from "react-router";
import useSWR from "swr";

interface Props {
  onSubmitForm: (e: FormEvent) => void;
  chat?: string;
  onChangeChat?: (e: any) => void;
  placeholder?: string;
  // data?: IUser[];
}

export default function ChatBox({
  chat,
  onChangeChat,
  onSubmitForm,
  placeholder,
}: Props) {
  const { workspace } = useParams<{
    workspace: string;
  }>();
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );

  const onKeydownChat = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm]
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focused: boolean
    ) => {
      if (!memberData) return;

      return (
        <EachMention focus={focused}>
          <img
            src={gravatar.url(memberData[index].email, {
              s: "20px",
              d: "retro",
            })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData]
  );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={
              memberData?.map((v) => ({
                id: v.id,
                display: v.nickname,
              })) || []
            }
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              "c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send" +
              (chat?.trim() ? "" : " c-texty_input__button--disabled")
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i
              className="c-icon c-icon--paperplane-filled"
              aria-hidden="true"
            />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
}
