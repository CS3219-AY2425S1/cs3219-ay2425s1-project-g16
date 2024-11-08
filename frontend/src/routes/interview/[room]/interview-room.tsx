import { useSuspenseQuery } from '@tanstack/react-query';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import { useMemo, useState } from 'react';

import { WithNavBanner, WithNavBlocker } from '@/components/blocks/authed';
import { AIChat } from '@/components/blocks/interview/ai-chat';
import { Editor } from '@/components/blocks/interview/editor';
import { PartnerChat } from '@/components/blocks/interview/partner-chat';
import { QuestionAttemptsPane } from '@/components/blocks/interview/question-attempts';
import { QuestionDetails } from '@/components/blocks/questions/details';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCrumbs } from '@/lib/hooks';
import { questionDetailsQuery } from '@/lib/queries/question-details';

interface InterviewRoomProps {
  questionId: number;
  roomId: string;
}

const InterviewRoom = ({ questionId, roomId }: InterviewRoomProps) => {
  const { crumbs } = useCrumbs();
  const { data: details } = useSuspenseQuery(questionDetailsQuery(questionId));
  const questionDetails = useMemo(() => details.question, [details]);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPartnerChatOpen, setIsPartnerChatOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageName>('typescript');

  const handleCodeChange = (code: string, language: LanguageName) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
  };

  const handleAIClick = () => {
    setIsPartnerChatOpen(false);
    setIsAIChatOpen(!isAIChatOpen);
  };

  const handlePartnerClick = () => {
    setIsAIChatOpen(false);
    setIsPartnerChatOpen(!isPartnerChatOpen);
  };

  return (
    <WithNavBlocker>
      <WithNavBanner crumbs={crumbs}>
        <div className='scrollbar-track-transparent scrollbar-thin flex flex-1 overflow-hidden sm:overflow-x-auto sm:overflow-y-hidden'>
          <Card className='border-border m-4 flex w-[500px] overflow-hidden p-4 md:w-2/5 md:min-w-[292px]'>
            <Tabs defaultValue='details' className='size-full'>
              <TabsList>
                <TabsTrigger value='details'>Question Details</TabsTrigger>
                <TabsTrigger value='attempts'>Past Attempts</TabsTrigger>
              </TabsList>
              <TabsContent value='details' className='h-[calc(100%-44px)]'>
                <QuestionDetails {...{ questionDetails }} />
              </TabsContent>
              <TabsContent value='attempts' className='flex h-[calc(100%-44px)]'>
                <QuestionAttemptsPane questionId={questionId} />
              </TabsContent>
            </Tabs>
          </Card>

          <div className='flex w-full'>
            <Editor
              questionId={questionId}
              room={roomId}
              onAIClick={handleAIClick}
              onPartnerClick={handlePartnerClick}
              onCodeChange={handleCodeChange}
            />
          </div>

          {(isAIChatOpen || isPartnerChatOpen) && (
            <Card className='border-border m-4 w-[500px] overflow-hidden md:w-1/3 md:min-w-[376px]'>
              {isAIChatOpen && (
                <AIChat
                  isOpen={isAIChatOpen}
                  onClose={() => setIsAIChatOpen(false)}
                  editorCode={currentCode}
                  language={currentLanguage}
                  questionDetails={questionDetails.description}
                />
              )}
              {isPartnerChatOpen && (
                <PartnerChat
                  roomId={roomId}
                  isOpen={isPartnerChatOpen}
                  onClose={() => setIsPartnerChatOpen(false)}
                />
              )}
            </Card>
          )}
        </div>
      </WithNavBanner>
    </WithNavBlocker>
  );
};

export default InterviewRoom;
