import { memo, useMemo } from "react";
import { chatParse } from "./ChatParse";
import { MemoizedChatBlock } from "./ChatBlocks";
import { useSidebar } from "../ui/sidebar";

type Message = {
  role: string;
  content: string;
};

export const MemoizedChatItem = memo(({ message }: { message: Message }) => {
  const blocks = useMemo(() => chatParse(message.content), [message.content]);
  const { open, isMobile } = useSidebar();

  return (
    <div className={`flex w-full justify-start`}>
      <div
        className={`max-w-3xl space-y-8 w-full ${
          open && !isMobile && "lg:max-w-[640px]"
        }`}
      >
        {blocks?.map((block, index) => (
          <MemoizedChatBlock block={block} key={`${index}`} />
        ))}
      </div>
    </div>
  );
});

MemoizedChatItem.displayName = "MemoizedChatItem";
