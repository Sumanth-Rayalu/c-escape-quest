import { useState, useCallback } from 'react';
import { Question } from '../data/questions';

interface QuestionOverlayProps {
  question: Question;
  onCorrect: () => void;
  onClose: () => void;
}

export default function QuestionOverlay({ question, onCorrect, onClose }: QuestionOverlayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSubmit = useCallback(() => {
    const answer = question.type === 'mcq' ? selectedOption : inputValue.trim();
    if (!answer) return;

    const isCorrect = answer === question.correctAnswer;

    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? `✓ Correct! ${question.explanation}`
        : `✗ Wrong answer. Try again.`,
    });

    if (isCorrect) {
      setAnswered(true);
      setTimeout(() => onCorrect(), 2000);
    } else {
      setTimeout(() => setFeedback(null), 2500);
    }
  }, [selectedOption, inputValue, question, onCorrect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 border rounded-lg bg-card border-border box-glow scanline">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <div className="w-3 h-3 rounded-full bg-accent" />
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="ml-2 text-xs font-mono text-muted-foreground">
            escape_room_v1.0 — level_{question.level}_challenge.c
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Question */}
          <div>
            <p className="text-sm font-mono text-primary mb-2">
              {'>'} LEVEL {question.level} — {question.type === 'mcq' ? 'MULTIPLE CHOICE' : 'INPUT ANSWER'}
            </p>
            <p className="text-foreground text-base leading-relaxed whitespace-pre-line">
              {question.question}
            </p>
          </div>

          {/* Code block */}
          {question.code && (
            <div className="rounded-md border border-border overflow-hidden">
              <div className="px-3 py-1.5 text-xs font-mono text-muted-foreground border-b border-border bg-secondary/50">
                program.c
              </div>
              <pre className="p-4 overflow-x-auto bg-secondary/30">
                <code className="text-sm font-mono text-primary leading-relaxed">
                  {question.code}
                </code>
              </pre>
            </div>
          )}

          {/* MCQ options */}
          {question.type === 'mcq' && question.options && (
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  disabled={answered}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full text-left px-4 py-3 rounded-md border font-mono text-sm transition-all
                    ${selectedOption === option
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/20 text-secondary-foreground hover:border-muted-foreground hover:bg-secondary/40'
                    }
                    ${answered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <span className="text-muted-foreground mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Text input */}
          {question.type === 'input' && (
            <div>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-primary">{'>'}</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  disabled={answered}
                  placeholder="Type your answer..."
                  className="flex-1 bg-transparent border-b border-border px-2 py-1 text-foreground
                    placeholder:text-muted-foreground focus:outline-none focus:border-primary
                    disabled:opacity-50 font-mono"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`rounded-md px-4 py-3 font-mono text-sm ${
                feedback.correct
                  ? 'bg-primary/10 border border-primary/30 text-primary'
                  : 'bg-destructive/10 border border-destructive/30 text-destructive'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Submit */}
          {!answered && (
            <button
              onClick={handleSubmit}
              disabled={question.type === 'mcq' ? !selectedOption : !inputValue.trim()}
              className="w-full py-3 rounded-md font-mono text-sm font-semibold transition-all
                bg-primary text-primary-foreground hover:bg-primary/90
                disabled:opacity-30 disabled:cursor-not-allowed
                box-glow"
            >
              {'>'} EXECUTE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
