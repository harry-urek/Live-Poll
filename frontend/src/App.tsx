import React from 'react';
import { useAppState, useStudentSocket } from './hooks';
import { USER_ROLES } from './constants';
import Welcome from './components/Welcome';
import Start from './components/Start';
import Loading from './components/Loading';
import Question from './components/Question';
import AddQuestion from './components/AddQuestion';

function App() {
  const {
    userRole,
    currentState,
    setCurrentState,
    handleRoleSelect,
    handleStudentJoin,
    handleQuestionReceived,
    handleWaitingForQuestion,
  } = useAppState();

  const {
    isConnected,
    currentQuestion,
    serverTimeLeft,
    pollResults,
    isWaiting,
    joinPoll,
    submitAnswer,
  } = useStudentSocket();


  React.useEffect(() => {
    if (userRole === USER_ROLES.STUDENT) {
      if (currentQuestion) {
        handleQuestionReceived();
      } else if (isWaiting) {
        handleWaitingForQuestion();
      }
    }
  }, [userRole, currentQuestion, isWaiting, handleQuestionReceived, handleWaitingForQuestion]);

  const handleStudentJoinPoll = (name: string) => {
    handleStudentJoin();
    joinPoll(name);
  };

  const renderCurrentComponent = () => {
    switch (currentState) {
      case 'welcome':
        return <Welcome onRoleSelect={handleRoleSelect} />;

      case 'start':
        return <Start onStudentJoin={handleStudentJoinPoll} />;

      case 'loading':
        return <Loading />;

      case 'question':
        return currentQuestion ? (
          <Question
            questionData={currentQuestion}
            serverTimeLeft={serverTimeLeft}
            pollResults={pollResults}
            onSubmitAnswer={submitAnswer}
            onResultsComplete={() => setCurrentState('loading')}
          />
        ) : (
          <Loading />
        );

      case 'addQuestion':
        return <AddQuestion />;

      default:
        return <Welcome onRoleSelect={handleRoleSelect} />;
    }
  };

  return <div className="app">{renderCurrentComponent()}</div>;
}

export default App;
