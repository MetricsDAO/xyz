import {useEffect, useState} from "react";
import { CaretUp32 } from '@carbon/icons-react';
import { usePrevious } from "~/utils/helpers";


export default function ShowQuestions ({ questions, upvoteQuestion, selected, selectedProgram }: { questions: any, upvoteQuestion: (questionID: number) => {}, selected: any, selectedProgram: any }) {
    let sorted:any;
    const prevSelectedProgram = usePrevious(selectedProgram);

    if (selectedProgram.name === "All") {
        if (selected.name === "Program") {
            sorted = questions.sort((a:any, b:any) => {
                return a.program.name > b.program.name ? 1 : -1;
            });
        } else {
            const property = selected.name === "Votes" ? "totalVotes" : "Newest";
            sorted = questions.sort((a:any, b:any) => {
                return parseInt(a[property]) < parseInt(b[property]) ? 1 : -1;
            });
        }
    } else { //filter it
        sorted = questions.filter(((obj:any) => {
            return obj.program.name == selectedProgram.name;
        }))
    }
    const [sortedQuestions, setSortedQuestions] = useState<any>(sorted);

    useEffect(() => {
        if (selectedProgram !== prevSelectedProgram) {
            setSortedQuestions(sorted);
        }
    }, [selectedProgram, prevSelectedProgram, sorted])

    function render() {
        if (!sortedQuestions.length) {
            return <h1>No Questions to display</h1>
        }
        return sortedQuestions.map((questionObj:any) => {
            return (
                <FilteredQuestions 
                key={questionObj.questionId} 
                upvoteQuestion={upvoteQuestion} 
                question={questionObj} 
                />
            )
        })

    }
    return render()
}

export function FilteredQuestions({
    question, 
    upvoteQuestion, 
    }:{ 
    question:any,  
    upvoteQuestion: (questionID: number) => {}, 
    }) {

    return (
        <div className="tw-flex tw-mb-10">
            <div id="post-votes" className="tw-self-start tw-mr-5 tw-border tw-rounded-md tw-w-10 tw-flex tw-flex-col tw-items-center">
                <CaretUp32 className="tw-cursor-pointer" onClick={() => {
                    upvoteQuestion(question.questionId)
                }} />
                <span>{question.totalVotes}</span>
            </div>
            <div className="tw-flex tw-flex-col">
                <h4 className="tw-font-bold tw-text-xl"> {question.name}</h4>
                <p className="tw-text-sm tw-mb-4">{question.program?.name}</p>
                <p className="tw-text-base tw-mb-4">{question.description}</p>
            </div>
        </div> 
    )
}