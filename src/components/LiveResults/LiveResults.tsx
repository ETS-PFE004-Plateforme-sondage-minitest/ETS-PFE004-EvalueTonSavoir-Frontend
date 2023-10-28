import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import './results.css';
import { GIFTQuestion } from 'gift-pegjs';

interface LiveResultsProps {
    socket: Socket | null;
    questions: GIFTQuestion[];
}

interface Answer {
    username: string;
    answer: string | number | boolean;
}

const LiveResults: React.FC<LiveResultsProps> = ({ socket, questions }) => {
    const [userAnswers, setUserAnswers] = useState<Record<string, (string | number | boolean)[]>>({});
    const [hideUsernames, setHideUsernames] = useState<boolean>(false);

    console.log('les questions')
    console.log(questions)
    useEffect(() => {
        if (socket) {
            socket.on('submit-answer', ({ username, answer }: Answer) => {
                setUserAnswers(prevUserAnswers => {
                    const prevAnswers = prevUserAnswers[username] || [];
                    return {
                        ...prevUserAnswers,
                        [username]: [...prevAnswers, answer]
                    };
                });
            });

            return () => {
                socket.off('submit-answer');
            };
        }
    }, [socket]);

    const maxQuestions = Object.values(userAnswers).reduce((max, answers) => Math.max(max, answers.length), 0);

    return (
        <div>
            <h2>Live results of the quiz</h2>
            <label>
                Hide usernames:
                <input 
                    type="checkbox"
                    checked={hideUsernames}
                    onChange={() => setHideUsernames(prev => !prev)}
                />
            </label>
            {Object.keys(userAnswers).length > 0 ? (

                <table className="table-bordered">
                    <thead>
                        <tr>
                            <th>Username</th>
                            {Array.from({ length: maxQuestions }).map((_, idx) => (
                                <th key={idx}>{`Q${idx + 1}`}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(userAnswers).map(([username, answers]) => (
                            <tr key={username}>
                                <td>{hideUsernames ? '******' : username}</td>
                                {answers.map((answer, idx) => {
                                    const question = questions[idx];
                                    let isCorrect = false;

                                    // Check if the answer is correct
                                    if (question.type === 'MC') {
                                        const correctChoice = question.choices.find(choice => choice.isCorrect);
                                        if (correctChoice && correctChoice.text.text === answer) {
                                            isCorrect = true;
                                        }
                                    } else if (question.type === 'TF') {
                                        isCorrect = (question.isTrue && answer === "True") || (!question.isTrue && answer === "False");
                                    }

                                    return (
                                        <td key={idx} className={isCorrect ? 'correct-answer' : 'incorrect-answer'}>
                                            {answer.toString()}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No answers received yet.</p>
            )}
        </div>
    );
}

export default LiveResults;
