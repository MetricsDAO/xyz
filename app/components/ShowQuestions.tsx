import {useEffect, useState} from "react";
import { CaretUp32 } from '@carbon/icons-react';
import { usePrevious } from "~/utils/helpers";


export default function ShowQuestions ({ questions, initUpVoteQuestion, selected, selectedProgram }: { questions: any, initUpVoteQuestion: (questionID: number) => {}, selected: any, selectedProgram: any }) {
    let sorted:any;
    const prevSelectedProgram = usePrevious(selectedProgram);
    const previousQuestions = usePrevious(questions);
    const prevSelected = usePrevious(selected);

    if (selectedProgram !== prevSelectedProgram || previousQuestions !== questions || prevSelected !== selected) {
        if (selectedProgram.name === "All") {
            if (selected.name === "Program") {
                sorted = questions.sort((a:any, b:any) => {
                    return a.program > b.program ? 1 : -1;
                });
            } else {
                const property = selected.name === "Votes" ? "totalVotes" : "questionId";
                sorted = questions.sort((a:any, b:any) => {
                    return parseInt(a[property]) < parseInt(b[property]) ? 1 : -1;
                });
            }
        } else { //filter it
            sorted = questions.filter(((obj:any) => {
                return obj.program == selectedProgram.name;
            }))
        }
    } else {
        sorted = previousQuestions;
    }
    const [sortedQuestions, setSortedQuestions] = useState<any>(sorted);

    useEffect(() => {
        if (selectedProgram !== prevSelectedProgram || previousQuestions !== questions) {
            setSortedQuestions(sorted);
        }
    }, [selectedProgram, prevSelectedProgram, sorted, previousQuestions, questions])

    function render() {
        if (!sortedQuestions.length) {
            return <h1>No Questions to display</h1>
        }
        return sortedQuestions.map((questionObj:any) => {
            return (
                <FilteredQuestions 
                key={questionObj.questionId} 
                initUpVoteQuestion={initUpVoteQuestion} 
                question={questionObj} 
                />
            )
        })

    }
    return render()
}

export function FilteredQuestions({
    question, 
    initUpVoteQuestion, 
    }:{ 
    question:any,  
    initUpVoteQuestion: (questionID: number) => {}, 
    }) {

    return (
        <div className={`tw-flex tw-mb-10 ${question.loading ? "tw-opacity-25" : "tw-opacity-100"}`}>
            <div id="post-votes" className="tw-self-start tw-mr-5 tw-border tw-rounded-md tw-w-10 tw-flex tw-flex-col tw-items-center">
                {question.name !== "Unavailable currently" || question.loading ? (
                <>
                <CaretUp32 className="tw-cursor-pointer" onClick={() => {
                    initUpVoteQuestion(question.questionId)
                }} />
                <span>{question.totalVotes}</span>
                </>
            ) : (
                <>
                <span className="tw-opacity-25">N/A</span>
                <span className="tw-opacity-25">{question.totalVotes}</span>
                </>
                )}
            </div>
            <div className="tw-flex tw-flex-col">
                <h4 className="tw-font-bold tw-text-xl"> {question.name}</h4>
                <p className="tw-text-sm tw-mb-4">{question.program}</p>
                <p className="tw-text-base tw-mb-4">{question.description}</p>
            </div>
        </div> 
    )
}